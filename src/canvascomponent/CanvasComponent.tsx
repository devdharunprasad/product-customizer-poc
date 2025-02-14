import React, { useEffect, useRef, useState } from "react";
import { BoxSelect, Database, Image, Link, Tag, Type } from "lucide-react";
import Konva from "konva";
import "./tshirt.css";
import { v4 as uuidv4 } from "uuid";
const TShirtEditor: React.FC = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const [color, setColor] = useState<string>("white");
  const [view, setView] = useState<"Front side" | "Back Side">("Front side");
  const [elements, setElements] = useState<
    { id: string; type: "text" | "image"; node: Konva.Node }[]
  >([]);
  const [rows, setRows] = useState<number>(20);
  const [columns, setColumns] = useState<number>(16);
  const [dragRect, setDragRect] = useState<{ x: number; y: number }>({
    x: 300,
    y: 400,
  });
  const transformerRef = useRef<Konva.Transformer | null>(null);
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
    imageObj.src =
      view === "Front side"
        ? "/src/assets/Group 1000002904.png"
        : "path_to_back_tshirt_image.png";
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
            stroke: "red",
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
        fill: "blue",
        draggable: true,
        dragBoundFunc: (pos) => {
          const newX = Math.max(pos.x, offsetX + 200);
          const newY = Math.max(pos.y, offsetY + 300);
          return { x: newX, y: newY };
        },
      });
      dragHandle.on("dragmove", (e) => {
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
    if (!layerRef.current || !transformerRef.current || !stageRef.current) return;  
    const text = new Konva.Text({
      x: 150,
      y: 200,
      text: "Click to edit",
      fontSize: 30,
      draggable: true,
      fill: "black",
    });  
    const layer = layerRef.current;
    const gridLeft = (500 - 200) / 2; // Offset X
    const gridTop = (500 - 300) / 2; // Offset Y
    const gridRight = gridLeft + 204; // Right boundary
    const gridBottom = gridTop + 255; // Bottom boundary    
    text.on("dragmove", () => {
      const textBounds = text.getClientRect();      
      let newX = text.x();
      let newY = text.y();    
      if (textBounds.x < gridLeft) newX = gridLeft;
      if (textBounds.x + textBounds.width > gridRight) newX = gridRight - textBounds.width;
      if (textBounds.y < gridTop) newY = gridTop;
      if (textBounds.y + textBounds.height > gridBottom) newY = gridBottom - textBounds.height;    
      text.position({ x: newX, y: newY });    
      layer.batchDraw();
    });
    layer.add(text);
    setElements((prev) => [...prev, { id: uuidv4(), type: "text", node: text }]);
    transformerRef.current.nodes([...transformerRef.current.nodes(), text]);
    layer.draw();
  };  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !layerRef.current || !transformerRef.current)
      return;  
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          Konva.Image.fromURL(reader.result, (img) => {
            img.setAttrs({
              x: 150,
              y: 150,
              width: 200,
              height: 200,
              draggable: true,
            });  
            img.on("transform", () => {
              img.setAttrs({
                width: img.width() * img.scaleX(),
                height: img.height() * img.scaleY(),
                scaleX: 1,
                scaleY: 1,
              });
            });
            const gridLeft = (500 - 200) / 2; // Offset X
            const gridTop = (500 - 300) / 2; // Offset Y
            const gridRight = gridLeft + 204; // Right boundary
            const gridBottom = gridTop + 255; // Bottom boundary
            img.on("dragmove", () => {
              const imgBounds = img.getClientRect();      
              let newX = img.x();
              let newY = img.y();    
              if (imgBounds.x < gridLeft) newX = gridLeft;
              if (imgBounds.x + imgBounds.width > gridRight) newX = gridRight - imgBounds.width;
              if (imgBounds.y < gridTop) newY = gridTop;
              if (imgBounds.y + imgBounds.height > gridBottom) newY = gridBottom - imgBounds.height;    
              img.position({ x: newX, y: newY });    
              if (layerRef.current) {
                layerRef.current.batchDraw();
              }
            });
            layerRef.current?.add(img);
            setElements([...elements, { id: uuidv4(), type: "image", node: img }]);
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
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "tshirt-design.png";
    link.click();
  };
  return (
    <>
      <div className=" min-h-screen flex flex-col items-center pb-6">
        <div className=" h-screen bg-white rounded-lg p-4 border-r border-gray-200 fixed left-0 top-0">
          <div className="space-y-8">
            <button className="w-full flex flex-col items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Tag size={24} />
              <span className="text-xs mt-1">Product</span>
            </button>
            <button className="w-full flex flex-col items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Database size={24} />
              <span className="text-xs mt-1">Layers</span>
            </button>
            <label className="w-full flex flex-col items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Image size={24} />
              <span className="text-xs mt-1">Files</span>
            </label>
            <button
              onClick={addText}
              className="w-full flex flex-col items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Type size={24} />
              <span className="text-xs mt-1">Text</span>
            </button>
            <button className="w-full flex flex-col items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Link size={24} />
              <span className="text-xs mt-1">Branding</span>
            </button>
            <button className="w-full flex flex-col items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BoxSelect size={24} />
              <span className="text-xs mt-1">Collections</span>
            </button>
          </div>
        </div>
        <div className="flex-1 p-8">
          
          <div>
            <label>Color:</label>
            {["white", "blue", "red", "orange", "gray", "black"].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={color === c ? "selected" : ""}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="bg-white px-40 py-8 rounded-xl border ">
            <div ref={stageRef} id="tshirt-canvas"></div>
          </div>
          <div className="flex justify-center pt-16">
            <div className="flex justify-center space-x-4 bg-white rounded-lg border px-10 py-2 w-fit">
              {[
                "Front side",
                "Back side",
                "Left sleeve",
                "Right Sleeve",
                "Pocket",
              ].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-md ${
                    view === v
                      ? "bg-gray-200 font-bold text-black"
                      : "text-gray-700 hover:text-black"
                  }`}
                >
                  {v} Side
                </button>
              ))}
            </div>
          </div>
          <button onClick={exportDesign}>Download Design</button>
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 p-4">
              <img
                src="/src/assets/yellow t-shirt.jpeg"
                alt="T-shirt"
                className="w-10 h-10 object-cover rounded"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Yellow Solid T-shirt Half Sleeves
                </p>
                <p className="text-sm text-gray-700 font-medium">$21.12</p>
              </div>
            </div>
            <button className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition">
              Continue to Mockup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default TShirtEditor;
