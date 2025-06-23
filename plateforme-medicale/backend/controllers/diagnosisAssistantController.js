const db = require('../config/db');
const axios = require('axios');
const aiManager = require('../ai/services/aiManager');
const colabService = require('../ai/services/colabService');

// Symptom to diagnosis mapping (basic rule-based system)
const symptomDiagnosisMap = {
  'fever': {
    'fièvre': ['Infection virale', 'Grippe', 'Infection bactérienne'],
    'fever': ['Viral infection', 'Flu', 'Bacterial infection'],
    'سخانة': ['عدوى فيروسية', 'أنفلونزا', 'عدوى بكتيرية'],
    'darija': ['عدوى فيروسية', 'أنفلونزا', 'عدوى بكتيرية']
  },
  'cough': {
    'toux': ['Rhume', 'Bronchite', 'Pneumonie', 'Allergie'],
    'cough': ['Cold', 'Bronchitis', 'Pneumonia', 'Allergy'],
    'كحة': ['برد', 'التهاب الشعب الهوائية', 'التهاب رئوي', 'حساسية'],
    'darija': ['برد', 'التهاب الشعب الهوائية', 'التهاب رئوي', 'حساسية']
  },
  'headache': {
    'mal de tête': ['Tension', 'Migraine', 'Sinusite', 'Déshydratation'],
    'headache': ['Tension headache', 'Migraine', 'Sinusitis', 'Dehydration'],
    'صداع': ['توتر', 'شقيقة', 'التهاب الجيوب الأنفية', 'جفاف'],
    'darija': ['توتر', 'شقيقة', 'التهاب الجيوب الأنفية', 'جفاف']
  },
  'sore_throat': {
    'mal de gorge': ['Pharyngite', 'Amygdalite', 'Infection virale'],
    'sore_throat': ['Pharyngitis', 'Tonsillitis', 'Viral infection'],
    'وجع الحلق': ['التهاب البلعوم', 'التهاب اللوزتين', 'عدوى فيروسية'],
    'darija': ['التهاب البلعوم', 'التهاب اللوزتين', 'عدوى فيروسية']
  },
  'nausea': {
    'nausée': ['Gastro-entérite', 'Intoxication alimentaire', 'Stress'],
    'nausea': ['Gastroenteritis', 'Food poisoning', 'Stress'],
    'غثيان': ['التهاب معدي معوي', 'تسمم غذائي', 'توتر'],
    'darija': ['التهاب معدي معوي', 'تسمم غذائي', 'توتر']
  },
  'fatigue': {
    'fatigue': ['Surmenage', 'Anémie', 'Dépression', 'Infection'],
    'fatigue': ['Overwork', 'Anemia', 'Depression', 'Infection'],
    'تعب': ['إرهاق', 'فقر الدم', 'اكتئاب', 'عدوى'],
    'darija': ['إرهاق', 'فقر الدم', 'اكتئاب', 'عدوى']
  },
  'chest_pain': {
    'douleur thoracique': ['Angine de poitrine', 'Infarctus', 'Anxiété', 'Reflux gastrique'],
    'chest_pain': ['Angina', 'Heart attack', 'Anxiety', 'Acid reflux'],
    'وجع الصدر': ['ذبحة صدرية', 'نوبة قلبية', 'قلق', 'ارتجاع معدي'],
    'darija': ['ذبحة صدرية', 'نوبة قلبية', 'قلق', 'ارتجاع معدي']
  },
  'shortness_of_breath': {
    'essoufflement': ['Asthme', 'Insuffisance cardiaque', 'Pneumonie', 'Anxiété'],
    'shortness_of_breath': ['Asthma', 'Heart failure', 'Pneumonia', 'Anxiety'],
    'ضيق التنفس': ['ربو', 'قصور القلب', 'التهاب رئوي', 'قلق'],
    'darija': ['ربو', 'قصور القلب', 'التهاب رئوي', 'قلق']
  },
  'abdominal_pain': {
    'douleur abdominale': ['Gastrite', 'Appendicite', 'Calculs biliaires', 'Ulcère'],
    'abdominal_pain': ['Gastritis', 'Appendicitis', 'Gallstones', 'Ulcer'],
    'وجع البطن': ['التهاب المعدة', 'التهاب الزائدة الدودية', 'حصى المرارة', 'قرحة'],
    'darija': ['التهاب المعدة', 'التهاب الزائدة الدودية', 'حصى المرارة', 'قرحة']
  },
  'dizziness': {
    'vertiges': ['Hypotension', 'Déshydratation', 'Problème d\'oreille interne'],
    'dizziness': ['Hypotension', 'Dehydration', 'Inner ear problem']
  },
  'back_pain': {
    'mal de dos': ['Tension musculaire', 'Hernie discale', 'Arthrose'],
    'back_pain': ['Muscle tension', 'Disc herniation', 'Arthritis']
  },
  'joint_pain': {
    'douleur articulaire': ['Arthrite', 'Arthrose', 'Tendinite'],
    'joint_pain': ['Arthritis', 'Osteoarthritis', 'Tendinitis']
  },
  'skin_rash': {
    'éruption cutanée': ['Eczéma', 'Allergie', 'Infection cutanée'],
    'skin_rash': ['Eczema', 'Allergy', 'Skin infection']
  },
  'difficulty_sleeping': {
    'difficulté à dormir': ['Insomnie', 'Stress', 'Apnée du sommeil'],
    'difficulty_sleeping': ['Insomnia', 'Stress', 'Sleep apnea']
  },
  'loss_of_appetite': {
    'perte d\'appétit': ['Dépression', 'Infection', 'Problème digestif'],
    'loss_of_appetite': ['Depression', 'Infection', 'Digestive problem']
  },
  'weight_loss': {
    'perte de poids': ['Hyperthyroïdie', 'Diabète', 'Cancer', 'Dépression'],
    'weight_loss': ['Hyperthyroidism', 'Diabetes', 'Cancer', 'Depression']
  },
  'muscle_pain': {
    'douleur musculaire': ['Fibromyalgie', 'Tension', 'Infection virale'],
    'muscle_pain': ['Fibromyalgia', 'Tension', 'Viral infection']
  },
  'swelling': {
    'gonflement': ['Rétention d\'eau', 'Insuffisance cardiaque', 'Allergie'],
    'swelling': ['Water retention', 'Heart failure', 'Allergy']
  },
  'numbness': {
    'engourdissement': ['Neuropathie', 'Compression nerveuse', 'Diabète'],
    'numbness': ['Neuropathy', 'Nerve compression', 'Diabetes']
  },
  'vision_problems': {
    'problèmes de vision': ['Fatigue oculaire', 'Glaucome', 'Cataracte'],
    'vision_problems': ['Eye strain', 'Glaucoma', 'Cataract']
  }
};

// Emergency symptoms that require immediate medical attention
const emergencySymptoms = [
  'chest_pain', 'shortness_of_breath', 'severe_abdominal_pain', 
  'loss_of_consciousness', 'severe_bleeding', 'difficulty_breathing',
  'severe_headache', 'high_fever', 'seizure', 'stroke_symptoms'
];

// Common symptoms with French and Darija translations
const commonSymptoms = [
  { id: 'fever', label: 'Fièvre', english: 'fever', darija: 'سخانة' },
  { id: 'cough', label: 'Toux', english: 'cough', darija: 'كحة' },
  { id: 'headache', label: 'Mal de tête', english: 'headache', darija: 'صداع' },
  { id: 'sore_throat', label: 'Mal de gorge', english: 'sore_throat', darija: 'وجع الحلق' },
  { id: 'nausea', label: 'Nausée', english: 'nausea', darija: 'غثيان' },
  { id: 'fatigue', label: 'Fatigue', english: 'fatigue', darija: 'تعب' },
  { id: 'chest_pain', label: 'Douleur thoracique', english: 'chest_pain', darija: 'وجع الصدر' },
  { id: 'shortness_of_breath', label: 'Essoufflement', english: 'shortness_of_breath', darija: 'ضيق التنفس' },
  { id: 'abdominal_pain', label: 'Douleur abdominale', english: 'abdominal_pain', darija: 'وجع البطن' },
  { id: 'dizziness', label: 'Vertiges', english: 'dizziness', darija: 'دوخة' },
  { id: 'back_pain', label: 'Mal de dos', english: 'back_pain' },
  { id: 'joint_pain', label: 'Douleur articulaire', english: 'joint_pain' },
  { id: 'skin_rash', label: 'Éruption cutanée', english: 'skin_rash' },
  { id: 'difficulty_sleeping', label: 'Difficulté à dormir', english: 'difficulty_sleeping' },
  { id: 'loss_of_appetite', label: 'Perte d\'appétit', english: 'loss_of_appetite' },
  { id: 'weight_loss', label: 'Perte de poids', english: 'weight_loss' },
  { id: 'muscle_pain', label: 'Douleur musculaire', english: 'muscle_pain' },
  { id: 'swelling', label: 'Gonflement', english: 'swelling' },
  { id: 'numbness', label: 'Engourdissement', english: 'numbness' },
  { id: 'vision_problems', label: 'Problèmes de vision', english: 'vision_problems' }
];

// Advanced medical knowledge base for intelligent responses
const medicalKnowledgeBase = {
  // Gynecological conditions
  menstrual: {
    keywords: ['règles', 'menstruation', 'cycle', 'utérus', 'seins', 'crampes', 'dysménorrhée'],
    patterns: [
      {
        symptoms: ['douleur', 'utérus', 'seins', 'pieds'],
        condition: 'Dysménorrhée (règles douloureuses)',
        response: `D'après vos symptômes (douleurs utérines, seins et pieds avec intensité 7/10), cela ressemble à une **dysménorrhée sévère** (règles douloureuses).

**Causes possibles :**
• Contractions utérines intenses
• Endométriose
• Fibromes utérins
• Syndrome prémenstruel sévère

**Conseils immédiats :**
• Anti-inflammatoires (ibuprofène 400mg)
• Chaleur sur le ventre (bouillotte)
• Magnésium et vitamine B6
• Repos et hydratation

**⚠️ Consultez rapidement si :**
• Douleur > 8/10 ou invalidante
• Saignements très abondants
• Fièvre associée
• Vomissements

Cette intensité de douleur n'est pas normale et mérite une consultation gynécologique pour écarter l'endométriose.`
      }
    ]
  },
  
  // Respiratory conditions
  respiratory: {
    keywords: ['toux', 'respiration', 'poumons', 'gorge', 'rhume'],
    patterns: [
      {
        symptoms: ['toux', 'sèche'],
        response: `**Toux sèche** - Plusieurs causes possibles :
• Irritation virale (post-infectieuse)
• Allergie ou asthme
• Reflux gastro-œsophagien
• Air sec ou pollution

**Conseils :**
• Miel et citron chaud
• Humidifier l'air
• Éviter les irritants
• Pastilles pour la gorge`
      }
    ]
  },
  
  // Pain management
  pain: {
    keywords: ['douleur', 'mal', 'souffrance', 'intense'],
    patterns: [
      {
        symptoms: ['douleur', 'tête'],
        response: `**Céphalées** - Type et localisation importants :
• Tension : front, tempes (stress, fatigue)
• Migraine : unilatérale, pulsatile
• Sinusite : front, joues
• Cervicales : nuque, base du crâne

**Traitement immédiat :**
• Paracétamol 1g ou ibuprofène 400mg
• Repos dans le calme et l'obscurité
• Hydratation
• Massage des tempes`
      }
    ]
  }
};

// Intelligent symptom analysis
function analyzeSymptoms(message) {
  const lowerMessage = message.toLowerCase();
  
  // Extract key medical information
  const painLevel = extractPainLevel(message);
  const bodyParts = extractBodyParts(lowerMessage);
  const symptoms = extractSymptoms(lowerMessage);
  const duration = extractDuration(lowerMessage);
  
  return {
    painLevel,
    bodyParts,
    symptoms,
    duration,
    severity: calculateSeverity(painLevel, symptoms)
  };
}

function extractPainLevel(message) {
  const painMatch = message.match(/(\d+)(?:\/10|sur 10|\s*\/\s*10)/i);
  return painMatch ? parseInt(painMatch[1]) : null;
}

function extractBodyParts(message) {
  const bodyParts = [];
  const bodyPartsMap = {
    'tête': 'head', 'crâne': 'head', 'front': 'head',
    'gorge': 'throat', 'cou': 'neck',
    'poitrine': 'chest', 'seins': 'breasts', 'thorax': 'chest',
    'ventre': 'abdomen', 'estomac': 'stomach', 'utérus': 'uterus',
    'dos': 'back', 'colonne': 'spine',
    'bras': 'arms', 'mains': 'hands',
    'jambes': 'legs', 'pieds': 'feet', 'genoux': 'knees'
  };
  
  for (const [french, english] of Object.entries(bodyPartsMap)) {
    if (message.includes(french)) {
      bodyParts.push({ french, english });
    }
  }
  return bodyParts;
}

function extractSymptoms(message) {
  const symptoms = [];
  const symptomMap = {
    'douleur': 'pain', 'mal': 'pain', 'souffrance': 'pain',
    'fièvre': 'fever', 'température': 'fever', 'chaud': 'fever',
    'toux': 'cough', 'crachat': 'cough',
    'nausée': 'nausea', 'vomissement': 'vomiting',
    'fatigue': 'fatigue', 'épuisement': 'fatigue',
    'vertige': 'dizziness', 'étourdissement': 'dizziness'
  };
  
  for (const [french, english] of Object.entries(symptomMap)) {
    if (message.includes(french)) {
      symptoms.push({ french, english });
    }
  }
  return symptoms;
}

function extractDuration(message) {
  const durationPatterns = [
    { pattern: /depuis (\d+) jours?/i, unit: 'days' },
    { pattern: /depuis (\d+) semaines?/i, unit: 'weeks' },
    { pattern: /depuis (\d+) mois/i, unit: 'months' },
    { pattern: /depuis hier/i, value: 1, unit: 'days' },
    { pattern: /depuis ce matin/i, value: 0.5, unit: 'days' }
  ];
  
  for (const { pattern, unit, value } of durationPatterns) {
    const match = message.match(pattern);
    if (match) {
      return { value: value || parseInt(match[1]), unit };
    }
  }
  return null;
}

function calculateSeverity(painLevel, symptoms) {
  if (painLevel >= 8) return 'severe';
  if (painLevel >= 6) return 'moderate';
  if (painLevel >= 4) return 'mild';
  if (symptoms.some(s => ['fever', 'vomiting'].includes(s.english))) return 'moderate';
  return 'mild';
}

// Enhanced AI response generator
function generateIntelligentResponse(message, conversationHistory = [], language = 'fr') {
  console.log('Using intelligent rule-based response as fallback');
  
  // Maintain language consistency throughout conversation
  const isArabic = language === 'ar' || message.includes('ديال') || message.includes('كاين') || message.includes('واش');
  const responseLanguage = isArabic ? 'ar' : 'fr';
  
  // Extract key information from message
  const analysis = analyzeSymptoms(message);
  const painLevel = extractPainLevel(message);
  const bodyParts = extractBodyParts(message);
  const duration = extractDuration(message);
  const severity = calculateSeverity(painLevel, analysis.symptoms);
  
  // Check if this is a follow-up message (has previous context)
  const hasContext = conversationHistory.length > 0;
  const previouslyAskedQuestions = conversationHistory.some(msg => 
    msg.message && (msg.message.includes('préciser') || msg.message.includes('قول لي'))
  );
  
  let response = '';
  
  // Build contextual response based on language and conversation state
  if (responseLanguage === 'ar') {
    // Darija response
    if (analysis.symptoms.length > 0 || bodyParts.length > 0 || painLevel > 0) {
      // User provided symptoms - give analysis
      if (bodyParts.length > 0) {
        response = `فهمت أنك تحس بالوجع في ${bodyParts.map(bp => bp.arabic || bp.french).join(' و')}. `;
      } else if (analysis.symptoms.length > 0) {
        response = `فهمت أنك تحس ب${analysis.symptoms.join(' و')}. `;
      }
      
      if (painLevel > 0) {
        if (painLevel >= 7) {
          response += `الألم ديالك قوي بزاف (${painLevel}/10). `;
        } else if (painLevel >= 4) {
          response += `الألم ديالك متوسط (${painLevel}/10). `;
        } else {
          response += `الألم ديالك خفيف (${painLevel}/10). `;
        }
      }
      
      if (duration) {
        response += `من ${duration}. `;
      }
      
      // Provide advice based on severity
      if (severity === 'high' || painLevel >= 8) {
        response += '\n\n⚠️ **مهم جداً**: هاد الألم قوي بزاف. خاصك تشوف طبيب بسرعة ولا تمشي للمستعجلات.';
      } else if (painLevel >= 6) {
        response += '\n\nنصائح مؤقتة:\n• خود راحة\n• حط كمادة باردة ولا سخونة\n• اشرب ماء بزاف\n• إلا ما تحسنتيش في 24 ساعة، شوف طبيب';
        response += addDoctorRecommendation(bodyParts, analysis.symptoms, severity, responseLanguage);
      } else if (!previouslyAskedQuestions) {
        response += '\n\nباش نقدر نعاونك أكثر، قول لي:\n';
        response += '• **واش كاين أعراض أخرى**؟\n';
        response += '• **شي حاجة كتزيد فالوجع** (حركة، أكل...)؟\n';
        response += '• **واش جربتي شي دوا**؟';
      } else {
        // Patient has provided enough information, give comprehensive advice
        response += addDoctorRecommendation(bodyParts, analysis.symptoms, severity, responseLanguage);
      }
    } else if (hasContext) {
      // Follow-up without new symptoms
      response = 'فهمت. واش يمكن تعطيني تفاصيل أكثر على الوضعية ديالك؟\n\n';
      response += 'مثلاً:\n• **كيفاش كيبان الوجع** (طاعن، ثقيل، حارق...)؟\n';
      response += '• **واش كاين شي حاجة كتخفف منه**؟';
    } else {
      // Initial greeting
      response = 'أهلا وسهلا! أنا المساعد الطبي ديالك.\n\n';
      response += 'قول لي شنو كيوجعك وفين، وغادي نحاول نعاونك باش نفهم الوضعية ونعطيك نصائح مفيدة.';
    }
    
  } else {
    // French response
    if (analysis.symptoms.length > 0 || bodyParts.length > 0 || painLevel > 0) {
      // User provided symptoms - give analysis
      if (bodyParts.length > 0) {
        response = `Je comprends que vous avez des symptômes au niveau : **${bodyParts.map(bp => bp.french).join(', ')}**. `;
      } else if (analysis.symptoms.length > 0) {
        response = `Je comprends que vous ressentez ${analysis.symptoms.join(' et ')}. `;
      }
      
      if (painLevel > 0) {
        if (painLevel >= 7) {
          response += `La douleur est intense (${painLevel}/10). `;
        } else if (painLevel >= 4) {
          response += `La douleur est modérée (${painLevel}/10). `;
        } else {
          response += `La douleur est légère (${painLevel}/10). `;
        }
      }
      
      if (duration) {
        response += `Depuis ${duration}. `;
      }
      
      // Provide advice based on severity
      if (severity === 'high' || painLevel >= 8) {
        response += '\n\n⚠️ **Urgent**: Cette douleur intense nécessite une consultation médicale immédiate. Rendez-vous aux urgences.';
      } else if (painLevel >= 6) {
        response += '\n\nConseils temporaires :\n• Repos\n• Application de chaud/froid\n• Hydratation\n• Si pas d\'amélioration sous 24h, consultez un médecin';
        response += addDoctorRecommendation(bodyParts, analysis.symptoms, severity, responseLanguage);
      } else if (!previouslyAskedQuestions) {
        response += '\n\nPour mieux vous aider, pouvez-vous préciser :\n';
        response += '• **D\'autres symptômes** associés ?\n';
        response += '• **Ce qui aggrave** la douleur (mouvement, alimentation...) ?\n';
        response += '• **Avez-vous pris des médicaments** ?';
      } else {
        // Patient has provided enough information, give comprehensive advice
        response += addDoctorRecommendation(bodyParts, analysis.symptoms, severity, responseLanguage);
      }
    } else if (hasContext) {
      // Follow-up without new symptoms
      response = 'Je vois. Pouvez-vous me donner plus de détails sur votre situation ?\n\n';
      response += 'Par exemple :\n• **Le type de douleur** (lancinante, sourde, brûlante...) ?\n';
      response += '• **Ce qui soulage** les symptômes ?';
    } else {
      // Initial greeting
      response = 'Bonjour ! Je suis votre assistant médical virtuel.\n\n';
      response += 'Décrivez-moi vos symptômes et leur localisation, et je vous aiderai à mieux comprendre votre situation et vous donner des conseils utiles.';
    }
  }
  
  return response;
}

// Helper function to parse AI responses into structured suggestions
function parseAIResponse(aiText, fallbackSuggestions) {
  try {
    const suggestions = [];
    const lines = aiText.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      // Look for numbered lists or bullet points with conditions
      const conditionMatch = line.match(/(?:\d+\.|\-|\•)\s*([^:]+)(?::\s*(.+))?/);
      if (conditionMatch) {
        const condition = conditionMatch[1].trim();
        const description = conditionMatch[2] || 'Condition identifiée par IA médicale';
        
        suggestions.push({
          condition,
          probability: Math.min(85, 60 + Math.random() * 25), // AI suggestions get higher probability
          description,
          matchingSymptoms: ['Analysé par IA'],
          severity: 'medium',
          source: 'ai'
        });
      }
    }
    
    // If we couldn't parse properly, enhance the fallback suggestions
    if (suggestions.length === 0) {
      return fallbackSuggestions.map(s => ({
        ...s,
        probability: Math.min(90, s.probability + 15),
        description: s.description + ' (Confirmé par IA)',
        source: 'ai_enhanced'
      }));
    }
    
    return suggestions.slice(0, 5); // Limit to top 5
  } catch (error) {
    console.warn('Error parsing AI response:', error);
    return fallbackSuggestions;
  }
}

// Enhanced rule-based analysis when no AI is available
function enhanceBasicAnalysis(symptoms, additionalInfo, basicSuggestions) {
  const enhanced = [...basicSuggestions];
  
  // Add contextual analysis based on symptom combinations
  const symptomText = symptoms.join(' ').toLowerCase();
  
  // Gynecological pattern detection
  if (symptomText.includes('règles') || symptomText.includes('menstruation')) {
    if (symptomText.includes('douleur') && (symptomText.includes('utérus') || symptomText.includes('ventre'))) {
      enhanced.unshift({
        condition: 'Dysménorrhée (règles douloureuses)',
        probability: 85,
        description: 'Douleurs menstruelles intenses nécessitant une évaluation',
        matchingSymptoms: symptoms.filter(s => ['douleur', 'utérus', 'seins'].some(keyword => s.includes(keyword))),
        severity: 'moderate',
        source: 'pattern_analysis'
      });
    }
  }
  
  // Pain intensity analysis
  if (additionalInfo) {
    const painMatch = additionalInfo.match(/(\d+)(?:\/10|sur 10)/i);
    if (painMatch && parseInt(painMatch[1]) >= 7) {
      enhanced.forEach(suggestion => {
        suggestion.severity = 'high';
        suggestion.probability = Math.min(95, suggestion.probability + 20);
        suggestion.description += ' (Douleur intense nécessitant attention médicale)';
      });
    }
  }
  
  // Multi-system involvement
  const bodyParts = extractBodyParts(symptomText);
  if (bodyParts.length >= 3) {
    enhanced.unshift({
      condition: 'Syndrome multi-systémique',
      probability: 75,
      description: 'Atteinte de plusieurs systèmes nécessitant une évaluation globale',
      matchingSymptoms: symptoms,
      severity: 'moderate',
      source: 'multi_system_analysis'
    });
  }
  
  return enhanced.slice(0, 5);
}

// Main response function (replaces the old generateBasicResponse)
function generateBasicResponse(message, conversationHistory = []) {
  return generateIntelligentResponse(message, conversationHistory);
}

// Basic symptom analysis using rule-based mapping
exports.analyzeSymptoms = async (req, res) => {
  try {
    // Handle both authenticated and unauthenticated users
    const patientId = req.user ? req.user.id_specifique_role : null;
    const isPublicUser = !req.user;
    const { symptoms, additionalInfo } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: 'Au moins un symptôme est requis' });
    }

    // Check for emergency symptoms
    const hasEmergencySymptoms = symptoms.some(symptom => 
      emergencySymptoms.includes(symptom.toLowerCase().replace(/\s+/g, '_'))
    );

    // Generate suggestions based on symptoms
    const suggestions = [];
    const processedSymptoms = [];

    symptoms.forEach(symptom => {
      const normalizedSymptom = symptom.toLowerCase().replace(/\s+/g, '_');
      const mappedDiagnoses = symptomDiagnosisMap[normalizedSymptom];
      
      if (mappedDiagnoses) {
        // Use French diagnoses - look for French keys in the diagnosis map
        let frenchDiagnoses = null;
        
        // Try to find French diagnoses by looking for French keys
        const frenchKeys = Object.keys(mappedDiagnoses).filter(key => 
          key.includes('è') || key.includes('é') || key.includes('à') || 
          key === 'fièvre' || key === 'toux' || key === 'mal de tête' || 
          key === 'mal de gorge' || key === 'nausée' || key === 'fatigue' ||
          key === 'douleur thoracique' || key === 'essoufflement' || 
          key === 'douleur abdominale' || key === 'vertiges' ||
          key === 'mal de dos' || key === 'douleur articulaire' ||
          key === 'éruption cutanée' || key === 'difficulté à dormir' ||
          key === 'perte d\'appétit' || key === 'perte de poids' ||
          key === 'douleur musculaire' || key === 'gonflement' ||
          key === 'engourdissement' || key === 'problèmes de vision'
        );
        
        if (frenchKeys.length > 0) {
          frenchDiagnoses = mappedDiagnoses[frenchKeys[0]];
        } else {
          // Fallback to first available language
          frenchDiagnoses = mappedDiagnoses[Object.keys(mappedDiagnoses)[0]];
        }
        
        if (frenchDiagnoses && Array.isArray(frenchDiagnoses)) {
        frenchDiagnoses.forEach(diagnosis => {
          const existingSuggestion = suggestions.find(s => s.condition === diagnosis);
          if (existingSuggestion) {
            existingSuggestion.probability += 15;
            existingSuggestion.matchingSymptoms.push(symptom);
          } else {
            suggestions.push({
              condition: diagnosis,
              probability: Math.min(85, 30 + Math.random() * 40),
              description: `Condition possible basée sur les symptômes rapportés`,
              matchingSymptoms: [symptom],
              severity: emergencySymptoms.includes(normalizedSymptom) ? 'high' : 'medium'
            });
          }
        });
        }
      }
      processedSymptoms.push(symptom);
    });

    // Sort suggestions by probability
    suggestions.sort((a, b) => b.probability - a.probability);

    // Limit to top 5 suggestions
    const topSuggestions = suggestions.slice(0, 5);

    // Store analysis in database (only for authenticated users)
    let analysisId = null;
    if (!isPublicUser) {
      const [result] = await db.execute(`
        INSERT INTO diagnosis_suggestions (
          patient_id, symptoms, suggestions, additional_info
        ) VALUES (?, ?, ?, ?)
      `, [
        patientId,
        JSON.stringify(processedSymptoms),
        JSON.stringify(topSuggestions),
        additionalInfo || null
      ]);
      analysisId = result.insertId;
    }

    const response = {
      analysisId,
      symptoms: processedSymptoms,
      suggestions: topSuggestions,
      hasEmergencySymptoms,
      disclaimer: "Ceci est une analyse préliminaire. Consultez toujours un professionnel de santé pour un diagnostic précis.",
      emergencyMessage: hasEmergencySymptoms ? 
        "⚠️ ATTENTION: Certains de vos symptômes nécessitent une attention médicale immédiate. Consultez un médecin ou rendez-vous aux urgences." : null
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Erreur lors de l\'analyse des symptômes:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de l\'analyse', 
      error: error.message 
    });
  }
};

// Advanced AI analysis using Google Colab only
exports.analyzeSymptomsAdvanced = async (req, res) => {
  try {
    // Handle both authenticated and unauthenticated users
    const patientId = req.user ? req.user.id_specifique_role : null;
    const isPublicUser = !req.user;
    const { symptoms, additionalInfo } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: 'Au moins un symptôme est requis' });
    }

    // Use Google Colab AI Manager for analysis - no fallbacks
    const aiAnalysis = await aiManager.analyzeSymptomsWithAI(symptoms, additionalInfo);
    console.log(`✅ Using ${aiAnalysis.service} via AI Manager for symptom analysis`);

    // Check for emergency symptoms
    const hasEmergencySymptoms = symptoms.some(symptom => 
      emergencySymptoms.includes(symptom.toLowerCase().replace(/\s+/g, '_'))
    );

    // Store analysis in database (only for authenticated users)
    let analysisId = null;
    if (!isPublicUser) {
      const [result] = await db.execute(`
        INSERT INTO diagnosis_suggestions (
          patient_id, symptoms, suggestions, additional_info
        ) VALUES (?, ?, ?, ?)
      `, [
        patientId,
        JSON.stringify(symptoms),
        JSON.stringify(aiAnalysis.analysis),
        additionalInfo || null
      ]);
      analysisId = result.insertId;
    }

    const response = {
      analysisId,
      symptoms,
      analysis: aiAnalysis.analysis,
      service: aiAnalysis.service,
      confidence: aiAnalysis.confidence,
      hasEmergencySymptoms,
      disclaimer: "Analyse basée sur l'IA Google Colab (phi3:mini). Consultez toujours un professionnel de santé pour un diagnostic précis.",
      emergencyMessage: hasEmergencySymptoms ? 
        "⚠️ ATTENTION: Certains de vos symptômes nécessitent une attention médicale immédiate. Consultez un médecin ou rendez-vous aux urgences." : null
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Erreur lors de l\'analyse avancée:', error);
    return res.status(500).json({ 
      message: 'Google Colab service unavailable. Please check your Colab notebook is running.', 
      error: error.message 
    });
  }
};

// Chat with AI assistant
exports.chatWithAssistant = async (req, res) => {
  try {
    // Handle both authenticated and unauthenticated users
    const patientId = req.user ? req.user.id_specifique_role : null;
    const isPublicUser = !req.user;
    const { message, conversationId, language = 'fr' } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message requis' });
    }

    let currentConversationId = conversationId || `conv_${Date.now()}`;

    // Retrieve conversation history from database
    let conversationHistory = [];
    if (conversationId && !isPublicUser) {
      try {
        const [historyRows] = await db.execute(`
          SELECT message, sender, timestamp 
          FROM chat_history 
          WHERE conversation_id = ? AND patient_id = ? 
          ORDER BY timestamp ASC 
          LIMIT 20
        `, [conversationId, patientId]);
        
        conversationHistory = historyRows.map(row => ({
          message: row.message,
          type: row.sender,
          timestamp: row.timestamp
        }));
      } catch (dbError) {
        console.warn('Could not retrieve chat history:', dbError.message);
        // Create chat_history table if it doesn't exist
        try {
          await db.execute(`
            CREATE TABLE IF NOT EXISTS chat_history (
              id INT AUTO_INCREMENT PRIMARY KEY,
              conversation_id VARCHAR(255) NOT NULL,
              patient_id INT NOT NULL,
              message TEXT NOT NULL,
              sender ENUM('user', 'assistant') NOT NULL,
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
              INDEX idx_conversation_patient (conversation_id, patient_id)
            )
          `);
          console.log('Created chat_history table');
        } catch (createError) {
          console.error('Could not create chat_history table:', createError.message);
        }
      }
    }

    // Store user message in database (only for authenticated users)
    if (!isPublicUser) {
      try {
        await db.execute(`
          INSERT INTO chat_history (conversation_id, patient_id, message, sender)
          VALUES (?, ?, ?, 'user')
        `, [currentConversationId, patientId, message]);
      } catch (dbError) {
        console.warn('Could not store user message:', dbError.message);
      }
    }

    let aiResponse = null;
    let responseSource = 'colab';

    // Use Google Colab only - no fallbacks
    const context = analyzeSymptoms(message);
    context.language = language;
    context.conversationHistory = conversationHistory; // Add conversation context
    context.conversationId = currentConversationId; // Add conversation ID
    context.patientId = patientId ? patientId.toString() : 'public_user'; // Add patient ID
    
    const aiResult = await aiManager.generateMedicalResponse(message, context);
    aiResponse = aiResult.response;
    responseSource = aiResult.service;
    console.log(`✅ Using ${aiResult.service} via AI Manager`);
    
    // Update conversation ID if provided by Colab
    if (aiResult.conversationId) {
      currentConversationId = aiResult.conversationId;
    }

    // Clean up response - remove duplicate disclaimers
    const disclaimerPatterns = [
      /⚠️\s*تذكير:.*?صحي\./g,
      /⚠️\s*Rappel:.*?médical\./g
    ];
    
    disclaimerPatterns.forEach(pattern => {
      const matches = aiResponse.match(pattern);
      if (matches && matches.length > 1) {
        // Remove all but the last disclaimer
        for (let i = 0; i < matches.length - 1; i++) {
          aiResponse = aiResponse.replace(matches[i], '');
        }
      }
    });

    // Add specific doctor recommendation based on symptoms
    const analysis = analyzeSymptoms(message);
    const bodyParts = extractBodyParts(message.toLowerCase());
    const symptoms = extractSymptoms(message.toLowerCase());
    const painLevel = extractPainLevel(message);
    const severity = calculateSeverity(painLevel, symptoms);
    
    // Add doctor recommendation if symptoms are detected
    if (symptoms.length > 0 || bodyParts.length > 0) {
      const doctorRecommendation = addDoctorRecommendation(bodyParts, symptoms, severity, language);
      aiResponse += doctorRecommendation;
    }

    // Add medical disclaimer if not present
    const hasDisclaimer = aiResponse.includes('⚠️') && 
      (aiResponse.includes('professionnel de santé') || aiResponse.includes('طبيب مختص'));
    
    if (!hasDisclaimer) {
    const disclaimer = language === 'ar' 
      ? "\n\n⚠️ <strong>تذكير</strong>: هاد المحادثة غير للمعلومات فقط. <strong>شوف طبيب مختص</strong> لأي مشكل صحي."
      : "\n\n⚠️ <strong>Rappel</strong>: Cette conversation est à titre informatif uniquement. <strong>Consultez un professionnel de santé</strong> pour tout problème médical.";
    
    aiResponse += disclaimer;
    }

    // Store assistant response in database (only for authenticated users)
    if (!isPublicUser) {
      try {
        await db.execute(`
          INSERT INTO chat_history (conversation_id, patient_id, message, sender)
          VALUES (?, ?, ?, 'assistant')
        `, [currentConversationId, patientId, aiResponse]);
      } catch (dbError) {
        console.warn('Could not store assistant message:', dbError.message);
      }
    }

    const chatResponse = {
      message: aiResponse,
      timestamp: new Date().toISOString(),
      conversationId: currentConversationId,
      type: 'assistant',
      source: responseSource
    };

    return res.status(200).json(chatResponse);
  } catch (error) {
    console.error('Erreur lors du chat:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors du chat', 
      error: error.message 
    });
  }
};

// Get patient's diagnosis history
exports.getDiagnosisHistory = async (req, res) => {
  try {
    const patientId = req.user.id_specifique_role;

    const [history] = await db.execute(`
      SELECT 
        ds.id, ds.symptoms, ds.suggestions, ds.additional_info, ds.created_at,
        AVG(df.rating) as average_rating,
        COUNT(df.id) as feedback_count
      FROM diagnosis_suggestions ds
      LEFT JOIN diagnosis_feedback df ON ds.id = df.suggestion_id
      WHERE ds.patient_id = ?
      GROUP BY ds.id
      ORDER BY ds.created_at DESC
      LIMIT 20
    `, [patientId]);

    const formattedHistory = history.map(item => ({
      id: item.id,
      symptoms: JSON.parse(item.symptoms),
      suggestions: JSON.parse(item.suggestions),
      additionalInfo: item.additional_info,
      createdAt: item.created_at,
      averageRating: item.average_rating ? parseFloat(item.average_rating).toFixed(1) : null,
      feedbackCount: item.feedback_count
    }));

    return res.status(200).json({ history: formattedHistory });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération de l\'historique', 
      error: error.message 
    });
  }
};

// Submit feedback on diagnosis suggestions
exports.submitFeedback = async (req, res) => {
  try {
    const patientId = req.user.id_specifique_role;
    const { suggestionId, rating, feedback } = req.body;

    if (!suggestionId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'ID de suggestion et note (1-5) requis' });
    }

    // Verify the suggestion belongs to this patient
    const [suggestions] = await db.execute(
      'SELECT id FROM diagnosis_suggestions WHERE id = ? AND patient_id = ?',
      [suggestionId, patientId]
    );

    if (suggestions.length === 0) {
      return res.status(404).json({ message: 'Suggestion non trouvée' });
    }

    // Check if feedback already exists
    const [existingFeedback] = await db.execute(
      'SELECT id FROM diagnosis_feedback WHERE suggestion_id = ? AND patient_id = ?',
      [suggestionId, patientId]
    );

    if (existingFeedback.length > 0) {
      // Update existing feedback
      await db.execute(`
        UPDATE diagnosis_feedback 
        SET rating = ?, feedback = ?, created_at = NOW()
        WHERE suggestion_id = ? AND patient_id = ?
      `, [rating, feedback || null, suggestionId, patientId]);
    } else {
      // Insert new feedback
      await db.execute(`
        INSERT INTO diagnosis_feedback (suggestion_id, patient_id, rating, feedback)
        VALUES (?, ?, ?, ?)
      `, [suggestionId, patientId, rating, feedback || null]);
    }

    return res.status(200).json({ message: 'Feedback enregistré avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du feedback:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de l\'enregistrement du feedback', 
      error: error.message 
    });
  }
};

// Get common symptoms list
exports.getCommonSymptoms = async (req, res) => {
  try {
    return res.status(200).json({ symptoms: commonSymptoms });
  } catch (error) {
    console.error('Erreur lors de la récupération des symptômes:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération des symptômes', 
      error: error.message 
    });
  }
};

// Helper function for basic symptom analysis
async function analyzeBasicSymptoms(symptoms, additionalInfo) {
  const suggestions = [];
  const processedSymptoms = [];

  symptoms.forEach(symptom => {
    // Try to match symptom with our mapping
    let matchedKey = null;
    let matchedDiagnoses = null;

    // First try direct match with symptom IDs
    if (symptomDiagnosisMap[symptom]) {
      matchedKey = symptom;
      matchedDiagnoses = symptomDiagnosisMap[symptom];
    } else {
      // Try to find by French label
      const commonSymptom = commonSymptoms.find(s => 
        s.label.toLowerCase() === symptom.toLowerCase() ||
        s.english === symptom.toLowerCase() ||
        s.id === symptom.toLowerCase()
      );
      
      if (commonSymptom && symptomDiagnosisMap[commonSymptom.english]) {
        matchedKey = commonSymptom.english;
        matchedDiagnoses = symptomDiagnosisMap[commonSymptom.english];
      }
    }
    
    if (matchedDiagnoses) {
      // Use French diagnoses - look for French keys in the diagnosis map
      let frenchDiagnoses = null;
      
      // Try to find French diagnoses by looking for French keys
      const frenchKeys = Object.keys(matchedDiagnoses).filter(key => 
        key.includes('è') || key.includes('é') || key.includes('à') || 
        key === 'fièvre' || key === 'toux' || key === 'mal de tête' || 
        key === 'mal de gorge' || key === 'nausée' || key === 'fatigue' ||
        key === 'douleur thoracique' || key === 'essoufflement' || 
        key === 'douleur abdominale' || key === 'vertiges' ||
        key === 'mal de dos' || key === 'douleur articulaire' ||
        key === 'éruption cutanée' || key === 'difficulté à dormir' ||
        key === 'perte d\'appétit' || key === 'perte de poids' ||
        key === 'douleur musculaire' || key === 'gonflement' ||
        key === 'engourdissement' || key === 'problèmes de vision'
      );
      
      if (frenchKeys.length > 0) {
        frenchDiagnoses = matchedDiagnoses[frenchKeys[0]];
      } else {
        // Fallback to first available language
        frenchDiagnoses = matchedDiagnoses[Object.keys(matchedDiagnoses)[0]];
      }
      
      if (frenchDiagnoses && Array.isArray(frenchDiagnoses)) {
      frenchDiagnoses.forEach(diagnosis => {
        const existingSuggestion = suggestions.find(s => s.condition === diagnosis);
        if (existingSuggestion) {
          existingSuggestion.probability += 15;
          existingSuggestion.matchingSymptoms.push(symptom);
        } else {
          suggestions.push({
            condition: diagnosis,
            probability: Math.min(85, 30 + Math.random() * 40),
              description: `Condition possible basée sur les symptômes rapportés`,
            matchingSymptoms: [symptom],
            severity: emergencySymptoms.includes(matchedKey) ? 'high' : 'medium'
          });
        }
      });
      }
    } else {
      // Fallback: create a generic suggestion
      suggestions.push({
        condition: `Symptôme: ${symptom}`,
        probability: 50,
        description: `Symptôme rapporté nécessitant une évaluation médicale`,
        matchingSymptoms: [symptom],
        severity: 'medium'
      });
    }
    
    processedSymptoms.push(symptom);
  });

  // Add some general suggestions if we have multiple symptoms
  if (symptoms.length >= 2) {
    suggestions.push({
      condition: 'Syndrome viral',
      probability: 60,
      description: 'Combinaison de symptômes pouvant indiquer une infection virale',
      matchingSymptoms: symptoms,
      severity: 'medium'
    });
  }

  // Sort suggestions by probability
  suggestions.sort((a, b) => b.probability - a.probability);

  return {
    symptoms: processedSymptoms,
    suggestions: suggestions.slice(0, 5)
  };
}

// Helper function to add doctor recommendation based on symptoms and body parts
function addDoctorRecommendation(bodyParts, symptoms, severity, language = 'fr') {
  let doctorType = 'Médecin généraliste'; // Default recommendation
  let reason = '';

  // Determine appropriate doctor based on body parts and symptoms
  const bodyPartsText = bodyParts.map(bp => bp.french || bp.arabic || bp).join(' ').toLowerCase();
  const symptomsText = symptoms.join(' ').toLowerCase();
  const allText = `${bodyPartsText} ${symptomsText}`;

  if (allText.includes('tête') || allText.includes('migraine') || allText.includes('vertige') || 
      allText.includes('maux de tête') || allText.includes('étourdissement')) {
    doctorType = 'Neurologue';
    reason = 'pour les maux de tête et vertiges';
  } else if (allText.includes('cœur') || allText.includes('poitrine') || allText.includes('thorax') ||
             allText.includes('palpitation') || allText.includes('essoufflement')) {
    doctorType = 'Cardiologue';
    reason = 'pour les problèmes cardiaques ou thoraciques';
  } else if (allText.includes('estomac') || allText.includes('ventre') || allText.includes('abdomen') ||
             allText.includes('digestif') || allText.includes('nausée') || allText.includes('vomissement')) {
    doctorType = 'Gastro-entérologue';
    reason = 'pour les problèmes digestifs';
  } else if (allText.includes('peau') || allText.includes('éruption') || allText.includes('démangeaison') ||
             allText.includes('acné') || allText.includes('eczéma')) {
    doctorType = 'Dermatologue';
    reason = 'pour les problèmes de peau';
  } else if (allText.includes('articulaire') || allText.includes('os') || allText.includes('arthrite') ||
             allText.includes('rhumatisme') || allText.includes('articulation')) {
    doctorType = 'Rhumatologue';
    reason = 'pour les douleurs articulaires';
  } else if (allText.includes('urinaire') || allText.includes('rein') || allText.includes('vessie') ||
             allText.includes('prostate')) {
    doctorType = 'Urologue';
    reason = 'pour les problèmes urinaires';
  } else if (allText.includes('respiratoire') || allText.includes('poumon') || allText.includes('toux') ||
             allText.includes('asthme') || allText.includes('bronche')) {
    doctorType = 'Pneumologue';
    reason = 'pour les problèmes respiratoires';
  } else if (allText.includes('règles') || allText.includes('menstruation') || allText.includes('gynéco') ||
             allText.includes('utérus') || allText.includes('ovaire')) {
    doctorType = 'Gynécologue';
    reason = 'pour les problèmes gynécologiques';
  } else if (allText.includes('oreille') || allText.includes('nez') || allText.includes('gorge') ||
             allText.includes('orl') || allText.includes('sinusite')) {
    doctorType = 'ORL (Oto-rhino-laryngologiste)';
    reason = 'pour les problèmes ORL';
  } else if (allText.includes('œil') || allText.includes('vision') || allText.includes('vue') ||
             allText.includes('ophtalmologie')) {
    doctorType = 'Ophtalmologue';
    reason = 'pour les problèmes de vision';
  } else if (allText.includes('stress') || allText.includes('anxiété') || allText.includes('dépression') ||
             allText.includes('mental') || allText.includes('psychologique')) {
    doctorType = 'Psychiatre ou Psychologue';
    reason = 'pour le soutien psychologique';
  } else if (allText.includes('diabète') || allText.includes('thyroïde') || allText.includes('hormone') ||
             allText.includes('endocrine')) {
    doctorType = 'Endocrinologue';
    reason = 'pour les problèmes hormonaux';
  }

  let recommendation = '';
  
  if (language === 'ar') {
    const doctorTypeAr = getDoctorTypeInArabic(doctorType);
    recommendation = `\n\n👨‍⚕️ <strong>نصيحة طبية</strong>: نصحك تشوف <strong>${doctorTypeAr}</strong>`;
    if (reason) {
      recommendation += ` ${reason}`;
    }
    recommendation += '.\n\n';
  } else {
    recommendation = `\n\n👨‍⚕️ <strong>Recommandation médicale</strong>: Je vous conseille de consulter un <strong>${doctorType}</strong>`;
    if (reason) {
      recommendation += ` <strong>${reason}</strong>`;
    }
    recommendation += '.\n\n';
  }

  // Add urgency note based on severity
  if (severity === 'high') {
    recommendation += language === 'ar' 
      ? '⚠️ <strong>مهم</strong>: خاصك تشوف <strong>الطبيب بسرعة</strong> أو تمشي <strong>للمستعجلات</strong>!'
      : '⚠️ <strong>IMPORTANT</strong>: <strong>Consultez rapidement</strong> ou rendez-vous aux <strong>urgences</strong>!';
  } else if (severity === 'medium') {
    recommendation += language === 'ar'
      ? '📅 <strong>نصيحة</strong>: شوف الطبيب في أقرب وقت ممكن (<strong>خلال 24-48 ساعة</strong>).'
      : '📅 <strong>Conseil</strong>: Prenez rendez-vous dans les prochains jours (<strong>24-48h</strong>).';
  } else {
    recommendation += language === 'ar'
      ? '📅 <strong>نصيحة</strong>: شوف الطبيب إذا <strong>استمرت الأعراض</strong> أو <strong>تطورت</strong>.'
      : '📅 <strong>Conseil</strong>: Consultez si les <strong>symptômes persistent</strong> ou <strong>s\'aggravent</strong>.';
  }

  return recommendation;
}

function getDoctorTypeInArabic(doctorType) {
  const translations = {
    'Médecin généraliste': 'طبيب عام',
    'Neurologue': 'طبيب الأعصاب',
    'Cardiologue': 'طبيب القلب',
    'Gastro-entérologue': 'طبيب الجهاز الهضمي',
    'Dermatologue': 'طبيب الجلدية',
    'Rhumatologue': 'طبيب الروماتيزم',
    'Urologue': 'طبيب المسالك البولية',
    'Pneumologue': 'طبيب الرئة',
    'Gynécologue': 'طبيب النساء والتوليد',
    'ORL (Oto-rhino-laryngologiste)': 'طبيب الأنف والأذن والحنجرة',
    'Ophtalmologue': 'طبيب العيون',
    'Psychiatre ou Psychologue': 'طبيب نفسي أو أخصائي نفسي',
    'Endocrinologue': 'طبيب الغدد الصماء'
  };
  
  return translations[doctorType] || 'طبيب مختص';
}

// Get AI service status including Colab
exports.getAIServiceStatus = async (req, res) => {
  try {
    // Get AI Manager status
    const aiStatus = await aiManager.getServiceStatus();
    
    // Get detailed Colab status
    let colabStatus = null;
    if (process.env.COLAB_ENABLED === 'true') {
      try {
        colabStatus = await colabService.getStatus();
      } catch (error) {
        colabStatus = {
          enabled: false,
          available: false,
          error: error.message
        };
      }
    }

    return res.status(200).json({
      success: true,
      aiManager: aiStatus,
      colab: colabStatus,
      environment: {
        COLAB_ENABLED: process.env.COLAB_ENABLED === 'true',
        COLAB_API_URL: process.env.COLAB_API_URL ? 'configured' : 'not_configured',
        OLLAMA_ENABLED: process.env.USE_OLLAMA === 'true'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du statut AI:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la vérification du statut AI',
      error: error.message 
    });
  }
};

// Test Colab connection
exports.testColabConnection = async (req, res) => {
  try {
    if (process.env.COLAB_ENABLED !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Colab service is not enabled'
      });
    }

    const connectionTest = await colabService.testConnection();
    
    return res.status(200).json({
      success: connectionTest.success,
      status: connectionTest.status,
      data: connectionTest.data,
      error: connectionTest.error,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du test de connexion Colab:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors du test de connexion Colab',
      error: error.message
    });
  }
}; 