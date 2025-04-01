import { useEffect } from 'react';
import * as fabric from 'fabric';

const CanvasComponent = () => {
  useEffect(() => {
    // Initialize the canvas
    const canvas = new fabric.Canvas('canvas');

    // Add a rectangle as an example
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 50,
      height: 50,
    });

    canvas.add(rect);

    // Function to restrict movement within canvas boundaries
    const restrictMovement = (obj: fabric.Object) => {
      const { left, top, width, height } = obj;
      if (left! < 0) obj.set('left', 0);
      if (top! < 0) obj.set('top', 0);
      if (left! + width! > canvas.width!) obj.set('left', canvas.width! - width!);
      if (top! + height! > canvas.height!) obj.set('top', canvas.height! - height!);
    };

    // Add event listeners
    canvas.on('object:modified', (e) => {
      restrictMovement(e.target as fabric.Object);
      canvas.renderAll();
    });

    canvas.on('object:moving', (e) => {
      restrictMovement(e.target as fabric.Object);
      canvas.renderAll();
    });

    // Cleanup function to avoid re-initializing the canvas
    return () => {
      canvas.dispose(); // Properly dispose of the fabric canvas instance
    };
  }, []);

  return <canvas id="canvas" width="500" height="500"></canvas>;
};

export default CanvasComponent;
