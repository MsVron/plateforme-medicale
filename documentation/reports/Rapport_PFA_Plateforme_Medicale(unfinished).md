# RAPPORT DE PROJET DE FIN D'ANNÉE
## CONCEPTION ET RÉALISATION D'UNE PLATEFORME MÉDICALE INTELLIGENTE DE GESTION DES RENDEZ-VOUS ET DOSSIERS PATIENTS AVEC INTÉGRATION D'INTELLIGENCE ARTIFICIELLE

---

**Présenté par :** Aya BEROUKECH et Hamza BENMESSAOUD  
**Filière :** Cycle Ingénieur - 4ème Année  
**Établissement :** SupMTI Oujda  
**Année Universitaire :** 2024-2025  
**Encadrante :** Pr. Ilhame El Farissi  

---

## DÉDICACE

À nos parents, pour leur soutien indéfectible et leurs encouragements tout au long de notre parcours académique. Leur confiance et leurs sacrifices ont rendu possible la réalisation de ce projet.

À nos familles, pour leur présence constante, leurs conseils précieux et leur foi inébranlable en nos capacités.

À nos enseignants, et particulièrement à Pr. Ilhame El Farissi, qui ont su transmettre leur savoir et éveiller notre passion pour l'informatique et les technologies.

À nos amis, pour leur solidarité, leur soutien moral et les moments de partage qui ont enrichi cette expérience universitaire.

À ceux qui ont pris le temps de nous donner leurs retours et suggestions, contribuant ainsi à l'amélioration de ce travail

À tous les professionnels de santé qui œuvrent quotidiennement pour le bien-être des patients et qui ont inspiré ce projet de digitalisation des soins médicaux.

## REMERCIEMENTS

Il est important pour nous de témoigner notre reconnaissance à tous ceux dont l'appui et la contribution ont favorisé l'aboutissement de ce projet de plateforme médicale BluePulse.

Louange à Allah, le Tout-Puissant, pour nous avoir accordé la force, la patience et la persévérance nécessaires pour mener à bien ce projet de digitalisation des soins de santé.

Nous tenons à exprimer notre profonde gratitude à notre encadrante, **Pr. Ilhame El Farissi**, pour son accompagnement bienveillant, ses conseils avisés et son expertise technique qui ont été déterminants dans la réalisation de cette plateforme médicale innovante.

Nos remerciements sincères vont également aux professionnels de santé qui ont contribué à enrichir notre compréhension des enjeux médicaux et ont guidé la conception fonctionnelle de BluePulse, notamment pour l'intégration de l'intelligence artificielle dans l'aide au diagnostic.

Nous remercions chaleureusement le corps professoral et administratif d'**École Supérieure de Management, Télécommunications et d'Informatique SupMTI**, pour leur encadrement et leur soutien durant notre parcours, ainsi que pour les connaissances techniques en développement full-stack qui ont rendu possible la création de cette solution complète.

Notre reconnaissance va aussi à tous ceux qui ont testé la plateforme et fourni des retours constructifs, contribuant ainsi à l'amélioration continue de l'expérience utilisateur et des fonctionnalités médicales.

Enfin, nous témoignons notre respect et notre reconnaissance aux membres du jury pour l'attention portée à notre travail et l'évaluation de cette contribution à la digitalisation du secteur de la santé.

## RÉSUMÉ

Dans le cadre des travaux de cette année, notre synthèse porte sur la présentation de notre application "BluePulse". Cette plateforme web a été développée pour révolutionner la gestion des rendez-vous médicaux et des dossiers patients en intégrant des technologies d'intelligence artificielle avancées.

La "BluePulse" est une application web complète que nous avons conçue pour simplifier la procédure de prise de rendez-vous pour les patients, optimiser la gestion des plannings pour les médecins, et centraliser les dossiers médicaux de manière sécurisée. Le système intègre un assistant IA pour l'aide au diagnostic et un système de notifications automatisées pour améliorer la communication entre tous les acteurs de santé. La plateforme supporte une architecture multi-institutionnelle permettant aux cabinets privés, hôpitaux, pharmacies et laboratoires d'accéder aux dossiers médicaux selon leurs rôles spécifiques, avec un système de thématisation dynamique qui adapte l'interface utilisateur selon le type d'établissement.

Cette synthèse décrit les étapes que nous avons suivies pour développer les fonctionnalités avancées de l'application, incluant l'architecture full-stack JavaScript, l'intégration de services d'intelligence artificielle, et l'implémentation de mesures de sécurité conformes aux exigences médicales. Notre projet démontre comment les technologies modernes peuvent transformer l'accessibilité et l'efficacité des soins de santé.

**Mots-clés :** Plateforme médicale, Intelligence artificielle, Gestion rendez-vous, Dossiers patients, Full-stack JavaScript, Sécurité médicale, Architecture multi-institutionnelle, Système de thématisation


## ABSTRACT

As part of this year's work, our dissertation presents our application "BluePulse". This web platform was developed to revolutionize medical appointment management and patient records by integrating advanced artificial intelligence technologies.

The "BluePulse" is a comprehensive web application that we designed to simplify the appointment booking procedure for patients, optimize schedule management for doctors, and centralize medical records securely. The system integrates an AI assistant for diagnostic support and an automated notification system to improve communication between all healthcare stakeholders.

This dissertation describes the steps we went through to develop the application's advanced features, including full-stack JavaScript architecture, artificial intelligence services integration, and implementation of security measures compliant with medical requirements. Our project demonstrates how modern technologies can transform healthcare accessibility and efficiency.

The platform successfully addresses the challenges of healthcare digitalization by providing an intuitive interface for multiple user types, intelligent appointment scheduling with conflict prevention, secure medical records management, and AI-powered diagnostic assistance. The comprehensive notification system ensures optimal communication flow. The multi-institutional architecture enables private cabinets, hospitals, pharmacies, and laboratories to access patient medical records according to their specific roles and requirements, with a dynamic theming system that automatically adapts the user interface based on the institution type.

**Keywords:** Medical platform, Healthcare digitalization, Artificial intelligence, Appointment management, Electronic health records, Patient records, Full-stack JavaScript, React.js, Node.js, MySQL, Medical security, GDPR (General Data Protection Regulation) compliance, Multi-institutional architecture, Telemedicine, Healthcare interoperability, Medical data management, BluePulse

---

## LISTE DES ABRÉVIATIONS

| Abréviation | Signification |
|-------------|---------------|
| PFA | Projet de Fin d'Année |
| API | Application Programming Interface |
| UI | User Interface |
| UX | User Experience |
| CRUD | Create, Read, Update, Delete |
| JWT | JSON Web Token |
| IA | Intelligence Artificielle |
| AI | Artificial Intelligence |
| GDPR | General Data Protection Regulation |
| RGPD | Règlement Général sur la Protection des Données |
| UML | Unified Modeling Language |
| MCD | Modèle Conceptuel de Données |
| REST | Representational State Transfer |
| HTTP | HyperText Transfer Protocol |
| HTTPS | HyperText Transfer Protocol Secure |
| SQL | Structured Query Language |
| MySQL | My Structured Query Language |
| JSON | JavaScript Object Notation |
| CSS | Cascading Style Sheets |
| HTML | HyperText Markup Language |
| JS | JavaScript |
| CDN | Content Delivery Network |

| CIM-10 | Classification Internationale des Maladies 10ème révision |
| SMTP | Simple Mail Transfer Protocol |
| SSL | Secure Sockets Layer |
| TLS | Transport Layer Security |
| URL | Uniform Resource Locator |
| DOM | Document Object Model |
| SPA | Single Page Application |
| CORS | Cross-Origin Resource Sharing |
| CIN | Carte d'Identité Nationale |

---

## TABLE DES MATIÈRES

**INTRODUCTION GÉNÉRALE** ............................................................. 4

**CHAPITRE 1 : PRÉSENTATION DU PROJET** ................................................ 6
1.1 Aperçu Général ................................................................. 6
1.2 Fonctionnalités Principales .................................................... 7
    1.2.1 Gestion des Utilisateurs et Authentification ............................ 7
    1.2.2 Gestion des Rendez-vous .................................................. 8
    1.2.3 Dossiers Médicaux Numériques ............................................ 9
    1.2.4 Recherche et Filtrage ................................................... 10
    1.2.5 Architecture Multi-Institutionnelle ..................................... 11
    1.2.6 Système de Thématisation Dynamique ...................................... 12
    1.2.7 Assistant Chatbot Intelligent ........................................... 13
    1.2.8 Tableaux de Bord et Statistiques ........................................ 14
1.3 Utilisateurs Cibles ........................................................... 11
1.4 Objectifs du Projet ........................................................... 12
1.5 Organisation du Projet ........................................................ 13

**CHAPITRE 2 : ÉTUDE FONCTIONNELLE** ................................................... 14
2.1 Analyse des Besoins ............................................................ 14
    2.1.1 Besoins Fonctionnels .................................................... 14
    2.1.2 Besoins Non Fonctionnels ................................................ 15
2.2 Modélisation UML ............................................................... 16
    2.2.1 Diagramme de Cas d'Utilisation ................................................ 16
    2.2.2 Diagrammes de Séquence .................................................. 17
    2.2.3 Modèle Conceptuel de Données (MCD) ...................................... 18
    2.2.4 Diagramme de Classes .................................................... 19
    2.2.5 Diagramme d'Activités ................................................... 20
    2.2.6 Diagramme d'États-Transitions ........................................... 21

**CHAPITRE 3 : ÉTUDE TECHNIQUE ET RÉALISATION** ....................................... 22
3.1 Architecture du Système ........................................................ 22
    3.1.1 Architecture Globale .................................................... 22
    3.1.2 Technologies Utilisées .................................................. 23
    3.1.3 Diagramme de Déploiement ................................................ 24
    3.1.4 Diagramme de Composants ................................................. 25
3.2 Implémentation et Développement ................................................ 26
    3.2.1 Backend - API REST ...................................................... 26
    3.2.2 Frontend - Interface Utilisateur ........................................ 27
    3.2.3 Base de Données ......................................................... 28
    3.2.4 Sécurité et Authentification ............................................ 29
    3.2.5 Implémentation Multi-Institutionnelle .................................... 30
    3.2.6 Système de Thématisation Dynamique ....................................... 31
    3.2.7 Implémentation des Statistiques ........................................ 32
3.3 Intégration de l'Intelligence Artificielle ..................................... 33
    3.3.1 Vision et Objectifs de l'IA Médicale .................................... 33
    3.3.2 Architecture de l'Assistant IA Médical .................................. 34
    3.3.3 Fonctionnalités Avancées de l'Assistant IA .............................. 35
    3.3.4 Implémentation Technique de l'IA ........................................ 36
    3.3.5 Sécurité et Conformité de l'IA Médicale ................................. 37
    3.3.6 Performance et Optimisation de l'IA ..................................... 38
3.4 Validation et Testing .......................................................... 39
    3.4.1 Approche de Validation .................................................. 39
    3.4.2 Suite de Tests Backend Spécialisés ...................................... 40
    3.4.3 Monitoring et Debugging Avancé .......................................... 41
3.5 Gestion de Projet et Méthodologie .............................................. 42
    3.5.1 Méthodologie Agile/Scrum Adaptée ........................................ 42
    3.5.2 Planification Temporelle et Sprints ..................................... 43
    3.5.3 Gestion des Risques et Mitigation ....................................... 44
    3.5.4 Métriques de Suivi et Indicateurs de Performance ........................ 45
3.6 Déploiement et Production ...................................................... 46
    3.6.1 Architecture de Déploiement ............................................. 46
    3.6.2 Solutions de Déploiement Évaluées ....................................... 47
    3.6.3 Configuration de Production ............................................. 48
    3.6.4 Monitoring et Maintenance ............................................... 49

**CONCLUSION GÉNÉRALE** ............................................................. 52

**WEBOGRAPHIE** .................................................................. 55

**ANNEXES** ....................................................................... 59
Annexe A : Structure de la Base de Données ......................................... 59
Annexe B : API REST - Endpoints Implémentés ........................................ 60
Annexe C : Architecture Frontend React ............................................. 61
Annexe D : Fichiers de Test et Validation .......................................... 62

---

## INTRODUCTION GÉNÉRALE

### Contexte et Problématique

La transformation numérique du secteur de la santé constitue aujourd'hui un enjeu stratégique majeur pour l'amélioration de la qualité des soins et l'optimisation des parcours patients. Dans un contexte où les établissements de santé font face à une demande croissante de services médicaux, couplée à des contraintes budgétaires et organisationnelles importantes, la digitalisation des processus de gestion devient une nécessité impérieuse pour maintenir un niveau de service optimal.

La problématique centrale de ce projet de fin d'année s'articule autour de la question suivante : comment concevoir et développer une plateforme médicale intelligente qui optimise la gestion des rendez-vous et des dossiers patients tout en intégrant des technologies d'intelligence artificielle pour améliorer l'aide au diagnostic préliminaire et l'expérience utilisateur globale ?

L'analyse de l'existant révèle plusieurs dysfonctionnements structurels dans les systèmes de gestion médicale traditionnels. Premièrement, la persistance de méthodes de gestion manuelle, notamment l'utilisation de fichiers Excel ou de registres papier, génère des risques d'erreurs humaines, de doublons et de perte d'informations critiques. Deuxièmement, l'accès fragmenté aux informations médicales entrave la continuité des soins et la coordination entre professionnels de santé. Troisièmement, les patients omettent fréquemment de mentionner leurs antécédents médicaux, diagnostics antérieurs ou traitements en cours lors des consultations, ce qui peut conduire à des erreurs diagnostiques et rendre plus difficile la prise en charge optimale par le médecin. Quatrièmement, l'absence d'outils d'aide à la décision médicale limite l'efficacité diagnostique, particulièrement dans les phases préliminaires de consultation. Cinquièmement, l'expérience patient demeure souvent dégradée par des processus de prise de rendez-vous complexes et peu intuitifs. Enfin, l'absence d'intégration entre les différents systèmes d'information médicaux compromet la vision globale du parcours de soins.

### Solutions Existantes et Comparaison

#### Solutions Traditionnelles
Les solutions traditionnelles présentent des caractéristiques contrastées. Les fichiers Excel offrent une simplicité d'utilisation appréciée des utilisateurs, mais souffrent d'un manque de sécurité, de risques d'erreurs importants et d'un accès concurrent limité qui entrave le travail collaboratif. Les systèmes internes propriétaires, bien qu'adaptés aux besoins spécifiques des établissements, présentent des fonctionnalités limitées, des coûts élevés de développement et de maintenance, ainsi qu'un manque d'interopérabilité avec d'autres systèmes. Les registres papier, encore utilisés dans certains contextes, exposent les établissements à des risques de perte de données, à des difficultés de recherche d'informations et à des problèmes d'espace de stockage.

#### Solutions Numériques Existantes
Parmi les solutions numériques existantes, *Doctolib* s'impose comme le leader du marché français, proposant une plateforme complète et performante, mais reste coûteux pour les petites structures médicales qui ne peuvent pas toujours justifier un tel investissement. *Mondocteur* offre une solution complète mais présente une complexité d'implémentation qui peut rebuter les établissements ayant des ressources techniques limitées. Les systèmes hospitaliers intégrés, conçus pour les grandes structures, proposent des fonctionnalités avancées mais s'avèrent souvent lourds et onéreux, inadaptés aux besoins des petites et moyennes structures de santé.

#### Solution Proposée

Notre plateforme médicale propose une approche moderne et intégrée qui combine plusieurs éléments clés. L'interface intuitive s'adapte à tous les types d'utilisateurs, quel que soit leur niveau de compétence technologique, avec un système de thématisation dynamique qui personnalise l'expérience selon le type d'établissement. La gestion complète des rendez-vous intègre un système de créneaux automatisé qui facilite la planification et réduit les erreurs de saisie. Les dossiers médicaux numériques centralisés et sécurisés permettent un accès rapide et sûr aux informations patients, avec des permissions granulaires selon le rôle de l'utilisateur. Le système multi-institutionnel accommode les besoins spécifiques des cabinets privés, hôpitaux, pharmacies et laboratoires, chacun ayant accès aux informations pertinentes pour leur domaine d'activité. L'architecture modulaire garantit l'évolutivité de la solution selon les besoins croissants des utilisateurs. La recherche de médecins selon spécialité facilite l'accès aux soins pour les patients. La gestion unifiée des patients directes (walk-in) répond aux besoins d'urgence et d'imprévus dans la pratique médicale quotidienne, réutilisable par tous les types d'établissements.

### Objectifs du Projet

**Objectif principal**
Développer une plateforme web complète de gestion médicale qui digitalise et optimise les processus de prise de rendez-vous et de gestion des dossiers patients.

**Objectifs spécifiques**
Le projet vise à créer une interface utilisateur moderne et responsive qui s'adapte à tous les dispositifs et navigateurs. Il s'agit d'implémenter un système de gestion des rendez-vous intelligent capable de gérer automatiquement les créneaux et les conflits. Le développement d'un module de dossiers médicaux sécurisé garantit la confidentialité et l'intégrité des données sensibles. Le système de recherche de médecins améliore l'accessibilité des soins. La sécurité et la confidentialité des données médicales constituent une priorité absolue, avec le respect des réglementations en vigueur. Enfin, la solution se doit d'être évolutive et maintenable pour accompagner la croissance des besoins utilisateurs.

### Structure du Rapport

Ce rapport s'articule autour de trois chapitres principaux conformément aux recommandations académiques. Le premier chapitre présente le projet dans son contexte général, détaillant la problématique, les solutions existantes et les objectifs visés. Le deuxième chapitre développe l'étude fonctionnelle avec les diagrammes d'analyse UML qui spécifient les besoins et l'architecture logicielle du système. Le troisième chapitre combine l'étude technique et la réalisation, présentant l'architecture système, l'implémentation des fonctionnalités, l'intégration de l'intelligence artificielle, la validation par les tests, la méthodologie de gestion de projet et les stratégies de déploiement. Une conclusion générale synthétise les résultats obtenus et les perspectives d'évolution du projet.



## CHAPITRE 1: PRÉSENTATION DU PROJET

### 1.1 Aperçu Général

La plateforme médicale développée est une application web full-stack moderne construite avec React.js et Node.js, destinée à révolutionner la gestion des établissements de santé. Elle s'adresse à huit types d'utilisateurs distincts : patients, médecins, administrateurs, super administrateurs, institutions médicales, pharmacies, hôpitaux et laboratoires. Cette solution intégrée utilise une architecture en trois tiers avec une base de données MySQL robuste comprenant plus de 25 tables interconnectées, visant à répondre aux défis contemporains de la digitalisation du secteur médical en proposant une approche centralisée, sécurisée et évolutive de la gestion des soins. L'architecture multi-institutionnelle permet à chaque type d'établissement d'accéder aux dossiers médicaux selon ses besoins spécifiques, avec un système de recherche unifié et des permissions granulaires. Le système de thématisation dynamique adapte automatiquement l'interface utilisateur selon le rôle de l'utilisateur, offrant une expérience personnalisée tout en maintenant la cohérence fonctionnelle.

### 1.2 Fonctionnalités Principales

#### 1.2.1 Gestion des Utilisateurs et Authentification

**Système Multi-Rôles Avancé :** Le système implémente une gestion différenciée selon huit types d'utilisateurs distincts définis dans l'énumération de la base de données : 'super_admin', 'admin', 'medecin', 'patient', 'institution', 'pharmacy', 'hospital', 'laboratory'. Les Super Administrateurs bénéficient d'une gestion globale du système avec création d'administrateurs délégués. Les Administrateurs gèrent les médecins et institutions dans leur périmètre. Les Médecins disposent d'un accès complet aux dossiers patients avec possibilité de créer des profils patients directes (walk-in) et de modifier toutes leurs informations médicales. Les Patients peuvent prendre des rendez-vous, consulter leurs dossiers et gérer leurs favoris médecins. Les Hôpitaux peuvent assigner des patients à un ou plusieurs médecins travaillant dans l'établissement, suivre les séjours, procédures et chirurgies. Les Pharmacies accèdent aux prescriptions médicales, gèrent la dispensation des médicaments et maintiennent un historique inter-pharmacies. Les Laboratoires visualisent les demandes d'analyses et d'imagerie, téléchargent les résultats et permettent aux médecins de consulter les rapports avec identification du laboratoire source.

**Sécurité Renforcée :** La sécurité du système repose sur une architecture multi-couches robuste. L'authentification par JWT (JSON Web Tokens) avec middleware Express personnalisé garantit la sécurité des sessions et la gestion granulaire des droits d'accès. Le hashage des mots de passe utilise bcrypt avec salt pour une protection maximale contre les attaques par dictionnaire. La vérification par email utilise Nodemailer avec tokens temporaires stockés en base. Le système de récupération de mot de passe implémente une fonctionnalité complète de réinitialisation sécurisée, permettant aux patients d'accéder à un processus de récupération via leur adresse email. Cette fonctionnalité génère des tokens à durée de vie limitée d'une heure, stockés de manière sécurisée dans les colonnes `token_reset_password` et `date_expiration_token` de la table `utilisateurs`. L'interface utilisateur intègre un bouton "Mot de passe oublié ?" accessible depuis la page de connexion, ouvrant une boîte de dialogue modale permettant la saisie de l'adresse email. Le système envoie automatiquement un email contenant un lien sécurisé vers une page de réinitialisation, où l'utilisateur peut définir un nouveau mot de passe avec validation de la force et confirmation. Cette implémentation assure une traçabilité complète des actions dans la table `historique_actions` tout en respectant les principes de sécurité par défaut et de protection des données personnelles.

#### 1.2.2 Gestion des Rendez-vous

**Pour les Patients :** Les patients bénéficient d'un système de réservation intelligent avec recherche multi-critères.

La recherche de médecins combine spécialité (table `specialites`), disponibilités en temps réel et tarifs de consultation. Le système de favoris (table `favoris_medecins`) permet un accès rapide aux médecins habituels. L'historique complet des rendez-vous avec statuts détaillés ('confirmé', 'annulé', 'reporté', 'terminé', 'no_show') offre une traçabilité complète. Les notifications automatiques (table `notifications`) informent des confirmations, rappels et modifications via email et interface web.

**Pour les Médecins :** Les médecins disposent d'un système de gestion avancé avec planification flexible.

La table `disponibilites_medecin` permet la définition de créneaux récurrents par jour de semaine avec gestion des pauses déjeuner et intervalles personnalisables (15, 30, 60 minutes). Le système d'indisponibilités exceptionnelles (table `indisponibilites_exceptionnelles`) gère les congés et absences. La fonctionnalité walk-in permet l'enregistrement immédiat de nouveaux patients avec création automatique de profil complet. Le tableau de bord médecin affiche les rendez-vous du jour, patients en attente et statistiques d'activité en temps réel.

#### 1.2.3 Dossiers Médicaux Numériques

**Gestion Complète et Modifiable :** Le système propose une gestion exhaustive des données médicales avec modification complète par les médecins.

La table `patients` centralise toutes les informations personnelles, médicales et sociales (profession, groupe sanguin, habitudes de vie) entièrement modifiables par les médecins. Les antécédents médicaux (table `antecedents_medicaux`) sont catégorisés par type ('médical', 'chirurgical', 'familial', 'gynécologique', 'psychiatrique') avec dates et descriptions détaillées. Les allergies (tables `allergies` et `patient_allergies`) incluent niveau de sévérité, symptômes et date de découverte. Les traitements (table `traitements`) documentent posologie, durée, indications et effets secondaires avec suivi de l'observance.

**Analyses et Imagerie Médicales :** Le système intègre un module complet d'analyses avec plus de 200 types d'examens organisés en catégories (Hématologie, Biochimie, Immunologie, Microbiologie, etc.). La table `resultats_analyses` stocke les résultats avec valeurs de référence, unités et interprétations. Le module d'imagerie (table `resultats_imagerie`) gère les examens radiologiques avec stockage des images et comptes-rendus. Les constantes vitales (table `constantes_vitales`) permettent un suivi longitudinal avec graphiques d'évolution.

**Consultations et Suivi :** Le module de consultations (table `consultations`) offre une traçabilité complète avec motifs, examens cliniques, diagnostics CIM-10, prescriptions et recommandations. Les notes patient (table `notes_patient`) permettent aux médecins d'ajouter des observations privées. Le système de rappels de suivi (table `rappels_suivi`) automatise les relances pour examens de contrôle. L'historique des actions (table `historique_actions`) trace toutes les modifications pour audit et responsabilité médicale.

#### 1.2.4 Recherche et Filtrage

**Recherche Avancée :** Le système propose une recherche multi-critères pour localiser facilement les médecins selon les besoins des patients.

Les filtres combinés permettent la recherche par spécialité, disponibilité immédiate, tarifs et acceptation de nouveaux patients. Le système de recherche textuelle avec auto-complétion facilite la localisation des médecins par nom ou spécialité. Les résultats sont triés par pertinence avec pagination optimisée pour une navigation fluide.

**Recherche Intelligente :** Le système de recherche multi-critères combine recherche textuelle (nom, spécialité) avec auto-complétion. Les résultats sont triés par pertinence avec pagination optimisée. La recherche sauvegarde les préférences utilisateur et propose des suggestions basées sur l'historique pour une expérience personnalisée.

#### 1.2.5 Architecture Multi-Institutionnelle

**Gestion Hospitalière Avancée :** Le système hospitalier permet l'assignation de patients à un ou plusieurs médecins travaillant dans l'établissement, avec suivi complet des séjours hospitaliers. Les hôpitaux disposent d'un système de recherche de patients utilisant les mêmes mécanismes que les médecins, avec recherche exacte par prénom, nom et CIN. La gestion des admissions et sorties est intégrée avec suivi des durées de séjour, procédures effectuées et chirurgies réalisées. Le système de gestion des lits permet l'optimisation de l'occupation et la planification des admissions. Les hôpitaux peuvent également ajouter des patients walk-in en réutilisant les fonctionnalités existantes, évitant ainsi la duplication de code et maintenant la cohérence du système.

**Système Pharmaceutique Intégré :** Les pharmacies bénéficient d'un accès privilégié aux prescriptions médicales avec visualisation des dates de prescription et gestion de la dispensation des médicaments. Le système permet de marquer les médicaments dispensés et maintient un historique inter-pharmacies visible par tous les établissements pharmaceutiques participants. Cette approche collaborative améliore la sécurité pharmaceutique en évitant les interactions médicamenteuses et les surdosages. Les médecins peuvent consulter cet historique pour optimiser leurs prescriptions et assurer un suivi thérapeutique optimal. La recherche de patients utilise le même mécanisme unifié avec recherche exacte par prénom, nom et CIN, garantissant la cohérence et la sécurité des données.

**Laboratoires et Imagerie Médicale :** Les laboratoires accèdent aux demandes d'analyses et d'imagerie prescrites par les médecins, avec possibilité de télécharger les résultats après identification du patient. Le système de recherche unifié permet aux laboratoires de localiser rapidement les patients par recherche exacte des critères d'identification. Une fois les résultats téléchargés, les médecins et hôpitaux peuvent consulter ces données avec identification claire du laboratoire source, facilitant la traçabilité et la communication inter-établissements. Cette intégration améliore significativement la continuité des soins et réduit les délais de prise en charge diagnostique.

**Système de Recherche Unifié :** L'architecture multi-institutionnelle s'appuie sur un système de recherche de patients unifié et sécurisé, utilisé par tous les types d'établissements. Cette approche garantit la cohérence des données, évite la duplication de code et assure la conformité RGPD avec audit complet de tous les accès aux données patients. Le système de recherche exacte par prénom, nom et CIN protège la confidentialité des patients tout en permettant une identification précise et fiable.

#### 1.2.6 Système de Thématisation Dynamique

**Adaptation Visuelle par Rôle :** La plateforme intègre un système de thématisation dynamique qui adapte automatiquement l'interface selon le rôle utilisateur. Chaque type d'établissement dispose de sa palette de couleurs professionnelle (vert médical, rouge hospitalier, violet pharmaceutique, orange laboratoire, bleu administratif). Cette personnalisation améliore l'expérience utilisateur tout en maintenant l'identité professionnelle.

**Architecture Technique :** Le système utilise Material-UI et variables CSS pour des transitions fluides entre thèmes. Un gestionnaire centralisé détecte le rôle connecté et applique le thème correspondant en temps réel, garantissant une cohérence visuelle complète.

#### 1.2.7 Assistant Chatbot Intelligent

**Architecture Cloud :** La plateforme intègre un assistant chatbot médical intelligent déployé sur Google Colab avec le modèle Ollama Phi3:mini. L'architecture utilise FastAPI pour exposer l'API du chatbot, rendue accessible publiquement via ngrok pour permettre l'intégration avec le backend Node.js de la plateforme.

**Fonctionnalités Médicales :** L'assistant analyse les symptômes rapportés par les patients en français, fournissant des suggestions préliminaires tout en orientant systématiquement vers une consultation médicale professionnelle. Le système intègre une détection automatique de spécialités médicales (neurologue, cardiologue, gastro-entérologue, etc.) basée sur l'analyse des mots-clés des symptômes décrits. Chaque réponse inclut des disclaimers médicaux appropriés et des recommandations de spécialistes.

**Gestion des Conversations :** Le chatbot maintient un historique des conversations persistant via une base de données SQLite, permettant un suivi contextuel des échanges. L'interface utilisateur minimisable et non-intrusive offre une expérience conversationnelle fluide avec formatage en gras des informations médicales importantes. Toutes les interactions sont tracées pour amélioration continue et conformité médicale.

#### 1.2.8 Tableaux de Bord et Statistiques

**Statistiques Médecin :** Le tableau de bord médecin présente des métriques d'activité en temps réel avec visualisations graphiques.

Les indicateurs incluent le nombre de consultations par période, la répartition des patients par âge et pathologie, les taux de présence aux rendez-vous, et l'évolution de l'activité mensuelle. Les graphiques Chart.js affichent les tendances de consultation, la distribution des créneaux horaires les plus demandés, et les statistiques de patients walk-in. Le système génère automatiquement des rapports d'activité exportables en PDF pour les besoins administratifs et comptables.

**Statistiques Administrateur :** L'interface administrative centralise les métriques globales de la plateforme avec tableaux de bord analytiques. Les indicateurs clés incluent le nombre total d'utilisateurs actifs par type, les statistiques d'utilisation des fonctionnalités, les métriques de performance système, et les rapports d'activité des établissements. Les graphiques d'évolution temporelle permettent le suivi des tendances d'adoption et l'identification des pics d'activité pour l'optimisation des ressources.

### 1.3 Utilisateurs Cibles

#### 1.3.1 Patients
La plateforme s'adresse aux particuliers avec inscription autonome ou création de profil par médecin. Les patients bénéficient d'un tableau de bord personnalisé avec historique complet, favoris médecins et notifications automatiques. Le système gère les profils familiaux avec contacts d'urgence et médecins traitants. Les patients chroniques disposent d'un suivi longitudinal avec rappels automatiques et graphiques d'évolution des constantes vitales.

#### 1.3.2 Professionnels de Santé
Les médecins généralistes et spécialistes (plus de 50 spécialités référencées) constituent le cœur de la plateforme. Chaque médecin dispose d'un tableau de bord avec gestion des disponibilités, patients directes, consultations et statistiques d'activité. Le système permet la création et modification complète des dossiers patients avec accès aux antécédents, allergies, traitements et résultats d'analyses. Les médecins peuvent gérer plusieurs institutions avec plannings différenciés.

#### 1.3.3 Établissements de Santé Diversifiés
Le système supporte huit types d'établissements : institutions médicales, pharmacies, hôpitaux, laboratoires, cliniques, cabinets privés, centres médicaux. Chaque établissement dispose d'horaires d'ouverture configurables et de gestion multi-médecins. Les institutions peuvent avoir un médecin propriétaire et gérer leurs affiliations avec les médecins. Le système de statuts ('pending', 'approved', 'rejected') permet une validation administrative des nouveaux établissements.

Les hôpitaux bénéficient de fonctionnalités spécialisées pour la gestion des admissions, assignations de patients aux médecins, suivi des séjours et gestion des lits. Les pharmacies disposent d'un accès privilégié aux prescriptions avec gestion de la dispensation et historique inter-pharmacies. Les laboratoires peuvent consulter les demandes d'analyses, télécharger les résultats et assurer la traçabilité des examens. Tous les établissements utilisent le même système de recherche unifié garantissant la cohérence et la sécurité des données patients.

### 1.4 Valeur Ajoutée du Projet

#### 1.4.1 Pour les Patients
La valeur ajoutée pour les patients se manifeste à travers plusieurs dimensions d'amélioration de leur expérience de soins. La simplicité d'utilisation, garantie par une interface intuitive et responsive, démocratise l'accès aux outils numériques de santé. L'accessibilité 24/7 du système libère les patients des contraintes horaires traditionnelles de prise de rendez-vous téléphonique. La centralisation de tous les dossiers médicaux en un lieu unique facilite le suivi médical et améliore la coordination entre professionnels de santé. La transparence offerte par la consultation des tarifs et disponibilités en temps réel permet aux patients de faire des choix éclairés et de planifier leurs soins en fonction de leurs contraintes personnelles et financières.

#### 1.4.2 Pour les Médecins
Les bénéfices pour les médecins se traduisent par une optimisation significative de leur exercice professionnel. L'optimisation du temps grâce à la gestion automatisée des créneaux libère les médecins des tâches administratives répétitives. L'accès centralisé aux dossiers permet une consultation rapide des informations patients, améliorant la qualité des consultations. La réduction des no-shows grâce au système de rappels automatiques optimise le taux de remplissage des plannings. La flexibilité offerte par la gestion des urgences avec les patients walk-in permet aux médecins de répondre aux besoins imprévus tout en maintenant l'organisation de leur planning.

#### 1.4.3 Pour les Établissements
L'efficacité opérationnelle constitue le principal bénéfice pour les institutions de santé. La réduction des tâches administratives permet de réallouer les ressources humaines vers des activités à plus forte valeur ajoutée. La visibilité renforcée par la présence en ligne améliore l'attractivité de l'établissement et facilite le recrutement de nouveaux patients. Les données analytiques fournies par le système permettent une meilleure compréhension de l'activité et facilitent la prise de décisions stratégiques. L'évolutivité de la solution garantit l'adaptation aux besoins croissants et aux changements organisationnels des établissements.

#### 1.4.4 Pour l'Écosystème Multi-Institutionnel
L'architecture multi-institutionnelle apporte une valeur ajoutée significative à l'ensemble de l'écosystème de santé. La coordination améliorée entre les différents types d'établissements facilite la continuité des soins et réduit les délais de prise en charge. Le partage sécurisé d'informations entre médecins, hôpitaux, pharmacies et laboratoires optimise les parcours de soins et améliore la sécurité des patients. La standardisation des processus de recherche et d'accès aux données garantit une expérience utilisateur cohérente tout en respectant les spécificités de chaque type d'établissement. Le système de thématisation dynamique renforce l'identité professionnelle de chaque institution tout en maintenant l'unité fonctionnelle de la plateforme.

### 1.5 Planification

#### 1.5.1 Composition de l'Équipe

Le projet a été développé en binôme par Aya BEROUKECH et Hamza BENMESSAOUD, étudiants en 4ème année du cycle ingénieur à SupMTI Oujda, sous l'encadrement de Pr. Ilhame El Farissi. Cette approche collaborative nous a permis une maîtrise complète de la stack technologique full-stack : React.js pour le frontend, Node.js/Express.js pour le backend, et MySQL pour la base de données. Notre développement s'est appuyé sur une architecture moderne avec plus de 45 composants React organisés en modules thématiques, 35+ endpoints API REST, et une base de données de 25+ tables interconnectées. L'encadrement pédagogique a apporté l'expertise méthodologique nécessaire à la gestion d'un projet de cette envergure technique.

#### 1.5.2 Planification Temporelle et Diagramme de Gantt

Le projet s'est déroulé sur une période de 12 semaines, structurée selon une approche méthodique permettant d'assurer la qualité et la complétude de la solution développée. La première semaine a été consacrée à l'analyse des besoins et à l'étude de l'existant, permettant de définir précisément le périmètre fonctionnel du projet. Les semaines 2 et 3 ont été dédiées à la conception technique, incluant la modélisation de la base de données, l'architecture système et le choix des technologies. Le développement s'est étendu sur les semaines 4 à 10, avec une approche parallèle combinant l'implémentation du backend et du frontend. Cette méthodologie de développement simultané a permis une intégration continue et une validation immédiate des fonctionnalités au fur et à mesure de leur création. Les semaines 11 et 12 ont été réservées aux tests finaux, à l'optimisation des performances et à la finalisation de la documentation technique.

```
Semaines  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10│11│12│
─────────────────────────────────────────────────────────
Analyse   │███│   │   │   │   │   │   │   │   │  │  │  │
Conception│   │███│███│   │   │   │   │   │   │  │  │  │
Backend   │   │   │   │███│███│███│███│███│███│██│  │  │
Frontend  │   │   │   │███│███│███│███│███│███│██│  │  │
Tests     │   │   │   │   │   │   │   │   │   │  │██│██│
```

#### 1.5.3 Méthodologie Agile/Scrum Adaptée

L'approche méthodologique adoptée s'inspire des principes Agile et Scrum adaptés au contexte d'un projet en binôme de fin d'études. Cette méthodologie agile a été choisie pour sa flexibilité et sa capacité d'adaptation aux évolutions technologiques et fonctionnelles rencontrées durant notre développement. Des sprints de deux semaines ont été définis pour structurer le développement et permettre une évaluation régulière de l'avancement, avec des livrables fonctionnels à chaque itération.

**Implémentation Scrum Personnalisée :** Des sprints de deux semaines ont été définis pour structurer le développement et permettre une évaluation régulière de l'avancement, avec des livrables fonctionnels à chaque itération. Chaque sprint débutait par une planification des tâches à réaliser, avec définition d'objectifs précis et mesurables sous forme de user stories. Des points de contrôle hebdomadaires avec l'encadrant pédagogique faisaient office de Sprint Reviews, permettant d'ajuster la planification en fonction des difficultés rencontrées et des opportunités d'amélioration identifiées. Les Sprint Retrospectives de fin de cycle permettaient d'analyser les succès et les points d'amélioration, favorisant un apprentissage continu et une optimisation de nos méthodes de travail.

**Gestion Agile du Backlog :** Le product backlog était régulièrement mis à jour avec les user stories priorisées selon leur valeur métier et leur complexité technique. Les épics principales comprenaient l'authentification multi-rôles, la gestion des rendez-vous intelligente, les dossiers médicaux complets, l'assistant IA médical, et l'architecture multi-institutionnelle. Cette approche nous a permis de concentrer nos efforts sur les fonctionnalités essentielles tout en gardant une vision claire des évolutions possibles.

**Avantages de l'Approche Agile :** L'approche itérative a facilité l'intégration progressive des fonctionnalités complexes, permettant de valider régulièrement la cohérence technique et fonctionnelle de la solution que nous avons développée. La flexibilité inhérente à cette méthodologie nous a permis d'adapter le périmètre du projet en fonction des contraintes temporelles tout en maintenant la qualité des livrables. L'utilisation d'outils de gestion de projet simples mais efficaces a facilité le suivi de l'avancement et la communication avec l'équipe pédagogique.

### 1.6 Contraintes et Défis

#### 1.6.1 Contraintes Techniques
Les contraintes techniques du projet sont multiples et exigent une attention particulière. La sécurité des données impose le respect du RGPD et la garantie de confidentialité médicale, nécessitant la mise en place de mesures de protection avancées. Les exigences de performance, avec un temps de réponse optimal, conditionnent l'adoption du système par les utilisateurs habitués à des interfaces réactives. La disponibilité du service 24h/24 et 7j/7 requiert une infrastructure robuste et des procédures de maintenance sophistiquées. La compatibilité multi-navigateurs et multi-dispositifs impose des tests exhaustifs et une conception responsive rigoureuse.

#### 1.6.2 Contraintes Fonctionnelles
Les défis fonctionnels reflètent la complexité du domaine médical. La gestion des spécificités médicales nécessite une compréhension approfondie des processus de soins et des besoins des professionnels de santé. La compatibilité avec les systèmes existants dans les établissements de santé peut s'avérer complexe en raison de la diversité des solutions déjà en place. L'accompagnement des utilisateurs dans l'adoption de nouveaux outils numériques requiert une approche pédagogique adaptée aux différents profils d'utilisateurs. La conformité aux normes médicales impose une veille réglementaire constante et des adaptations régulières du système pour maintenir la conformité.

---

## CHAPITRE 2: ÉTUDE FONCTIONNELLE

### 2.1 Analyse des Besoins

#### 2.1.1 Besoins Fonctionnels

**Gestion des Utilisateurs Multi-Rôles :** Le système implémente une authentification JWT avec huit rôles distincts stockés dans la table `utilisateurs`. Chaque rôle dispose d'un accès spécifique via middleware Express personnalisé. La vérification email utilise Nodemailer avec tokens temporaires. Le système de récupération de mot de passe génère des tokens sécurisés avec expiration automatique. L'historique des connexions et actions est tracé pour audit de sécurité.

**Gestion Avancée des Rendez-vous :** Le système gère les créneaux récurrents via la table `disponibilites_medecin` avec intervalles configurables (15/30/60 min). Les indisponibilités exceptionnelles sont gérées séparément. L'algorithme de recherche de créneaux évite les conflits en temps réel. Les notifications automatiques (email + interface) utilisent des templates personnalisés. Le système de statuts détaillés ('confirmé', 'annulé', 'reporté', 'terminé', 'no_show') assure une traçabilité complète.

**Dossiers Médicaux Complets :** La table `patients` centralise toutes les informations modifiables par les médecins (profession, groupe sanguin, habitudes). Les antécédents sont catégorisés par type avec dates précises. Le système d'allergies inclut sévérité et symptômes. Les traitements documentent posologie, durée et observance. Plus de 200 types d'analyses sont organisés en catégories avec valeurs de référence. Les constantes vitales permettent un suivi graphique longitudinal.

**Recherche Intelligente :** Le système de recherche multi-critères permet aux patients de localiser facilement les médecins selon leurs besoins. Les filtres combinés (spécialité, tarifs, disponibilité) utilisent des requêtes SQL optimisées avec pagination pour des performances maximales.

**Gestion Multi-Institutionnelle :** Le système implémente une architecture permettant aux hôpitaux, pharmacies et laboratoires d'accéder aux dossiers patients selon leurs rôles spécifiques. Les hôpitaux gèrent les admissions, assignations de médecins et suivi des séjours via les tables `hospital_assignments`, `hospital_beds` et `hospital_stays`. Les pharmacies accèdent aux prescriptions via `prescriptions` et `prescription_medications`, avec gestion de la dispensation dans `medication_dispensing`. Les laboratoires consultent les demandes via `test_requests` et `imaging_requests`, et téléchargent les résultats dans `test_results` et `imaging_results`. Un système de recherche unifié utilise l'utilitaire partagé `patientSearch.js` pour garantir la cohérence et la sécurité RGPD.

#### 2.1.2 Besoins Non Fonctionnels

**Performance :** Le système doit garantir un temps de réponse inférieur à 2 secondes pour maintenir une expérience utilisateur fluide et professionnelle. Le support de plus de 1000 utilisateurs simultanés assure la scalabilité nécessaire pour une adoption large de la plateforme. Une disponibilité de 99.9% du système garantit un accès continu aux services, essentiel dans le domaine médical.

**Sécurité :** Le chiffrement des données sensibles protège les informations médicales contre les accès non autorisés. La conformité RGPD assure le respect des réglementations européennes sur la protection des données personnelles. L'audit des accès permet de tracer toutes les consultations et modifications de données pour des raisons de sécurité et de responsabilité. La sauvegarde automatique garantit la pérennité des données et la continuité de service en cas d'incident.

**Utilisabilité :** L'interface intuitive et responsive s'adapte à tous les types d'utilisateurs, quel que soit leur niveau de maîtrise technologique. Le support multi-navigateurs assure la compatibilité avec les environnements informatiques variés des utilisateurs. L'accessibilité selon les standards WCAG 2.1 garantit l'utilisation du système par les personnes en situation de handicap.

### 2.2 Diagrammes d'Analyse

#### 2.2.1 Diagramme de Cas d'Utilisation

Le diagramme de cas d'Utilisation présente une vue d'ensemble des interactions entre les différents acteurs du système et les fonctionnalités principales de la plateforme médicale. Ce diagramme identifie huit acteurs principaux : Patient, Médecin, Administrateur, Super Administrateur, Institution, Pharmacie, Hôpital et Laboratoire. Les cas d'Utilisation sont organisés en modules fonctionnels cohérents incluant la gestion de l'authentification, la planification des rendez-vous, la gestion des dossiers médicaux, la recherche géolocalisée, et l'administration du système.

**[PLACEHOLDER - Diagramme de Cas d'Utilisation]**
*Figure 2.1 : Diagramme de cas d'Utilisation global de la plateforme médicale*
*Ce diagramme illustrera les interactions entre les 8 types d'acteurs et les principales fonctionnalités du système, organisées en packages thématiques (Authentification, Gestion RDV, Dossiers Médicaux, Géolocalisation, Administration).*

#### 2.2.2 Diagrammes de Séquence

Les diagrammes de séquence détaillent les interactions temporelles entre les objets du système pour les scénarios critiques. Quatre diagrammes principaux ont été modélisés pour couvrir les processus métier essentiels de la plateforme.

**Séquence 1 : Authentification et Connexion Utilisateur**

**[PLACEHOLDER - Diagramme de Séquence : Authentification]**
*Figure 2.2 : Séquence d'authentification multi-rôles*
*Ce diagramme montrera l'interaction entre l'interface utilisateur, le contrôleur d'authentification, le service JWT, et la base de données pour le processus de connexion avec vérification des rôles.*

**Séquence 2 : Prise de Rendez-vous Patient**

**[PLACEHOLDER - Diagramme de Séquence : Prise de RDV]**
*Figure 2.3 : Séquence de prise de rendez-vous*
*Ce diagramme illustrera le processus complet de réservation d'un rendez-vous, incluant la recherche de créneaux disponibles, la vérification des conflits, et la confirmation avec notification.*

**Séquence 3 : Consultation Médicale et Mise à Jour du Dossier**

**[PLACEHOLDER - Diagramme de Séquence : Consultation Médicale]**
*Figure 2.4 : Séquence de consultation et mise à jour du dossier patient*
*Ce diagramme détaillera l'interaction entre le médecin, l'interface de consultation, et les différentes tables de données médicales lors d'une consultation.*

**Séquence 4 : Recherche Géolocalisée de Médecins**

**[PLACEHOLDER - Diagramme de Séquence : Recherche Géolocalisée]**
*Figure 2.5 : Séquence de recherche géographique de médecins*
*Ce diagramme montrera l'interaction avec l'API de géolocalisation, le calcul de distances, et l'affichage des résultats sur la carte interactive.*

#### 2.2.3 Modèle Conceptuel de Données (MCD)

**Entités Principales Implémentées :**

Le modèle conceptuel de données s'articule autour de vingt-cinq entités principales interconnectées par des relations complexes respectant les contraintes d'intégrité référentielle.

**[PLACEHOLDER - Modèle Conceptuel de Données]**
*Figure 2.6 : Modèle Conceptuel de Données complet*
*Ce diagramme présentera l'ensemble des 25+ tables avec leurs attributs, types de données, contraintes et relations. Les entités seront organisées en groupes logiques : Utilisateurs, Médical, Géolocalisation, Analyses, et Administration.*

```
Entités Centrales :
├─► Utilisateurs (id, nom_utilisateur, email, role, mot_de_passe, id_specifique_role)
├─► Patients (id, prenom, nom, date_naissance, CIN, telephone, adresse, profession, groupe_sanguin)
├─► Medecins (id, prenom, nom, specialite_id, numero_ordre, tarif_consultation)
├─► Institutions (id, nom, adresse, type, telephone, email)
└─► Specialites (id, nom, description)

Entités Médicales :
├─► Rendez_vous (id, patient_id, medecin_id, date_heure, statut, motif, type)
├─► Consultations (id, rdv_id, motif, examen_clinique, diagnostic, prescription)
├─► Antecedents_medicaux (id, patient_id, type, description, date_diagnostic)
├─► Patient_allergies (id, patient_id, allergie_id, severite, date_decouverte)
├─► Traitements (id, patient_id, medicament_id, posologie, date_debut, date_fin)
└─► Constantes_vitales (id, consultation_id, tension_systolique, tension_diastolique, poids, taille)

Entités d'Analyses :
├─► Categories_analyses (id, nom, description)
├─► Types_analyses (id, categorie_id, nom, valeur_reference_min, valeur_reference_max, unite)
├─► Resultats_analyses (id, patient_id, type_analyse_id, valeur, date_analyse)
└─► Resultats_imagerie (id, patient_id, type_examen, description, date_examen)

Entités Multi-Institutionnelles :
├─► Hospital_assignments (id, patient_id, hospital_id, doctor_id, admission_date, discharge_date, status)
├─► Hospital_beds (id, hospital_id, bed_number, ward, status, patient_id)
├─► Hospital_stays (id, assignment_id, stay_duration, procedures, surgeries, billing_info)
├─► Prescription_medications (id, prescription_id, medication_id, quantity, dosage, dispensed_quantity)
├─► Medication_dispensing (id, prescription_medication_id, pharmacy_id, quantity_dispensed, dispensing_date)
├─► Test_requests (id, patient_id, doctor_id, test_type, urgency, status, request_date)
├─► Imaging_requests (id, patient_id, doctor_id, imaging_type, urgency, status, request_date)
├─► Test_results (id, test_request_id, laboratory_id, results, technician_notes, completion_date)
├─► Imaging_results (id, imaging_request_id, laboratory_id, results, radiologist_report, completion_date)
└─► Patient_search_audit (id, searching_user_id, searching_institution_id, search_criteria, results_count, timestamp)

Entités IA et Statistiques :
├─► Diagnosis_suggestions (id, patient_id, symptomes_json, suggestions_json, niveau_confiance, date_analyse)
├─► Diagnosis_feedback (id, suggestion_id, patient_id, evaluation, commentaires, date_feedback)
├─► Statistiques_medecin (id, medecin_id, periode, nb_consultations, nb_patients, taux_presence)
└─► Logs_activite (id, utilisateur_id, action, details_json, timestamp)
```

#### 2.2.4 Diagramme de Classes

Le diagramme de classes présente la structure orientée objet de l'application, mettant en évidence les classes principales, leurs attributs, méthodes et relations d'héritage ou d'association.

**[PLACEHOLDER - Diagramme de Classes Backend]**
*Figure 2.7 : Diagramme de classes du backend Node.js*
*Ce diagramme montrera l'architecture MVC avec les contrôleurs, modèles, services et middlewares. Les classes principales incluront UserController, PatientController, MedecinController, RendezVousController, et les services d'authentification.*

**[PLACEHOLDER - Diagramme de Classes Frontend]**
*Figure 2.8 : Diagramme de classes des composants React*
*Ce diagramme illustrera l'architecture des composants React avec leurs props, states et méthodes. Les composants principaux incluront PatientHome, MedecinDashboard, RendezVousManager, et les composants de géolocalisation.*

#### 2.2.5 Diagramme d'Activités

Les diagrammes d'activités modélisent les flux de travail complexes et les processus métier de la plateforme médicale.

**Activité 1 : Processus de Prise de Rendez-vous**

**[PLACEHOLDER - Diagramme d'Activités : Prise de RDV]**
*Figure 2.9 : Flux d'activités pour la prise de rendez-vous*
*Ce diagramme montrera le processus complet depuis la recherche de médecin jusqu'à la confirmation du rendez-vous, incluant les points de décision, les validations et les notifications.*

**Activité 2 : Gestion d'une Consultation Médicale**

**[PLACEHOLDER - Diagramme d'Activités : Consultation]**
*Figure 2.10 : Flux d'activités pour une consultation médicale*
*Ce diagramme détaillera le processus de consultation depuis l'accueil du patient jusqu'à la mise à jour du dossier médical et la planification du suivi.*

**Activité 3 : Processus d'Inscription et Validation Médecin**

**[PLACEHOLDER - Diagramme d'Activités : Inscription Médecin]**
*Figure 2.11 : Flux d'activités pour l'inscription et validation d'un médecin*
*Ce diagramme illustrera le processus d'inscription, de vérification des documents, de validation administrative et d'activation du compte médecin.*

#### 2.2.6 Diagramme d'États-Transitions

Les diagrammes d'états-transitions modélisent les changements d'état des objets métier critiques du système.

**États du Rendez-vous**

**[PLACEHOLDER - Diagramme d'États : Rendez-vous]**
*Figure 2.12 : États et transitions d'un rendez-vous*
*Ce diagramme montrera les états possibles d'un rendez-vous (en_attente, confirmé, en_cours, terminé, annulé, reporté, no_show) et les transitions autorisées entre ces états.*

**États du Dossier Patient**

**[PLACEHOLDER - Diagramme d'États : Dossier Patient]**
*Figure 2.13 : États et transitions d'un dossier patient*
*Ce diagramme illustrera l'évolution du statut d'un dossier patient (nouveau, en_cours, complet, archivé) et les conditions de transition.*

**États du Compte Médecin**

**[PLACEHOLDER - Diagramme d'États : Compte Médecin]**
*Figure 2.14 : États et transitions d'un compte médecin*
*Ce diagramme détaillera les états d'un compte médecin (pending, en_verification, approved, actif, suspendu, rejected) et les processus de validation.*

### 2.3 Spécifications Détaillées

#### 2.3.1 Module d'Authentification

**Fonctionnalités :** Le module d'authentification intègre une inscription avec vérification email qui garantit l'authenticité des comptes utilisateurs dès leur création. La connexion avec JWT (JSON Web Tokens) assure une gestion sécurisée des sessions utilisateur avec un contrôle fin des droits d'accès. 

**Système de Récupération de Mot de Passe :** Le système implémente une fonctionnalité complète de récupération de mot de passe exclusivement pour les patients, garantissant la sécurité tout en préservant l'accessibilité. L'architecture technique s'appuie sur plusieurs composants intégrés :

- **Backend (authController.js)** : Deux endpoints dédiés gèrent le processus complet. `POST /api/auth/forgot-password` traite les demandes de réinitialisation en générant des tokens sécurisés avec crypto.randomBytes() et en envoyant des emails professionnels via Nodemailer. `POST /api/auth/reset-password` valide les tokens, vérifie leur expiration (1 heure), et met à jour les mots de passe avec hachage bcrypt.

- **Service Email (emailService.js)** : Le service intègre des templates HTML professionnels avec design responsive et branding BluePulse. Les emails incluent des liens sécurisés, des instructions claires, et des avertissements de sécurité. La configuration SMTP utilise des variables d'environnement pour la sécurité des credentials.

- **Interface Utilisateur** : L'intégration UI comprend un bouton "Mot de passe oublié ?" sur la page de connexion, ouvrant une boîte de dialogue Material-UI élégante (ForgotPasswordDialog.jsx) avec validation d'email en temps réel, états de chargement, et messages de confirmation. La page de réinitialisation (ResetPassword.jsx) offre une interface complète avec validation de token, indicateur de force du mot de passe, confirmation de correspondance, et redirection automatique après succès.

- **Sécurité Renforcée** : Le système implémente plusieurs mesures de protection : tokens à durée de vie limitée (1 heure), aucune divulgation d'informations sur l'existence des comptes, hachage sécurisé des mots de passe avec bcrypt, et validation stricte des critères de complexité. L'utilisation des colonnes existantes `token_reset_password` et `date_expiration_token` évite les modifications de schéma tout en assurant la traçabilité.

La gestion des sessions maintient la continuité de l'expérience utilisateur tout en respectant les exigences de sécurité médicale.

**Règles Métier :** Les mots de passe doivent respecter une complexité minimale avec au moins 6 caractères pour assurer un équilibre entre sécurité et utilisabilité. Le système limite les tentatives de connexion à 5 échecs consécutifs pour prévenir les attaques par force brute. Les tokens JWT ont une durée de vie de 24 heures pour équilibrer sécurité et confort d'utilisation. La vérification email est obligatoire avant l'activation complète du compte utilisateur. Le processus de récupération de mot de passe est exclusivement disponible pour les comptes patients, avec des tokens de réinitialisation ayant une durée de vie limitée à une heure pour des raisons de sécurité. Le système n'expose aucune information sur l'existence ou non d'un compte associé à une adresse email donnée, retournant systématiquement le même message de confirmation pour préserver la confidentialité des utilisateurs. Les nouveaux mots de passe sont soumis aux mêmes critères de validation que lors de l'inscription, avec vérification de la correspondance entre le mot de passe et sa confirmation avant acceptation.

#### 2.3.2 Module de Gestion des Rendez-vous

**Fonctionnalités :** La création de créneaux par les médecins permet une gestion flexible de l'emploi du temps selon les contraintes personnelles et professionnelles de chaque médecin. La réservation par les patients s'effectue en temps réel avec vérification automatique de la disponibilité. La gestion des conflits prévient les doubles réservations et propose des alternatives en cas d'indisponibilité. Les notifications automatiques informent toutes les parties prenantes des créations, modifications ou annulations de rendez-vous.

**Règles Métier :** Le système empêche toute double réservation d'un même créneau horaire pour garantir l'intégrité du planning médical. L'annulation de rendez-vous reste possible jusqu'à 2 heures avant l'heure prévue pour permettre une réorganisation optimale. Les rappels automatiques sont envoyés 24 heures et 1 heure avant le rendez-vous pour réduire l'absentéisme. Les créneaux peuvent être configurés par intervalles de 15, 30 ou 60 minutes selon les besoins de chaque spécialité médicale.

#### 2.3.3 Module de Recherche Géographique

**Fonctionnalités :** La recherche par code postal ou ville permet aux patients de localiser facilement les médecins dans leur zone géographique en saisissant manuellement leur adresse ou ville. Le calcul de distance utilise les coordonnées GPS pour fournir des résultats précis et pertinents. Le filtrage par spécialité médicale affine les résultats selon les besoins spécifiques du patient. Le tri par proximité et disponibilité optimise l'affichage des résultats pour faciliter la prise de décision.

**Règles Métier :** Le rayon de recherche par défaut est fixé à 50 kilomètres pour équilibrer pertinence géographique et choix disponibles. Les patients saisissent manuellement leur localisation pour préserver leur vie privée et éviter les demandes d'autorisation de géolocalisation automatique. Les coordonnées GPS sont stockées de manière sécurisée pour les médecins et institutions participant au système de géolocalisation.

#### 2.3.4 Module Assistant Chatbot IA

**Architecture Multi-Services :** Le module chatbot implémente une architecture de fallback intelligent avec trois niveaux de service. Le service principal utilise Ollama pour l'exécution locale de modèles de langage spécialisés en médecine, garantissant la confidentialité des données patients. En cas d'indisponibilité, le système bascule automatiquement vers OpenAI GPT-3.5-turbo, puis vers Hugging Face BioGPT-Large, avant de revenir à l'analyse basée sur des règles prédéfinies.

**Fonctionnalités d'Analyse :** L'assistant combine trois approches complémentaires : analyse basée sur des règles avec cartographie de plus de vingt symptômes courants, analyse par IA exploitant des modèles pré-entraînés sur des corpus médicaux, et analyse contextuelle tenant compte de l'intensité des symptômes et des combinaisons multi-systémiques. Le système supporte le multilinguisme (français, anglais, arabe dialectal marocain) pour une accessibilité maximale.

**Règles Métier :** Chaque interaction est accompagnée de disclaimers précisant le caractère préliminaire des suggestions. Le système détecte automatiquement les urgences médicales et affiche des avertissements prioritaires. Toutes les données sont anonymisées avant transmission aux services externes. L'historique des interactions est tracé pour amélioration continue et audit de conformité.

#### 2.3.5 Module Statistiques et Tableaux de Bord

**Métriques Médecin :** Le système génère des statistiques d'activité personnalisées incluant le nombre de consultations par période (jour/semaine/mois), la répartition des patients par tranche d'âge et pathologie, les taux de présence aux rendez-vous avec analyse des no-shows, et l'évolution temporelle de l'activité. Les graphiques interactifs Chart.js permettent l'analyse des tendances et l'identification des créneaux horaires optimaux.

**Métriques Administrateur :** L'interface administrative centralise les indicateurs globaux de performance : nombre d'utilisateurs actifs par type et période, statistiques d'utilisation des fonctionnalités, les métriques de performance système, et les rapports d'activité des établissements. Les graphiques d'évolution temporelle permettent le suivi des tendances d'adoption et l'identification des pics d'activité pour l'optimisation des ressources.

**Règles Métier :** Les données statistiques respectent l'anonymisation des informations patients. Les rapports sont générés en temps réel avec mise en cache pour optimiser les performances. L'export des données est sécurisé et tracé pour audit. Les métriques de géolocalisation respectent les contraintes de confidentialité des établissements.

### 2.4 Interfaces Utilisateur

#### 2.4.1 Interface Patient

**Tableau de Bord :** Le tableau de bord patient centralise l'information essentielle pour faciliter le suivi médical. L'affichage des prochains rendez-vous permet une planification efficace et évite les oublis. La liste des médecins favoris facilite la prise de rendez-vous avec les médecins habituels. Les rappels médicaux alertent sur les examens ou consultations à programmer. L'accès rapide à la recherche permet de trouver immédiatement un nouveau médecin si nécessaire.

**Recherche de Médecin :** La barre de recherche intelligente propose une saisie intuitive avec auto-complétion et suggestions contextuelles. Les filtres avancés permettent de combiner spécialité, distance géographique et tarif pour affiner les résultats. La carte interactive avec marqueurs offre une visualisation géographique immédiate des médecins disponibles. Les profils détaillés des médecins fournissent toutes les informations nécessaires à la prise de décision (formation, expérience, tarifs, avis patients).

**Assistant Chatbot :** L'interface chatbot se présente sous forme d'une fenêtre de discussion minimisable et non-intrusive, accessible depuis toutes les pages patient. L'interface conversationnelle guide l'utilisateur dans la description de ses symptômes avec des questions contextuelles intelligentes. Les réponses de l'assistant incluent des suggestions diagnostiques préliminaires, des recommandations d'urgence si nécessaire, et des orientations vers des spécialités médicales appropriées. L'historique des conversations est sauvegardé pour permettre un suivi longitudinal des préoccupations de santé.

#### 2.4.2 Interface Médecin

**Tableau de Bord :** Le tableau de bord médecin optimise la gestion quotidienne de l'activité professionnelle. L'affichage des rendez-vous du jour permet une préparation efficace des consultations. La liste des patients en attente facilite la gestion des urgences et des imprévus. Les statistiques d'activité fournissent des indicateurs de performance et d'évolution de la pratique. Les notifications urgentes alertent sur les situations nécessitant une attention immédiate.

**Gestion des Patients :** La recherche de patients permet un accès rapide aux dossiers médicaux lors des consultations. Les dossiers médicaux complets centralisent toute l'information nécessaire à la prise en charge. La création de consultations documente chaque interaction thérapeutique de manière structurée. Les modules de prescription et recommandations facilitent le suivi post-consultation et la continuité des soins.

**Statistiques et Analyses :** Le tableau de bord statistiques présente des graphiques interactifs Chart.js avec métriques d'activité personnalisées. Les visualisations incluent l'évolution du nombre de consultations, la répartition des patients par pathologie, les analyses de créneaux horaires optimaux, et les taux de présence aux rendez-vous. Les rapports d'activité sont exportables en PDF pour les besoins administratifs et comptables. Les graphiques de tendances permettent l'identification des patterns d'activité et l'optimisation de la planification.

#### 2.4.3 Interface Administrative

**Gestion Globale :** L'interface administrative centralise le pilotage de la plateforme. Le tableau de bord analytique fournit une vue d'ensemble de l'activité avec des indicateurs clés de performance. La gestion des utilisateurs permet l'administration des comptes et la résolution des problèmes d'accès. La configuration du système autorise l'adaptation de la plateforme aux besoins spécifiques. Les rapports d'activité génèrent des synthèses périodiques pour le suivi de la performance globale.

**Tableaux de Bord Analytiques :** L'interface administrative intègre des tableaux de bord sophistiqués avec métriques globales de la plateforme. Les indicateurs incluent le nombre d'utilisateurs actifs par type et période, les statistiques d'utilisation des fonctionnalités principales, les métriques de performance système (temps de réponse, disponibilité), et les analyses géographiques de répartition des établissements. Les graphiques d'évolution temporelle permettent le suivi des tendances d'adoption et l'identification des pics d'activité pour l'optimisation des ressources. Les rapports de géolocalisation visualisent la densité des médecins par région et facilitent l'analyse de couverture territoriale.

### 2.5 Architecture Fonctionnelle

#### 2.5.1 Architecture en Couches

L'architecture fonctionnelle s'organise en quatre couches distinctes pour garantir la modularité et la maintenabilité du système. La Couche Présentation, développée avec React.js et Material-UI, gère l'interface utilisateur et l'expérience client. La Couche Service intègre l'API REST et la logique métier pour traiter les demandes utilisateur. La Couche Accès Données, basée sur MySQL avec optimisations ORM, gère les interactions avec la base de données. La Couche Persistance assure le stockage sécurisé et structuré de toutes les données du système.

```
┌─────────────────────────────────────────┐
│           Couche Présentation           │
│        (React.js + Material-UI)         │
├─────────────────────────────────────────┤
│            Couche Service               │
│         (API REST + Business Logic)     │
├─────────────────────────────────────────┤
│           Couche Accès Données          │
│            (MySQL + ORM)                │
├─────────────────────────────────────────┤
│           Couche Persistance            │
│          (Base de Données MySQL)        │
└─────────────────────────────────────────┘
```

#### 2.5.2 API REST - Endpoints Principaux

**Authentification :** Les endpoints d'authentification gèrent l'ensemble du cycle de vie des sessions utilisateur. `POST /api/auth/login` traite les demandes de connexion avec vérification des identifiants. `POST /api/auth/register` gère la création de nouveaux comptes utilisateur avec validation des données. `POST /api/auth/logout` termine proprement les sessions actives. 

**Endpoints de Récupération de Mot de Passe :** Deux endpoints spécialisés gèrent le processus complet de récupération de mot de passe :

- `POST /api/auth/forgot-password` : Traite les demandes de réinitialisation de mot de passe. Accepte un objet JSON avec l'adresse email du patient. Génère un token sécurisé avec crypto.randomBytes(32), définit une expiration d'une heure, et envoie un email de réinitialisation via Nodemailer. Retourne systématiquement le même message de confirmation pour préserver la confidentialité des comptes, qu'ils existent ou non.

- `POST /api/auth/reset-password` : Valide le token de réinitialisation et met à jour le mot de passe. Accepte un objet JSON avec le token et le nouveau mot de passe. Vérifie la validité et l'expiration du token, hache le nouveau mot de passe avec bcrypt, et nettoie les données de réinitialisation. Retourne un message de succès ou d'erreur selon la validité du token.

Ces endpoints implémentent des mesures de sécurité strictes : restriction aux comptes patients uniquement, tokens à durée de vie limitée, aucune divulgation d'informations sur l'existence des comptes, et validation complète des données d'entrée.

**Gestion des Rendez-vous :** Les endpoints de rendez-vous orchestrent la planification médicale. `GET /api/appointments` récupère la liste des rendez-vous selon les droits d'accès de l'utilisateur. `POST /api/appointments` crée de nouveaux rendez-vous avec vérification de disponibilité. `PUT /api/appointments/:id` modifie les rendez-vous existants en respectant les contraintes métier. `DELETE /api/appointments/:id` gère l'annulation des rendez-vous avec notification automatique.

**Gestion des Médecins :** Les endpoints médecins facilitent la recherche et la consultation des profils professionnels. `GET /api/medecins` fournit la liste complète des médecins avec filtrage possible. `GET /api/medecins/search` offre une recherche avancée par critères multiples. `GET /api/medecins/:id/disponibilites` récupère les créneaux disponibles d'un médecin spécifique.

**Gestion des Patients :** Les endpoints patients centralisent l'accès aux dossiers médicaux. `GET /api/patients/:id/dossier` récupère le dossier médical complet d'un patient. `POST /api/patients/:id/consultation` crée un nouveau compte-rendu de consultation. `GET /api/patients/:id/historique` fournit l'historique complet des interactions médicales du patient.

**Assistant Chatbot IA :** Les endpoints de l'assistant IA gèrent l'analyse de symptômes et les interactions conversationnelles. `POST /api/diagnosis/analyze` traite l'analyse basique de symptômes avec règles prédéfinies. `POST /api/diagnosis/ai-analyze` effectue l'analyse avancée via les services IA externes. `POST /api/diagnosis/chat` gère les conversations avec l'assistant virtuel. `GET /api/diagnosis/history` récupère l'historique des analyses pour un patient. `POST /api/diagnosis/feedback` collecte les évaluations des patients sur la qualité des suggestions.

**Statistiques et Métriques :** Les endpoints statistiques fournissent les données analytiques pour les tableaux de bord. `GET /api/stats/medecin/:id` génère les statistiques d'activité personnalisées pour un médecin. `GET /api/stats/admin/global` fournit les métriques globales de la plateforme. `GET /api/stats/admin/users` récupère les statistiques d'utilisation par type d'utilisateur. `GET /api/stats/geolocation` analyse la répartition géographique des établissements. `POST /api/stats/export` génère et exporte les rapports d'activité en PDF.

---

## CHAPITRE 3: ÉTUDE TECHNIQUE ET RÉALISATION

### 3.1 Architecture du Système

#### 3.1.1 Architecture Globale

[Insert picture of system architecture diagram showing three-tier structure: Frontend (React.js), Backend (Node.js), and Database (MySQL)]

L'architecture du système suit un modèle en trois tiers moderne avec séparation stricte des responsabilités. Le Frontend React.js (port 3000) utilise une architecture par composants avec plus de 45 composants organisés en modules thématiques (auth, patient, medecin, admin, layout). Le Backend Node.js/Express.js (port 5000) implémente une API REST avec plus de 35 endpoints, middlewares d'authentification JWT, et controllers spécialisés. La Base de Données MySQL comprend 25+ tables avec contraintes d'intégrité, index optimisés et triggers pour l'audit. L'architecture supporte la géolocalisation avec coordonnées GPS indexées et calculs de distance optimisés.

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│   Frontend React.js     │    │    Backend Node.js      │    │   Base de Données      │
│   Port: 3000           │◄──►│   Express.js Port: 5000 │◄──►│   MySQL                │
│   • 45+ Composants     │    │   • 35+ Endpoints API   │    │   • 25+ Tables         │
│   • Material-UI        │    │   • JWT Middleware      │    │   • Index Spatiaux     │
│   • Cartographie       │    │   • Nodemailer          │    │   • Contraintes FK     │
│   • Axios HTTP         │    │   • Bcrypt Security     │    │   • Audit Triggers     │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

#### 3.1.2 Technologies Utilisées

[Insert picture of technology stack diagram showing all frameworks, libraries, and tools used]

**Frontend Stack Moderne :** React.js 18.2.0 avec hooks et composants fonctionnels pour une architecture moderne et performante. Material-UI (MUI) 5.13.0 avec @mui/icons-material, @mui/lab et @mui/x-date-pickers pour une interface cohérente et professionnelle. React Router DOM 6.11.1 pour la navigation SPA avec protection des routes par rôle. Axios 1.4.0 pour les communications HTTP avec intercepteurs d'authentification. Cartographie interactive avec OpenStreetMap pour la géolocalisation des médecins et institutions. Chart.js 4.4.9 + React-ChartJS-2 5.3.0 pour les graphiques de constantes vitales. Date-fns 2.30.0 pour la manipulation des dates et créneaux horaires.

**Backend Robuste :** Node.js avec Express.js 4.18.2 pour l'API REST avec architecture MVC (controllers, routes, middlewares). MySQL2 3.3.1 pour les connexions optimisées avec pool de connexions et requêtes préparées. JWT (jsonwebtoken 9.0.0) pour l'authentification stateless avec refresh tokens. Bcrypt 5.1.0 pour le hashage sécurisé des mots de passe avec salt. Nodemailer 6.9.2 pour l'envoi d'emails avec templates HTML et authentification SMTP. CORS 2.8.5 pour la sécurisation des requêtes cross-origin. Dotenv 16.0.3 pour la gestion sécurisée des variables d'environnement.

**Base de Données Optimisée :** MySQL avec 25+ tables normalisées (3NF) et contraintes d'intégrité référentielle strictes. Index composites optimisés pour les requêtes géographiques (latitude/longitude), recherches textuelles et jointures fréquentes. Contraintes CHECK pour la validation des données médicales (groupes sanguins, statuts, types). Triggers pour l'audit automatique des modifications dans `historique_actions`. Procédures stockées pour les calculs complexes de disponibilités et conflits de rendez-vous.

[Insert picture of database schema diagram showing all 25+ tables with relationships and constraints]

#### 3.1.3 Diagramme de Déploiement

Le diagramme de déploiement illustre l'architecture physique de la plateforme médicale et la répartition des composants sur l'infrastructure technique.

**[PLACEHOLDER - Diagramme de Déploiement]**
*Figure 3.1 : Architecture de déploiement de la plateforme médicale*
*Ce diagramme montrera la répartition des composants sur les serveurs : serveur web (React.js), serveur d'application (Node.js/Express), serveur de base de données (MySQL), et les connexions réseau entre ces éléments. Il inclura également les services externes (SMTP, APIs de géolocalisation).*

#### 3.1.4 Diagramme de Composants

Le diagramme de composants détaille l'organisation modulaire de l'application et les dépendances entre les différents modules.

**[PLACEHOLDER - Diagramme de Composants Backend]**
*Figure 3.2 : Architecture en composants du backend Node.js*
*Ce diagramme présentera l'organisation des modules backend : contrôleurs, services, middlewares, modèles de données, et leurs interfaces. Il montrera les dépendances entre les modules d'authentification, de gestion des rendez-vous, des dossiers médicaux, et de géolocalisation.*

**[PLACEHOLDER - Diagramme de Composants Frontend]**
*Figure 3.3 : Architecture en composants du frontend React*
*Ce diagramme illustrera l'organisation des composants React en modules thématiques : authentification, patient, médecin, administration, et composants partagés. Il montrera les flux de données et les dépendances entre composants.*

#### 3.1.5 Diagramme de Communication

Le diagramme de communication présente les interactions entre les différents composants du système lors de l'exécution des fonctionnalités principales.

**[PLACEHOLDER - Diagramme de Communication : Prise de RDV]**
*Figure 3.4 : Communication entre composants pour la prise de rendez-vous*
*Ce diagramme montrera les messages échangés entre l'interface utilisateur, les contrôleurs, les services métier, et la base de données lors du processus de réservation d'un rendez-vous.*

**[PLACEHOLDER - Diagramme de Communication : Géolocalisation]**
*Figure 3.5 : Communication pour la recherche géolocalisée*
*Ce diagramme détaillera les interactions avec les services de géolocalisation, le calcul de distances, et l'affichage des résultats sur la carte interactive.*

### 3.2 Réalisation

#### 3.2.1 Développement Frontend

La structure de l'application React suit une organisation modulaire avec séparation claire des responsabilités. Les composants sont organisés en dossiers thématiques (auth, patient, médecin, common) pour faciliter la maintenance et la réutilisation. La gestion des routes utilise React Router avec protection des accès selon les rôles utilisateur. Les hooks personnalisés centralisent la logique métier et la gestion d'état. Le système de thème Material-UI assure une cohérence visuelle sur l'ensemble de l'application. Les appels API sont centralisés dans des services dédiés avec gestion d'erreurs uniforme.

[Insert picture of the medical platform homepage/dashboard showing the main interface]

L'interface patient privilégie la simplicité d'utilisation avec un tableau de bord intuitif présentant les informations essentielles. La recherche de médecins intègre des filtres avancés et une carte interactive pour la géolocalisation. Le processus de prise de rendez-vous guide l'utilisateur étape par étape avec validation en temps réel. La gestion des favoris permet un accès rapide aux médecins habituels.

**Amélioration de l'Expérience d'Authentification :** L'interface de connexion a été enrichie avec une fonctionnalité de récupération de mot de passe intégrée et accessible. Le bouton "Mot de passe oublié ?" est stratégiquement positionné sous les champs de connexion pour une découverte naturelle. L'activation de cette fonctionnalité ouvre une boîte de dialogue modale élégante qui maintient le contexte de connexion tout en offrant une solution immédiate aux patients ayant oublié leurs identifiants.

**Design et Ergonomie de la Récupération :** La boîte de dialogue de récupération utilise les composants Material-UI pour une cohérence visuelle parfaite avec le reste de l'application. L'interface guide l'utilisateur avec des messages clairs et des validations en temps réel. Les états de chargement avec indicateurs visuels informent l'utilisateur du traitement de sa demande. Les messages de confirmation sont formulés de manière à préserver la confidentialité tout en rassurant l'utilisateur sur le traitement de sa demande.

**Page de Réinitialisation Optimisée :** La page de réinitialisation de mot de passe offre une expérience utilisateur complète avec validation en temps réel de la force du mot de passe. L'indicateur de sécurité visuel guide l'utilisateur vers la création d'un mot de passe robuste. La vérification de correspondance entre les deux saisies évite les erreurs de frappe. La redirection automatique après succès fluidifie le parcours utilisateur vers la connexion.

[Insert picture of patient appointment booking interface showing search filters and available time slots]

[Insert picture of interactive map showing doctor locations with markers and search filters]

L'interface médecin optimise la productivité avec un tableau de bord synthétique présentant l'activité du jour. La gestion des patients walk-in permet l'enregistrement rapide de nouveaux patients et la consultation immédiate de leurs dossiers. Les fonctionnalités de recherche de patients facilitent l'accès aux dossiers médicaux. Le module de consultation permet la saisie structurée des comptes-rendus avec gestion des antécédents et prescriptions.

[Insert picture of doctor dashboard showing appointment calendar, patient list, and availability management]

[Insert picture of patient medical record interface showing personal information, medical history, and treatment sections]

#### 3.2.2 Développement Backend

L'architecture du serveur Express.js organise le code en modules fonctionnels avec controllers, routes, middlewares et utilitaires. Les controllers implémentent la logique métier spécifique à chaque domaine (authentification, patients, médecins, rendez-vous). Les middlewares gèrent l'authentification JWT, la validation des données et l'audit des accès. Les routes définissent les endpoints API REST avec documentation intégrée.

Le module d'authentification implémente un système complet avec inscription, connexion, vérification email et récupération de mot de passe. Les mots de passe sont sécurisés par hashage bcrypt avec salt. Les tokens JWT incluent les informations de rôle pour la gestion des autorisations. Le système de notifications utilise Nodemailer pour l'envoi d'emails avec templates personnalisés.

**Implémentation Technique de la Récupération de Mot de Passe :**

L'architecture technique de la fonctionnalité de récupération de mot de passe s'appuie sur une approche sécurisée multi-couches intégrant backend, frontend et service email :

**Backend - Contrôleur d'Authentification :**
```javascript
// authController.js - Endpoint de demande de réinitialisation
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expirationDate = new Date(Date.now() + 3600000); // 1 heure
  
  // Mise à jour sécurisée sans révéler l'existence du compte
  await db.query(
    'UPDATE utilisateurs SET token_reset_password = ?, date_expiration_token = ? WHERE email = ? AND role = "patient"',
    [resetToken, expirationDate, email]
  );
  
  await sendPasswordResetEmail(email, resetToken);
  res.json({ message: 'Si un compte existe, un email a été envoyé' });
};

// Endpoint de validation et réinitialisation
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  const result = await db.query(
    'UPDATE utilisateurs SET mot_de_passe = ?, token_reset_password = NULL, date_expiration_token = NULL WHERE token_reset_password = ? AND date_expiration_token > NOW() AND role = "patient"',
    [hashedPassword, token]
  );
  
  if (result.affectedRows === 0) {
    return res.status(400).json({ message: 'Token invalide ou expiré' });
  }
  
  res.json({ message: 'Mot de passe réinitialisé avec succès' });
};
```

**Service Email - Templates Professionnels :**
```
// emailService.js - Template HTML responsive
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisation de mot de passe - BluePulse</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1976d2;">BluePulse</h1>
          <h2 style="color: #333;">Réinitialisation de votre mot de passe</h2>
        </div>
        
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>⚠️ Important :</strong>
          <ul>
            <li>Ce lien expire dans 1 heure</li>
            <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
            <li>Ne partagez jamais ce lien avec personne</li>
          </ul>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Si le bouton ne fonctionne pas, copiez ce lien : ${resetUrl}
        </p>
      </div>
    </body>
    </html>
  `;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - BluePulse',
    html: htmlTemplate
  });
};
```

**Frontend - Interface Utilisateur Intégrée :**

**Composant de Dialogue (ForgotPasswordDialog.jsx) :**
```javascript
const ForgotPasswordDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Si un compte existe, un email de réinitialisation a été envoyé');
      setError('');
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mot de passe oublié ?</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Adresse email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error}
            disabled={loading}
          />
          {message && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !email}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

**Page de Réinitialisation (ResetPassword.jsx) :**
```javascript
const ResetPassword = () => {
  const [token] = useSearchParams();
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', {
        token: token.get('token'),
        newPassword: passwords.password
      });
      
      setSuccess('Mot de passe réinitialisé avec succès !');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Token invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Nouveau mot de passe
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nouveau mot de passe"
            type="password"
            value={passwords.password}
            onChange={(e) => {
              setPasswords(prev => ({ ...prev, password: e.target.value }));
              setStrength(calculatePasswordStrength(e.target.value));
            }}
            margin="normal"
          />
          
          <PasswordStrengthIndicator strength={strength} />
          
          <TextField
            fullWidth
            label="Confirmer le mot de passe"
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
            margin="normal"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || strength < 3}
            sx={{ mt: 3 }}
          >
            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

**Base de Données et ORM :** MySQL2 3.3.1 assure les connexions optimisées avec pool de connexions et requêtes préparées. L'architecture de base de données comprend 25+ tables normalisées avec contraintes d'intégrité référentielle strictes et index composites optimisés.

**Sécurité et Authentification :** JWT (jsonwebtoken 9.0.0) gère l'authentification stateless avec tokens sécurisés. Bcrypt 5.1.0 assure le hashage des mots de passe avec salt. CORS 2.8.5 sécurise les requêtes cross-origin avec configuration granulaire.

**Communication et Services :** Nodemailer 6.9.2 gère l'envoi d'emails avec templates HTML personnalisés et authentification SMTP. Axios 1.9.0 facilite les communications avec les services externes d'intelligence artificielle.

**Configuration et Utilitaires :** Dotenv 16.0.3 sécurise la gestion des variables d'environnement. Date-fns 2.30.0 harmonise la manipulation des dates côté serveur.

#### 3.4.3 Intelligence Artificielle - Services Hybrides

**Services IA Locaux :** Ollama permet l'exécution locale de modèles de langage spécialisés en médecine (Phi3:mini, Mistral:7b) garantissant la confidentialité des données patients. L'architecture de fallback intelligent assure une disponibilité maximale du service d'assistance.

**Services IA Externes :** OpenAI GPT-3.5-turbo fournit un service de fallback robuste pour l'analyse de symptômes complexes. Hugging Face BioGPT-Large offre une spécialisation médicale avancée. L'architecture multi-services optimise coûts et performance selon la disponibilité.

**Gestion et Orchestration :** Le gestionnaire AIManager centralise l'orchestration des services IA avec système de fallback intelligent. La persistance des interactions via les tables `diagnosis_suggestions` et `diagnosis_feedback` assure traçabilité et amélioration continue.

#### 3.4.4 Base de Données - Architecture Optimisée

**Système de Gestion :** MySQL 8.0 avec architecture normalisée (3NF) et contraintes d'intégrité référentielle strictes. Plus de 25 tables interconnectées gèrent l'ensemble des données médicales et utilisateurs.

**Optimisations Avancées :** Index composites optimisés pour les requêtes géographiques (latitude/longitude), recherches textuelles et jointures fréquentes. Index spatiaux pour les calculs de distance Haversine. Contraintes CHECK pour la validation des données médicales.

**Audit et Sécurité :** Triggers automatiques pour l'audit des modifications dans `historique_actions`. Procédures stockées pour les calculs complexes de disponibilités et conflits de rendez-vous. Chiffrement des données sensibles et gestion granulaire des droits d'accès.

### 3.5 Stratégies de Déploiement

#### 3.5.1 Architecture de Déploiement

**Approche Multi-Plateforme :** La plateforme médicale a été conçue pour supporter plusieurs stratégies de déploiement selon les besoins et contraintes des établissements de santé. L'architecture découplée frontend/backend facilite le déploiement sur différentes infrastructures cloud ou on-premise.

**Solution de Déploiement Retenue :** Railway a été choisi comme plateforme de déploiement pour sa simplicité d'intégration et son approche tout-en-un. Cette solution permet le déploiement automatisé du frontend React, du backend Node.js et de la base de données MySQL native depuis un repository GitHub unique, avec gestion automatique des variables d'environnement et monitoring intégré.

**Séparation des Services :** Bien que Railway propose une approche unifiée, l'architecture découplée permet également le déploiement sur des infrastructures alternatives. Le frontend React peut être déployé sur des CDN statiques (Vercel, Netlify) pour des performances optimales. Le backend Node.js s'adapte aux plateformes serverless (Vercel Functions) ou aux serveurs traditionnels. La base de données MySQL peut être hébergée sur des services managés ou des instances dédiées.


#### 3.5.2 Configuration de Production

**Variables d'Environnement :** Configuration sécurisée via variables d'environnement pour les credentials de base de données, clés JWT, configuration SMTP, et APIs externes. Séparation stricte entre environnements de développement, test et production.

**Optimisations Performance :** Compression gzip, mise en cache des ressources statiques, optimisation des requêtes SQL avec index appropriés, et configuration de pools de connexions pour la base de données.

**Sécurité Production :** Configuration HTTPS obligatoire, headers de sécurité CSP, limitation du taux de requêtes, monitoring des tentatives d'intrusion, et sauvegarde automatisée des données.

#### 3.5.3 Monitoring et Maintenance

**Surveillance Système :** Monitoring des performances applicatives, surveillance de la disponibilité des services, alertes automatiques en cas de dysfonctionnement, et métriques d'utilisation pour l'optimisation continue.

**Gestion des Mises à Jour :** Stratégie de déploiement continu avec tests automatisés, rollback automatique en cas d'erreur, et maintenance programmée avec notification utilisateurs.

**Sauvegarde et Récupération :** Sauvegarde automatique quotidienne de la base de données, réplication des données critiques, et procédures de récupération d'urgence documentées.

### 3.3 Validation et Testing

#### 3.3.1 Approche de Validation Pragmatique

La validation du système a été réalisée par une approche de testing pragmatique combinant debugging console et fichiers de test Node.js spécialisés. Cette méthodologie a permis une validation continue des fonctionnalités critiques tout au long du développement. Le debugging frontend via React DevTools et console.log a facilité le suivi des états des composants, des appels API et des interactions utilisateur. Le monitoring backend avec logging détaillé a permis de tracer les requêtes HTTP, opérations base de données et gestion des erreurs.

#### 3.3.2 Suite de Tests Backend Spécialisés

La validation du système backend s'appuie sur une suite de tests spécialisés développés pour valider les fonctionnalités critiques de la plateforme. Cette approche de testing modulaire comprend plusieurs catégories de tests adaptés aux différents aspects du système.

**Tests de Connectivité et Base de Données :** Le fichier `test-db.js` constitue le fondement de la validation de connectivité, vérifiant l'intégrité des connexions MySQL, l'exécution des requêtes complexes et le respect des contraintes référentielles. Ce module examine particulièrement les jointures multi-tables, les requêtes géospatiales et les performances des index optimisés, garantissant la robustesse de la couche de persistance.

**Tests d'API et Endpoints :** Le module `test-appointments-api.js` valide exhaustivement l'ensemble des endpoints de gestion des rendez-vous, couvrant les opérations de création, modification, annulation et recherche de créneaux disponibles. Cette suite examine spécifiquement les scénarios de gestion des conflits, les cas de double réservation et la logique complexe de disponibilités.

**Tests de Communication :** La validation du système de communication s'effectue via le fichier `test-email.js`, qui confirme le bon fonctionnement du système Nodemailer avec différents templates de notification. Ce module teste les mécanismes de vérification, les rappels automatiques et la gestion robuste des erreurs SMTP.

**Tests de Logique Métier :** Le fichier `test-slots.js` se concentre sur la validation de l'algorithme de génération des créneaux horaires, examinant la gestion des pauses déjeuner, les intervalles personnalisables et les mécanismes de prévention des conflits de planning.

**Tests d'Intelligence Artificielle :** Le module `test-phi3-mini.js` valide spécifiquement l'intégration des modèles d'IA locaux, testant les interactions avec Ollama et la gestion des fallbacks vers les services externes. Ce test assure la fiabilité de l'assistant médical IA.

**Tests de Performance :** Les modules `test-fast.js`, `test-optimized.js` et `test-quick.js` constituent une suite de tests de performance adaptés à différents scénarios. `test-fast.js` effectue des tests de performance rapides sur les fonctionnalités core, `test-optimized.js` exécute une suite de tests optimisés pour les performances système, et `test-quick.js` réalise des smoke tests pour la validation rapide des fonctionnalités de base.

#### 3.3.3 Tests de la Fonctionnalité de Récupération de Mot de Passe

La validation de la fonctionnalité de récupération de mot de passe a nécessité une approche de test complète couvrant les aspects sécuritaires, fonctionnels et d'expérience utilisateur. Cette validation s'est appuyée sur plusieurs méthodes complémentaires pour garantir la robustesse et la sécurité de cette fonctionnalité critique.

**Tests de Sécurité :** La validation sécuritaire a porté sur plusieurs aspects critiques. Les tests de génération de tokens ont vérifié l'unicité et la complexité cryptographique des tokens générés avec crypto.randomBytes(32). La validation de l'expiration automatique a confirmé que les tokens deviennent inutilisables après une heure. Les tests de non-divulgation ont vérifié que le système retourne systématiquement le même message, qu'un compte existe ou non, préservant ainsi la confidentialité des utilisateurs. La validation du hachage bcrypt a confirmé que les nouveaux mots de passe sont correctement sécurisés avec salt.

**Tests Fonctionnels Backend :** Le module `test-forgot-password.js` a été développé pour valider exhaustivement les endpoints de récupération. Ce test vérifie la génération correcte des tokens, l'envoi des emails de réinitialisation, la validation des tokens lors de la réinitialisation, et la gestion des cas d'erreur (token expiré, token invalide, compte inexistant). Les tests incluent également la vérification de la restriction aux comptes patients uniquement et la validation des critères de complexité des nouveaux mots de passe.

**Tests d'Interface Utilisateur :** La validation frontend a porté sur l'ergonomie et la fonctionnalité des composants React. Les tests du composant ForgotPasswordDialog ont vérifié la validation d'email en temps réel, la gestion des états de chargement, l'affichage des messages d'erreur et de confirmation, et la fermeture appropriée du dialogue. La page ResetPassword a été testée pour la validation de token, l'indicateur de force du mot de passe, la vérification de correspondance des mots de passe, et la redirection automatique après succès.

**Tests d'Intégration Email :** La validation du service email a confirmé le bon fonctionnement de Nodemailer avec les templates HTML professionnels. Les tests ont vérifié la réception des emails, la validité des liens de réinitialisation, l'affichage correct du template responsive, et la gestion des erreurs SMTP. La configuration SMTP a été testée avec différents fournisseurs pour assurer la compatibilité.

**Tests de Performance et Charge :** Des tests de charge ont été effectués pour valider la performance du système sous stress. Ces tests ont confirmé que le système peut gérer plusieurs demandes simultanées de réinitialisation sans dégradation de performance. La validation des timeouts et de la gestion des connexions concurrentes a assuré la stabilité du système en production.

**Tests de Cas Limites :** La validation a inclus des tests de cas limites comme les tentatives de réutilisation de tokens expirés, les demandes multiples pour le même compte, les tentatives d'accès direct à la page de réinitialisation sans token valide, et la gestion des caractères spéciaux dans les mots de passe. Ces tests ont confirmé la robustesse du système face aux utilisations atypiques.

#### 3.3.4 Monitoring et Debugging Avancé

Le système de logging intégré trace toutes les opérations critiques avec horodatage et niveau de sévérité. Les requêtes géospatiales sont monitorées pour optimiser les performances des calculs de distance Haversine. Le debugging des composants de cartographie a nécessité un suivi précis des coordonnées GPS et du clustering des marqueurs. L'audit des actions utilisateur via la table `historique_actions` permet un debugging post-mortem des problèmes de données. Les métriques de performance des requêtes SQL complexes ont guidé l'optimisation des index composites.

**Monitoring Spécialisé de la Récupération de Mot de Passe :** Un système de monitoring dédié trace toutes les opérations de récupération de mot de passe pour des raisons de sécurité et d'audit. Les logs incluent les tentatives de demande de réinitialisation (avec anonymisation des emails), les générations de tokens, les tentatives de validation de tokens, et les réinitialisations réussies. Ce monitoring permet de détecter les tentatives d'attaque par force brute et d'identifier les problèmes de livraison d'emails. Les métriques collectées incluent le taux de succès des réinitialisations, le temps moyen entre demande et réinitialisation, et les patterns d'utilisation de la fonctionnalité.

---

## CHAPITRE 4: INTÉGRATION DE L'INTELLIGENCE ARTIFICIELLE

### 4.1 Vision et Objectifs de l'IA Médicale

L'intégration de l'intelligence artificielle dans notre plateforme médicale répond à un besoin croissant d'assistance intelligente dans le processus de diagnostic préliminaire et d'amélioration de l'expérience patient. Cette approche innovante vise à démocratiser l'accès à une première évaluation médicale tout en maintenant les standards de sécurité et de responsabilité médicale. L'objectif principal consiste à développer un assistant virtuel capable d'analyser les symptômes rapportés par les patients et de fournir des suggestions diagnostiques préliminaires, tout en orientant systématiquement vers une consultation médicale professionnelle pour confirmation et traitement.

### 4.2 Architecture de l'Assistant IA Médical

#### 4.2.1 Conception Multi-Services

L'architecture de l'assistant IA repose sur un gestionnaire centralisé (AIManager) qui orchestre plusieurs services d'intelligence artificielle selon une approche de fallback intelligent. Le service principal utilise Ollama pour l'exécution locale de modèles de langage spécialisés en médecine, garantissant la confidentialité des données patients. En cas d'indisponibilité du service principal, le système bascule automatiquement vers des services externes comme OpenAI GPT-3.5-turbo ou Hugging Face BioGPT-Large. Cette architecture redondante assure une disponibilité maximale du service d'assistance IA tout en optimisant les coûts et la performance.
[Insert picture of AI architecture diagram showing AIManager, Ollama, OpenAI, and Hugging Face services integration]


#### 4.2.2 Système Hybride d'Analyse

L'analyse des symptômes combine trois approches complémentaires pour maximiser la précision et la fiabilité des suggestions. L'analyse basée sur des règles utilise une cartographie exhaustive de symptômes vers diagnostics potentiels, couvrant plus de vingt symptômes courants avec leurs équivalents en français, anglais et arabe dialectal marocain. L'analyse par intelligence artificielle exploite des modèles de langage pré-entraînés sur des corpus médicaux pour identifier des patterns complexes et des corrélations symptomatiques avancées. L'analyse contextuelle enrichit les suggestions en tenant compte des informations additionnelles fournies par le patient, de l'intensité des symptômes et des combinaisons symptomatiques multi-systémiques.

### 4.3 Fonctionnalités Avancées de l'Assistant IA

#### 4.3.1 Interface Conversationnelle Intelligente

[Insert picture of AI chatbot interface showing conversation flow and minimizable design]

L'assistant IA se présente sous la forme d'un chatbot conversationnel intégré de manière non-intrusive dans l'interface patient.

#### 4.3.2 Détection Automatique d'Urgences

Un module de détection d'urgences médicales analyse en temps réel les symptômes rapportés pour identifier les situations nécessitant une intervention médicale immédiate. Le système reconnaît automatiquement les symptômes critiques tels que les douleurs thoraciques, l'essoufflement sévère, les douleurs abdominales intenses, les pertes de conscience ou les saignements importants. Lorsqu'un symptôme d'urgence est détecté, l'assistant affiche immédiatement un avertissement prioritaire recommandant une consultation d'urgence ou un appel aux services d'urgence, tout en maintenant un ton rassurant mais ferme.

### 4.4 Implémentation Technique de l'IA

#### 4.4.1 Backend IA et Gestion des Modèles

Le backend IA s'articule autour du contrôleur `diagnosisAssistantController.js` qui gère l'ensemble des interactions avec les services d'intelligence artificielle. Ce contrôleur implémente plusieurs endpoints spécialisés : l'analyse basique de symptômes utilisant des règles prédéfinies, l'analyse avancée exploitant les modèles IA externes, le chat conversationnel avec l'assistant virtuel, et la gestion de l'historique des analyses. Le système de fallback intelligent teste séquentiellement les services disponibles, en commençant par Ollama local, puis OpenAI, et enfin Hugging Face, avant de revenir à l'analyse basée sur des règles si aucun service IA n'est disponible.

#### 4.4.2 Persistance et Traçabilité

Deux tables dédiées assurent la persistance des données liées à l'IA médicale. La table `diagnosis_suggestions` stocke l'ensemble des analyses effectuées, incluant les symptômes rapportés au format JSON, les suggestions générées avec leurs niveaux de confiance, et les informations contextuelles additionnelles. La table `diagnosis_feedback` collecte les évaluations des patients sur la qualité des suggestions, permettant un apprentissage continu et l'amélioration des algorithmes. Cette approche garantit la traçabilité complète des interactions IA tout en respectant les exigences de confidentialité médicale.

### 4.5 Sécurité et Conformité de l'IA Médicale

#### 4.5.1 Disclaimers et Responsabilité Médicale

Chaque interaction avec l'assistant IA est accompagnée de disclaimers clairs précisant le caractère préliminaire et non-diagnostique des suggestions fournies. Le système rappelle systématiquement que les suggestions de l'IA ne remplacent en aucun cas l'avis d'un professionnel de santé qualifié et que toute décision médicale doit être prise en consultation avec un médecin. Cette approche éthique et légale protège à la fois les patients et les développeurs tout en encourageant un usage responsable de la technologie d'assistance médicale.

#### 4.5.2 Protection des Données et Confidentialité

L'architecture IA respecte strictement les principes de protection des données personnelles de santé. Les données symptomatiques sont anonymisées avant transmission aux services IA externes, et aucune information personnelle identifiable n'est partagée avec des tiers. Le service Ollama local garantit que les données sensibles ne quittent jamais l'infrastructure contrôlée, tandis que les services externes ne reçoivent que des descriptions symptomatiques génériques. L'ensemble des interactions est chiffré et audité pour assurer la conformité avec les réglementations de protection des données de santé.

### 4.6 Performance et Optimisation de l'IA

#### 4.6.1 Métriques de Performance

Le système IA intègre des mécanismes de monitoring avancés pour évaluer la performance et la fiabilité des suggestions. Les métriques collectées incluent le temps de réponse des différents services IA, le taux de succès des analyses, la distribution des niveaux de confiance, et les scores de satisfaction des patients via le système de feedback. Ces données permettent d'optimiser continuellement les algorithmes et d'identifier les domaines nécessitant des améliorations.

#### 4.6.2 Évolutivité et Apprentissage Continu

L'architecture modulaire de l'IA facilite l'intégration de nouveaux modèles et services sans disruption du système existant. Le système de feedback patient alimente une boucle d'amélioration continue, permettant d'affiner les algorithmes de suggestion et d'adapter les réponses aux besoins spécifiques de la population utilisatrice. Cette approche évolutive garantit que l'assistant IA s'améliore constamment en fonction de l'usage réel et des retours utilisateurs.

---

## CHAPITRE 5: PLANIFICATION ET GESTION DE PROJET

### 5.1 Méthodologie de Développement

#### 5.1.1 Approche Agile Adaptée

La gestion de ce projet de fin d'année a adopté une méthodologie agile adaptée au contexte académique et aux contraintes d'un développement en binôme. L'approche retenue s'inspire des principes Scrum tout en intégrant des éléments de méthodologie Kanban pour optimiser la flexibilité et la réactivité face aux évolutions des besoins. Cette hybridation méthodologique nous a permis de maintenir un rythme de développement soutenu tout en conservant la capacité d'adaptation nécessaire à l'exploration de nouvelles technologies et fonctionnalités.

**Principes Agiles Appliqués :** Notre projet a mis en œuvre les valeurs fondamentales de l'Agile Manifesto, privilégiant les individus et interactions plutôt que les processus, les logiciels fonctionnels plutôt que la documentation exhaustive, la collaboration avec l'encadrant plutôt que la négociation contractuelle, et l'adaptation au changement plutôt que le suivi d'un plan rigide. Cette approche nous a facilité l'intégration de nouvelles fonctionnalités comme l'intelligence artificielle et l'architecture multi-institutionnelle en cours de développement.

**Pratiques Scrum Adaptées :** Notre implémentation de Scrum a été adaptée au contexte de binôme avec des sprints de deux semaines, un product backlog priorisé selon la valeur métier, des daily standups remplacés par un suivi quotidien en équipe, et des sprint reviews avec l'encadrant pédagogique. Les retrospectives de fin de sprint nous ont permis l'amélioration continue de nos méthodes de travail et l'optimisation de notre productivité collaborative.

#### 5.1.2 Organisation en Sprints Académiques

Le projet a été structuré en sprints de deux semaines, alignés sur le calendrier académique et les échéances pédagogiques. Chaque sprint débutait par une phase de planification incluant la définition des objectifs, l'estimation des tâches et l'identification des risques potentiels. Les points de contrôle hebdomadaires avec l'encadrant pédagogique servaient de réunions de suivi, permettant d'ajuster la trajectoire du projet en fonction des difficultés rencontrées et des opportunités identifiées. Cette approche itérative a facilité l'intégration progressive des fonctionnalités complexes tout en maintenant un niveau de qualité élevé.

**Structure des Sprints :** Chaque sprint suivait un cycle structuré comprenant : Sprint Planning (définition des user stories et estimation en story points), Sprint Execution (développement avec tests continus), Sprint Review (démonstration des fonctionnalités à l'encadrant), et Sprint Retrospective (analyse des améliorations possibles). Cette structure a permis de livrer des incréments fonctionnels réguliers et de maintenir un feedback constant sur la qualité du développement.

**Gestion du Product Backlog :** Le backlog produit était organisé selon les priorités métier avec des user stories détaillées pour chaque fonctionnalité. Les épics principales incluaient l'authentification multi-rôles, la gestion des rendez-vous, les dossiers médicaux, la géolocalisation, l'intelligence artificielle, et l'architecture multi-institutionnelle. Chaque user story était estimée selon sa complexité et sa valeur métier, permettant une planification optimale des sprints.

**Outils et Suivi :** Le suivi du projet utilisait des outils simples mais efficaces : tableau Kanban pour la visualisation des tâches, burndown charts pour le suivi de l'avancement, et documentation continue des décisions techniques. Cette approche légère a permis de se concentrer sur le développement tout en maintenant une traçabilité complète du processus.

### 5.2 Planification Temporelle Détaillée

#### 5.2.1 Diagramme de Gantt du Projet

La planification du projet s'étend sur une période de 14 semaines, de fin février à fin mai 2024, structurée selon une approche progressive permettant d'assurer la qualité et la complétude de la solution développée.

[Insert picture of detailed Gantt chart showing 14-week project timeline with all phases and milestones]

```
DIAGRAMME DE GANTT - PLATEFORME MÉDICALE INTELLIGENTE
Période: Fin Février - Fin Mai 2024 (14 semaines)

Semaines    │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10│11│12│13│14│
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
PHASE 1: ANALYSE ET CONCEPTION                                      │
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
Étude besoins│███│   │   │   │   │   │   │   │   │   │   │   │   │   │
Analyse exist│███│███│   │   │   │   │   │   │   │   │   │   │   │   │
Conception DB│   │███│███│   │   │   │   │   │   │   │   │   │   │   │
Architecture │   │   │███│███│   │   │   │   │   │   │   │   │   │   │
Maquettage UI│   │   │   │███│   │   │   │   │   │   │   │   │   │   │
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
PHASE 2: DÉVELOPPEMENT CORE                                         │
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
Setup Projet │   │   │   │███│   │   │   │   │   │   │   │   │   │   │
Base de Donn.│   │   │   │███│███│   │   │   │   │   │   │   │   │   │
Auth & Sécur.│   │   │   │   │███│███│   │   │   │   │   │   │   │   │
API Backend  │   │   │   │   │   │███│███│███│   │   │   │   │   │   │
Interface UI │   │   │   │   │   │   │███│███│███│   │   │   │   │   │
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
PHASE 3: FONCTIONNALITÉS AVANCÉES                                  │
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
Géolocalisa. │   │   │   │   │   │   │   │███│███│   │   │   │   │   │
Gestion RDV  │   │   │   │   │   │   │   │   │███│███│   │   │   │   │
Dossiers Méd.│   │   │   │   │   │   │   │   │   │███│███│   │   │   │
Notifications│   │   │   │   │   │   │   │   │   │   │███│   │   │   │
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
PHASE 4: INTELLIGENCE ARTIFICIELLE                                 │
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
Recherche IA │   │   │   │   │   │   │   │   │   │   │███│   │   │   │
Conception IA│   │   │   │   │   │   │   │   │   │   │███│███│   │   │
Implémen. IA │   │   │   │   │   │   │   │   │   │   │   │███│███│   │
Tests IA     │   │   │   │   │   │   │   │   │   │   │   │   │███│   │
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
PHASE 5: FINALISATION                                              │
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
Tests Intégr.│   │   │   │   │   │   │   │   │   │   │   │   │███│███│
Optimisation │   │   │   │   │   │   │   │   │   │   │   │   │   │███│
Documentation│   │   │   │   │   │   │   │   │   │   │   │   │   │███│
Présentation │   │   │   │   │   │   │   │   │   │   │   │   │   │███│
────────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤

JALONS MAJEURS:
 S4  : Architecture validée
 S6  : Authentification opérationnelle  
 S8  : API Backend complète
 S10 : Interface utilisateur fonctionnelle
 S12 : Géolocalisation et RDV opérationnels
 S13 : IA médicale intégrée
 S14 : Projet finalisé et documenté
Les scripts utilitaires incluent la génération de données de test, la création automatique de comptes médecins, l'ajout d'échantillons de médicaments et l'intégration de types d'analyses médicales complets. Le système de migrations comprend des scripts de mise à jour de base de données et un gestionnaire automatisé de migrations pour assurer l'évolutivité de la structure de données.

--- 