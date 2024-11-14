import React, { useRef, useState, useEffect } from 'react';
import styles from "./canvas.module.css";

interface CanvasProps {
  onSubmit: (imageDataUrl: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ onSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSubmit(dataUrl);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Reapply white background again after clearing
        ctx.fillStyle = 'white';
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
      <button onClick={handleSubmit} className={styles.submit_button}>Send to Backend</button>
      <button onClick={handleClear} className={styles.clear_button}>Clear</button>
    </main>
  );
};

export default Canvas;
