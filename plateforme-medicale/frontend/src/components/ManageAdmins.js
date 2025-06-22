import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import '../styles/ManageAdmins.css';
import { formatDateTime } from '../utils/dateUtils';

const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!username) {
    return "Le nom d'utilisateur est requis";
  }
  if (username.length < 3) {
    return "Le nom d'utilisateur doit contenir au moins 3 caractères";
  }
  if (username.length > 30) {
    return "Le nom d'utilisateur ne doit pas dépasser 30 caractères";
  }
  if (!usernameRegex.test(username)) {
    return "Le nom d'utilisateur ne doit contenir que des lettres, chiffres et underscores (_), sans espaces";
  }
  return "";
};

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom_utilisateur: '',
    mot_de_passe: '',
    email: '',
    prenom: '',
    nom: '',
    telephone: '',
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/admins', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAdmins(response.data.admins);
    } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs:', error);
      setError(error.response?.data?.message || 'Erreur lors de la récupération des administrateurs');
    }
  };

  const handleOpen = (admin = null) => {
    if (admin) {
      setEditId(admin.id);
      setFormData({
        nom_utilisateur: admin.nom_utilisateur || '',
        mot_de_passe: '',
        email: admin.email,
        prenom: admin.prenom,
        nom: admin.nom,
        telephone: admin.telephone || '',
      });
    } else {
      setEditId(null);
      setFormData({
        nom_utilisateur: '',
        mot_de_passe: '',
        email: '',
        prenom: '',
        nom: '',
        telephone: '',
      });
    }
    setError('');
    setSuccess('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called with formData:', formData);
    try {
      const usernameError = validateUsername(formData.nom_utilisateur);
      if (usernameError) {
        setError(usernameError);
        return;
      }

      if (!formData.nom_utilisateur || !formData.mot_de_passe || !formData.email || !formData.prenom || !formData.nom) {
        setError('Tous les champs obligatoires doivent être remplis');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour effectuer cette action');
        return;
      }

      if (editId) {
        console.log('Sending PUT request to update admin:', editId);
        await axios.put(`http://localhost:5000/api/admin/admins/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Administrateur modifié avec succès');
      } else {
        console.log('Sending POST request to add admin');
        await axios.post('http://localhost:5000/api/admin/admins', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Administrateur ajouté avec succès');
      }
      await fetchAdmins();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError(error.response?.data?.message || 'Erreur lors de l\'ajout/modification de l\'administrateur');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Administrateur supprimé avec succès');
      fetchAdmins();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(error.response?.data?.message || 'Erreur lors de la suppression de l\'administrateur');
    }
  };

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des administrateurs
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="#4caf50" sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Ajouter un administrateur
      </Button>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Prénom</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Téléphone</TableCell>
            <TableCell>Date de création</TableCell>
            <TableCell>Actif</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.prenom}</TableCell>
              <TableCell>{admin.nom}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.telephone}</TableCell>
              <TableCell>{formatDateTime(admin.date_creation)}</TableCell>
              <TableCell>{admin.est_actif ? 'Oui' : 'Non'}</TableCell>
              <TableCell>
                <Button color="primary" onClick={() => handleOpen(admin)}>
                  Modifier
                </Button>
                <Button color="error" onClick={() => handleDelete(admin.id)}>
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Modifier un administrateur' : 'Ajouter un administrateur'}</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            margin="dense"
            label="Nom d'utilisateur"
            fullWidth
            value={formData.nom_utilisateur}
            onChange={(e) => {
              const value = e.target.value;
              const error = validateUsername(value);
              setFormData({ ...formData, nom_utilisateur: value });
              if (error) {
                setError(error);
              } else {
                setError("");
              }
            }}
            error={!!error}
            helperText={error}
            disabled={!!editId}
          />
          {!editId && (
            <TextField
              margin="dense"
              label="Mot de passe"
              type="password"
              fullWidth
              value={formData.mot_de_passe}
              onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
            />
          )}
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Prénom"
            fullWidth
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Nom"
            fullWidth
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Téléphone"
            fullWidth
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editId ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAdmins;