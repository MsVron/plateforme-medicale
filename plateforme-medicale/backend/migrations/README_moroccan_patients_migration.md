# Migration des Patients Marocains

## Description
Cette migration ajoute 40 patients marocains diversifiés avec des dossiers médicaux complets à la base de données de la plateforme médicale.

## Fichier de Migration
- **Nom**: `populate_moroccan_patients.sql`
- **Date de création**: 2024
- **Auteur**: Système de migration automatique

## Contenu de la Migration

### 1. Patients Ajoutés
- **Total**: 40 patients
- **Répartition par sexe**: 
  - Hommes: 22 (55%)
  - Femmes: 18 (45%)
- **Répartition par âge**:
  - Mineurs (< 18 ans): 4 patients
  - Adultes (18-64 ans): 32 patients
  - Seniors (≥ 65 ans): 4 patients

### 2. Répartition Géographique
- **Casablanca**: 12 patients (30%)
- **Rabat**: 8 patients (20%)
- **Marrakech**: 6 patients (15%)
- **Fès**: 4 patients (10%)
- **Agadir**: 3 patients (7.5%)
- **Tanger**: 3 patients (7.5%)
- **Oujda**: 2 patients (5%)
- **Meknès et autres**: 2 patients (5%)

### 3. Données Médicales Incluses

#### Allergies
- 12 patients avec allergies documentées
- Types d'allergies: acariens, fruits de mer, pollen, pénicilline, aspirine, latex, sulfamides, arachides, iode, poils d'animaux
- Niveaux de sévérité: légère, modérée, sévère

#### Antécédents Médicaux
- 15 patients avec antécédents médicaux chroniques
- Conditions incluses:
  - Hypertension artérielle
  - Diabète type 2
  - BPCO (Bronchopneumopathie Chronique Obstructive)
  - Migraine chronique
  - Antécédents cardiaques (infarctus)
  - Scoliose
  - Anémie ferriprive
  - Lombalgie chronique
  - Arthrose
  - Hernie discale
  - Eczéma atopique
  - Psoriasis
  - Neuropathie diabétique

#### Notes Médicales
- 12 notes importantes de suivi médical
- Catégories: suivi, traitement, prévention, antécédents, complications

#### Mesures Médicales
- Tension artérielle
- Glycémie et HbA1c
- Mesures pédiatriques (taille, poids)
- Cholestérol
- Hémoglobine

#### Rappels de Suivi
- 8 rappels programmés pour les patients chroniques
- Motifs: contrôles spécialisés, bilans biologiques, imagerie

### 4. Rendez-vous
- 6 rendez-vous d'exemple (passés et futurs)
- Statuts: terminé, confirmé, planifié
- Spécialités diverses: médecine générale, cardiologie, pédiatrie, gynécologie

### 5. Fonctionnalités Sociales
- 10 médecins favoris ajoutés
- 8 évaluations de médecins (notes de 4 à 5 étoiles)

## Structure des Données

### Informations Personnelles
- Noms et prénoms marocains authentiques
- CNE (Carte Nationale d'Identité) unique
- Adresses réalistes dans les villes marocaines
- Contacts d'urgence
- Groupes sanguins variés

### Informations Médicales
- Taille et poids réalistes selon l'âge et le sexe
- Habitudes de vie (tabac, alcool, activité physique)
- Professions diverses représentatives du Maroc

### Comptes Utilisateurs
- Format nom d'utilisateur: `prenom.nom`
- Mot de passe par défaut: `patient123` (hashé avec bcrypt)
- Emails uniques avec domaines variés (.com, .fr, .ma)

## Instructions d'Utilisation

### Prérequis
1. Base de données avec structure complète installée
2. Migration des médecins marocains déjà exécutée
3. PhpMyAdmin ou interface MySQL disponible

### Installation
1. Ouvrir PhpMyAdmin
2. Sélectionner la base de données de la plateforme médicale
3. Aller dans l'onglet "Importer"
4. Sélectionner le fichier `populate_moroccan_patients.sql`
5. Cliquer sur "Exécuter"

### Vérification
Après l'exécution, vérifier:
- 40 nouveaux patients dans la table `patients`
- Comptes utilisateurs correspondants dans `utilisateurs`
- Données médicales associées dans les tables spécialisées

## Données de Test

### Comptes Patients Exemples
- **youssef.alami** / patient123 (Casablanca, allergie acariens)
- **omar.tazi** / patient123 (Casablanca, hypertension)
- **abdellatif.idrissi** / patient123 (Casablanca, diabète + BPCO)
- **zineb.fassi** / patient123 (Casablanca, 14 ans, asthme)
- **ahmed.fassi** / patient123 (Rabat, fonctionnaire)
- **hassan.berrada** / patient123 (Marrakech, guide touristique)

### Cas Médicaux Intéressants
1. **Patient diabétique complexe**: Abdellatif Idrissi (diabète + BPCO + HTA)
2. **Patient pédiatrique**: Zineb Fassi (asthme, allergie pollen)
3. **Patient post-infarctus**: Rachid Hajji (suivi cardiologique)
4. **Patient avec allergies multiples**: Malika Lahlou (acariens + pollen)

## Maintenance

### Mise à Jour
Pour mettre à jour les données:
1. Modifier le fichier SQL
2. Réexécuter la migration (attention aux doublons)
3. Ou utiliser des requêtes UPDATE spécifiques

### Suppression
Pour supprimer les données de test:
```sql
-- Supprimer les patients ajoutés par cette migration
DELETE FROM patients WHERE CNE LIKE 'CN1%';
DELETE FROM utilisateurs WHERE nom_utilisateur IN (
    'youssef.alami', 'aicha.benali', 'omar.tazi', 
    -- ... liste complète des utilisateurs
);
```

## Notes Techniques

### Sécurité
- Mots de passe hashés avec bcrypt
- Emails uniques pour éviter les conflits
- CNE uniques suivant le format marocain

### Performance
- Utilisation de variables MySQL (@patient_start_id)
- Requêtes optimisées avec LIMIT 1
- Index sur les champs de recherche

### Compatibilité
- Compatible MySQL 5.7+
- Compatible MariaDB 10.2+
- Testé avec PhpMyAdmin 5.x

## Support
Pour toute question ou problème avec cette migration, consulter:
1. Les logs MySQL pour les erreurs
2. La structure de base de données dans `/sql_structure`
3. La documentation des médecins dans `README_moroccan_doctors_migration.md`

---
*Migration créée automatiquement pour la plateforme médicale marocaine* 