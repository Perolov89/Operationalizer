import React, { useRef, useState, useEffect } from "react";
import styles from "./canvas.module.css";

/**
Canvas Component
 
The component on which the user draws the numbers and operators used to 
predict and calculate.
*/

interface CanvasProps {
  // Optional boolean prop to trigger canvas clear.
  clearTrigger?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ clearTrigger }) => {
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

  const getCoordinates = (
    event: React.TouchEvent | React.MouseEvent,
    canvas: HTMLCanvasElement
  ): { x: number; y: number } | null => {
    let x, y;
    const rect = canvas.getBoundingClientRect();

    if ("touches" in event) {
      // Touch event
      const touch = event.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      // Mouse event
      x = event.nativeEvent.offsetX;
      y = event.nativeEvent.offsetY;
    }

    // Scale coordinates based on canvas size vs display size
    x = (x * canvas.width) / rect.width;
    y = (y * canvas.height) / rect.height;

    return { x, y };
  };
  // Starts the drawing operation when the user presses the mouse down on the canvas.
  // e - The mouse event triggered by the user's interaction.
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const coords = getCoordinates(e, canvas);
    if (!coords) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setDrawing(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const coords = getCoordinates(e, canvas);
    if (!coords) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(coords.x, coords.y);
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
        style={{ touchAction: "none" }} // Prevent touch scrolling/zooming
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button onClick={handleClear} className={styles.clear_button}>
        Clear
      </button>
    </main>
  );
};

export default Canvas;
