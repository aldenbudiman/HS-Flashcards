'use client'

import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import Head from 'next/head';

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

export default function SignUpPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Head>
          <title>Sign Up - Flashcard SaaS</title>
          <meta name="description" content="Sign up for Flashcard SaaS"/>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        </Head>

        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
              <Typography variant="h6" style={{fontWeight: 700, cursor: 'pointer'}}>
                Flashcard SaaS
              </Typography>
            </Link>
            <Button 
              color="primary" 
              href="/sign-in" 
              variant="contained"
              style={{marginRight: '16px'}}
            >
              Sign In
            </Button>
            <Button 
              color="primary" 
              variant="outlined" 
              href="/sign-up"
              style={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                backgroundColor: 'transparent'
              }}
            >
              Sign Up
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h2" gutterBottom>
            Sign Up for Flashcard SaaS
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
            Create an account to start making flashcards easily.
          </Typography>
          <Box sx={{ 
            maxWidth: '400px',
            maxHeight: '560px',
            margin: '0 auto', 
            padding: '24px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <SignUp />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
