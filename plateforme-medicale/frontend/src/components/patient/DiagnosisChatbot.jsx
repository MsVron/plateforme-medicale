import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Card,
  CardContent,
  Avatar,
  Alert,
  CircularProgress,
  Fab,
  Collapse,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  Maximize as MaximizeIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  LocalHospital as MedicalIcon,
  History as HistoryIcon,
  Feedback as FeedbackIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  Add as AddIcon
} from '@mui/icons-material';
import axios from '../../services/axiosConfig';

const DiagnosisChatbot = () => {
  // Main state
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'symptoms', 'history'
  
  // Language state
  const [language, setLanguage] = useState('fr'); // 'fr' for French, 'ar' for Arabic
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  
  // Symptom analysis state
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [commonSymptoms, setCommonSymptoms] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // History state
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Feedback state
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, suggestionId: null });
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  
  // UI state
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);

  // Function to get welcome message based on language
  const getWelcomeMessage = (lang) => {
    const token = localStorage.getItem('token');
    const baseMessage = lang === 'fr' 
      ? 'Bonjour ! Je suis votre assistant médical virtuel. Je peux vous aider à analyser vos symptômes et répondre à vos questions de santé. Comment puis-je vous aider aujourd\'hui ?'
      : 'أهلا وسهلا! أنا المساعد الطبي الذكي ديالك. يمكنني نعاونك باش تحلل الأعراض ديالك ونجاوب على الأسئلة ديال الصحة. كيفاش يمكنني نعاونك اليوم؟';
    
    if (!token) {
      const guestMessage = lang === 'fr' 
        ? '\n\n💡 **Mode invité** : Vous pouvez tester l\'assistant gratuitement ! Pour sauvegarder vos conversations et accéder à l\'historique, créez un compte patient.'
        : '\n\n💡 **وضع الضيف** : يمكنك تجربة المساعد مجاناً! باش تحفظ المحادثات وتشوف التاريخ، دير حساب مريض.';
      return baseMessage + guestMessage;
    }
    
    return baseMessage;
  };

  // Function to handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Update the welcome message
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === 1 
          ? { ...msg, message: getWelcomeMessage(newLanguage) }
          : msg
      )
    );
  };

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'assistant',
          message: getWelcomeMessage(language),
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [language]);

  useEffect(() => {
    if (isOpen && currentView === 'symptoms') {
      fetchCommonSymptoms();
    }
  }, [isOpen, currentView]);

  useEffect(() => {
    if (isOpen && currentView === 'history') {
      fetchDiagnosisHistory();
    }
  }, [isOpen, currentView]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCommonSymptoms = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = token ? '/patient/diagnosis/symptoms' : '/public/diagnosis/symptoms';
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(endpoint, { headers });
      setCommonSymptoms(response.data.symptoms);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      if (error.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        setError('Accès non autorisé. Cette fonctionnalité est réservée aux patients.');
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Impossible de se connecter au serveur. Vérifiez que le serveur backend est démarré.');
      } else {
        setError('Erreur lors du chargement des symptômes');
      }
    }
  };

  const fetchDiagnosisHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // For unauthenticated users, show empty history with a message
        setDiagnosisHistory([]);
        setError('Connectez-vous pour voir votre historique de diagnostics');
        return;
      }
      
      const response = await axios.get('/patient/diagnosis/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiagnosisHistory(response.data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Erreur lors du chargement de l\'historique');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const endpoint = token ? '/patient/diagnosis/chat' : '/public/diagnosis/chat';
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(endpoint, {
        message: inputMessage,
        conversationId,
        language
      }, { headers });

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        message: response.data.message,
        timestamp: response.data.timestamp
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationId(response.data.conversationId);
      
      if (!isOpen) {
        setHasNewMessage(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMessage = language === 'fr' 
        ? 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.'
        : 'سماح لي، كاين مشكل تقني. عاود المحاولة من بعد.';
      
      if (error.response?.status === 401) {
        errorMessage = language === 'fr' 
          ? 'Session expirée. Veuillez vous reconnecter pour continuer.'
          : 'انتهت الجلسة. خاصك تدخل من جديد باش تكمل.';
      } else if (error.response?.status === 403) {
        errorMessage = language === 'fr' 
          ? 'Accès non autorisé. Cette fonctionnalité est réservée aux patients.'
          : 'ما عندكش الصلاحية. هاد الخدمة خاصة بالمرضى فقط.';
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = language === 'fr' 
          ? 'Impossible de se connecter au serveur. Vérifiez que le serveur backend est démarré.'
          : 'ما قدرناش نتصلو بالسيرفر. تأكد أن السيرفر خدام.';
      }
      
      const errorMsg = {
        id: Date.now() + 1,
        type: 'assistant',
        message: errorMessage,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => {
      const exists = prev.find(s => s.id === symptom.id);
      if (exists) {
        return prev.filter(s => s.id !== symptom.id);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleAddCustomSymptom = () => {
    if (!customSymptom.trim()) return;
    
    const newSymptom = {
      id: `custom_${Date.now()}`,
      label: customSymptom,
      english: customSymptom.toLowerCase().replace(/\s+/g, '_'),
      isCustom: true
    };
    
    setSelectedSymptoms(prev => [...prev, newSymptom]);
    setCustomSymptom('');
  };

  const handleAnalyzeSymptoms = async (advanced = false) => {
    if (selectedSymptoms.length === 0) {
      setError('Veuillez sélectionner au moins un symptôme');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const endpoint = advanced 
        ? (token ? '/patient/diagnosis/analyze-advanced' : '/public/diagnosis/analyze-advanced')
        : (token ? '/patient/diagnosis/analyze' : '/public/diagnosis/analyze');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.post(endpoint, {
        symptoms: selectedSymptoms.map(s => s.label),
        additionalInfo
      }, { headers });

      // Add analysis result to chat
      const analysisMessage = {
        id: Date.now(),
        type: 'assistant',
        message: `Analyse terminée ! J'ai identifié ${response.data.suggestions.length} conditions possibles basées sur vos symptômes.`,
        timestamp: new Date().toISOString(),
        analysisData: response.data
      };
      
      setMessages(prev => [...prev, analysisMessage]);
      setCurrentView('chat');
      
      if (!isOpen) {
        setHasNewMessage(true);
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setError('Erreur lors de l\'analyse des symptômes');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/patient/diagnosis/feedback', {
        suggestionId: feedbackDialog.suggestionId,
        rating: feedbackRating,
        feedback: feedbackComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFeedbackDialog({ open: false, suggestionId: null });
      setFeedbackRating(0);
      setFeedbackComment('');
      
      if (currentView === 'history') {
        fetchDiagnosisHistory();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Erreur lors de l\'envoi du feedback');
    }
  };

  const renderChatView = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Enhanced Messages Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          p: 2, 
          maxHeight: '420px',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { 
            background: 'rgba(0,0,0,0.05)', 
            borderRadius: '10px',
            margin: '8px'
          },
          '&::-webkit-scrollbar-thumb': { 
            background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)', 
            borderRadius: '10px',
            '&:hover': {
              background: 'linear-gradient(180deg, #5a6fd8 0%, #6a4190 100%)'
            }
          },
        }}
      >
        {messages.map((message) => (
          <Box key={message.id} sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
              gap: 2
            }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  bgcolor: message.type === 'user' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: '2px solid white'
                }}
              >
                {message.type === 'user' ? <PersonIcon /> : <BotIcon />}
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  maxWidth: '75%',
                  background: message.type === 'user' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  color: message.type === 'user' ? 'white' : 'text.primary',
                  borderRadius: message.type === 'user' ? '24px 24px 8px 24px' : '24px 24px 24px 8px',
                  boxShadow: message.type === 'user' 
                    ? '0 8px 32px rgba(102, 126, 234, 0.3)'
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  border: message.type === 'user' ? 'none' : '1px solid rgba(0,0,0,0.05)',
                  position: 'relative',
                  '&::before': message.type === 'assistant' ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '24px 24px 0 0'
                  } : {}
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.message}
                </Typography>
                
                {message.analysisData && (
                  <Box sx={{ mt: 2 }}>
                    {message.analysisData.hasEmergencySymptoms && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {message.analysisData.emergencyMessage}
                      </Alert>
                    )}
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Suggestions de diagnostic :
                    </Typography>
                    
                    {message.analysisData.suggestions.map((suggestion, index) => (
                      <Card key={index} sx={{ mb: 1, bgcolor: 'background.paper' }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" color="text.primary">
                              {suggestion.condition}
                            </Typography>
                            <Chip 
                              label={`${Math.round(suggestion.probability)}%`}
                              size="small"
                              color={suggestion.probability > 70 ? 'error' : suggestion.probability > 50 ? 'warning' : 'default'}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {suggestion.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Symptômes correspondants: {suggestion.matchingSymptoms.join(', ')}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Alert severity="info" sx={{ mt: 2 }}>
                      {message.analysisData.disclaimer}
                    </Alert>
                  </Box>
                )}
                
                <Typography variant="caption" sx={{ 
                  display: 'block', 
                  mt: 1, 
                  opacity: 0.7,
                  textAlign: message.type === 'user' ? 'right' : 'left'
                }}>
                  {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Typography>
              </Paper>
            </Box>
          </Box>
        ))}
        
        {isTyping && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ 
              width: 40, 
              height: 40, 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '2px solid white'
            }}>
              <BotIcon />
            </Avatar>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                background: 'white',
                borderRadius: '24px 24px 24px 8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '24px 24px 0 0'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1 }}>
                  L'assistant tape...
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    bgcolor: '#667eea', 
                    borderRadius: '50%', 
                    animation: 'bounce 1.4s infinite',
                    '@keyframes bounce': {
                      '0%, 80%, 100%': { transform: 'scale(0)' },
                      '40%': { transform: 'scale(1)' }
                    }
                  }} />
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    bgcolor: '#667eea', 
                    borderRadius: '50%', 
                    animation: 'bounce 1.4s infinite 0.2s',
                    '@keyframes bounce': {
                      '0%, 80%, 100%': { transform: 'scale(0)' },
                      '40%': { transform: 'scale(1)' }
                    }
                  }} />
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    bgcolor: '#667eea', 
                    borderRadius: '50%', 
                    animation: 'bounce 1.4s infinite 0.4s',
                    '@keyframes bounce': {
                      '0%, 80%, 100%': { transform: 'scale(0)' },
                      '40%': { transform: 'scale(1)' }
                    }
                  }} />
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Enhanced Input Area */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(0,0,0,0.08)',
        background: 'white',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            placeholder={language === 'fr' ? "Tapez votre message..." : "اكتب رسالتك..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            multiline
            maxRows={3}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                backgroundColor: '#f8fafc',
                border: '2px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  border: '2px solid rgba(102, 126, 234, 0.2)'
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                  border: '2px solid #667eea',
                  boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
                },
                '& fieldset': {
                  border: 'none'
                }
              },
              '& .MuiInputBase-input': {
                padding: '12px 16px',
                fontSize: '14px',
                '&::placeholder': {
                  color: '#64748b',
                  opacity: 1
                }
              }
            }}
          />
          <IconButton 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            sx={{
              width: 48,
              height: 48,
              background: inputMessage.trim() && !isTyping 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : '#e2e8f0',
              color: inputMessage.trim() && !isTyping ? 'white' : '#64748b',
              borderRadius: '50%',
              boxShadow: inputMessage.trim() && !isTyping 
                ? '0 8px 32px rgba(102, 126, 234, 0.3)'
                : 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: inputMessage.trim() && !isTyping 
                  ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                  : '#cbd5e1',
                transform: inputMessage.trim() && !isTyping ? 'translateY(-2px)' : 'none'
              },
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
          >
            <SendIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        
        {/* Quick Actions */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          mt: 1, 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {['💊 Symptômes', '🩺 Diagnostic', '📋 Historique'].map((action, index) => (
            <Chip
              key={index}
              label={action}
              size="small"
              onClick={() => {
                if (index === 0) setCurrentView('symptoms');
                else if (index === 2) setCurrentView('history');
              }}
              sx={{
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.2)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );

  const renderSymptomsView = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Analyse de Symptômes
        </Typography>
        
        {selectedSymptoms.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Symptômes sélectionnés :
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedSymptoms.map((symptom) => (
                <Chip
                  key={symptom.id}
                  label={symptom.label}
                  onDelete={() => handleSymptomToggle(symptom)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
        
        <Typography variant="subtitle2" gutterBottom>
          {language === 'fr' ? 'Symptômes courants :' : 'الأعراض الشائعة :'}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {commonSymptoms.map((symptom) => (
            <Chip
              key={symptom.id}
              label={language === 'fr' ? symptom.label : (symptom.darija || symptom.label)}
              onClick={() => handleSymptomToggle(symptom)}
              color={selectedSymptoms.find(s => s.id === symptom.id) ? 'primary' : 'default'}
              variant={selectedSymptoms.find(s => s.id === symptom.id) ? 'filled' : 'outlined'}
              clickable
            />
          ))}
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            {language === 'fr' ? 'Ajouter un symptôme personnalisé :' : 'زيادة عرض شخصي :'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder={language === 'fr' ? 'Décrivez votre symptôme' : 'وصف العرض ديالك'}
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
            />
            <IconButton onClick={handleAddCustomSymptom} disabled={!customSymptom.trim()}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder={language === 'fr' ? 'Informations supplémentaires (optionnel)' : 'معلومات إضافية (اختياري)'}
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          sx={{ mb: 3 }}
        />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
      
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Stack spacing={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleAnalyzeSymptoms(false)}
            disabled={selectedSymptoms.length === 0 || isAnalyzing}
            startIcon={isAnalyzing ? <CircularProgress size={20} /> : <PsychologyIcon />}
          >
            {isAnalyzing 
              ? (language === 'fr' ? 'Analyse en cours...' : 'التحليل جاري...')
              : (language === 'fr' ? 'Analyser (Basique)' : 'تحليل (أساسي)')
            }
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleAnalyzeSymptoms(true)}
            disabled={selectedSymptoms.length === 0 || isAnalyzing}
            startIcon={<ScienceIcon />}
          >
            {language === 'fr' ? 'Analyser (IA Avancée)' : 'تحليل (ذكي متقدم)'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  const renderHistoryView = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Historique des Analyses
        </Typography>
        
        {isLoadingHistory ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : diagnosisHistory.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
            Aucune analyse précédente
          </Typography>
        ) : (
          <Stack spacing={2}>
            {diagnosisHistory.map((analysis) => (
              <Card key={analysis.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2">
                      {new Date(analysis.createdAt).toLocaleDateString('fr-FR')}
                    </Typography>
                    {analysis.averageRating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={parseFloat(analysis.averageRating)} readOnly size="small" />
                        <Typography variant="caption">
                          ({analysis.feedbackCount})
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Symptômes: {analysis.symptoms.join(', ')}
                  </Typography>
                  
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">
                        {analysis.suggestions.length} suggestion(s) de diagnostic
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1}>
                        {analysis.suggestions.map((suggestion, index) => (
                          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">
                              {suggestion.condition}
                            </Typography>
                            <Chip 
                              label={`${Math.round(suggestion.probability)}%`}
                              size="small"
                              color={suggestion.probability > 70 ? 'error' : suggestion.probability > 50 ? 'warning' : 'default'}
                            />
                          </Box>
                        ))}
                        
                        <Button
                          size="small"
                          startIcon={<FeedbackIcon />}
                          onClick={() => setFeedbackDialog({ open: true, suggestionId: analysis.id })}
                        >
                          Donner un avis
                        </Button>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );

  if (!isOpen) {
    return (
      <Tooltip 
        title={language === 'fr' ? 'Assistant IA Médical' : 'المساعد الطبي الذكي'}
        placement="left"
      >
        <Fab
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            border: '3px solid white',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-4px) scale(1.05)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)'
            },
            '&:active': {
              transform: 'translateY(-2px) scale(1.02)'
            }
          }}
          onClick={() => setIsOpen(true)}
        >
          <Badge 
            color="error" 
            variant="dot" 
            invisible={!hasNewMessage}
            sx={{
              '& .MuiBadge-dot': {
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '2px solid white',
                animation: hasNewMessage ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', opacity: 1 },
                  '50%': { transform: 'scale(1.2)', opacity: 0.7 },
                  '100%': { transform: 'scale(1)', opacity: 1 }
                }
              }
            }}
          >
            <ChatIcon sx={{ fontSize: 32, color: 'white' }} />
          </Badge>
        </Fab>
      </Tooltip>
    );
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: isMinimized ? 320 : 420,
          height: isMinimized ? 80 : 600,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isMinimized ? 'scale(0.95)' : 'scale(1)',
          '&:hover': {
            boxShadow: '0 25px 80px rgba(0,0,0,0.2)'
          }
        }}
      >
        {/* Enhanced Header */}
        <Box
          sx={{
            p: 2.5,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: isMinimized ? 'pointer' : 'default',
            borderRadius: '24px 24px 0 0',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 72
          }}
          onClick={isMinimized ? () => setIsMinimized(false) : undefined}
        >
          {/* Background Pattern */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1, flex: 1, minWidth: 0 }}>
            <Avatar sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              width: 36, 
              height: 36,
              border: '2px solid rgba(255,255,255,0.3)',
              flexShrink: 0
            }}>
              <MedicalIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                fontSize: '1rem', 
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {language === 'fr' ? 'Assistant IA Médical' : 'المساعد الطبي الذكي'}
              </Typography>
              {!isMinimized && (
                <Typography variant="caption" sx={{ 
                  opacity: 0.9, 
                  fontSize: '0.75rem', 
                  lineHeight: 1.2,
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {language === 'fr' ? 'Votre santé, notre priorité' : 'صحتك، أولويتنا'}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, position: 'relative', zIndex: 1 }}>
            {!isMinimized && (
              <>
                <Tooltip title={language === 'fr' ? 'Chat' : 'محادثة'}>
                  <IconButton
                    size="small"
                    sx={{ 
                      color: 'white',
                      bgcolor: currentView === 'chat' ? 'rgba(255,255,255,0.2)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                      transition: 'all 0.2s ease',
                      width: 32,
                      height: 32
                    }}
                    onClick={() => setCurrentView('chat')}
                  >
                    <ChatIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={language === 'fr' ? 'Symptômes' : 'الأعراض'}>
                  <IconButton
                    size="small"
                    sx={{ 
                      color: 'white',
                      bgcolor: currentView === 'symptoms' ? 'rgba(255,255,255,0.2)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                      transition: 'all 0.2s ease',
                      width: 32,
                      height: 32
                    }}
                    onClick={() => setCurrentView('symptoms')}
                  >
                    <PsychologyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={language === 'fr' ? 'Historique' : 'التاريخ'}>
                  <IconButton
                    size="small"
                    sx={{ 
                      color: 'white',
                      bgcolor: currentView === 'history' ? 'rgba(255,255,255,0.2)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                      transition: 'all 0.2s ease',
                      width: 32,
                      height: 32
                    }}
                    onClick={() => setCurrentView('history')}
                  >
                    <HistoryIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Box sx={{ width: 1, height: 20, bgcolor: 'rgba(255,255,255,0.3)', mx: 0.25 }} />
              </>
            )}
            

            
            <Tooltip title={isMinimized ? "Agrandir" : "Réduire"}>
              <IconButton
                size="small"
                sx={{ 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  transition: 'all 0.2s ease',
                  width: 32,
                  height: 32
                }}
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <MaximizeIcon sx={{ fontSize: 16 }} /> : <MinimizeIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Fermer">
              <IconButton
                size="small"
                sx={{ 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  transition: 'all 0.2s ease',
                  width: 32,
                  height: 32
                }}
                onClick={() => setIsOpen(false)}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Content */}
        <Collapse in={!isMinimized}>
          <Box sx={{ height: 500 }}>
            {currentView === 'chat' && renderChatView()}
            {currentView === 'symptoms' && renderSymptomsView()}
            {currentView === 'history' && renderHistoryView()}
          </Box>
        </Collapse>
      </Paper>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog.open} onClose={() => setFeedbackDialog({ open: false, suggestionId: null })}>
        <DialogTitle>Évaluer l'analyse</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography component="legend">Note globale</Typography>
            <Rating
              value={feedbackRating}
              onChange={(event, newValue) => setFeedbackRating(newValue)}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Commentaire (optionnel)"
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog({ open: false, suggestionId: null })}>
            Annuler
          </Button>
          <Button onClick={handleSubmitFeedback} disabled={feedbackRating === 0}>
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export default DiagnosisChatbot;
