
Ecole Supérieure de Management ,
Télecommunication et Informatique
SupMTI OUJDA

Rapport de Projet de Fin d’Année
 
Présenté en vue de la validation de
Niveau : BAC+4
Option : Ingénierie des systèmes informatiques
 
 
 
 
Sujet : 
Conception et réalisation d’une plateforme médicale web de gestion des rendez-vous et dossiers patients avec intégration d'intelligence artificielle « BluePulse »
 


  
Présenté par :	Encadré par :
Aya Berroukech
Hamza BENMESSAOUD
	Pr. Ilhame El Farissi
Année universitaire : 2024 – 2025
		
Dédicaces

À nos parents, pour leur soutien indéfectible et leurs encouragements tout au long de notre parcours académique. Leur confiance et leurs sacrifices ont rendu possible la réalisation de ce projet.
À nos familles, pour leur présence constante, leurs conseils précieux et leur foi inébranlable en nos capacités.
À nos enseignants, et particulièrement à Pr. Ilhame El Farissi, qui ont su transmettre leur savoir et éveiller notre passion pour l’informatique et les technologies.
À nos amis, pour leur solidarité, leur soutien moral et les moments de partage qui ont enrichi cette expérience universitaire.
À ceux qui ont pris le temps de nous donner leurs retours et suggestions, contribuant ainsi à l’amélioration de ce travail
À tous les professionnels de santé qui œuvrent quotidiennement pour le bien-être des patients et qui ont inspiré ce projet de digitalisation des soins médicaux.
 
Remerciements

Il est important pour nous de témoigner notre reconnaissance à tous ceux dont l’appui et la contribution ont favorisé l’aboutissement de ce projet de plateforme médicale BluePulse.
Louange à Allah, le Tout-Puissant, pour nous avoir accordé la force, la patience et la persévérance nécessaires pour mener à bien ce projet de digitalisation des soins de santé.
Nous tenons à exprimer notre profonde gratitude à notre encadrante, Pr. Ilhame El Farissi, pour son accompagnement bienveillant, ses conseils avisés et son expertise technique qui ont été déterminants dans la réalisation de cette plateforme médicale innovante.
Nos remerciements sincères vont également aux professionnels de santé qui ont contribué à enrichir notre compréhension des enjeux médicaux et ont guidé la conception fonctionnelle de BluePulse, notamment pour l’intégration de l’intelligence artificielle dans l’aide au diagnostic.
Nous remercions chaleureusement le corps professoral et administratif d’École Supérieure de Management, Télécommunications et d’Informatique SupMTI, pour leur encadrement et leur soutien durant notre parcours, ainsi que pour les connaissances techniques en développement full-stack qui ont rendu possible la création de cette solution complète.
Enfin, nous témoignons notre respect et notre reconnaissance aux membres du jury pour l’attention portée à notre travail et l’évaluation de cette contribution à la digitalisation du secteur de la santé.

 
Résumé

Ce projet porte sur le développement d'une plateforme web médicale "BluePulse" visant à moderniser la gestion des soins de santé en intégrant des technologies d'intelligence artificielle avancées.
L'application propose un système complet de prise de rendez-vous permettant aux patients de réserver facilement leurs consultations tout en optimisant la gestion des plannings médicaux. Elle centralise les dossiers patients de manière sécurisée, facilitant l'accès aux informations médicales pour tous les professionnels de santé autorisés.
Un assistant IA intégré offre une aide au diagnostic préliminaire en analysant les symptômes décrits par les patients, avec détection automatique des spécialités médicales recommandées. Le système de notifications automatisées améliore la communication entre tous les acteurs de santé.
Par ailleurs, la plateforme supporte une architecture multi-institutionnelle permettant aux cabinets privés, hôpitaux, pharmacies et laboratoires d'accéder aux dossiers médicaux selon leurs rôles spécifiques. Un système de thématisation dynamique adapte l'interface utilisateur selon le type d'établissement.
L'outil offre aux médecins des fonctionnalités avancées pour gérer leurs patients, créer des dossiers complets, prescrire des traitements et suivre l'évolution des pathologies.
L'objectif principal est de digitaliser, optimiser et sécuriser les processus de soins de santé à travers une plateforme intuitive, performante et adaptée aux besoins des professionnels de santé et des patients.







Mots-clés : Plateforme médicale, Digitalisation sanitaire, Système multi-rôles, Dossiers médicaux électroniques, Assistant chatbot IA, Gestion hospitalière, Dispensation pharmaceutique, Résultats laboratoire, Recherche géolocalisée, Thématisation dynamique 

Abstract

This project focuses on the development of a medical web platform "BluePulse" aimed at modernizing healthcare management by integrating advanced artificial intelligence technologies.
The application provides a comprehensive appointment booking system allowing patients to easily schedule their consultations while optimizing medical scheduling management. It centralizes patient records securely, facilitating access to medical information for all authorized healthcare professionals.
An integrated AI assistant offers preliminary diagnostic support by analyzing patient-described symptoms, with automatic detection of recommended medical specialties. The automated notification system improves communication between all healthcare stakeholders.
Furthermore, the platform supports a multi-institutional architecture enabling private practices, hospitals, pharmacies, and laboratories to access patient medical records according to their specific roles. A dynamic theming system adapts the user interface based on the institution type.
The tool provides physicians with advanced functionalities to manage their patients, create comprehensive medical records, prescribe treatments, and monitor pathology progression.
The main objective is to digitalize, optimize, and secure healthcare processes through an intuitive, high-performance platform adapted to the needs of healthcare professionals and patients..








Keywords: Medical platform, Healthcare digitalization, Multi-role system, Electronic medical records, AI chatbot assistant, Hospital management, Pharmaceutical dispensing, Laboratory results, Geolocated search, Dynamic theming 

Liste des abréviations
Abréviation	Signification
PFA	Projet de Fin d’Année
API	Application Programming Interface
UI	User Interface
UX	User Experience
CRUD	Create, Read, Update, Delete
JWT	JSON Web Token
IA	Intelligence Artificielle
UML	Unified Modeling Language
MCD	Modèle Conceptuel de Données
REST	Representational State Transfer
HTML	HyperText Transfer Protocol
SQL	Structured Query Language
MySQL	My Structured Query Language
JSON	JavaScript Object Notation
CSS	Cascading Style Sheets
HTML	HyperText Markup Language
SSL	Secure Sockets Layer
TLS	Transport Layer Security
URL	Uniform Resource Locator
DOM	Document Object Model
SPA	Single Page Application
CORS	Cross-Origin Resource Sharing
CIN	Carte d’Identité Nationale
 
|
Liste des figures
Figure 1: Diagramme de Gantt	26
Figure 2: Diagramme de cas d'utilisation pour les patients et les utilisateurs non authentifié	32
Figure 3: Diagramme de cas d'utilisation des médecins	33
Figure 4: Diagramme de cas d'utilisation des pharmaciens	33
Figure 5: Diagramme de cas d'utilisation de laboratins	34
Figure 6: Diagramme de cas d'utilisation d'hospitaliers	34
Figure 7: Diagramme de cas d'utilisation des admins	35
Figure 8: Diagramme de Séquence d’authentification	36
Figure 9: Diagramme de Séquence de prise de rendez-vous	36
Figure 10: Diagramme de  Séquence de consultation et mise à jour du dossier patient	37
Figure 11: Diagramme de Séquence de recherche de médecins	37
Figure 12: Modèle Conceptuel de Données	38
Figure 13: Environnement de développement intégré Visual Studio Code	41
Figure 14: git	42
Figure 15: GitHub	42
Figure 16: Postman	42
Figure 17: MySQL Workbench	42
Figure 18: Node.js	43
Figure 19: Express.js	43
Figure 20: React	44
Figure 21: Material UI	44
Figure 22: Google Colab	44
Figure 23: Ollama	44
Figure 24: SQLite	44
Figure 25: ngrok	44
Figure 26: Architecture en trois tiers de la plateforme BluePulse	45
Figure 27: Organisation des modules backend Node.js/Express.js	47
Figure 28: Nodemailer	52
Figure 29: JWT	52
Figure 30: Interface d'authentification	55
Figure 31: Email de confirmation pour les patients nouvellement inscrits	55
Figure 32: Interface Tableau de Bord Médecin	56
Figure 33: Interface de Recherche de Patients	56
Figure 34: Dossier Médical Patient Complet	57
Figure 35: Interface de Prise de Rendez-vous	58
Figure 36: Interface Assistant IA Médical	59
Figure 37: Interface d'administration système	60
Figure 38: Railway	63
Figure 39: Vercel	63
Figure 40: Workflow de Déploiement	65


 
	Table des matières	

Dédicaces	2
À tous les professionnels de santé qui œuvrent quotidiennement pour le bien-être des patients et qui ont inspiré ce projet de digitalisation des soins médicaux.	2
Remerciements	3
Résumé	4
Abstract	5
Liste des abréviations	6
Liste des figures	7
Table des matières	9
Chapitre 1:  Présentation du projet « BluePulse »	15
Introduction	16
1) Aperçu Général	16
2) Fonctionnalités Principales	16
2.1) Gestion des Utilisateurs et Authentification	16
2.2) Gestion des Rendez-vous	17
2.3) Dossiers Médicaux Numériques	18
2.4) Recherche et Filtrage	19
2.5) Architecture Multi-Institutionnelle	19
2.6) Système de Thématisation Dynamique	20
2.7) Assistant Chatbot Intelligent	20
2.8) Tableaux de Bord et Statistiques	21
3) Utilisateurs Cibles	22
3.1) Patients	22
3.2) Professionnels de Santé	22
3.3) Établissements de Santé Diversifiés	22
4) Valeur Ajoutée du Projet	23
4.1) Pour les Patients	23
4.2) Pour les Médecins	23
4.3) Pour les Établissements	23
4.4) Pour l’Écosystème Multi-Institutionnel	24
5) Planification et Gestion de Projet	24
5.1) Composition de l’Équipe	24
5.2) Planification Temporelle Détaillée (Diagramme de Gantt)	24
5.3) Méthodologie de Développement	26
6) Contraintes et Défis	27
6.1) Contraintes Techniques	27
6.2) Contraintes Fonctionnelles	28
Conclusion	28
Chapitre 2:  Etude fonctionnelleIntroduction	29
1) Analyse des Besoins	30
1.1) Besoins Fonctionnels	30
1.2) Besoins Non Fonctionnels	31
2) Diagrammes d’Analyse	31
2.1) Diagramme de Cas d’Utilisation	31
2.2) Diagrammes de Séquence	35
2.3) Modèle Conceptuel de Données (MCD)	37
Conclusion	39
Chapitre 3: Etude technique et réalisation	40
Introduction	41
1) Outils et Environnement de Travail Technique	41
1.1) Environnement de Développement	41
1.2 Outils de Gestion de Version et Collaboration	41
1.3) Outils de Test, Débogage et Qualité du Code	42
2) Choix de Technologies	42
2.1 Technologies Backend	42
2.2) Technologies Frontend	43
2.3) Base de Données	44
2.4) Intelligence Artificielle	44
3) Architecture Générale du Système	45
3.1) Architecture en Trois Tiers	45
3.2) Organisation du Backend	46
3.3) Organisation du Frontend	48
3.3) Communication entre Client et Serveur	48
3.5) Structure de l’API REST	48
4) Système de Thématisation Dynamique et Fonctionnalités Avancées	50
1) Système de Thématisation Multi-Institutionnelle	50
4.2) Assistant Intelligence Artificielle Intégré	51
5) Implémentation des Modules Principaux	51
5.1) Module d’Authentification et Autorisation Multi-Rôles	51
5.2) Module de Gestion des Dossiers Médicaux Complets	52
5.3) Architecture Multi-Institutionnelle	54
6) Interfaces Réalisées	55
6.1) Interface d’Authentification Multi-Rôles	55
6.2) Tableau de Bord Médecin	55
6.3) Interface de Recherche de Patients	56
6.4) Dossier Médical Patient Complet	57
6.5) Interface de Prise de Rendez-vous	57
6.6) Assistant IA Médical Intégré	58
6.7) Interface d’Administration Système	59
7) Sécurité et Protection des données	60
7.1) Mesures de Sécurité Implémentées	60
7.2) Protection des Données Médicales	61
8) Tests, Validation et Déploiement	62
1) Stratégie de Tests Multi-Niveaux	62
8.2) Validation Fonctionnelle	62
8.3) Stratégies de Déploiement	63
Conclusion	66
Conclusion générale	67
WEBOGRAPHIE	69

 
Introduction générale
La transformation numérique du secteur de la santé constitue un enjeu stratégique majeur pour l'amélioration de la qualité des soins au Maroc. Face à une demande croissante de services médicaux et des contraintes budgétaires importantes, la digitalisation des processus de gestion devient une nécessité impérieuse. Cette évolution s'inscrit dans une dynamique mondiale de modernisation des systèmes de santé, où l'innovation technologique représente un levier essentiel pour répondre aux défis démographiques, épidémiologiques et économiques contemporains. Le secteur médical marocain, confronté à des enjeux de performance opérationnelle et d'efficience économique, nécessite une approche globale de modernisation technologique intégrant les spécificités culturelles et linguistiques nationales. Les établissements de santé publics et privés, depuis les centres hospitaliers universitaires jusqu'aux cabinets de médecine générale ruraux, doivent impérativement s'approprier des outils numériques adaptés à leurs contraintes budgétaires et organisationnelles. Cette révolution digitale sanitaire s'accompagne d'une transformation profonde des métiers médicaux, imposant aux professionnels de santé l'acquisition de compétences technologiques nouvelles tout en préservant l'excellence clinique traditionnelle.
Le contexte sanitaire marocain se caractérise par une dualité entre les ambitions de modernisation et la réalité opérationnelle des établissements qui peinent à adopter les outils numériques adaptés. Cette situation génère des inefficiences dans la coordination des soins, la gestion des ressources médicales, et l'optimisation des parcours patients, accentuées par l'émergence de nouvelles pathologies et la complexification des protocoles thérapeutiques. Les disparités territoriales importantes entre les régions urbaines équipées technologiquement et les zones rurales sous-médicalisées créent une fracture numérique sanitaire préoccupante, limitant l'accès équitable aux soins pour l'ensemble de la population marocaine. Cette hétérogénéité géographique s'accompagne d'une diversité des niveaux de formation technologique des professionnels de santé, nécessitant des solutions intuitives et facilement appropriables. Les contraintes linguistiques spécifiques au Maroc, avec la coexistence du français, de l'arabe et de la darija dans les pratiques médicales quotidiennes, compliquent l'adoption de solutions technologiques standardisées d'origine internationale.
La problématique centrale s'articule autour de la conception d'une plateforme médicale intelligente optimisant la gestion des rendez-vous et des dossiers patients, intégrant l'intelligence artificielle pour l'aide au diagnostic préliminaire, adaptée au contexte marocain. Cette problématique s'enrichit d'une dimension d'interopérabilité multi-institutionnelle, permettant une coordination efficace entre les différents acteurs de l'écosystème sanitaire : cabinets médicaux, hôpitaux, pharmacies, laboratoires d'analyses, et centres de radiologie. L'ampleur de cette problématique nécessite une approche systémique considérant simultanément les enjeux techniques, économiques, réglementaires et socioculturels du système de santé marocain. L'intégration harmonieuse de technologies d'intelligence artificielle avancées dans un environnement médical traditionnel représente un défi méthodologique majeur, exigeant une attention particulière aux questions de sécurité, de confidentialité et de responsabilité médicale. Cette dimension technologique innovante doit s'accompagner d'une réflexion approfondie sur les implications éthiques et déontologiques de l'assistance artificielle dans les décisions de santé.

L'analyse approfondie révèle plusieurs dysfonctionnements structurels : persistance de méthodes manuelles archaïques (fichiers Excel, registres papier) générant des risques d'erreurs humaines et d'inefficacité administrative, accès fragmenté aux données médicales entravant la continuité des soins et la coordination interprofessionnelle, et absence d'outils d'aide à la décision limitant l'efficacité diagnostique et la qualité des prescriptions. Ces dysfonctionnements se manifestent par des délais d'attente prolongés, des redondances d'examens, et une sous-optimisation des plannings médicaux. La multiplication des systèmes d'information isolés et incompatibles entre eux génère des silos informationnels préjudiciables à la vision globale du parcours patient. Cette fragmentation informationnelle s'accompagne d'une perte d'efficience économique considérable, avec des redondances d'examens coûteux et des retards diagnostiques impactant négativement les résultats thérapeutiques. Les médecins, confrontés à des interfaces multiples et des procédures administratives chronophages, voient leur temps clinique réduit au détriment de la relation thérapeutique fondamentale avec leurs patients.









Chapitre 1: 
Présentation du projet « BluePulse »
 
Introduction
Ce premier chapitre présente de manière détaillée notre projet de plateforme médicale BluePulse, en exposant ses fonctionnalités principales, ses utilisateurs cibles et la valeur ajoutée qu’elle apporte au secteur de la santé. Il établit également le cadre méthodologique et organisationnel qui a guidé notre développement.
1) Aperçu Général
La plateforme médicale développée est une application web full-stack moderne construite avec React.js et Node.js, destinée à révolutionner la gestion des établissements de santé. Elle s’adresse à huit types d’utilisateurs distincts : patients, médecins, administrateurs, super administrateurs, institutions médicales, pharmacies, hôpitaux et laboratoires.
Cette solution intégrée utilise une architecture en trois tiers avec une base de données MySQL robuste comprenant plus de 25 tables interconnectées. L’architecture multi-institutionnelle permet à chaque type d’établissement d’accéder aux dossiers médicaux selon ses besoins spécifiques, avec un système de recherche unifié et des permissions granulaires.
Le système de thématisation dynamique adapte automatiquement l’interface utilisateur selon le rôle de l’utilisateur, offrant une expérience personnalisée tout en maintenant la cohérence fonctionnelle.
2) Fonctionnalités Principales
2.1) Gestion des Utilisateurs et Authentification
Système Multi-Rôles Avancé : Le système implémente une gestion différenciée selon huit types d’utilisateurs distincts définis dans l’énumération de la base de données : ‘super_admin’, ‘admin’, ‘medecin’, ‘patient’, ‘institution’, ‘pharmacy’, ‘hospital’, ‘laboratory’. Les Super Administrateurs bénéficient d’une gestion globale du système avec création d’administrateurs délégués. Les Administrateurs gèrent les médecins et institutions dans leur périmètre. Les Médecins disposent d’un accès complet aux dossiers patients avec possibilité de créer des profils patients directes (walk-in) et de modifier toutes leurs informations médicales. Les Patients peuvent prendre des rendez-vous, consulter leurs dossiers et gérer leurs favoris médecins. Les Hôpitaux peuvent assigner des patients à un ou plusieurs médecins travaillant dans l’établissement, suivre les séjours, procédures et chirurgies. Les Pharmacies accèdent aux prescriptions médicales, gèrent la dispensation des médicaments et maintiennent un historique inter-pharmacies. Les Laboratoires visualisent les demandes d’analyses et d’imagerie, téléchargent les résultats et permettent aux médecins de consulter les rapports avec identification du laboratoire source.
Sécurité Renforcée : La sécurité du système repose sur une architecture multi-couches robuste. L’authentification par JWT (JSON Web Tokens) avec middleware Express personnalisé garantit la sécurité des sessions et la gestion granulaire des droits d’accès. Le hashage des mots de passe utilise bcrypt avec salt pour une protection maximale contre les attaques par dictionnaire. La vérification par email utilise Nodemailer avec tokens temporaires stockés en base. Le système de récupération de mot de passe implémente une fonctionnalité sécurisée avec tokens à durée de vie limitée (1 heure) et interface utilisateur intégrée, assurant la traçabilité complète des actions tout en respectant les principes de sécurité et de protection des données personnelles.
2.2) Gestion des Rendez-vous
Pour les Patients : Les patients bénéficient d’un système de réservation intelligent avec recherche multi-critères.
La recherche de médecins combine spécialité (table specialites), disponibilités en temps réel et tarifs de consultation. Le système de favoris (table favoris_medecins) permet un accès rapide aux médecins habituels. L’historique complet des rendez-vous avec statuts détaillés (‘confirmé’, ‘annulé’, ‘reporté’, ‘terminé’, ‘no_show’) offre une traçabilité complète. Les notifications automatiques (table notifications) informent des confirmations, rappels et modifications via email et interface web.
Pour les Médecins : Les médecins disposent d’un système de gestion avancé avec planification flexible.
La table disponibilites_medecin permet la définition de créneaux récurrents par jour de semaine avec gestion des pauses déjeuner et intervalles personnalisables (15, 30, 60 minutes). Le système d’indisponibilités exceptionnelles (table indisponibilites_exceptionnelles) gère les congés et absences. La fonctionnalité walk-in permet l’enregistrement immédiat de nouveaux patients avec création automatique de profil complet. Le tableau de bord médecin affiche les rendez-vous du jour, patients en attente et statistiques d’activité en temps réel.
2.3) Dossiers Médicaux Numériques
Gestion Complète et Modifiable : Le système propose une gestion exhaustive des données médicales avec modification complète par les médecins.
La table patients centralise toutes les informations personnelles, médicales et sociales (profession, groupe sanguin, habitudes de vie) entièrement modifiables par les médecins. Les antécédents médicaux (table antecedents_medicaux) sont catégorisés par type (‘médical’, ‘chirurgical’, ‘familial’, ‘gynécologique’, ‘psychiatrique’) avec dates et descriptions détaillées. Les allergies (tables allergies et patient_allergies) incluent niveau de sévérité, symptômes et date de découverte. Les traitements (table traitements) documentent posologie, durée, indications et effets secondaires avec suivi de l’observance.
Analyses et Imagerie Médicales : Le système intègre un module complet d’analyses avec plus de 200 types d’examens organisés en catégories (Hématologie, Biochimie, Immunologie, Microbiologie, etc.). La table resultats_analyses stocke les résultats avec valeurs de référence, unités et interprétations. Le module d’imagerie (table resultats_imagerie) gère les examens radiologiques avec stockage des images et comptes-rendus. Les constantes vitales (table constantes_vitales) permettent un suivi longitudinal avec graphiques d’évolution.
Consultations et Suivi : Le module de consultations (table consultations) offre une traçabilité complète avec motifs, examens cliniques, diagnostics CIM-10, prescriptions et recommandations. Les notes patient (table notes_patient) permettent aux médecins d’ajouter des observations privées. Le système de rappels de suivi (table rappels_suivi) automatise les relances pour examens de contrôle. L’historique des actions (table historique_actions) trace toutes les modifications pour audit et responsabilité médicale.
2.4) Recherche et Filtrage
Recherche Avancée : Le système propose une recherche multi-critères pour localiser facilement les médecins selon les besoins des patients. Les filtres combinés permettent la recherche par spécialité, disponibilité immédiate, tarifs et acceptation de nouveaux patients. Le système de recherche textuelle avec auto-complétion facilite la localisation des médecins par nom ou spécialité. Les résultats sont triés par pertinence avec pagination optimisée et sauvegarde des préférences utilisateur.
2.5) Architecture Multi-Institutionnelle
Gestion Hospitalière Avancée : Le système hospitalier permet l’assignation de patients à un ou plusieurs médecins travaillant dans l’établissement, avec suivi complet des séjours hospitaliers. Les hôpitaux disposent d’un système de recherche de patients utilisant les mêmes mécanismes que les médecins, avec recherche exacte par prénom, nom et CIN. La gestion des admissions et sorties est intégrée avec suivi des durées de séjour, procédures effectuées et chirurgies réalisées. Le système de gestion des lits permet l’optimisation de l’occupation et la planification des admissions. Les hôpitaux peuvent également ajouter des patients walk-in en réutilisant les fonctionnalités existantes, évitant ainsi la duplication de code et maintenant la cohérence du système.
Système Pharmaceutique Intégré : Les pharmacies bénéficient d’un accès privilégié aux prescriptions médicales avec visualisation des dates de prescription et gestion de la dispensation des médicaments. Le système permet de marquer les médicaments dispensés et maintient un historique inter-pharmacies visible par tous les établissements pharmaceutiques participants. Cette approche collaborative améliore la sécurité pharmaceutique en évitant les interactions médicamenteuses et les surdosages. Les médecins peuvent consulter cet historique pour optimiser leurs prescriptions et assurer un suivi thérapeutique optimal. La recherche de patients utilise le même mécanisme unifié avec recherche exacte par prénom, nom et CIN, garantissant la cohérence et la sécurité des données.
Laboratoires et Imagerie Médicale : Les laboratoires accèdent aux demandes d’analyses et d’imagerie prescrites par les médecins, avec possibilité de télécharger les résultats après identification du patient. Le système de recherche unifié permet aux laboratoires de localiser rapidement les patients par recherche exacte des critères d’identification. Une fois les résultats téléchargés, les médecins et hôpitaux peuvent consulter ces données avec identification claire du laboratoire source, facilitant la traçabilité et la communication inter-établissements. Cette intégration améliore significativement la continuité des soins et réduit les délais de prise en charge diagnostique.
Système de Recherche Unifié : L’architecture multi-institutionnelle s’appuie sur un système de recherche de patients unifié et sécurisé, utilisé par tous les types d’établissements. Cette approche garantit la cohérence des données, évite la duplication de code et assure la traçabilité complète de tous les accès aux données patients. Le système de recherche exacte par prénom, nom et CIN protège la confidentialité des patients tout en permettant une identification précise et fiable.
2.6) Système de Thématisation Dynamique
Adaptation Visuelle par Rôle : La plateforme intègre un système de thématisation dynamique qui adapte automatiquement l’interface selon le rôle utilisateur. Chaque type d’établissement dispose de sa palette de couleurs professionnelle (vert médical, rouge hospitalier, violet pharmaceutique, orange laboratoire, bleu administratif). Cette personnalisation améliore l’expérience utilisateur tout en maintenant l’identité professionnelle.
Architecture Technique : Le système utilise Material-UI et variables CSS pour des transitions fluides entre thèmes. Un gestionnaire centralisé détecte le rôle connecté et applique le thème correspondant en temps réel, garantissant une cohérence visuelle complète.
2.7) Assistant Chatbot Intelligent
Architecture Cloud Complète : La plateforme intègre un assistant chatbot médical intelligent déployé sur Google Colab utilisant le modèle Ollama Phi3:mini (3.8B paramètres). L’architecture s’appuie sur une stack technique complète comprenant FastAPI pour l’exposition de l’API, ngrok pour l’accessibilité publique, et une intégration transparente avec le backend Node.js via des services dédiés (colabService.js, aiManager.js).
Infrastructure Technique Avancée : Le système implémente une architecture de services robuste avec monitoring automatique (colab_monitor.js), gestion des timeouts intelligente, et système de retry avec backoff progressif. L’intégration utilise axios avec configuration personnalisée pour gérer les headers ngrok et optimiser les performances. La base de données SQLite intégrée dans Colab assure la persistance des conversations avec indexation optimisée pour les requêtes fréquentes.
Fonctionnalités Médicales Intelligentes : L’assistant analyse les symptômes, intégrant une détection automatique de 13 spécialités médicales (neurologue, cardiologue, gastro-entérologue, dermatologue, gynécologue, urologue, pneumologue, rhumatologue, endocrinologue, psychiatre, ORL, ophtalmologue, médecin généraliste) basée sur l’analyse sémantique des mots-clés. Le système applique des filtres de sécurité automatiques, ajoute des disclaimers médicaux obligatoires, et formate en gras les informations critiques.
Gestion Avancée des Conversations : Le chatbot maintient un historique contextuel persistant avec limitation intelligente (20 messages récents) pour optimiser les performances. L’interface utilisateur responsive et minimisable offre une expérience conversationnelle fluide avec support du streaming et gestion des erreurs gracieuse. Le système de monitoring intégré trace les métriques de performance (temps de réponse, taux de succès, timeouts) pour assurer la qualité de service.
2.8) Tableaux de Bord et Statistiques
Statistiques Médecin : Le tableau de bord médecin présente des métriques d’activité en temps réel avec visualisations graphiques.
Les indicateurs incluent le nombre de consultations par période, la répartition des patients par âge et pathologie, les taux de présence aux rendez-vous, et l’évolution de l’activité mensuelle. Les graphiques Chart.js affichent les tendances de consultation, la distribution des créneaux horaires les plus demandés, et les statistiques de patients directes (walk-in). Le système génère automatiquement des rapports d’activité exportables en PDF pour les besoins administratifs et comptables.
Statistiques Administrateur : L’interface administrative centralise les métriques globales de la plateforme avec tableaux de bord analytiques. Les indicateurs clés incluent le nombre total d’utilisateurs actifs par type, les statistiques d’utilisation des fonctionnalités, les métriques de performance système, et les rapports d’activité des établissements. Les graphiques d’évolution temporelle permettent le suivi des tendances d’adoption et l’identification des pics d’activité pour l’optimisation des ressources.
3) Utilisateurs Cibles
3.1) Patients
La plateforme s’adresse aux particuliers avec inscription autonome ou création de profil par médecin. Les patients bénéficient d’un tableau de bord personnalisé avec historique complet, favoris médecins et notifications automatiques. Le système gère les profils familiaux avec contacts d’urgence et médecins traitants. Les patients chroniques disposent d’un suivi longitudinal avec rappels automatiques et graphiques d’évolution des constantes vitales.
3.2) Professionnels de Santé
Les médecins généralistes et spécialistes (plus de 50 spécialités référencées) constituent le cœur de la plateforme. Chaque médecin dispose d’un tableau de bord avec gestion des disponibilités, patients directes, consultations et statistiques d’activité. Le système permet la création et modification complète des dossiers patients avec accès aux antécédents, allergies, traitements et résultats d’analyses. Les médecins peuvent gérer plusieurs institutions avec plannings différenciés.
3.3) Établissements de Santé Diversifiés
Le système supporte huit types d’établissements : institutions médicales, pharmacies, hôpitaux, laboratoires, cliniques, cabinets privés, centres médicaux. Chaque établissement dispose d’horaires d’ouverture configurables et de gestion multi-médecins. Les institutions peuvent avoir un médecin propriétaire et gérer leurs affiliations avec les médecins. Le système de statuts (‘pending’, ‘approved’, ‘rejected’) permet une validation administrative des nouveaux établissements.
Les hôpitaux bénéficient de fonctionnalités spécialisées pour la gestion des admissions, assignations de patients aux médecins, suivi des séjours et gestion des lits. Les pharmacies disposent d’un accès privilégié aux prescriptions avec gestion de la dispensation et historique inter-pharmacies. Les laboratoires peuvent consulter les demandes d’analyses, télécharger les résultats et assurer la traçabilité des examens. Tous les établissements utilisent le même système de recherche unifié garantissant la cohérence et la sécurité des données patients.
4) Valeur Ajoutée du Projet
4.1) Pour les Patients
La valeur ajoutée pour les patients se manifeste à travers plusieurs dimensions d’amélioration de leur expérience de soins. La simplicité d’utilisation, garantie par une interface intuitive et responsive, démocratise l’accès aux outils numériques de santé. L’accessibilité 24/7 du système libère les patients des contraintes horaires traditionnelles de prise de rendez-vous téléphonique. La centralisation de tous les dossiers médicaux en un lieu unique facilite le suivi médical et améliore la coordination entre professionnels de santé. La transparence offerte par la consultation des tarifs et disponibilités en temps réel permet aux patients de faire des choix éclairés et de planifier leurs soins en fonction de leurs contraintes personnelles et financières.
4.2) Pour les Médecins
Les bénéfices pour les médecins se traduisent par une optimisation significative de leur exercice professionnel. L’optimisation du temps grâce à la gestion automatisée des créneaux libère les médecins des tâches administratives répétitives. L’accès centralisé aux dossiers permet une consultation rapide des informations patients, améliorant la qualité des consultations. La réduction des no-shows grâce au système de rappels automatiques optimise le taux de remplissage des plannings. La flexibilité offerte par la gestion des urgences avec les patients walk-in permet aux médecins de répondre aux besoins imprévus tout en maintenant l’organisation de leur planning.
4.3) Pour les Établissements
L’efficacité opérationnelle constitue le principal bénéfice pour les institutions de santé. La réduction des tâches administratives permet de réallouer les ressources humaines vers des activités à plus forte valeur ajoutée. La visibilité renforcée par la présence en ligne améliore l’attractivité de l’établissement et facilite le recrutement de nouveaux patients. Les données analytiques fournies par le système permettent une meilleure compréhension de l’activité et facilitent la prise de décisions stratégiques. L’évolutivité de la solution garantit l’adaptation aux besoins croissants et aux changements organisationnels des établissements.
4.4) Pour l’Écosystème Multi-Institutionnel
L’architecture multi-institutionnelle apporte une valeur ajoutée significative à l’ensemble de l’écosystème de santé. La coordination améliorée entre les différents types d’établissements facilite la continuité des soins et réduit les délais de prise en charge. Le partage sécurisé d’informations entre médecins, hôpitaux, pharmacies et laboratoires optimise les parcours de soins et améliore la sécurité des patients. La standardisation des processus de recherche et d’accès aux données garantit une expérience utilisateur cohérente tout en respectant les spécificités de chaque type d’établissement. Le système de thématisation dynamique renforce l’identité professionnelle de chaque institution tout en maintenant l’unité fonctionnelle de la plateforme.
5) Planification et Gestion de Projet
5.1) Composition de l’Équipe
Le projet a été développé en binôme par Aya BEROUKECH et Hamza BENMESSAOUD, étudiants en 4ème année du cycle ingénieur à SupMTI Oujda, sous l’encadrement de Pr. Ilhame El Farissi. Cette approche collaborative nous a permis une maîtrise complète de la stack technologique full-stack : React.js pour le frontend, Node.js/Express.js pour le backend, et MySQL pour la base de données. Notre développement s’est appuyé sur une architecture moderne avec plus de 45 composants React organisés en modules thématiques, 35+ endpoints API REST, et une base de données de 25+ tables interconnectées. L’encadrement pédagogique a apporté l’expertise méthodologique nécessaire à la gestion d’un projet de cette envergure technique.
5.2) Planification Temporelle Détaillée (Diagramme de Gantt)
Le projet s'est déroulé sur 14 semaines (fin février à fin mai 2024), structuré en six phases distinctes avec jalons de validation. Le diagramme de Gantt ci-dessous illustre la planification complète du projet.
Phase 1 : Analyse et conception (semaines 1-3) : Cette phase fondamentale établit les bases du projet avec l'étude des besoins et l'analyse de l'existant. La conception de la base de données comprenant plus de 25 tables interconnectées et la définition de l'architecture système multi-institutionnelle constituent les livrables principaux. 
Jalon : Architecture Validée
Phase 2 : Développement core (semaines 4-7) : Le cœur du développement débute avec le setup de l'environnement et la création de la base de données MySQL. L'implémentation du système d'authentification JWT multi-rôles assure la sécurité de la plateforme. Le développement parallèle de l'API Backend Node.js avec plus de 35 endpoints et de l'interface React.js comprenant plus de 45 composants constitue l'ossature technique de la solution. 
Jalons : Auth Opérationnelle, API Backend Complète
Phase 3 : Fonctionnalités avancées (semaines 8-11) : Cette phase enrichit la plateforme avec des fonctionnalités différenciantes. L'intégration de la géolocalisation et du système de gestion des rendez-vous intelligent optimise l'expérience utilisateur. Le développement des dossiers médicaux complets intégrant plus de 200 types d'analyses médicales constitue le cœur métier de la solution. L'architecture multi-institutionnelle permet aux hôpitaux, pharmacies et laboratoires d'accéder aux données selon leurs besoins spécifiques. Les tableaux de bord personnalisés et l'optimisation des performances complètent cette phase. *Jalons : Interface Fonctionnelle, Géoloc & RDV Opérationnels*
Phase 4 : Intelligence artificielle (semaines 11-13) : L'innovation majeure du projet réside dans l'intégration du modèle Ollama Phi-3-mini déployé sur Google Colab. L'assistant chatbot médical développé offre une détection automatique de spécialités médicales basée sur l'analyse des symptômes. Les services IA exposés via FastAPI intègrent des mesures de sécurité médicale strictes avec disclaimers obligatoires. Jalon : IA Médicale Intégrée
Phase 5 : Finalisation (semaines 12-14) : La phase de finalisation assure la qualité globale avec une campagne de tests exhaustifs et l'optimisation finale des performances. La documentation technique complète et la préparation des supports de présentation préparent la livraison du projet.
Phase 6 : Déploiement (semaine 14) : La mise en production s'effectue sur une infrastructure cloud moderne avec Vercel pour le frontend et Railway pour le backend. La configuration du monitoring et la mise en service officielle marquent l'aboutissement du projet. 
Jalon : Déploiement Production
 
Figure 1: Diagramme de Gantt
5.3) Méthodologie de Développement
L’approche méthodologique adoptée s’inspire des principes Agile et Scrum adaptés au contexte d’un projet en binôme de fin d’études. Cette méthodologie agile a été choisie pour sa flexibilité et sa capacité d’adaptation aux évolutions technologiques et fonctionnelles rencontrées durant notre développement. Des sprints de deux semaines ont été définis pour structurer le développement et permettre une évaluation régulière de l’avancement, avec des livrables fonctionnels à chaque itération.
Implémentation Scrum Personnalisée : Des sprints de deux semaines ont été définis pour structurer le développement et permettre une évaluation régulière de l’avancement, avec des livrables fonctionnels à chaque itération. Chaque sprint débutait par une planification des tâches à réaliser, avec définition d’objectifs précis et mesurables sous forme de user stories. Des points de contrôle hebdomadaires avec l’encadrant pédagogique faisaient office de Sprint Reviews, permettant d’ajuster la planification en fonction des difficultés rencontrées et des opportunités d’amélioration identifiées. Les Sprint Retrospectives de fin de cycle permettaient d’analyser les succès et les points d’amélioration, favorisant un apprentissage continu et une optimisation de nos méthodes de travail.
Gestion Agile du Backlog : Le product backlog était régulièrement mis à jour avec les user stories priorisées selon leur valeur métier et leur complexité technique. Les épics principales comprenaient l’authentification multi-rôles, la gestion des rendez-vous intelligente, les dossiers médicaux complets, l’assistant IA médical, et l’architecture multi-institutionnelle. Cette approche nous a permis de concentrer nos efforts sur les fonctionnalités essentielles tout en gardant une vision claire des évolutions possibles.
Avantages de l’Approche Agile : L’approche itérative a facilité l’intégration progressive des fonctionnalités complexes, permettant de valider régulièrement la cohérence technique et fonctionnelle de la solution que nous avons développée. La flexibilité inhérente à cette méthodologie nous a permis d’adapter le périmètre du projet en fonction des contraintes temporelles tout en maintenant la qualité des livrables. L’utilisation d’outils de gestion de projet simples mais efficaces a facilité le suivi de l’avancement et la communication avec l’équipe pédagogique.
6) Contraintes et Défis
6.1) Contraintes Techniques
Les contraintes techniques du projet sont multiples et exigent une attention particulière. La sécurité des données impose la garantie de confidentialité médicale, nécessitant la mise en place de mesures de protection avancées. Les exigences de performance, avec un temps de réponse optimal, conditionnent l’adoption du système par les utilisateurs habitués à des interfaces réactives. La disponibilité du service 24h/24 et 7j/7 requiert une infrastructure robuste et des procédures de maintenance sophistiquées. La compatibilité multi-navigateurs et multi-dispositifs impose des tests exhaustifs et une conception responsive rigoureuse.
6.2) Contraintes Fonctionnelles
Les défis fonctionnels reflètent la complexité du domaine médical. La gestion des spécificités médicales nécessite une compréhension approfondie des processus de soins et des besoins des professionnels de santé. La compatibilité avec les systèmes existants dans les établissements de santé peut s’avérer complexe en raison de la diversité des solutions déjà en place. L’accompagnement des utilisateurs dans l’adoption de nouveaux outils numériques requiert une approche pédagogique adaptée aux différents profils d’utilisateurs. Le respect des standards médicaux impose une veille constante et des adaptations régulières du système.
Conclusion
Ce chapitre a présenté les fondements de notre projet BluePulse, une plateforme médicale innovante qui répond aux défis contemporains de la digitalisation des soins de santé. L’analyse des fonctionnalités, des utilisateurs cibles et de la valeur ajoutée démontre la pertinence de notre approche multi-institutionnelle intégrant l’intelligence artificielle. Le chapitre suivant détaillera l’étude fonctionnelle et les diagrammes d’analyse qui ont guidé la conception de cette solution.
 








Chapitre 2: 
Etude fonctionnelle 
Introduction
Ce chapitre présente l’étude fonctionnelle complète de la plateforme BluePulse, incluant l’analyse détaillée des besoins fonctionnels et non fonctionnels, ainsi que la modélisation UML du système. Les diagrammes présentés constituent la base conceptuelle qui a orienté l’architecture et l’implémentation technique de notre solution.
1) Analyse des Besoins
1.1) Besoins Fonctionnels
Gestion des Utilisateurs Multi-Rôles : Le système implémente une authentification JWT avec huit rôles distincts stockés dans la table utilisateurs. Chaque rôle dispose d’un accès spécifique via middleware Express personnalisé. La vérification email utilise Nodemailer avec tokens temporaires. Le système de récupération de mot de passe génère des tokens sécurisés avec expiration automatique. L’historique des connexions et actions est tracé pour audit de sécurité.
Gestion Avancée des Rendez-vous : Le système gère les créneaux récurrents via la table disponibilites_medecin avec intervalles configurables (15/30/60 min). Les indisponibilités exceptionnelles sont gérées séparément. L’algorithme de recherche de créneaux évite les conflits en temps réel. Les notifications automatiques (email + interface) utilisent des templates personnalisés. Le système de statuts détaillés (‘confirmé’, ‘annulé’, ‘reporté’, ‘terminé’, ‘no_show’) assure une traçabilité complète.
Dossiers Médicaux Complets : La table patients centralise toutes les informations modifiables par les médecins (profession, groupe sanguin, habitudes). Les antécédents sont catégorisés par type avec dates précises. Le système d’allergies inclut sévérité et symptômes. Les traitements documentent posologie, durée et observance. Plus de 200 types d’analyses sont organisés en catégories avec valeurs de référence. Les constantes vitales permettent un suivi graphique longitudinal.
Recherche Intelligente : Le système de recherche multi-critères permet aux patients de localiser facilement les médecins selon leurs besoins. Les filtres combinés (spécialité, tarifs, disponibilité) utilisent des requêtes SQL optimisées avec pagination pour des performances maximales.
Gestion Multi-Institutionnelle : Le système implémente une architecture permettant aux hôpitaux, pharmacies et laboratoires d’accéder aux dossiers patients selon leurs rôles spécifiques. Les hôpitaux gèrent les admissions, assignations de médecins et suivi des séjours via les tables hospital_assignments, hospital_beds et hospital_stays. Les pharmacies accèdent aux prescriptions via prescriptions et prescription_medications, avec gestion de la dispensation dans medication_dispensing. Les laboratoires consultent les demandes via test_requests et imaging_requests, et téléchargent les résultats dans test_results et imaging_results. Un système de recherche unifié utilise l’utilitaire partagé patientSearch.js pour garantir la cohérence et la sécurité RGPD.
1.2) Besoins Non Fonctionnels
Performance : Le système doit garantir un temps de réponse inférieur à 2 secondes pour maintenir une expérience utilisateur fluide et professionnelle. Le support de plus de 1000 utilisateurs simultanés assure la scalabilité nécessaire pour une adoption large de la plateforme. Une disponibilité de 99.9% du système garantit un accès continu aux services, essentiel dans le domaine médical.
Sécurité : Le chiffrement des données sensibles protège les informations médicales contre les accès non autorisés. L’audit des accès permet de tracer toutes les consultations et modifications de données pour des raisons de sécurité et de responsabilité. La sauvegarde automatique garantit la pérennité des données et la continuité de service en cas d’incident.
Utilisabilité : L’interface intuitive et responsive s’adapte à tous les types d’utilisateurs, quel que soit leur niveau de maîtrise technologique. Le support multi-navigateurs assure la compatibilité avec les environnements informatiques variés des utilisateurs. L’accessibilité selon les standards WCAG 2.1 garantit l’utilisation du système par les personnes en situation de handicap.
2) Diagrammes d’Analyse
2.1) Diagramme de Cas d’Utilisation
Le diagramme de cas d’Utilisation présente une vue d’ensemble des interactions entre les différents acteurs du système et les fonctionnalités principales de la plateforme médicale. Ce diagramme identifie huit acteurs principaux : Patient, Médecin, Administrateur, Super Administrateur, Institution, Pharmacie, Hôpital et Laboratoire. Les cas d’Utilisation sont organisés en modules fonctionnels cohérents incluant la gestion de l’authentification, la planification des rendez-vous, la gestion des dossiers médicaux, la recherche des médecins, et l’administration du système.
 
Figure 2: Diagramme de cas d'utilisation pour les patients et les utilisateurs non authentifié
 
Figure 3: Diagramme de cas d'utilisation des médecins
 
Figure 4: Diagramme de cas d'utilisation des pharmaciens
 
Figure 5: Diagramme de cas d'utilisation de laboratins
 
Figure 6: Diagramme de cas d'utilisation d'hospitaliers
 
Figure 7: Diagramme de cas d'utilisation des admins
2.2) Diagrammes de Séquence
Les diagrammes de séquence détaillent les interactions temporelles entre les objets du système pour les scénarios critiques. Quatre diagrammes principaux ont été modélisés pour couvrir les processus métier essentiels de la plateforme.
 
Figure 8: Diagramme de Séquence d’authentification
 
Figure 9: Diagramme de Séquence de prise de rendez-vous
Séquence 3 : Consultation Médicale et Mise à Jour du Dossier
 
Figure 10: Diagramme de  Séquence de consultation et mise à jour du dossier patient

 
Figure 11: Diagramme de Séquence de recherche de médecins
2.3) Modèle Conceptuel de Données (MCD)
Entités Principales Implémentées :
Le modèle conceptuel de données s’articule autour de vingt-cinq entités principales interconnectées par des relations complexes respectant les contraintes d’intégrité référentielle.
 
Figure 12: Modèle Conceptuel de Données
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
├─► Types_analyses (id, categorie_id, nom, valeur_reference_min, valeur_reference_max, unite, ordre_affichage)
├─►resultats_analyses (id, patient_id, type_analyse_id, valeur, date_analyse,
                   statut, notes_laboratoire, medecin_prescripteur_id)
├─►resultats_imagerie (id, patient_id, type_examen, description, date_examen,
                   compte_rendu, medecin_radiologue_id)
Conclusion
L’étude fonctionnelle présentée dans ce chapitre a permis de définir précisément les besoins et les spécifications de la plateforme BluePulse. Les diagrammes UML élaborés constituent le socle conceptuel sur lequel repose l’architecture technique du système. Le chapitre suivant détaillera l’implémentation technique de ces spécifications et la réalisation concrète de la plateforme.
 








Chapitre 3:
Etude technique et réalisation
 
Introduction
Ce chapitre décrit la réalisation technique du projet « BluePulse », en présentant les outils utilisés, les choix technologiques effectués, ainsi que l’architecture globale mise en place. Nous détaillerons également les interfaces développées à travers des captures d’écran représentatives du système. L’objectif est d’expliquer comment ces éléments techniques ont contribué à construire une plateforme médicale efficace, maintenable et sécurisée, depuis l’environnement de développement jusqu’à la communication entre les différentes couches du système, en passant par la présentation visuelle des fonctionnalités réalisées.
1) Outils et Environnement de Travail Technique
1.1) Environnement de Développement
Le développement de l’application BluePulse a été réalisé dans un environnement moderne, structuré pour favoriser la productivité et la qualité du code. Les principaux outils utilisés sont :
• Visual Studio Code (VS Code) : Éditeur de code principal, avec des extensions pour JavaScript, React, Node.js, MySQL, etc. 
 
Figure 13: Environnement de développement intégré Visual Studio Code
• Terminal intégré + linters : Pour l’exécution rapide des commandes CLI et la validation du code 
• Navigateurs modernes (Chrome/Firefox) : Pour le test, le débogage, et l’inspection du rendu frontend
1.2 Outils de Gestion de Version et Collaboration
• Git : Système de gestion de version utilisé tout au long du projet 
• GitHub : Plateforme centralisée pour héberger le code source, suivre les modifications et gérer la collaboration en binôme
 
 
Figure 14: git
 
Figure 15: GitHub
 
1.3) Outils de Test, Débogage et Qualité du Code
• ESLint & Prettier : Pour l’analyse statique du code JavaScript et l’uniformisation du style 
• React Developer Tools : Pour le suivi des composants React et des états 
• Postman : Pour tester les endpoints de l’API de manière indépendante 
• MySQL Workbench : Pour la gestion et l’optimisation de la base de donnée
 
 
Figure 16: Postman
 
 
Figure 17: MySQL Workbench 
2) Choix de Technologies
2.1 Technologies Backend
 Le backend de l’application est développé en Node.js avec Express.js, une combinaison JavaScript full-stack robuste, adaptée à la gestion de la logique métier médicale, des permissions granulaires, et de l’architecture multi-institutionnelle. Express.js offre une structure MVC bien organisée et une flexibilité particulièrement adaptée à notre contexte médical complexe.
Express.js a été choisi pour construire l’API RESTful avec plus de 35 endpoints. Il fournit un système de middlewares avancé, une gestion des routes modulaire et des contrôleurs spécialisés qui accélèrent le développement tout en maintenant la sécurité médicale.
L’authentification JWT (JSON Web Token) garantit une gestion sécurisée des sessions sans stockage côté serveur, essentielle pour une application de santé nécessitant un haut niveau de sécurité.
 
 
Figure 18: Node.js
 
 
Figure 19: Express.js
 
2.2) Technologies Frontend 
Le frontend utilise React.js 18.2.0, une bibliothèque JavaScript moderne qui structure le projet avec plus de 45 composants réutilisables. Le choix s’est porté sur React pour sa flexibilité, son écosystème mature et sa capacité à gérer des interfaces complexes multi-rôles.
React 18 constitue la base de l’interface utilisateur avec ses composants fonctionnels et son système de hooks moderne. L’application utilise React Router DOM pour la navigation SPA, optimisant l’expérience utilisateur dans un contexte médical où la rapidité d’accès est cruciale.
Styling et Interface Utilisateur :
• Material-UI 5.17.1 : Framework de composants UI professionnels et accessibles, adapté au domaine médical • 
Chart.js : Bibliothèque de visualisation pour les statistiques médicales et tableaux de bord • 
Axios : Client HTTP pour les communications API sécurisées • 
Date-fns : Gestion avancée des dates médicales et créneaux de rendez-vous
 
 
Figure 20: React
 
 
Figure 21: Material UI
 
2.3) Base de Données
• MySQL est utilisée pour sa robustesse, sa fiabilité et sa capacité à gérer plus de 25 tables interconnectées avec des relations complexes • MySQL2 : Driver Node.js optimisé pour les performances et la sécurité • La base de données gère les utilisateurs multi-rôles, patients, médecins, institutions, analyses médicales (200+ types), traitements, et rendez-vous avec gestion intelligente des créneaux
2.4) Intelligence Artificielle
 
 
Figure 22: Google Colab
 
 
Figure 23: Ollama
 
 
Figure 24: SQLite
 
 
Figure 25: ngrok
 
• Google Colab : Environnement d’exécution cloud avec GPU T4 pour le modèle IA 
• Ollama Phi-3-mini : Modèle de langage de 3.8B paramètres optimisé pour l’assistance médicale 
• FastAPI : Framework Python pour l’exposition des services IA 
: Base de données intégrée pour la persistance des conversations 
• Ngrok : Tunnel sécurisé pour l’accessibilité publique de l’API IA
3) Architecture Générale du Système
L’architecture du projet BluePulse suit un modèle standard d’application web moderne découplée : le frontend et le backend sont totalement indépendants, communiquant via une API REST sécurisée. Cette approche garantit la maintenabilité, la scalabilité et la sécurité nécessaires au domaine médical.
3.1) Architecture en Trois Tiers
La plateforme BluePulse implémente une architecture en trois tiers qui sépare clairement les responsabilités en trois couches distinctes :
 
Figure 26: Architecture en trois tiers de la plateforme BluePulse
-	Tier 1 : Couche de Présentation (Frontend) 
• Technologie : React.js 18.2.0 avec Material-UI 
• Responsabilités : Interface utilisateur, interactions utilisateur, affichage des données 
• Composants : Plus de 45 composants React organisés par domaine métier 
• Thématisation : Système dynamique adapté aux 8 types d'utilisateurs
-	Tier 2 : Couche Logique Métier (Backend) 
• Technologie : Node.js avec Express.js 
• Responsabilités : Logique métier, authentification, autorisations, traitement des requêtes 
• API : Plus de 35 endpoints REST organisés par modules fonctionnels 
• Services : Modules spécialisés (médecins, patients, hôpitaux, pharmacies, laboratoires, IA)
-	Tier 3 : Couche de Données (Database) 
• Technologie : MySQL avec plus de 25 tables interconnectées 
• Responsabilités : Stockage, persistance, intégrité des données médicales 
• Organisation : Données structurées par domaines (authentification, médical, analyses, institutions)
3.2) Organisation du Backend
Le backend Node.js/Express.js est structuré en modules fonctionnels, chacun traitant une fonctionnalité médicale précise :
 
Figure 27: Organisation des modules backend Node.js/Express.js
• auth : Inscription, authentification (JWT), profil, gestion des 8 rôles utilisateurs 
• patients : Gestion complète des dossiers patients, antécédents, allergies, traitements 
• medecins : Profils médecins, disponibilités, consultations, statistiques d’activité 
• appointments : Gestion des rendez-vous intelligente avec gestion des conflits 
• hospitals : Assignations patients, gestion des lits, admissions hospitalières 
• pharmacies : Prescriptions, dispensation, historique inter-pharmacies
• laboratories : Demandes d’analyses, résultats, imagerie médicale 
• ai : Assistant chatbot médical avec IA intégrée
Chaque module a ses propres routes, contrôleurs, middlewares et services, ce qui facilite la maintenance et l’évolutivité du code médical complexe.
3.3) Organisation du Frontend
Le frontend utilise la structure moderne de React.js avec une organisation modulaire par type d’utilisateur.
Structure des dossiers : 
• /components : Plus de 45 composants réutilisables organisés par domaine (médecin, hospital, pharmacy, laboratory, patient, auth, layout) 
• /hooks : Hooks personnalisés (useAuth, usePatientSearch, useAppointments) 
• /services : Services API pour chaque module métier 
• /utils : Fonctions utilitaires (authentification, formatage médical, calculs) 
• /assets : Fichiers statiques et thèmes dynamiques
Cette architecture assure une séparation claire des responsabilités médicales, une réutilisabilité du code et une maintenance optimale pour une plateforme de santé.
3.3) Communication entre Client et Serveur
• Authentification sécurisée via JWT : Le token est obtenu via /api/auth/login et transmis dans les headers des requêtes sécurisées 
• Requêtes HTTP envoyées via Axios avec intercepteurs pour la gestion automatique des tokens 
• Réponses au format JSON structurées avec codes d’erreur médicaux spécifiques 
• Protection des routes sur le frontend via des garde-fous (ProtectedRoute) et sur le backend via les middlewares de rôles 
• Gestion des erreurs centralisée avec messages localisés pour le contexte médical
3.5) Structure de l’API REST
L’API REST, construite avec Express.js, expose plus de 35 endpoints organisés par domaine médical :
Authentification • POST /api/auth/login : Connexion multi-rôles 
• POST /api/auth/register : Inscription avec vérification email 
• POST /api/auth/forgot-password : Récupération de mot de passe 
• POST /api/auth/verify-email : Vérification email
Patients • POST /api/patients/create : Création de profil patient 
• GET /api/patients/search : Recherche sécurisée de patients 
• PUT /api/patients/:id/update : Mise à jour complète du dossier 
• GET /api/patients/:id/medical-history : Historique médical complet
Médecins • POST /api/medecins/create-profile : Création de profil médecin 
• GET /api/medecins/dashboard : Tableau de bord avec statistiques 
• POST /api/medecins/availability : Gestion des disponibilités 
• GET /api/medecins/search : Recherche de médecins par spécialité
Rendez-vous • POST /api/appointments/create : Création de rendez-vous intelligent 
• GET /api/appointments/my : Rendez-vous par utilisateur 
• PUT /api/appointments/:id/status : Modification de statut 
• GET /api/appointments/conflicts : Détection de conflits
Hôpitaux • POST /api/hospitals/assign-patient : Assignation patient-médecin 
• GET /api/hospitals/dashboard : Tableau de bord hospitalier 
• POST /api/hospitals/admission : Gestion des admissions 
• GET /api/hospitals/beds : Gestion des lits
Pharmacies • GET /api/pharmacies/prescriptions : Accès aux prescriptions 
• POST /api/pharmacies/dispense : Enregistrement de dispensation 
• GET /api/pharmacies/history : Historique inter-pharmacies
Laboratoires • GET /api/laboratories/test-requests : Demandes d’analyses 
• POST /api/laboratories/upload-results : Téléchargement de résultats 
• GET /api/laboratories/imaging : Gestion de l’imagerie
Intelligence Artificielle • POST /api/ai/chat : Conversation avec l’assistant médical 
• GET /api/ai/specialties : Détection automatique de spécialités 
• GET /api/ai/history : Historique des conversations
4) Système de Thématisation Dynamique et Fonctionnalités Avancées
1) Système de Thématisation Multi-Institutionnelle
La plateforme intègre un système de thématisation dynamique sophistiqué qui adapte automatiquement l’interface selon le rôle utilisateur. Cette fonctionnalité améliore l’expérience utilisateur tout en renforçant l’identité professionnelle de chaque type d’établissement.
Architecture Technique : Le système repose sur une configuration centralisée des palettes de couleurs pour chaque rôle utilisateur : 
• Médecins : Thème vert médical professionnel 
• Hôpitaux : Thème rouge hospitalier 
• Pharmacies : Thème violet pharmaceutique 
• Laboratoires : Thème orange laboratoire 
• Patients : Thème bleu convivial 
• Administrateurs : Thème noir administratif
La synchronisation CSS en temps réel via des variables CSS dynamiques et une gestion d’état globale met à jour automatiquement le thème selon le rôle de l’utilisateur connecté.
4.2) Assistant Intelligence Artificielle Intégré
L’intégration de l’intelligence artificielle constitue un élément différenciateur majeur de la plateforme, répondant aux enjeux contemporains d’aide à la décision médicale.
Architecture Cloud Complète : L’infrastructure AI repose sur une stack technique multicouche utilisant : 
• Google Colab avec GPU T4 pour l’exécution du modèle 
• Ollama comme runtime optimisé pour Phi-3-mini (3.8B paramètres) 
• FastAPI pour l’exposition des services REST 
• SQLite intégrée pour la persistance des conversations 
• Ngrok pour l’accessibilité publique sécurisée
Fonctionnalités Médicales Avancées : 
1. Détection Automatique de Spécialités : Le système identifie automatiquement 13 spécialités médicales basées sur l’analyse sémantique des symptômes 
2. Filtres de Sécurité : Validation automatique et disclaimers médicaux obligatoires 
3. Persistance des Conversations : Base SQLite intégrée avec indexation optimisée
Gestion de la Fiabilité : Le système implémente un mécanisme de retry avec backoff progressif pour assurer la robustesse des communications avec l’API IA, incluant une gestion intelligente des timeouts et des erreurs de connexion.
5) Implémentation des Modules Principaux
5.1) Module d’Authentification et Autorisation Multi-Rôles
 
              
Figure 28: Nodemailer
 
                   
Figure 29: JWT
 
Le module d’authentification constitue le fondement sécuritaire de la plateforme, gérant huit types d’utilisateurs distincts avec des niveaux d’accès différenciés. L’approche basée sur JWT (JSON Web Tokens) a été privilégiée pour sa capacité à maintenir des sessions sécurisées tout en permettant une architecture distribuée.
Implémentation des Middlewares de Sécurité : Le système utilise des middlewares Express personnalisés pour contrôler l’accès granulaire selon les rôles utilisateur, avec validation automatique des permissions pour chaque type d’établissement (pharmacie, hôpital, laboratoire).
Stack Technologique d’Authentification : 
• JsonWebToken pour la génération et validation des tokens 
• Bcrypt avec salt rounds pour le hachage sécurisé des mots de passe 
• Nodemailer pour la vérification email et récupération de mot de passe 
• Middlewares Express personnalisés pour la validation des rôles
Gestion des Sessions et Tokens : JWT avec expiration configurable, refresh tokens pour les sessions longues, blacklisting des tokens lors de la déconnexion, et validation des permissions à chaque requête API.
5.2) Module de Gestion des Dossiers Médicaux Complets
Le module de gestion des dossiers médicaux constitue le cœur fonctionnel de la plateforme, permettant aux médecins de modifier intégralement les informations patients et de gérer des analyses médicales complètes.
Système d’Analyses Médicales Avancé : 
La plateforme intègre un système complet de gestion des analyses avec 11 catégories médicales : • Hématologie : Analyses sanguines complètes 
• Biochimie : Paramètres biochimiques essentiels 
• Endocrinologie : Hormones et métabolisme 
• Immunologie : Tests immunologiques 
• Microbiologie : Analyses bactériologiques 
• Vitamines et Minéraux : Carences nutritionnelles 
• Marqueurs Tumoraux : Dépistage oncologique 
• Cardiologie : Marqueurs cardiaques 
• Coagulation : Tests de coagulation 
• Urologie : Analyses urinaires 
• Autre : Examens spécialisés
Plus de 200 types d’examens sont disponibles avec valeurs de référence automatiques.
Interface de Gestion Médicale : Le composant principal MedicalDossier.jsx offre une interface complète pour la gestion des dossiers patients avec sections organisées : 
• Informations personnelles modifiables 
• Traitements en cours avec posologie 
• Antécédents et allergies détaillés 
• Résultats d’analyses avec graphiques 
• Constantes vitales longitudinales 
• Observations cliniques privées 
• Historique complet des rendez-vous
Fonctionnalités de Modification Complète : Toutes les informations patients sont modifiables par les médecins, incluant le groupe sanguin avec validation, contact d’urgence complet, profession et habitudes de vie, gestion des allergies avec niveaux de sévérité, et traitements avec posologie et suivi d’observance.
5.3) Architecture Multi-Institutionnelle
L’architecture multi-institutionnelle permet une coordination inédite entre les différents acteurs de santé. Cette implémentation utilise un système de recherche unifié et des permissions granulaires.
Système de Recherche Unifié : L’architecture utilise un système de recherche de patients unifié et sécurisé avec : 
• Validation des paramètres d’entrée 
• Construction dynamique des conditions SQL 
• Exécution de la recherche avec audit de sécurité 
• Traçabilité complète de tous les accès aux données patients
Gestion Hospitalière Spécialisée : Le système hospitalier permet : 
• Assignation de patients aux médecins avec vérification des disponibilités 
• Gestion des lits et services hospitaliers 
• Suivi complet des admissions avec statuts en temps réel 
• Coordination entre équipes médicales
Système Pharmaceutique Intégré : Les pharmacies disposent d’un système complet : 
• Gestion des prescriptions avec vérification automatique 
• Enregistrement de la dispensation médicamenteuse 
• Historique inter-pharmacies pour améliorer la sécurité pharmaceutique 
• Détection des interactions médicamenteuses
Laboratoires et Imagerie : Les laboratoires bénéficient de : 
• Accès aux demandes d’analyses prescrites 
• Gestion de l’imagerie médicale 
• Traçabilité des examens par établissement source 
6) Interfaces Réalisées
Cette section présente les principales interfaces développées pour la plateforme BluePulse, illustrant l’expérience utilisateur pour chaque type d’acteur du système médical à travers des captures d’écran représentatives des fonctionnalités implémentées.
6.1) Interface d’Authentification Multi-Rôles
L’interface d’authentification constitue le point d’entrée unifié de la plateforme, adaptée aux 8 types d’utilisateurs distincts. Cette interface responsive intègre une thématisation dynamique qui s’adapte automatiquement selon le rôle détecté lors de la connexion.
 
Figure 30: Interface d'authentification

Le système de vérification par email est automatiquement déclenché lors de l'inscription des nouveaux patients, garantissant la sécurité et l'authenticité des comptes créés. Chaque patient qui s'inscrit pour la première fois reçoit un email de confirmation avec un token temporaire sécurisé généré par Nodemailer, permettant l'activation de son compte de manière sécurisée.

Figure 31: Email de confirmation pour les patients nouvellement inscrits
6.2) Tableau de Bord Médecin
Le tableau de bord médecin représente l’interface centrale pour les professionnels de santé, offrant une vue d’ensemble complète de leur activité quotidienne avec des métriques en temps réel et des outils de gestion avancés.
 
Figure 32: Interface Tableau de Bord Médecin
6.3) Interface de Recherche de Patients
L’interface de recherche de patients illustre le système unifié utilisé par tous les types d’établissements pour localiser et accéder aux dossiers patients de manière sécurisée et conforme aux exigences RGPD.
 
Figure 33: Interface de Recherche de Patients
6.4) Dossier Médical Patient Complet
L’interface de gestion des dossiers médicaux constitue le cœur fonctionnel de la plateforme, permettant aux médecins de consulter et modifier intégralement les informations patients avec une organisation claire et intuitive.  
Figure 34: Dossier Médical Patient Complet
6.5) Interface de Prise de Rendez-vous
L’interface de réservation de rendez-vous illustre le système intelligent de gestion des créneaux avec détection automatique des conflits et optimisation des plannings médicaux.
 
Figure 35: Interface de Prise de Rendez-vous
6.6) Assistant IA Médical Intégré
L’interface de l’assistant chatbot illustre l’intégration native de l’intelligence artificielle avec détection automatique de spécialités, et disclaimers de sécurité médicale.
 
Figure 36: Interface Assistant IA Médical
6.7) Interface d’Administration Système
L’interface d’administration démontre les outils de gestion globale de la plateforme avec statistiques d’utilisation, gestion des utilisateurs, et monitoring des performances système.
 
Figure 37: Interface d'administration système
7) Sécurité et Protection des données
7.1) Mesures de Sécurité Implémentées
La sécurité constitue un enjeu fondamental dans le développement d’applications médicales. L’approche sécuritaire adoptée s’articule autour d’une stratégie de défense en profondeur :
Sécurisation des Données : 
• Chiffrement AES-256 pour les données sensibles au repos 
• Chiffrement TLS 1.3 pour les communications 
• Hachage bcrypt avec salt pour les mots de passe 
• Validation et sanitisation systématiques des entrées
Contrôle d’Accès : 
• Authentification JWT avec expiration configurable 
• Middlewares de validation des rôles granulaires 
• Audit complet de tous les accès aux données patients 
• Blacklisting des tokens lors de déconnexion
Protection Réseau : 
• CORS configuré pour les domaines autorisés 
• Rate limiting pour prévenir les attaques DDoS 
• Validation des headers HTTP 
• Monitoring des tentatives d’intrusion
7.2) Protection des Données Médicales
Sécurité par Conception : La protection des données médicales est intégrée dès la conception : 
• Minimisation des données collectées 
• Chiffrement des informations sensibles 
• Pseudonymisation pour les analyses statistiques 
• Contrôles d’accès granulaires
Gestion des Accès : 
• Authentification forte pour tous les utilisateurs 
• Permissions spécifiques par type d’établissement 
• Sessions sécurisées avec expiration automatique 
• Validation des droits à chaque requête
Traçabilité et Audit : 
• Logging de tous les accès aux dossiers patients 
• Historique des modifications avec horodatage 
• Identification de l’utilisateur pour chaque action 
• Rapports d’audit automatisés
8) Tests, Validation et Déploiement
1) Stratégie de Tests Multi-Niveaux
La validation de la plateforme médicale nécessite une approche rigoureuse et multicouche :
Tests Unitaires : 
• Validation des algorithmes critiques (créneaux, calculs géographiques) 
• Tests des fonctions utilitaires médicales 
• Validation des middlewares de sécurité 
• Tests des services d’authentification
Tests d’Intégration : 
• Validation des interactions frontend-backend 
• Tests des flux de données multi-institutionnels 
• Vérification de l’intégration IA 
• Tests des communications API

Tests de Sécurité : 
• Validation des contrôles d’accès 
• Vérification de la protection des données 
8.2) Validation Fonctionnelle
Scénarios Utilisateur Réalistes : 
• Parcours patient complet (inscription → RDV → consultation) 
• Workflow médecin (connexion → patients → dossiers → prescriptions) 
• Processus multi-institutionnel (hôpital → pharmacie → laboratoire) 
• Utilisation de l’assistant IA médical
Validation des Cas d’Erreur : 
• Gestion des pannes réseau 
• Récupération après timeout IA 
• Validation des données corrompues 
• Mécanismes de rollback
8.3) Stratégies de Déploiement
 
 
Figure 38: Railway
 
Figure 39: Vercel
 

Architecture de Déploiement Cloud :
La plateforme BluePulse utilise une architecture de déploiement moderne basée sur des services cloud spécialisés :
Frontend - Vercel : 
• Déploiement automatique du frontend React.js 
• CDN global pour des performances optimales 
• Certificats SSL automatiques 
• Déploiements automatiques depuis GitHub 
• Preview deployments pour chaque pull request 
• Optimisation automatique des performances 
• Support des variables d’environnement sécurisées
Backend - Railway : 
• Déploiement du serveur Node.js/Express.js 
• Base de données MySQL hébergée 
• Variables d’environnement chiffrées 
• Scaling automatique selon la charge 
• Monitoring intégré des performances 
• Logs centralisés et accessibles 
• Déploiements automatiques depuis GitHub
Configuration de Production : 
•  Frontend Vercel : Build optimisé avec minification et compression 
• Backend Railway : Serveur Node.js avec clustering automatique 
• Base de données : MySQL avec sauvegardes automatiques 
• Sécurité : HTTPS forcé, CORS configuré, rate limiting 
• Monitoring : Métriques temps réel sur Railway dashboard
Avantages de cette Architecture : 
• Simplicité : Déploiement en un clic depuis GitHub 
• Performance : CDN Vercel + infrastructure Railway optimisée 
• Sécurité : Certificats SSL automatiques et variables chiffrées 
• Scalabilité : Montée en charge automatique selon le trafic 
• Maintenance : Mises à jour automatiques et monitoring intégré 
• Coût : Solution économique pour un projet étudiant
Workflow de Déploiement :
 
Figure 40: Workflow de Déploiement
Pipeline de Déploiement Détaillé :
1.	Développement Local : Modifications du code source avec tests locaux
2.	Commit GitHub : Push automatique déclenchant les pipelines de déploiement
3.	Build Frontend (Vercel) :
–	Compilation React.js optimisée
–	Minification et compression des assets
–	Distribution via CDN global
–	Génération des certificats SSL automatiques
4.	Déploiement Backend (Railway) :
–	Démarrage du serveur Node.js/Express.js
–	Connexion automatique à la base de données MySQL
–	Configuration des variables d’environnement sécurisées
–	Activation du monitoring et des health checks
5.	Mise en Production :
–	Accès utilisateur via HTTPS sécurisé
–	Fonctionnalités complètes disponibles
–	Monitoring temps réel des performances
–	Logs centralisés pour le debugging
Métriques de Performance du Pipeline : •
Temps de build frontend : ~2-3 minutes 
• Temps de déploiement backend : ~1-2 minutes 
• Temps total de mise en production : ~5 minutes maximum 
Conclusion
Ce chapitre a détaillé l’architecture technique et la réalisation complète de la plateforme BluePulse. L’implémentation des modules principaux, les stratégies de tests et les optimisations de performance démontrent la robustesse de notre solution. Les mesures de sécurité implémentées garantissent la protection des données médicales sensibles, positionnant BluePulse comme une solution fiable pour la digitalisation des soins de santé.
 
Conclusion générale

La réalisation de la plateforme médicale BluePulse s’inscrit dans une démarche d’innovation technologique au service de la modernisation du système de santé marocain. Ce projet de fin d’année a permis de concevoir et développer une solution complète répondant aux défis contemporains de la digitalisation des soins de santé, en intégrant des technologies d’intelligence artificielle avancées et une architecture multi-institutionnelle innovante.
L’analyse des besoins a révélé les limitations des systèmes de gestion médicale traditionnels, notamment la persistance de méthodes manuelles, l’accès fragmenté aux informations médicales, et l’absence d’outils d’aide à la décision. Notre solution BluePulse répond à ces problématiques par une approche intégrée combinant simplicité d’utilisation et innovation technologique.
La plateforme développée constitue une application web full-stack moderne s’adressant à huit types d’utilisateurs distincts : patients, médecins, administrateurs, super administrateurs, institutions médicales, pharmacies, hôpitaux et laboratoires. L’architecture en trois tiers avec une base de données MySQL robuste comprenant plus de 25 tables interconnectées garantit la scalabilité et la sécurité nécessaires au domaine médical.
L’intégration native de l’intelligence artificielle représente une différenciation majeure de notre solution. L’assistant chatbot médical, déployé sur Google Colab utilisant le modèle Phi-3-mini, analyse les symptômes avec détection automatique de 13 spécialités médicales. Cette fonctionnalité d’aide au diagnostic préliminaire améliore significativement l’expérience utilisateur tout en respectant les exigences de sécurité médicale.
L’architecture multi-institutionnelle permet une coordination inédite entre les différents acteurs de santé. Les hôpitaux peuvent assigner des patients aux médecins et suivre les séjours, les pharmacies accèdent aux prescriptions avec gestion de la dispensation, et les laboratoires consultent les demandes d’analyses avec téléchargement des résultats. Cette intégration améliore la continuité des soins et optimise les parcours patients.
Le développement s’est appuyé sur une méthodologie agile adaptée au contexte académique, avec des sprints de deux semaines permettant une évaluation régulière de l’avancement. L’implémentation technique démontre la maîtrise d’une stack technologique moderne : React.js pour le frontend, Node.js/Express.js pour le backend, et MySQL pour la persistance des données. Le déploiement sur Vercel et Railway assure une infrastructure cloud robuste et économique.
Les mesures de sécurité implémentées respectent les exigences du domaine médical avec authentification JWT, chiffrement des données sensibles, et protection robuste des informations. L’approche “Sécurité par Conception” garantit la protection des données médicales dès la conception du système, avec contrôles d’accès granulaires et audit complet des accès.
Les perspectives d’évolution incluent l’extension des fonctionnalités d’intelligence artificielle, l’intégration avec les systèmes d’information hospitaliers existants, et le développement d’une application mobile native. L’analyse des données anonymisées collectées pourrait contribuer à la recherche épidémiologique et à l’amélioration des politiques de santé publique.
Ce projet démontre comment les technologies modernes peuvent transformer l’accessibilité et l’efficacité des soins de santé au Maroc. La plateforme BluePulse contribue à la réduction de la fracture numérique dans le secteur médical en proposant une solution accessible et intuitive adaptée aux besoins locaux. L’intégration réussie de technologies d’intelligence artificielle dans une architecture multi-institutionnelle démontre la faisabilité technique et la pertinence fonctionnelle de notre approche, positionnant BluePulse comme une solution viable pour la digitalisation des établissements de santé marocains.
 

WEBOGRAPHIE
[1] React.js Documentation. React - A JavaScript library for building user interfaces. https://reactjs.org/
[2] Node.js Foundation. Node.js - JavaScript runtime built on Chrome’s V8 JavaScript engine. https://nodejs.org/
[3] Express.js Team. Express - Fast, unopinionated, minimalist web framework for Node.js. https://expressjs.com/
[4] MySQL AB. MySQL - The world’s most popular open source database. https://www.mysql.com/
[5] Material-UI Team. Material-UI - React components for faster and easier web development. https://mui.com/
[6] Chart.js Team. Chart.js - Simple yet flexible JavaScript charting for designers & developers. https://www.chartjs.org/
[7] Axios Library. Axios - Promise based HTTP client for the browser and node.js. https://axios-http.com/
[8] React Router Team. React Router - Declarative routing for React. https://reactrouter.com/
[9] Microsoft Research. (2024). Phi-3 Technical Report: A Highly Capable Language Model Locally on Your Phone. arXiv:2404.14219.
[10] Google Colab Team. Google Colaboratory - A hosted Jupyter notebook service. https://colab.research.google.com/
[11] Ollama Team. Ollama - Get up and running with large language models locally. https://ollama.ai/
[12] FastAPI Team. FastAPI - Modern, fast web framework for building APIs with Python. https://fastapi.tiangolo.com/
[13] Ngrok Inc. Ngrok - Secure tunnels to localhost. https://ngrok.com/
[14] Vercel Inc. Vercel - The Frontend Cloud. https://vercel.com/
[15] Railway Corp. Railway - Deploy code with zero configuration. https://railway.app/
[16] JWT.io. JSON Web Tokens - Introduction. https://jwt.io/introduction/
[17] Bcrypt Library. Bcrypt - A library to help you hash passwords. https://www.npmjs.com/package/bcrypt
[18] Nodemailer Team. Nodemailer - Send e-mails from Node.js. https://nodemailer.com/
[19] Visual Studio Code Team. Visual Studio Code - Code editing. Redefined. https://code.visualstudio.com/
[20] Git SCM. Git - Distributed version control system. https://git-scm.com/
[21] GitHub Inc. GitHub - Where the world builds software. https://github.com/
[22] Postman Inc. Postman - The Collaboration Platform for API Development. https://www.postman.com/
[23] Anthropic. Claude Sonnet - Advanced AI Assistant for Code Development and Technical Documentation. https://claude.ai

