# Support du Handicap dans le Dossier Médical

## Vue d'ensemble

Ce document décrit l'implémentation du support des informations de handicap dans la plateforme médicale. Cette fonctionnalité permet aux médecins de documenter et de suivre les informations relatives au handicap des patients dans leur dossier médical.

## Champs de Base de Données

### Table `patients` - Nouveaux champs ajoutés :

| Champ | Type | Description |
|-------|------|-------------|
| `a_handicap` | BOOLEAN | Indique si le patient est en situation de handicap |
| `type_handicap` | ENUM | Type de handicap ('moteur', 'sensoriel', 'intellectuel', 'psychique', 'multiple', 'autre') |
| `type_handicap_autre` | VARCHAR(100) | Type de handicap personnalisé (utilisé quand type_handicap = 'autre') |
| `niveau_handicap` | ENUM | Niveau de handicap ('léger', 'modéré', 'sévère') |
| `description_handicap` | TEXT | Description détaillée du handicap |
| `besoins_accessibilite` | TEXT | Besoins spécifiques d'accessibilité |
| `equipements_medicaux` | TEXT | Équipements médicaux utilisés |
| `autonomie_niveau` | ENUM | Niveau d'autonomie ('autonome', 'assistance_partielle', 'assistance_totale') |

## Types de Handicap Supportés

### 1. Moteur
- Troubles de la mobilité
- Paralysies
- Amputations
- Troubles musculo-squelettiques

### 2. Sensoriel
- Déficience visuelle
- Déficience auditive
- Troubles de la parole

### 3. Intellectuel
- Déficience intellectuelle
- Troubles d'apprentissage
- Troubles cognitifs

### 4. Psychique
- Troubles mentaux
- Troubles psychiatriques
- Troubles du comportement

### 5. Multiple
- Combinaison de plusieurs types de handicap

### 6. Autre
- Types de handicap non couverts par les catégories standards
- Champ texte libre pour préciser le type exact
- Permet une flexibilité pour des cas particuliers

## Niveaux de Handicap

- **Léger** : Handicap avec impact limité sur les activités quotidiennes
- **Modéré** : Handicap nécessitant des adaptations régulières
- **Sévère** : Handicap nécessitant une assistance importante

## Niveaux d'Autonomie

- **Autonome** : Patient indépendant dans ses activités
- **Assistance partielle** : Patient nécessitant une aide ponctuelle
- **Assistance totale** : Patient dépendant pour la plupart des activités

## Fonctionnalités Implémentées

### 1. Interface Médecin
- **Édition du profil patient** : Section dédiée au handicap dans le formulaire d'édition
- **Affichage dans le dossier** : Informations de handicap visibles dans le dossier médical
- **Besoins spéciaux** : Section séparée pour l'accessibilité et les équipements

### 2. Gestion Conditionnelle
- Les champs de handicap ne s'affichent que si `a_handicap = true`
- Interface adaptative selon le type de handicap sélectionné
- Champ texte personnalisé qui apparaît uniquement si "Autre" est sélectionné

### 3. Sécurité et Confidentialité
- Accès restreint aux médecins autorisés
- Logging des modifications pour audit
- Respect du RGPD pour les données sensibles

## Migration de Base de Données

Pour ajouter le support du handicap à une base existante :

```sql
-- Exécuter le fichier de migration
SOURCE migrations/01_database_structure/add_handicap_fields.sql;
```

## Utilisation

### 1. Activation du Support Handicap
1. Ouvrir le dossier médical d'un patient
2. Cliquer sur "Modifier le profil"
3. Dans la section "Informations sur le handicap", sélectionner "Oui"
4. Remplir les champs appropriés
5. Sauvegarder

### 2. Consultation des Informations
- Les informations de handicap apparaissent dans la section "Informations personnelles"
- Les besoins spéciaux sont affichés dans une section dédiée
- Les équipements médicaux sont listés séparément

## Exemples d'Usage

### Exemple 1 : Handicap Moteur
```
Type: Moteur
Niveau: Modéré
Description: Paraplégie suite à accident
Besoins d'accessibilité: Rampe d'accès, toilettes adaptées, parking PMR
Équipements: Fauteuil roulant manuel
Autonomie: Assistance partielle
```

### Exemple 2 : Handicap Sensoriel
```
Type: Sensoriel
Niveau: Sévère
Description: Surdité profonde bilatérale
Besoins d'accessibilité: Interprète LSF, boucle magnétique
Équipements: Implants cochléaires
Autonomie: Autonome
```

### Exemple 3 : Handicap Personnalisé
```
Type: Autre
Type personnalisé: Fibromyalgie
Niveau: Modéré
Description: Syndrome de fibromyalgie avec fatigue chronique
Besoins d'accessibilité: Horaires flexibles, pauses fréquentes
Équipements: Coussin ergonomique, aide à la marche
Autonomie: Assistance partielle
```

## Considérations Importantes

### 1. Confidentialité
- Ces informations sont particulièrement sensibles
- Accès limité au personnel médical autorisé
- Respect strict du secret médical

### 2. Mise à Jour
- Les informations doivent être régulièrement mises à jour
- Évolution possible du handicap dans le temps
- Nouveaux équipements ou besoins

### 3. Accessibilité de la Plateforme
- La plateforme elle-même doit être accessible
- Respect des standards WCAG
- Tests avec des utilisateurs en situation de handicap

## Développements Futurs

### 1. Intégration avec les Services
- Lien avec les services de réadaptation
- Coordination avec les équipements médicaux
- Suivi des aides techniques

### 2. Alertes et Rappels
- Rappels pour le renouvellement d'équipements
- Alertes pour les besoins d'accessibilité lors des RDV
- Notifications pour le suivi spécialisé

### 3. Statistiques et Reporting
- Statistiques anonymisées sur les types de handicap
- Rapports pour l'amélioration de l'accessibilité
- Indicateurs de qualité de prise en charge

## Support Technique

Pour toute question technique concernant l'implémentation du support handicap :
- Consulter ce document
- Vérifier les logs d'audit en cas de problème
- Contacter l'équipe de développement pour les évolutions 