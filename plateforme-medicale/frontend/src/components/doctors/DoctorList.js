import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Component to display the list of doctors in a table
 */
const DoctorList = ({ 
  doctors, 
  onEdit, 
  onDelete, 
  searchQuery = '', 
  setSearchQuery = () => {} 
}) => {
  // Filter doctors by search query
  const filteredDoctors = doctors.filter(doctor => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      doctor.prenom?.toLowerCase().includes(searchLower) ||
      doctor.nom?.toLowerCase().includes(searchLower) ||
      doctor.specialite_nom?.toLowerCase().includes(searchLower) ||
      doctor.email?.toLowerCase().includes(searchLower) ||
      doctor.ville?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Box 
      component={Paper}
      elevation={2}
      sx={{ 
        mt: 2, 
        p: 0, 
        overflow: 'auto', 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="medium" color="#2c3e50">
          Liste des médecins ({filteredDoctors.length})
        </Typography>
        <TextField
          size="small"
          placeholder="Rechercher un médecin..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: '8px' }
          }}
        />
      </Box>
      
      <Table>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Nom complet</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Spécialité</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>INPE</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDoctors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Aucun médecin trouvé
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredDoctors.map((doctor) => (
              <TableRow 
                key={doctor.id}
                sx={{
                  bgcolor: !doctor.est_actif ? '#f5f5f5' : 'inherit',
                  '&:hover': { bgcolor: '#f0f9ff' },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {doctor.prenom} {doctor.nom}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doctor.institution_nom || "Aucune institution"} • {doctor.ville || "Ville non spécifiée"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{doctor.specialite_nom}</TableCell>
                <TableCell>{doctor.numero_ordre}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={doctor.est_actif ? "Actif" : "Inactif"}
                    size="small"
                    sx={{
                      bgcolor: doctor.est_actif ? 'rgba(76, 175, 80, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                      color: doctor.est_actif ? '#388e3c' : '#616161',
                      fontWeight: 'medium',
                      borderRadius: '6px'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => onEdit(doctor)}
                      sx={{
                        borderRadius: '8px',
                        borderColor: '#4ca1af',
                        color: '#4ca1af',
                        '&:hover': {
                          borderColor: '#2c3e50',
                          bgcolor: 'rgba(44, 62, 80, 0.04)',
                        }
                      }}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => onDelete(doctor.id)}
                      color="error"
                      sx={{
                        borderRadius: '8px',
                      }}
                    >
                      Supprimer
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default DoctorList; 