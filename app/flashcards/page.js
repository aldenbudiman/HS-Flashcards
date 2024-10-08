'use client'

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Assume this is where you initialize Firebase
import { 
  Container, 
  Grid, 
  Card, 
  CardActionArea, 
  CardContent, 
  Typography, 
  Box, 
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import Link from 'next/link';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#3f51b5',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

export default function FlashcardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
    
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);
  
      if(docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      }
      else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn){
    return <></>;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  }

  const handleDeleteClick = (e, flashcard) => {
    e.stopPropagation();
    setFlashcardToDelete(flashcard);
    setDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = async () => {
    if (flashcardToDelete) {
      const userDocRef = doc(collection(db, 'users'), user.id);
      const flashcardCollectionRef = collection(userDocRef, flashcardToDelete.name);

      // Delete all documents in the flashcard collection
      const querySnapshot = await getDocs(flashcardCollectionRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Remove the flashcard from the user's flashcards array
      const updatedFlashcards = flashcards.filter(fc => fc.name !== flashcardToDelete.name);
      await updateDoc(userDocRef, { flashcards: updatedFlashcards });

      setFlashcards(updatedFlashcards);
    }
    setDeleteDialogOpen(false);
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFlashcardToDelete(null);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Head>
          <title>Flazz</title>
          <meta name="description" content="Your flashcards"/>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        </Head>

        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" style={{flexGrow: 1, fontWeight: 700}}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Flazz
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Flashcards
          </Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                          {flashcard.name}
                        </Typography>
                        <IconButton
                          onClick={(e) => handleDeleteClick(e, flashcard)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Flashcard Set?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this flashcard set? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}