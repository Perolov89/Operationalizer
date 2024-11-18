"use client";
import React, { useState } from "react";
import Canvas from "./components/Canvas";
import SmokeBackground from "./components/SmokeBackground";
import styles from "./page.module.css";

/**
Home Component
 
This is the main component of the application, providing a UI for drawing two numbers
and an operator on separate canvases. It sends these drawings to a backend service for
prediction and performs a calculation based on the predictions.
*/

const Home: React.FC = () => {
  const [clearTrigger, setClearTrigger] = useState(false); // State to trigger clearing all canvases.
  const [result, setResult] = useState<number | null>(null); // State to hold the calculated result.

  // Submits the drawn images to the backend for processing.
  // dataUrls - Array of Base64 encoded strings representing the canvas content.

  const submitDrawing = async (dataUrls: string[]) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: {
            firstNumber: dataUrls[0],
            operator: dataUrls[1],
            secondNumber: dataUrls[2],
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        try {
          // Extract predicted symbols and perform a calculation.
          const firstNumber = Number(result.firstNumber.predicted_symbol);
          const operator = result.operator.predicted_symbol;
          const secondNumber = Number(result.secondNumber.predicted_symbol);

          let calculation;
          switch (operator) {
            case "+":
              calculation = firstNumber + secondNumber;
              break;
            case "-":
              calculation = firstNumber - secondNumber;
              break;
            case "*":
              calculation = firstNumber * secondNumber;
              break;
            case "/":
              calculation = firstNumber / secondNumber;
              break;
            default:
              throw new Error("Unsupported operator");
          }
          setResult(calculation); // Update the result state with the calculation.
        } catch (error) {
          console.log(`Error when converting to Numbers : ${error}`);
        }
        console.log("Predictions from Flask:", result);
        console.log(`Calculated result: ${result}`);
      } else {
        console.error("Failed to process images");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult(null);
    }
  };

  // Collects data from all canvas elements, converts them to Base64 strings,
  // and submits them to the backend.
  const handleOperationalize = () => {
    const canvases = document.querySelectorAll("canvas");
    const dataUrls = Array.from(canvases).map((canvas) =>
      (canvas as HTMLCanvasElement).toDataURL("image/png")
    );
    submitDrawing(dataUrls);
  };

  // Triggers the clearing of all canvases by toggling the `clearTrigger` state.
  const handleClearAll = () => {
    setClearTrigger((prev) => !prev);
  };

  return (
    <>
      <SmokeBackground />
      <main className={styles.main}>
        <h1 className={styles.title}>The operationalizer</h1>

        <section className={styles.canvasContainer}>
          <article className={styles.canvasWrapper}>
            <span className={styles.label}>Number 1</span>
            <Canvas onSubmit={() => {}} clearTrigger={clearTrigger} />
          </article>

          <article className={styles.canvasWrapper}>
            <span className={styles.label}>Operator</span>
            <Canvas onSubmit={() => {}} clearTrigger={clearTrigger} />
          </article>

          <article className={styles.canvasWrapper}>
            <span className={styles.label}>Number 2</span>
            <Canvas onSubmit={() => {}} clearTrigger={clearTrigger} />
          </article>
        </section>

        {result && <div className={styles.result}>{result}</div>}
        <div className={styles.buttonContainer}>
          <button
            className={styles.operationalizeButton}
            onClick={handleOperationalize}
          >
            Operationalize!
          </button>
          <button className={styles.clearButton} onClick={handleClearAll}>
            Clear All
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
