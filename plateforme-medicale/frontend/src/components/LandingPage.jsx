import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Fade,
  Slide,
  Zoom,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Grid,
} from "@mui/material"
import {
  Schedule as ScheduleIcon,
  Description as RecordsIcon,
  Chat as ChatIcon,
  Psychology as AIIcon,
  Medication as PrescriptionIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Star as StarIcon,
} from "@mui/icons-material"
import "../styles/Login.css"
import DiagnosisChatbot from "./patient/DiagnosisChatbot"

const LandingPage = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    // Stagger animations
    const timer1 = setTimeout(() => setAnimationStep(1), 300)
    const timer2 = setTimeout(() => setAnimationStep(2), 600)
    const timer3 = setTimeout(() => setAnimationStep(3), 900)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const features = [
    {
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      title: "Rendez-vous en ligne",
      description: "Gérez vos rendez-vous médicaux en ligne",
      color: "#4ca1af",
    },
    {
      icon: <RecordsIcon sx={{ fontSize: 40 }} />,
      title: "Dossiers médicaux",
      description: "Consultez vos dossiers médicaux",
      color: "#2c3e50",
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      title: "Communication",
      description: "Communiquez avec vos médecins",
      color: "#3a6e78",
    },
    {
      icon: <AIIcon sx={{ fontSize: 40 }} />,
      title: "IA Médicale",
      description: "Analysez vos symptômes avec notre IA",
      color: "#4ca1af",
    },
    {
      icon: <PrescriptionIcon sx={{ fontSize: 40 }} />,
      title: "Prescriptions",
      description: "Accédez à vos prescriptions et résultats",
      color: "#2c3e50",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Sécurisé",
      description: "Vos données sont protégées et sécurisées",
      color: "#3a6e78",
    },
  ]

  return (
    <Box
      sx={{
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        left: 0,
        top: 0,
      }}
    >
      {/* Medical Background Image with Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)),
            url("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />
      
      {/* Additional subtle overlay for better text readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(76, 161, 175, 0.1) 0%, rgba(44, 62, 80, 0.2) 100%)",
          zIndex: 1,
        }}
      />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            py: 8,
            minHeight: "90vh",
          }}
        >
          {/* Main Title */}
          <Fade in={true} timeout={1000}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "3.5rem", md: "5rem" },
                fontWeight: 800,
                color: "white",
                textTransform: "uppercase",
                letterSpacing: 3,
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
                mb: 2,
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                background: "linear-gradient(135deg, #4ca1af 0%, #64b5f6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  textShadow: "0 6px 30px rgba(0, 0, 0, 0.9)",
                },
              }}
            >
              BluePulse
            </Typography>
          </Fade>

          {/* Tagline */}
          <Slide direction="up" in={animationStep >= 1} timeout={800}>
            <Typography
              variant="h4"
              sx={{
                color: "rgba(255, 255, 255, 0.95)",
                fontWeight: 600,
                mb: 4,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.7)",
                fontSize: { xs: "1.3rem", md: "1.8rem" },
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                letterSpacing: 1,
              }}
            >
              Votre santé, notre priorité
            </Typography>
          </Slide>

          {/* Description */}
          <Fade in={animationStep >= 2} timeout={1000}>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                mb: 5,
                maxWidth: 700,
                lineHeight: 1.7,
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontWeight: 400,
              }}
            >
              Plateforme médicale moderne qui révolutionne votre expérience de santé. Connectez-vous avec vos médecins,
              gérez vos rendez-vous et bénéficiez de notre intelligence artificielle pour un suivi médical optimal.
            </Typography>
          </Fade>

          {/* Action Buttons */}
          <Slide direction="up" in={animationStep >= 3} timeout={800}>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", sm: "row" },
                mb: 6,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: "rgba(76, 161, 175, 0.9)",
                  color: "white",
                  px: 5,
                  py: 2.5,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  borderRadius: "50px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                  fontFamily: "'Inter', 'Segoe UI', sans-serif",
                  "&:hover": {
                    bgcolor: "rgba(76, 161, 175, 1)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                Se connecter
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/register/patient")}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.8)",
                  color: "white",
                  px: 5,
                  py: 2.5,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  borderRadius: "50px",
                  borderWidth: 2,
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  fontFamily: "'Inter', 'Segoe UI', sans-serif",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                Créer un compte
              </Button>
            </Box>
          </Slide>
        </Box>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          py: 10,
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 800,
                background: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 50%, #64b5f6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                letterSpacing: -1,
              }}
            >
              Nos Services
            </Typography>

            <Box
              sx={{
                width: 80,
                height: 4,
                background: "linear-gradient(90deg, #4ca1af 0%, #64b5f6 100%)",
                borderRadius: 2,
                mx: "auto",
                mb: 4,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                color: "#5a6c7d",
                maxWidth: 700,
                mx: "auto",
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: "1.1rem", md: "1.4rem" },
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
              }}
            >
              Découvrez comment BluePulse transforme votre expérience médicale avec des solutions innovantes
            </Typography>
          </Box>

                      <Grid container spacing={5}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Zoom in={true} timeout={1000} style={{ transitionDelay: `${index * 150}ms` }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "28px",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.06)",
                      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "1px solid rgba(255, 255, 255, 0.9)",
                      bgcolor: "rgba(255, 255, 255, 0.98)",
                      backdropFilter: "blur(20px)",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: `linear-gradient(90deg, ${feature.color} 0%, ${feature.color}80 100%)`,
                      },
                      "&:hover": {
                        transform: "translateY(-12px) scale(1.02)",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                        "& .feature-icon": {
                          transform: "scale(1.15) rotate(5deg)",
                          background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}80 100%)`,
                        },
                        "& .feature-title": {
                          color: feature.color,
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ p: 5, textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: "24px",
                          background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}25 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 4,
                          border: `2px solid ${feature.color}20`,
                          position: "relative",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            inset: -2,
                            borderRadius: "26px",
                            background: `linear-gradient(135deg, ${feature.color}30 0%, transparent 50%, ${feature.color}30 100%)`,
                            zIndex: -1,
                          },
                        }}
                      >
                        <Box
                          className="feature-icon"
                          sx={{
                            color: feature.color,
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            fontSize: "2.5rem",
                          }}
                        >
                          {feature.icon}
                        </Box>
                      </Box>

                      <Typography
                        className="feature-title"
                        variant="h5"
                        sx={{
                          mb: 3,
                          color: "#2c3e50",
                          fontWeight: 700,
                          fontSize: "1.4rem",
                          fontFamily: "'Inter', 'Segoe UI', sans-serif",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: "#5a6c7d",
                          lineHeight: 1.7,
                          fontSize: "1rem",
                          fontFamily: "'Inter', 'Segoe UI', sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(20px)",
          py: 10,
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                color: "white",
                fontWeight: "bold",
                mb: 3,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Prêt à commencer ?
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              Rejoignez des milliers de patients qui font confiance à BluePulse
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Chip
                icon={<StarIcon />}
                label="Gratuit"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
              <Chip
                icon={<SecurityIcon />}
                label="Sécurisé"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
              <Chip
                icon={<SupportIcon />}
                label="Support 24/7"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register/patient")}
              sx={{
                bgcolor: "rgba(76, 161, 175, 0.9)",
                color: "white",
                px: 6,
                py: 3,
                mt: 4,
                fontSize: "1.3rem",
                fontWeight: 600,
                borderRadius: "50px",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "all 0.3s ease",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                "&:hover": {
                  bgcolor: "rgba(76, 161, 175, 1)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 35px rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              Commencer maintenant
            </Button>
          </Box>
        </Container>
      </Box>

      {/* AI Chatbot */}
      <DiagnosisChatbot />
    </Box>
  )
}

export default LandingPage 