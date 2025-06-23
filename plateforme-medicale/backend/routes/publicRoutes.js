const express = require('express');
const router = express.Router();
const diagnosisAssistantController = require('../controllers/diagnosisAssistantController');

// Public AI Diagnosis Routes (no authentication required)
router.post(
    "/public/diagnosis/analyze",
    diagnosisAssistantController.analyzeSymptoms
);

router.post(
    "/public/diagnosis/analyze-advanced",
    diagnosisAssistantController.analyzeSymptomsAdvanced
);

router.post(
    "/public/diagnosis/chat",
    diagnosisAssistantController.chatWithAssistant
);

router.get(
    "/public/diagnosis/symptoms",
    diagnosisAssistantController.getCommonSymptoms
);

router.get(
    "/public/diagnosis/ai-status",
    diagnosisAssistantController.getAIServiceStatus
);

router.post(
    "/public/diagnosis/test-colab",
    diagnosisAssistantController.testColabConnection
);

module.exports = router; 