# Système d'Emails pour les Rendez-vous

## Vue d'ensemble

Le système d'emails pour les rendez-vous automatise l'envoi de notifications par email aux patients pour :
- Confirmation de prise de rendez-vous
- Rappels avant les rendez-vous
- Confirmation et annulation par email

## Fonctionnalités

### 1. Email de Confirmation (Automatique)
- **Déclencheur** : Création d'un nouveau rendez-vous
- **Contenu** : Détails du rendez-vous, liens de confirmation/annulation
- **Sécurité** : Tokens sécurisés avec expiration (7 jours)

### 2. Email de Rappel (Automatique)
- **Déclencheur** : 24 heures avant le rendez-vous
- **Contenu** : Rappel avec checklist de préparation
- **Fréquence** : Service en arrière-plan vérifie toutes les heures

### 3. Confirmation par Email
- **URL** : `/appointment/confirm?token=XXX&id=YYY`
- **Action** : Change le statut du rendez-vous à "confirmé"
- **Sécurité** : Validation du token et de l'ID

### 4. Annulation par Email
- **URL** : `/appointment/cancel?token=XXX&id=YYY`
- **Action** : Change le statut du rendez-vous à "annulé"
- **Confirmation** : Dialog de confirmation avant annulation

## Architecture Technique

### Base de Données
```sql
-- Table pour les tokens d'email
CREATE TABLE appointment_email_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rendez_vous_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    type ENUM('confirmation', 'cancellation') NOT NULL,
    date_expiration DATETIME NULL,
    utilise BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rendez_vous_id) REFERENCES rendez_vous(id)
);

-- Colonnes ajoutées à la table rendez_vous
ALTER TABLE rendez_vous ADD COLUMN rappel_24h_envoye BOOLEAN DEFAULT FALSE;
ALTER TABLE rendez_vous ADD COLUMN rappel_1h_envoye BOOLEAN DEFAULT FALSE;
```

### Backend - Services

#### 1. EmailService (`utils/emailService.js`)
```javascript
// Fonctions principales
- generateAppointmentToken(appointmentId, type)
- sendAppointmentConfirmationEmail(appointmentData)
- sendAppointmentReminderEmail(appointmentData)
- sendAppointmentCancellationEmail(appointmentData)
```

#### 2. AppointmentReminderService (`services/appointmentReminderService.js`)
```javascript
// Service en arrière-plan
- checkAndSendReminders() // Vérifie et envoie les rappels
- start() // Démarre le service
- stop() // Arrête le service
- getStatus() // Retourne le statut du service
```

#### 3. Routes API
```javascript
// Routes pour les emails
GET /api/appointments/confirm?token=XXX&id=YYY
GET /api/appointments/cancel?token=XXX&id=YYY

// Routes pour le service de rappels
GET /api/appointment-reminders/status
POST /api/appointment-reminders/check
```

### Frontend - Pages

#### 1. Pages Publiques
```javascript
// Gestion des liens email
/appointment/confirm - AppointmentConfirmation.jsx
/appointment/cancel - AppointmentCancellation.jsx
/appointment/success - AppointmentSuccess.jsx
/appointment/error - AppointmentError.jsx
```

#### 2. Administration
```javascript
// Gestion du service
/admin/appointment-emails - AppointmentEmailManagement.jsx
```

## Configuration

### Variables d'Environnement
```env
# Configuration email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# URLs pour les liens email
FRONTEND_URL=http://localhost:3000
```

### Démarrage du Service
```javascript
// Dans app.js
const appointmentReminderService = require('./services/appointmentReminderService');
appointmentReminderService.start();
```

## Sécurité

### Tokens
- Générés avec `crypto.randomBytes(32)`
- Expiration automatique (7 jours)
- Usage unique (marqués comme utilisés)
- Validation côté serveur

### Validation
- Vérification de l'existence du rendez-vous
- Validation du token et de l'expiration
- Vérification des permissions

## Monitoring

### Logs
- Envoi d'emails (succès/échec)
- Utilisation des tokens
- Statut du service de rappels

### Métriques
- Nombre d'emails envoyés
- Taux de confirmation
- Taux d'annulation
- Statut du service

## Maintenance

### Nettoyage
- Suppression automatique des tokens expirés
- Logs rotatifs
- Monitoring des performances

### Dépannage
1. Vérifier la configuration email
2. Contrôler le statut du service de rappels
3. Vérifier les logs d'erreur
4. Tester les endpoints manuellement

## Utilisation

### Pour les Patients
1. **Prise de RDV** → Email de confirmation automatique
2. **24h avant** → Email de rappel automatique
3. **Confirmation** → Clic sur le lien dans l'email
4. **Annulation** → Clic sur le lien dans l'email

### Pour les Administrateurs
1. **Monitoring** → Page `/admin/appointment-emails`
2. **Déclenchement manuel** → Bouton "Vérifier maintenant"
3. **Statut du service** → Vérification en temps réel

## Améliorations Futures

### Fonctionnalités
- Rappel 1 heure avant le rendez-vous
- Templates d'emails personnalisables
- Notifications SMS
- Intégration calendrier

### Technique
- Queue de messages pour les emails
- Retry automatique en cas d'échec
- Métriques avancées
- Tests automatisés 