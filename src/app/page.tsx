"use client";
import React, { useState } from "react";
import Canvas from "./components/Canvas";
import styles from "./page.module.css";

const Home: React.FC = () => {
  const [prediction, setPrediction] = useState("");

  const submitDrawing = async (dataUrl: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (response.ok) {
        const result = await response.json();
        setPrediction(result.predicted_label);
        console.log("Prediction from Flask:", result.predicted_label);
      } else {
        console.error("Failed to process image");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className={styles.main}>
      <article className={styles.canvas_container}>
        <h1 className={styles.h1}>Draw a Number</h1>
        <Canvas onSubmit={submitDrawing} />
        <h1>Prediction: {prediction}</h1>
      </article>
    </main>
  );
};

export default Home;

function usestate(arg0: string): [any, any] {
  throw new Error("Function not implemented.");
}

// added touch screen
