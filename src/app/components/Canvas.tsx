import React, { useRef, useState, useEffect } from "react";
import styles from "./canvas.module.css";

interface CanvasProps {
  // Callback function to handle the submission of the canvas drawing.
  onSubmit: (imageDataUrl: string) => void;
  // Optional boolean prop to trigger a canvas clear operation.
  clearTrigger?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ onSubmit, clearTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  // Effect hook to clear the canvas whenever the `clearTrigger` prop changes.
  useEffect(() => {
    handleClear();
  }, [clearTrigger]);

  // Effect hook to initialize the canvas background color to white on mount.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);
  // Starts the drawing operation when the user presses the mouse down on the canvas.
  // e - The mouse event triggered by the user's interaction.
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configure the drawing properties.
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    // Begin a new path and move to the starting point.
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  // Draws on the canvas as the user moves the mouse while holding down the button.
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      // Extend the path to the current mouse position and draw.
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  // Stops the drawing operation when the user releases the mouse button.
  const stopDrawing = () => {
    setDrawing(false);
  };

  // Clears the canvas content and resets the background to white.
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear the entire canvas.
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Reset the background color.
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <main className={styles.main}>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className={styles.canvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <button onClick={handleClear} className={styles.clear_button}>
        Clear
      </button>
    </main>
  );
};

export default Canvas;

// Add touch screen
