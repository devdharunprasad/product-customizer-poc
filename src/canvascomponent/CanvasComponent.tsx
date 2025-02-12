import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

const TShirtEditor: React.FC = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const [printingType, setPrintingType] = useState<'DTG' | 'Puff'>('DTG');
  const [color, setColor] = useState<string>('white');
  const [view, setView] = useState<'Front' | 'Back' | 'Left Sleeve' | 'Right Sleeve'>('Front');
  const [elements, setElements] = useState<{ id: string, type: 'text' | 'image', node: Konva.Node }[]>([]);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = new Konva.Stage({
      container: stageRef.current,
      width: 500,
      height: 500,
    });
    const layer = new Konva.Layer();
    stage.add(layer);
    layerRef.current = layer;

    const imageObj = new window.Image();
    imageObj.src = view === 'Front' ? '/src/assets/Group 1000002904.png' : 'path_to_back_tshirt_image.png';
    imageObj.onload = () => {
      const tshirtImage = new Konva.Image({
        image: imageObj,
        x: 0,
        y: 0,
        width: 500,
        height: 500,
      });
      layer.add(tshirtImage);

      const gridWidth = 200 / 16;
      const gridHeight = 300 / 20;
      const offsetX = (500 - 200) / 2;  // Centering the grid horizontally
      const offsetY = (500 - 300) / 2;  // Centering the grid vertically

      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 20; j++) {
          const rect = new Konva.Rect({
            x: offsetX + i * gridWidth,
            y: offsetY + j * gridHeight,
            width: gridWidth,
            height: gridHeight,
            stroke: 'red',
            strokeWidth: 0.1,
          });
          layer.add(rect);
        }
      }
      layer.draw();
    };
  }, [view]);

  const addText = () => {
    if (!layerRef.current) return;
    const text = new Konva.Text({
      x: 150,
      y: 200,
      text: 'Your Design',
      fontSize: 30,
      draggable: true,
      fill: 'black',
    });
    layerRef.current.add(text);
    setElements([...elements, { id: uuidv4(), type: 'text', node: text }]);
    layerRef.current.draw();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => { if (!event.target.files || !layerRef.current) return; const file = event.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === 'string') { Konva.Image.fromURL(reader.result, (img) => { img.setAttrs({ x: 0, y: 0, width: 500, height: 500, draggable: true, name: 'uploadedImage', }); layerRef.current?.add(img); setElements([...elements, { id: uuidv4(), type: 'image', node: img }]); layerRef.current?.draw(); }); } }; reader.readAsDataURL(file); } };

  const exportDesign = () => {
    if (!layerRef.current) return;
    const dataURL = layerRef.current.getStage().toDataURL();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'tshirt-design.png';
    link.click();
  };
  return (
    <div>
      <h2>T-Shirt Editor</h2>
      <div>
        <label>Printing Type:</label>
        <button onClick={() => setPrintingType('DTG')} className={printingType === 'DTG' ? 'selected' : ''}>DTG Printing</button>
        <button onClick={() => setPrintingType('Puff')} className={printingType === 'Puff' ? 'selected' : ''}>Puff Printing</button>
      </div>
      <div>
        <label>Color:</label>
        {['white', 'blue', 'red', 'orange', 'gray', 'black'].map((c) => (
          <button key={c} onClick={() => setColor(c)} className={color === c ? 'selected' : ''}>{c}</button>
        ))}
      </div>
      <div>
        <label>View:</label>
        {['Front', 'Back'].map((v) => (
          <button key={v} onClick={() => setView(v)} className={view === v ? 'selected' : ''}>{v}</button>
        ))}
      </div>
      <div ref={stageRef} id="tshirt-canvas" style={{ border: '1px solid black' }}></div>
      <button onClick={addText}>Add Text</button>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={exportDesign}>Download Design</button>
    </div>
  );
};

export default TShirtEditor;
