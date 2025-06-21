const axios = require('axios');
const { emailService } = require('../../utils/emailService');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'test@example.com'; // Change this to a real email for testing

// Test data
const testAppointmentData = {
  patient: {
    nom: 'Dupont',
    prenom: 'Jean',
    email: TEST_EMAIL
  },
  doctor: {
    nom: 'Dr. Martin',
    prenom: 'Sophie',
    specialite: 'Cardiologie'
  },
  appointment: {
    id: 999,
    date: '2024-01-15',
    time: '14:30',
    motif: 'Consultation de routine'
  }
};

async function testEmailService() {
  console.log('🧪 Test du Service Email pour les Rendez-vous\n');

  try {
    // Test 1: Generate tokens
    console.log('1️⃣ Test de génération de tokens...');
    const confirmToken = await emailService.generateAppointmentToken(999, 'confirmation');
    const cancelToken = await emailService.generateAppointmentToken(999, 'cancellation');
    
    console.log(`✅ Token de confirmation généré: ${confirmToken.substring(0, 20)}...`);
    console.log(`✅ Token d'annulation généré: ${cancelToken.substring(0, 20)}...\n`);

    // Test 2: Send confirmation email (if email is configured)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      console.log('2️⃣ Test d\'envoi d\'email de confirmation...');
      try {
        await emailService.sendAppointmentConfirmationEmail(testAppointmentData);
        console.log('✅ Email de confirmation envoyé avec succès\n');
      } catch (error) {
        console.log(`❌ Erreur envoi email: ${error.message}\n`);
      }

      console.log('3️⃣ Test d\'envoi d\'email de rappel...');
      try {
        await emailService.sendAppointmentReminderEmail(testAppointmentData);
        console.log('✅ Email de rappel envoyé avec succès\n');
      } catch (error) {
        console.log(`❌ Erreur envoi email: ${error.message}\n`);
      }
    } else {
      console.log('2️⃣ ⚠️ Configuration email manquante, test d\'envoi ignoré\n');
    }

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

async function testReminderService() {
  console.log('🔔 Test du Service de Rappels\n');

  try {
    // Test reminder service status
    console.log('1️⃣ Test du statut du service de rappels...');
    const response = await axios.get(`${API_BASE_URL}/appointment-reminders/status`);
    console.log('✅ Statut du service:', response.data);
    console.log();

    // Test manual trigger
    console.log('2️⃣ Test du déclenchement manuel...');
    const triggerResponse = await axios.post(`${API_BASE_URL}/appointment-reminders/check`);
    console.log('✅ Déclenchement manuel:', triggerResponse.data);
    console.log();

  } catch (error) {
    console.error('❌ Erreur service de rappels:', error.response?.data || error.message);
  }
}

async function testEmailEndpoints() {
  console.log('🔗 Test des Endpoints Email\n');

  try {
    // Generate test tokens first
    const confirmToken = await emailService.generateAppointmentToken(999, 'confirmation');
    const cancelToken = await emailService.generateAppointmentToken(999, 'cancellation');

    // Test confirmation endpoint (this will fail without real appointment)
    console.log('1️⃣ Test endpoint de confirmation...');
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/confirm`, {
        params: { token: confirmToken, id: 999 }
      });
      console.log('✅ Endpoint confirmation:', response.data);
    } catch (error) {
      console.log(`⚠️ Endpoint confirmation (attendu): ${error.response?.data?.message || error.message}`);
    }
    console.log();

    // Test cancellation endpoint (this will fail without real appointment)
    console.log('2️⃣ Test endpoint d\'annulation...');
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/cancel`, {
        params: { token: cancelToken, id: 999 }
      });
      console.log('✅ Endpoint annulation:', response.data);
    } catch (error) {
      console.log(`⚠️ Endpoint annulation (attendu): ${error.response?.data?.message || error.message}`);
    }
    console.log();

  } catch (error) {
    console.error('❌ Erreur endpoints:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Démarrage des Tests du Système d\'Emails\n');
  console.log('=' .repeat(50));
  
  await testEmailService();
  console.log('=' .repeat(50));
  
  await testReminderService();
  console.log('=' .repeat(50));
  
  await testEmailEndpoints();
  console.log('=' .repeat(50));
  
  console.log('✨ Tests terminés!\n');
  
  console.log('📋 Instructions pour les tests complets:');
  console.log('1. Configurer les variables d\'environnement email');
  console.log('2. Créer un vrai rendez-vous dans la base de données');
  console.log('3. Utiliser l\'ID réel pour tester les endpoints');
  console.log('4. Vérifier la réception des emails');
  console.log('5. Tester les liens de confirmation/annulation');
}

// Execute tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testEmailService,
  testReminderService,
  testEmailEndpoints,
  runAllTests
}; 