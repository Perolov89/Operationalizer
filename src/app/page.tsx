'use client'
import React from 'react';
import Canvas from './components/Canvas';

const Home: React.FC = () => {
  const submitDrawing = async (dataUrl: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Prediction from Flask:', result);
      } else {
        console.error('Failed to process image');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Draw a Number</h1>
      <Canvas onSubmit={submitDrawing} />
    </div>
  );
};

export default Home;
