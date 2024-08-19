'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Container, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  Snackbar,
  Alert
} from '@mui/material';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import getStripe from '@/utils/get-stripe';
import Head from 'next/head';
import { 
  TextFields, 
  Psychology, 
  Devices,
  ArrowForward
} from '@mui/icons-material';

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

export default function Home() {
  const [isBasicChosen, setIsBasicChosen] = useState(true); // Default to "Using Basic"
  const { isSignedIn } = useUser(); // Use Clerk's useUser hook to check sign-in status
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleBasicClick = () => {
    setIsBasicChosen(true);
  };

  const handleSubmit = async () => {
    if (!isSignedIn) {
      setOpenSnackbar(true);
      return;
    }

    try {
      const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          origin: 'http://localhost:3000',
        },
      });

      const checkoutSessionJson = await checkoutSession.json();

      if (checkoutSession.status === 500) {
        console.error(checkoutSessionJson.message);
        return;
      }

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error('An error occurred during checkout:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const boxHeight = 400; // Set a fixed height for both pricing boxes
  const buttonHeight = 48; // Define the button height

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Head>
          <title>Flashcard SaaS</title>
          <meta name="description" content="Create flashcards from your text" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        </Head>

        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 700 }}>
              Flashcard SaaS
            </Typography>
            <SignedOut>
              <Button 
                color="primary" 
                href="/sign-in" 
                variant="outlined"
                style={{
                  marginRight: '16px',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  backgroundColor: 'transparent'
                }}
              >
                Sign In
              </Button>
              <Button 
                color="primary" 
                variant="contained" 
                href="/sign-up"
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h1" gutterBottom>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            href="/generate"
            endIcon={<ArrowForward />}
          >
            Get Started
          </Button>
        </Box>

        <Box sx={{ my: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <TextFields sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
                <Typography>
                  Simply input your text and let our software do the rest.
                  Creating flashcards has never been easier.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Psychology sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
                <Typography>
                  Our AI intelligently breaks down your text into concise
                  flashcards perfect for studying.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Devices sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
                <Typography>
                  Access your flashcards from any device, at any time.
                  Study on the go with ease.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 8, textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom sx={{ mb: 4 }}>Pricing</Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={5}>
              <Box
                sx={{
                  p: 4,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 4,
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transform: 'translateY(-4px)',
                  },
                  position: 'relative',
                  height: boxHeight, // Set a fixed height for the box
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    right: -1,
                    bottom: -1,
                    borderRadius: 'inherit',
                    border: '1px solid rgba(0,0,0,0.1)',
                    pointerEvents: 'none',
                  }
                }}
              >
                <Typography variant="h4" gutterBottom>Basic</Typography>
                <Typography variant="h3" gutterBottom>Free</Typography>
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Typography variant="body1" gutterBottom>Features:</Typography>
                  <ul>
                    <li>Access to basic flashcard creation tools</li>
                    <li>Save generated flashcards</li>
                    <li>Up to 100 flashcards storage</li>
                    <li>Basic customer support</li>
                  </ul>
                </Box>
                {isBasicChosen ? (
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      borderRadius: 2,
                      bgcolor: 'grey.100',
                      color: 'grey.600',
                      height: buttonHeight, // Set the same height as the button
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Using Basic
                  </Box>
                ) : (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="large" 
                    onClick={handleBasicClick}
                    sx={{ height: buttonHeight }} // Set a fixed height for the button
                  >
                    Choose Basic
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <Box
                sx={{
                  p: 4,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 4,
                  bgcolor: 'primary.main',
                  color: 'white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(63,81,181,0.3)',
                    transform: 'translateY(-4px)',
                  },
                  height: boxHeight, // Set a fixed height for the box
                }}
              >
                <Typography variant="h4" gutterBottom>Pro</Typography>
                <Typography variant="h3" gutterBottom>\$5 / month</Typography>
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Typography variant="body1" gutterBottom>Features:</Typography>
                  <ul>
                    <li>Unlimited flashcard generation</li>
                    <li>Unlimited Storage</li>
                    <li>Advanced AI-powered flashcard creation</li>
                    <li>Priority customer support</li>
                  </ul>
                </Box>
                <Button variant="contained" color="secondary" size="large" onClick={handleSubmit}>
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="warning" 
            sx={{ 
              width: '100%', 
              fontSize: '1.25rem', // Increase font size
              p: 2 // Increase padding
            }}
          >
            You must be signed in to choose the Pro plan.
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}