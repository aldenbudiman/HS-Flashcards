'use client'

import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  CardActionArea,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { db } from '@/firebase'; // Adjust the import according to your Firebase setup
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

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false); // New state for error dialog
  const router = useRouter();

  const handleSubmit = async () => {
    if (!text.trim()) {
      setErrorDialogOpen(true);
      return;
    }

    setLoading(true);
    fetch('/api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data) => {
        setFlashcards(data);
        setFlipped({});
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error generating flashcards:', error);
        setLoading(false);
      });
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleWarningClose = () => setWarningOpen(false);
  const handleErrorDialogClose = () => setErrorDialogOpen(false); // Close error dialog

  const handleViewSavedFlashcards = () => {
    if (!isSignedIn) {
      setWarningOpen(true);
      return;
    }
    router.push('/flashcards');
  };

  const saveFlashcards = async () => {
    if (!isSignedIn) {
      setWarningOpen(true);
      return;
    }

    if (!name) {
      alert('Please enter a name for your flashcard set.');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert('A flashcard set with that name already exists.');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcardSets: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push('/flashcards');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 700 }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Flashcard SaaS
              </Link>
            </Typography>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleViewSavedFlashcards}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(63, 81, 181, 0.04)',
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              View Saved Flashcards
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <Paper sx={{ p: 4, width: '100%' }}>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Submit'}
            </Button>
          </Paper>
        </Box>
        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant='h5'>Flashcards Preview</Typography>
            <Grid container spacing={3}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent>
                      <Box
                        sx={{
                          perspective: '1000px',
                          '& > div': {
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          },
                          '& > div > div': {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            boxSizing: 'border-box',
                          },
                          '& > div > div:nth-of-type(2)': {
                            transform: 'rotateY(180deg)',
                          },
                        }}
                      >
                        <div>
                          <div>
                            <Typography variant='h5' component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant='h5' component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpen}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              label='Collection Name'
              type='text'
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant='outlined'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards}>Save</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={warningOpen} onClose={handleWarningClose}>
          <DialogTitle>Warning</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You need to be signed in to perform this action. Please sign in and try again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleWarningClose}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a prompt before generating flashcards.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleErrorDialogClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}