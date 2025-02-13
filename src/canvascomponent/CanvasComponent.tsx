import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';
const TShirtEditor: React.FC = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const [printingType, setPrintingType] = useState<'DTG' | 'Puff'>('DTG');
  const [color, setColor] = useState<string>('white');
  const [view, setView] = useState<'Front' | 'Back'>('Front');
  const [elements, setElements] = useState<{ id: string, type: 'text' | 'image', node: Konva.Node }[]>([]);
  const [rows, setRows] = useState<number>(20);
  const [columns, setColumns] = useState<number>(16);
  const [dragRect, setDragRect] = useState<{ x: number, y: number }>({ x: 300, y: 400 });
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
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
      const gridWidth = 204 / columns;
      const gridHeight = 255 / rows;
      const offsetX = (500 - 200) / 2;
      const offsetY = (500 - 300) / 2;
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
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
      const dragHandle = new Konva.Rect({
        x: dragRect.x,
        y: dragRect.y,
        width: 10,
        height: 10,
        fill: 'blue',
        draggable: true,
        dragBoundFunc: (pos) => {
          const newX = Math.max(pos.x, offsetX + 200);
          const newY = Math.max(pos.y, offsetY + 300);
          return { x: newX, y: newY };
        },
      });
      dragHandle.on('dragmove', (e) => {
        const newCols = Math.ceil((e.target.x() - offsetX) / gridWidth);
        const newRows = Math.ceil((e.target.y() - offsetY) / gridHeight);
        setColumns(newCols);
        setRows(newRows);
        setDragRect({ x: e.target.x(), y: e.target.y() });
      });
      layer.add(dragHandle);
      const transformer = new Konva.Transformer();
      layer.add(transformer);
      transformerRef.current = transformer;
      layer.draw();
    };
  }, [view, columns, rows]);

  const addText = () => {
    if (!layerRef.current || !transformerRef.current) return;
    const text = new Konva.Text({
      x: 150,
      y: 200,
      text: 'Your Design',
      fontSize: 30,
      draggable: true,
      fill: 'black',
    });
    text.on('transform', () => {
      text.setAttrs({
        width: text.width() * text.scaleX(),
        height: text.height() * text.scaleY(),
        scaleX: 1,
        scaleY: 1,
      });
    });
    text.on('dblclick', () => {
      const textPosition = text.getClientRect();
      const areaPosition = {
        x: textPosition.x + stageRef.current!.getBoundingClientRect().left,
        y: textPosition.y + stageRef.current!.getBoundingClientRect().top,
      };
      const textArea = textAreaRef.current!;
      textArea.value = text.text();
      textArea.style.position = 'absolute';
      textArea.style.top = areaPosition.y + 'px';
      textArea.style.left = areaPosition.x + 'px';
      textArea.style.width = text.width() - text.padding() * 2 + 'px';
      textArea.style.height = text.height() - text.padding() * 2 + 'px';
      textArea.style.fontSize = text.fontSize() + 'px';
      textArea.style.border = 'none';
      textArea.style.padding = '0px';
      textArea.style.margin = '0px';
      textArea.style.overflow = 'hidden';
      textArea.style.background = 'none';
      textArea.style.outline = 'none';
      textArea.style.resize = 'none';
      textArea.style.lineHeight = text.lineHeight().toString();
      textArea.style.fontFamily = text.fontFamily();
      textArea.style.transformOrigin = 'left top';
      textArea.style.textAlign = text.align();
      textArea.style.color = text.fill() as string;
      textArea.style.transform = `rotateZ(${text.rotation()}deg) translateY(-2px)`;
      textArea.style.display = 'block';
      textArea.focus();
      textArea.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
          text.text(textArea.value);
          textArea.style.display = 'none';
        }
      });
      textArea.addEventListener('blur', () => {
        text.text(textArea.value);
        textArea.style.display = 'none';
      });
    });
    layerRef.current.add(text);
    setElements([...elements, { id: uuidv4(), type: 'text', node: text }]);
    layerRef.current.draw();
    transformerRef.current.nodes([text]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !layerRef.current || !transformerRef.current) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          Konva.Image.fromURL(reader.result, (img) => {
            img.setAttrs({
              x: 150,
              y: 150,
              width: 200,
              height: 200,
              draggable: true,
            });
            img.on('transform', () => {
              img.setAttrs({
                width: img.width() * img.scaleX(),
                height: img.height() * img.scaleY(),
                scaleX: 1,
                scaleY: 1,
              });
            });
            layerRef.current?.add(img);
            setElements([...elements, { id: uuidv4(), type: 'image', node: img }]);
            layerRef.current?.draw();
            if (transformerRef.current) {
              transformerRef.current.nodes([img]);
            }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const exportDesign = () => {
    if (!layerRef.current) return;
    const dataURL = layerRef.current.getStage().toDataURL();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download =  'tshirt-design.png';
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
