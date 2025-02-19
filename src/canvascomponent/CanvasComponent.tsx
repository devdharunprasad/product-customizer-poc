import React, { useEffect, useRef, useState} from "react";
import { BoxSelect, Database, Image, Link, Tag, Type } from "lucide-react";
import Konva from "konva";
import "./tshirt.css";
import { v4 as uuidv4 } from "uuid";
import useTShirtStore from "../store/useTShirtStore";
const TShirtEditor: React.FC = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [activeSize, setActiveSize] = useState(null);
  console.log({activeSize});
  const layerRef = useRef<Konva.Layer | null>(null);
  const [size, setSize] = useState("M");
  console.log({size})
  const {
    color,
    view,
    setColor,
    setView,
    addTextElement,
    addImageElement,
  } = useTShirtStore();
  const rows:number= 20
  const columns:number =16
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const sizes: string[] = ["S", "M", "L", "XL", "2XL", "3XL"];
  const gridScale: { [key: string]: number } = {
    S: 1.2,
    M: 1,
    L: 0.9,
    XL: 0.8,
    "2XL": 0.7,
    "3XL": 0.6,
  };
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
        : "/src/assets/Group 1000002984 (1).svg";  
    imageObj.onload = () => {
      const tshirtImage = new Konva.Image({
        image: imageObj,
        x: 0,
        y: 0,
        width: 500,
        height: 500,
      });  
      layer.add(tshirtImage); 
       // Grid Calculation
       const scale = gridScale[size];
       console.log({scale});
       const gridWidth = (204 / columns) * scale;
       const gridHeight = (255 / rows) * scale;
       const offsetX = (500 - gridWidth * columns) / 2;
       const offsetY = (500 - gridHeight * rows) / 2;  
      // Draw the grid (fixed, not draggable)
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
      const transformer = new Konva.Transformer();
      layer.add(transformer);
      transformerRef.current = transformer;  
      layer.draw();
    };
  }, [view, columns, rows,size]);  
  const addText = () => {    
    if (!layerRef.current || !transformerRef.current || !stageRef.current) return;       
    const text = new Konva.Text({
      x: 150,
      y: 200,
      text: "some text",
      fontSize: 20,
      draggable: true,
      fill: "black",
    });
    text.on('transform', function () {
      text.setAttrs({
        width: text.width() * text.scaleX(),
        scaleX: 1,
      });
    }); 
    const layer = layerRef.current;
    const stage = layer?.getStage();
    // T-shirt image boundaries (assuming fixed dimensions)
    const tshirtX = (500 - 200) / 2;  // X position of T-shirt image
    const tshirtY = (500 - 300) / 2;  // Y position of T-shirt image
    const tshirtWidth = 204;          // Width of T-shirt image
    const tshirtHeight = 255;         // Height of T-shirt image
    // Create X and Y axis guide lines (full canvas span)
    const xAxis = new Konva.Line({
      points: [0, text.y() + text.height() / 2, 500, text.y() + text.height() / 2], 
      stroke: "blue",
      strokeWidth: 1,
      dash: [5, 5],
      listening: false,
      visible: false,
    });
    const yAxis = new Konva.Line({
      points: [text.x() + text.width() / 2, 0, text.x() + text.width() / 2, 500], 
      stroke: "blue",
      strokeWidth: 1,
      dash: [5, 5],
      listening: false,
      visible: false,
    });
    layer.add(xAxis, yAxis);
    text.on("click", () => {
      xAxis.visible(true);
      yAxis.visible(true);
      transformerRef.current?.nodes([text]);
      layer?.batchDraw();
    });
    // Cursor change on hover
    text.on("mouseover", () => {
      document.body.style.cursor = "move";
    });
    text.on("mouseout", () => {
      document.body.style.cursor = "default";
    });
    // Select text when clicked
    text.on("click", (e) => {
      e.cancelBubble = true;
      transformerRef.current?.nodes([text]);
      layerRef.current?.batchDraw();
    });
    text.on('transform', function () {
      text.setAttrs({
          width: text.width() * text.scaleX(),
          scaleX: 1,
      });
  });     
  const editText = () => {
    const textPosition = text.getAbsolutePosition();
    const stageBox = stage.container().getBoundingClientRect();    
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);    
    textarea.value = text.text();
    textarea.style.position = "absolute";
    textarea.style.top = `${textPosition.y + stageBox.top}px`;
    textarea.style.left = `${textPosition.x + stageBox.left}px`;
    textarea.style.width = `${text.width()}px`;
    textarea.style.height = `${text.height()}px`;
    textarea.style.fontSize = `${text.fontSize()}px`;
    textarea.style.border = "none";
    textarea.style.padding = "5px";
    textarea.style.margin = "0";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.background = "transparent";
    textarea.style.overflow = "hidden";
    textarea.style.fontFamily = text.fontFamily();
    textarea.focus();
    
    textarea.addEventListener("blur", () => {
        text.text(textarea.value);
        document.body.removeChild(textarea);
        layer.batchDraw();
    });
    
    textarea.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            text.text(textarea.value);
            document.body.removeChild(textarea);
            layer.batchDraw();
        }
    });
};
text.on("dblclick", editText);
    // Restrict text drag within the T-shirt image
    text.on("dragmove", () => {
      const newX = Math.max(tshirtX, Math.min(text.x(), tshirtX + tshirtWidth - text.width()));
      const newY = Math.max(tshirtY, Math.min(text.y(), tshirtY + tshirtHeight - text.height()));
      text.position({ x: newX, y: newY });
      // Update guide lines based on text center
      xAxis.points([0, newY + text.height() / 2, 500, newY + text.height() / 2]);
      yAxis.points([newX + text.width() / 2, 0, newX + text.width() / 2, 500]);
      layer.batchDraw();
    });
    stage?.on("click", (e) => {
      if (e.target !== text) {
        xAxis.visible(false);
        yAxis.visible(false);
        transformerRef.current?.nodes([]);
        layer?.batchDraw();
      }
    });
    layer.add(text);
    addTextElement({ id: uuidv4(), node: text });
    transformerRef.current.nodes([...transformerRef.current.nodes(), text]);
    layer.draw();
};
const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files || !layerRef.current || !transformerRef.current) return;
  const file = event.target.files[0];
  if (!file) return;
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
        const layer = layerRef.current;
        const stage = layer?.getStage();
        // T-shirt image boundaries
        const tshirtX = (500 - 200) / 2;
        const tshirtY = (500 - 300) / 2;
        const tshirtWidth = 204;
        const tshirtHeight = 255;
        // Create X and Y axis guide lines
        const xAxis = new Konva.Line({
          points: [0, img.y() + img.height() / 2, 500, img.y() + img.height() / 2],
          stroke: "blue",
          strokeWidth: 1,
          dash: [5, 5],
          listening: false,
          name: "axis",
          visible: false, // Initially hidden
        });
        const yAxis = new Konva.Line({
          points: [img.x() + img.width() / 2, 0, img.x() + img.width() / 2, 500],
          stroke: "blue",
          strokeWidth: 1,
          dash: [5, 5],
          listening: false,
          name: "axis",
          visible: false, // Initially hidden
        });
        layer?.add(xAxis, yAxis);
        function updateAxes() {
          const centerX = img.x() + img.width() / 2;
          const centerY = img.y() + img.height() / 2;
          xAxis.points([0, centerY, 500, centerY]);
          yAxis.points([centerX, 0, centerX, 500]);
          layer?.batchDraw();
        }
        img.on("dragmove", () => {
          const newX = Math.max(tshirtX, Math.min(img.x(), tshirtX + tshirtWidth - img.width()));
          const newY = Math.max(tshirtY, Math.min(img.y(), tshirtY + tshirtHeight - img.height()));
          img.position({ x: newX, y: newY });
          updateAxes();
          layer?.batchDraw();
        });
        img.on("transform", () => {
          const newWidth = img.width() * img.scaleX();
          const newHeight = img.height() * img.scaleY();
          const newX = Math.max(tshirtX, Math.min(img.x(), tshirtX + tshirtWidth - newWidth));
          const newY = Math.max(tshirtY, Math.min(img.y(), tshirtY + tshirtHeight - newHeight));
          img.setAttrs({
            width: newWidth,
            height: newHeight,
            scaleX: 1,
            scaleY: 1,
            x: newX,
            y: newY,
          });
          updateAxes();
          layer?.batchDraw();
        });
        // Show axes when image is clicked
        img.on("click", () => {
          xAxis.visible(true);
          yAxis.visible(true);
          transformerRef.current?.nodes([img]);
          layer?.batchDraw();
        });
        // Hide axes when clicking outside the image
        stage?.on("click", (e) => {
          if (e.target !== img) {
            xAxis.visible(false);
            yAxis.visible(false);
            transformerRef.current?.nodes([]);
            layer?.batchDraw();
          }
        });
        img.on("mouseover", () => (document.body.style.cursor = "move"));
        img.on("mouseout", () => (document.body.style.cursor = "default"));
        layer?.add(img);
        addImageElement({ id: uuidv4(), node: img });
        layer?.draw();
        if (transformerRef.current) {
          transformerRef.current.nodes([img]);
        }
      });
    }
  };
  reader.readAsDataURL(file);
};
  const exportDesign = () => {
    if (!layerRef.current) return;
    const dataURL = layerRef.current.getStage().toDataURL();
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "tshirt-design.png";
    link.click();
  };     
  
    const handleSizeClick = (size:string) => {
      setActiveSize(size);
      setSize(size);
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
          <div className="flex space-x-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => handleSizeClick(size)}
          className={`border-2 px-4 py-2 rounded ${activeSize === size ? 'border-blue-500 text-white bg-blue-500' : 'border-gray-300 text-gray-500'}`}
        >
          {size}
        </button>
      ))}
    </div>
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
