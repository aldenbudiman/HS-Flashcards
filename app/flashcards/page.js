'use client'

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Assume this is where you initialize Firebase
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';

export default function FlashcardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    async function getFlashcards() {
        if (!user) return
    
        const docRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(docRef)
  
        if(!docSnap.exists()) {
          const collections = docSnap.data().flashcards || []
          setFlashcards(collections)
        }
        else {
          await setDoc(doc(docRef, { flashcards: [] }))
        }
      }
      getFlashcards()
  }, [user])

  if (!isLoaded || !isSignedIn){
    return <></>
  }

  const handleCardClick = (id) => {
    router.push(`/flashcards?id=${id}`)
  }

  return (
    <Container maxWidth="100vw">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant="h6">
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}