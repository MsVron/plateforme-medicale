const db = require('../../../config/db');

/**
 * Service for managing patient measurements (weight/height)
 */
class MeasurementService {
  /**
   * Get patient measurements
   */
  static async getPatientMeasurements(patientId) {
    // Verify patient access
    const [patientCheck] = await db.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patientCheck.length === 0) {
      throw new Error('Patient non trouvé');
    }

    // Get measurements from mesures_patient table
    const [measurements] = await db.execute(`
      SELECT 
        mp.id,
        mp.date_mesure,
        mp.type_mesure,
        mp.valeur,
        mp.notes
      FROM mesures_patient mp
      WHERE mp.patient_id = ? AND mp.type_mesure IN ('poids', 'taille')
      ORDER BY mp.date_mesure DESC, mp.type_mesure
    `, [patientId]);

    // Group measurements by date for display
    const measurementsByDate = {};
    
    measurements.forEach(m => {
      // Simple date formatting without timezone manipulation
      let dateKey;
      if (m.date_mesure instanceof Date) {
        // Format the date directly as YYYY-MM-DD
        const year = m.date_mesure.getFullYear();
        const month = String(m.date_mesure.getMonth() + 1).padStart(2, '0');
        const day = String(m.date_mesure.getDate()).padStart(2, '0');
        dateKey = `${year}-${month}-${day}`;
      } else {
        // If it's already a string, try to extract the date part
        dateKey = m.date_mesure.toString().split('T')[0];
      }
      
      if (!measurementsByDate[dateKey]) {
        measurementsByDate[dateKey] = {
          date_mesure: dateKey,
          poids: null,
          taille: null,
          notes: '',
          poids_id: null,
          taille_id: null
        };
      }
      
      if (m.type_mesure === 'poids') {
        measurementsByDate[dateKey].poids = m.valeur;
        measurementsByDate[dateKey].poids_id = m.id;
        measurementsByDate[dateKey].notes = m.notes || measurementsByDate[dateKey].notes;
      } else if (m.type_mesure === 'taille') {
        measurementsByDate[dateKey].taille = m.valeur;
        measurementsByDate[dateKey].taille_id = m.id;
        measurementsByDate[dateKey].notes = m.notes || measurementsByDate[dateKey].notes;
      }
    });

    // Convert to array and create a unique ID for each grouped measurement
    const allMeasurements = Object.keys(measurementsByDate)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(dateKey => {
        const measurement = measurementsByDate[dateKey];
        
        // Create a unique identifier that includes both individual IDs
        let id_parts = [];
        if (measurement.poids_id) id_parts.push(`p${measurement.poids_id}`);
        if (measurement.taille_id) id_parts.push(`t${measurement.taille_id}`);
        
        measurement.id = id_parts.join('_');
        
        return measurement;
      });

    return allMeasurements;
  }

  /**
   * Add patient measurement
   */
  static async addPatientMeasurement(patientId, medecinId, measurementData) {
    const { poids, taille, date_mesure, notes } = measurementData;

    // Verify patient access
    const [patientCheck] = await db.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patientCheck.length === 0) {
      throw new Error('Patient non trouvé');
    }

    if (!poids && !taille) {
      throw new Error('Au moins le poids ou la taille doit être fourni');
    }

    const measurementDate = date_mesure || new Date().toISOString().split('T')[0];

    // Insert weight measurement if provided
    if (poids) {
      await db.execute(`
        INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
        VALUES (?, ?, 'poids', ?, 'kg', ?, ?)
      `, [patientId, medecinId, poids, measurementDate, notes || '']);
    }

    // Insert height measurement if provided
    if (taille) {
      await db.execute(`
        INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
        VALUES (?, ?, 'taille', ?, 'cm', ?, ?)
      `, [patientId, medecinId, taille, measurementDate, notes || '']);
    }

    // Update patient's current weight and height in patients table
    await this.updatePatientCurrentMeasurements(patientId, poids, taille);
  }

  /**
   * Update patient measurement
   */
  static async updatePatientMeasurement(patientId, measurementId, medecinId, updateData) {
    const { poids, taille, date_mesure, notes } = updateData;

    // Verify patient access
    const [patientCheck] = await db.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patientCheck.length === 0) {
      throw new Error('Patient non trouvé');
    }

    // Convert empty strings and null to proper values for validation
    const hasPoids = poids !== null && poids !== undefined && poids !== '' && parseFloat(poids) > 0;
    const hasTaille = taille !== null && taille !== undefined && taille !== '' && parseInt(taille) > 0;
    
    const isCompoundId = measurementId.includes('p') || measurementId.includes('t');
    
    // For compound IDs, allow the update even if both measurements are null (user might be clearing values)
    // For individual IDs, require at least one measurement
    if (!hasPoids && !hasTaille && !isCompoundId) {
      throw new Error('Au moins le poids ou la taille doit être fourni');
    }

    // Handle different ID formats
    if (/^\d+$/.test(measurementId)) {
      // Handle individual measurement update by database ID
      await this.updateIndividualMeasurement(measurementId, patientId, { poids, taille, date_mesure, notes });
    } else if (measurementId.includes('p') || measurementId.includes('t')) {
      // Handle compound ID format (p1_t2)
      await this.updateCompoundMeasurement(measurementId, patientId, medecinId, { poids, taille, date_mesure, notes });
    } else if (measurementId.startsWith('mp_')) {
      // Handle legacy date-based IDs
      await this.updateLegacyMeasurement(measurementId, patientId, medecinId, { poids, taille, date_mesure, notes });
    } else {
      throw new Error('Format d\'ID de mesure invalide');
    }
  }

  /**
   * Delete patient measurement
   */
  static async deletePatientMeasurement(patientId, measurementId) {
    // Verify patient access
    const [patientCheck] = await db.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patientCheck.length === 0) {
      throw new Error('Patient non trouvé');
    }

    // Handle different ID formats
    if (/^\d+$/.test(measurementId)) {
      // Handle individual measurement deletion by database ID
      await this.deleteIndividualMeasurement(measurementId, patientId);
    } else if (measurementId.includes('p') || measurementId.includes('t')) {
      // Handle compound ID format (p1_t2)
      await this.deleteCompoundMeasurement(measurementId, patientId);
    } else if (measurementId.startsWith('mp_')) {
      // Handle legacy date-based IDs
      await this.deleteLegacyMeasurement(measurementId, patientId);
    } else {
      throw new Error('Format d\'ID de mesure invalide');
    }
  }

  /**
   * Update patient's current measurements in patients table
   */
  static async updatePatientCurrentMeasurements(patientId, poids, taille) {
    const updateFields = [];
    const updateValues = [];

    if (poids) {
      updateFields.push('poids_kg = ?');
      updateValues.push(poids);
    }

    if (taille) {
      updateFields.push('taille_cm = ?');
      updateValues.push(taille);
    }

    if (updateFields.length > 0) {
      updateValues.push(patientId);
      await db.execute(
        `UPDATE patients SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }
  }

  /**
   * Update individual measurement by database ID
   */
  static async updateIndividualMeasurement(measurementId, patientId, updateData) {
    const { poids, taille, date_mesure, notes } = updateData;
    
    const [existingMeasurement] = await db.execute(
      'SELECT id, type_mesure, date_mesure FROM mesures_patient WHERE id = ? AND patient_id = ?',
      [measurementId, patientId]
    );

    if (existingMeasurement.length === 0) {
      throw new Error('Mesure non trouvée');
    }

    const measurement = existingMeasurement[0];
    const measurementDate = date_mesure || measurement.date_mesure;

    const hasPoids = poids !== null && poids !== undefined && poids !== '' && parseFloat(poids) > 0;
    const hasTaille = taille !== null && taille !== undefined && taille !== '' && parseInt(taille) > 0;

    // Update the specific measurement based on its type
    if (measurement.type_mesure === 'poids' && hasPoids) {
      await db.execute(
        'UPDATE mesures_patient SET valeur = ?, date_mesure = ?, notes = ? WHERE id = ?',
        [poids, measurementDate, notes || '', measurementId]
      );
    } else if (measurement.type_mesure === 'taille' && hasTaille) {
      await db.execute(
        'UPDATE mesures_patient SET valeur = ?, date_mesure = ?, notes = ? WHERE id = ?',
        [taille, measurementDate, notes || '', measurementId]
      );
    } else {
      throw new Error(`Cette mesure est de type ${measurement.type_mesure}. Veuillez fournir la valeur correspondante.`);
    }
  }

  /**
   * Update compound measurement (p1_t2 format)
   */
  static async updateCompoundMeasurement(measurementId, patientId, medecinId, updateData) {
    const { poids, taille, date_mesure, notes } = updateData;
    
    const parts = measurementId.split('_');
    let poidsId = null;
    let tailleId = null;
    
    parts.forEach(part => {
      if (part.startsWith('p')) {
        poidsId = part.substring(1);
      } else if (part.startsWith('t')) {
        tailleId = part.substring(1);
      }
    });

    const measurementDate = date_mesure || new Date().toISOString().split('T')[0];
    const hasPoids = poids !== null && poids !== undefined && poids !== '' && parseFloat(poids) > 0;
    const hasTaille = taille !== null && taille !== undefined && taille !== '' && parseInt(taille) > 0;

    // Handle weight measurement
    if (poidsId) {
      if (hasPoids) {
        // Update existing weight measurement
        await this.updateIfExists(poidsId, patientId, 'poids', poids, measurementDate, notes);
      } else {
        // Delete weight measurement if value is cleared
        await this.deleteIfExists(poidsId, patientId, 'poids');
      }
    } else if (hasPoids) {
      // Create new weight measurement if it doesn't exist
      await this.createMeasurementIfNotExists(patientId, medecinId, 'poids', poids, measurementDate, notes);
    }

    // Handle height measurement
    if (tailleId) {
      if (hasTaille) {
        // Update existing height measurement
        await this.updateIfExists(tailleId, patientId, 'taille', taille, measurementDate, notes);
      } else {
        // Delete height measurement if value is cleared
        await this.deleteIfExists(tailleId, patientId, 'taille');
      }
    } else if (hasTaille) {
      // Create new height measurement if it doesn't exist
      await this.createMeasurementIfNotExists(patientId, medecinId, 'taille', taille, measurementDate, notes);
    }

    // Special case: if both measurements are cleared but we have notes or date changes,
    // we need to handle this scenario. For now, we'll allow the deletion to proceed.
    // The frontend should prevent this scenario by validation.
  }

  /**
   * Update legacy measurement (mp_YYYY-MM-DD format)
   */
  static async updateLegacyMeasurement(measurementId, patientId, medecinId, updateData) {
    const { poids, taille, date_mesure, notes } = updateData;
    
    const targetDate = measurementId.substring(3);
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
      throw new Error('Format de date invalide dans l\'ID de mesure');
    }

    const hasPoids = poids !== null && poids !== undefined && poids !== '' && parseFloat(poids) > 0;
    const hasTaille = taille !== null && taille !== undefined && taille !== '' && parseInt(taille) > 0;

    // Delete existing measurements for this date
    await db.execute(
      'DELETE FROM mesures_patient WHERE patient_id = ? AND DATE(date_mesure) = ? AND type_mesure IN ("poids", "taille")',
      [patientId, targetDate]
    );

    // Insert updated measurements
    if (hasPoids) {
      await db.execute(`
        INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
        VALUES (?, ?, 'poids', ?, 'kg', ?, ?)
      `, [patientId, medecinId, poids, date_mesure, notes || '']);
    }

    if (hasTaille) {
      await db.execute(`
        INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
        VALUES (?, ?, 'taille', ?, 'cm', ?, ?)
      `, [patientId, medecinId, taille, date_mesure, notes || '']);
    }
  }

  /**
   * Delete individual measurement by database ID
   */
  static async deleteIndividualMeasurement(measurementId, patientId) {
    const [existingMeasurement] = await db.execute(
      'SELECT id FROM mesures_patient WHERE id = ? AND patient_id = ?',
      [measurementId, patientId]
    );

    if (existingMeasurement.length === 0) {
      throw new Error('Mesure non trouvée');
    }

    await db.execute(
      'DELETE FROM mesures_patient WHERE id = ? AND patient_id = ?',
      [measurementId, patientId]
    );
  }

  /**
   * Delete compound measurement (p1_t2 format)
   */
  static async deleteCompoundMeasurement(measurementId, patientId) {
    const parts = measurementId.split('_');
    const idsToDelete = [];
    
    parts.forEach(part => {
      if (part.startsWith('p')) {
        idsToDelete.push(part.substring(1));
      } else if (part.startsWith('t')) {
        idsToDelete.push(part.substring(1));
      }
    });

    if (idsToDelete.length === 0) {
      throw new Error('Format d\'ID de mesure invalide');
    }

    // Verify all measurements exist
    const placeholders = idsToDelete.map(() => '?').join(',');
    const [existingMeasurements] = await db.execute(
      `SELECT id FROM mesures_patient WHERE id IN (${placeholders}) AND patient_id = ?`,
      [...idsToDelete, patientId]
    );

    if (existingMeasurements.length !== idsToDelete.length) {
      throw new Error('Une ou plusieurs mesures non trouvées');
    }

    // Delete all measurements
    await db.execute(
      `DELETE FROM mesures_patient WHERE id IN (${placeholders}) AND patient_id = ?`,
      [...idsToDelete, patientId]
    );
  }

  /**
   * Delete legacy measurement (mp_YYYY-MM-DD format)
   */
  static async deleteLegacyMeasurement(measurementId, patientId) {
    const targetDate = measurementId.substring(3);
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
      throw new Error('Format de date invalide dans l\'ID de mesure');
    }

    // Check if measurements exist for this date
    const [existingMeasurements] = await db.execute(
      'SELECT id FROM mesures_patient WHERE patient_id = ? AND DATE(date_mesure) = ?',
      [patientId, targetDate]
    );

    if (existingMeasurements.length === 0) {
      throw new Error('Mesure non trouvée pour cette date');
    }

    // Delete all measurements for this date
    await db.execute(
      'DELETE FROM mesures_patient WHERE patient_id = ? AND DATE(date_mesure) = ? AND type_mesure IN ("poids", "taille")',
      [patientId, targetDate]
    );
  }

  /**
   * Helper: Update measurement if it exists
   */
  static async updateIfExists(id, patientId, type, valeur, date_mesure, notes) {
    const [existing] = await db.execute(
      'SELECT id FROM mesures_patient WHERE id = ? AND patient_id = ? AND type_mesure = ?',
      [id, patientId, type]
    );

    if (existing.length > 0) {
      await db.execute(
        'UPDATE mesures_patient SET valeur = ?, date_mesure = ?, notes = ? WHERE id = ?',
        [valeur, date_mesure, notes || '', id]
      );
    }
  }

  /**
   * Helper: Delete measurement if it exists
   */
  static async deleteIfExists(id, patientId, type) {
    const [existing] = await db.execute(
      'SELECT id FROM mesures_patient WHERE id = ? AND patient_id = ? AND type_mesure = ?',
      [id, patientId, type]
    );

    if (existing.length > 0) {
      await db.execute(
        'DELETE FROM mesures_patient WHERE id = ? AND patient_id = ?',
        [id, patientId]
      );
    }
  }

  /**
   * Helper: Create measurement if not duplicate
   */
  static async createMeasurementIfNotExists(patientId, medecinId, type, valeur, date_mesure, notes) {
    const [existingForDate] = await db.execute(
      'SELECT id FROM mesures_patient WHERE patient_id = ? AND type_mesure = ? AND DATE(date_mesure) = ?',
      [patientId, type, date_mesure]
    );

    if (existingForDate.length === 0) {
      const unite = type === 'poids' ? 'kg' : 'cm';
      await db.execute(`
        INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [patientId, medecinId, type, valeur, unite, date_mesure, notes || '']);
    }
  }
}

module.exports = MeasurementService; 