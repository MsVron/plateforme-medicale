import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DiagnosisChatbot from './patient/DiagnosisChatbot';

const PatientHome = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box sx={{ mt: 4, p: 3, bgcolor: '#fff0f5', borderRadius: 2, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Espace Patient
        </Typography>
        <Typography variant="body1" paragraph>
          Bienvenue sur votre espace patient de la plateforme médicale.
        </Typography>
        <Typography variant="body1">
          Utilisez les options ci-dessous pour naviguer dans votre espace personnel.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box>
              <SearchIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Rechercher un médecin
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Trouvez un médecin par spécialité, ville ou nom et prenez rendez-vous facilement.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              endIcon={<SearchIcon />}
              onClick={() => navigate('/patient/search-doctors')}
              fullWidth
            >
              Rechercher
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box>
              <FavoriteIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Médecins favoris
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Accédez rapidement à vos médecins préférés et à leur disponibilité.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              endIcon={<FavoriteIcon />}
              onClick={() => navigate('/patient/favorites')}
              fullWidth
            >
              Voir mes favoris
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Box>
              <SmartToyIcon sx={{ fontSize: 50, mb: 2, color: 'white' }} />
              <Typography variant="h5" gutterBottom>
                Assistant IA
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.9)' }}>
                Analysez vos symptômes et obtenez des conseils médicaux préliminaires avec notre IA.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)'
                }
              }}
              size="large"
              endIcon={<SmartToyIcon />}
              onClick={() => {
                // The chatbot will appear as a floating button
                // This button can show a tooltip or open the chatbot directly
              }}
              fullWidth
            >
              Utiliser l'IA
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {/* AI Diagnosis Chatbot */}
      <DiagnosisChatbot />
    </Container>
  );
};

export default PatientHome;
