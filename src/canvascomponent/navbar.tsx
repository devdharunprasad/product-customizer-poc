import  { useEffect, useRef } from 'react';
import *as fabric from 'fabric';

const TShirtDesigner = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let canvas: fabric.Canvas | undefined;
    if (canvasRef.current) {
      canvas = new fabric.Canvas(canvasRef.current);
    }

    const text = new fabric.Text('Your Text Here', {
      left: 50,
      top: 50,
      fill: 'black',
      fontSize: 24,
    });

    if (canvas) {
      canvas.add(text);
    }

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  return (
    <div id="tshirt-div" style={{ backgroundColor:'#ffff' , width: '452px', height: '548px', position: 'relative' }}>
      <img
        id="tshirt-backgroundpicture"
        src="https://i.postimg.cc/GpmQXh9v/Group-1000002904.png"
        alt="T-Shirt"
        style={{ width: '100%', position: 'absolute' }}
      />
      <div className="drawing-area" style={{ position: 'absolute', top: '60px', left: '122px', width: '200px', height: '400px' }}>
        <canvas id="tshirt-canvas" width="200" height="200" ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default TShirtDesigner;