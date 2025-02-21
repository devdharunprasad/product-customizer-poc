import React, { useEffect, useRef, useState } from "react";
import { BoxSelect, Database, Image, Link, Tag, Type } from "lucide-react";
import Konva from "konva";
import "./tshirt.css";
import { v4 as uuidv4 } from "uuid";
import useTShirtStore from "../store/useTShirtStore";
const TShirtEditor: React.FC = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [activeSize, setActiveSize] = useState(null);
  const [activeTab, setActiveTab] = useState("Product");
  const layerRef = useRef<Konva.Layer | null>(null);
  const [size, setSize] = useState("M");
  const { view, setView, addTextElement, addImageElement } = useTShirtStore();
  const rows: number = 20;
  const columns: number = 16;
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const sizes: string[] = ["S", "M", "L", "XL", "2XL", "3XL"];
  type SizeType = "S" | "M" | "L" | "XL" | "2XL" | "3XL";
  const gridScale: { [key in SizeType]: number } = {
    S: 1.2,
    M: 1,
    L: 0.9,
    XL: 0.8,
    "2XL": 0.7,
    "3XL": 0.6,
  };
  const convertToInches = (pixels: number, size: SizeType): number => {
    const scale = gridScale[size];
    return (pixels / 12.75) * scale;
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
      const gridWidth = convertToInches(204 / columns, size);
      const gridHeight = convertToInches(255 / rows, size);
      const offsetX = (500 - gridWidth * columns * 12.75) / 2;
      const offsetY = (500 - gridHeight * rows * 12.75) / 2;
      // Draw the grid (draggable)
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          const rect = new Konva.Rect({
            x: offsetX + i * gridWidth * 12.75,
            y: offsetY + j * gridHeight * 12.75,
            width: gridWidth * 12.75,
            height: gridHeight * 12.75,
            stroke: "red",
            strokeWidth: 0.1,
            draggable: true,
          });

          rect.on("transform", () => {
            const scaleX = rect.scaleX();
            const scaleY = rect.scaleY();
            rect.width(rect.width() * scaleX);
            rect.height(rect.height() * scaleY);
            rect.scaleX(1);
            rect.scaleY(1);
          });
          layer.add(rect);
        }
      }
      const transformer = new Konva.Transformer();
      layer.add(transformer);
      transformerRef.current = transformer;
      stage.on("click", (e) => {
        if (e.target === stage) {
          transformer.nodes([]);
          return;
        }
        if (e.target instanceof Konva.Rect) {
          transformer.nodes([e.target]);
        }
      });
      layer.draw();
    };
  }, [view, columns, rows, size]);
  const addText = () => {
    if (!layerRef.current || !transformerRef.current || !stageRef.current)
      return;
    const text = new Konva.Text({
      x: 150,
      y: 200,
      text: "Some text",
      fontSize: 20,
      draggable: true,
      fill: "black",
    });
    const layer = layerRef.current;
    const stage = layer?.getStage();
    // T-shirt image boundaries
    const tshirtX = (500 - 200) / 2;
    const tshirtY = (500 - 300) / 2;
    const tshirtWidth = 204;
    const tshirtHeight = 255;
    // Create resize and rotation info display
    const sizeText = new Konva.Text({
      text: `W: ${text.width()} H: ${text.height()}`,
      fontSize: 16,
      fontFamily: "Arial",
      fill: "green",
      x: text.x() + text.width() + 10,
      y: text.y(),
      visible: false,
    });
    const angleText = new Konva.Text({
      text: "0°",
      fontSize: 16,
      fontFamily: "Arial",
      fill: "red",
      x: text.x() + text.width() / 2,
      y: text.y() - 30,
      visible: false,
    });
    layer?.add(sizeText, angleText);
    function updateInfoDisplay() {
      const width = Math.round(text.width() * text.scaleX());
      const height = Math.round(text.height() * text.scaleY());
      const angle = Math.round(text.rotation());
      sizeText.text(`W: ${width} H: ${height}`);
      sizeText.position({
        x: text.x() + width + 10,
        y: text.y(),
      });
      angleText.text(`${angle}°`);
      angleText.position({
        x: text.x() + width / 2,
        y: text.y() - 30,
      });
      sizeText.visible(true);
      angleText.visible(true);
      layer?.batchDraw();
    }
    // Guide lines for alignment
    const xAxis = new Konva.Line({
      points: [
        0,
        text.y() + text.height() / 2,
        500,
        text.y() + text.height() / 2,
      ],
      stroke: "blue",
      strokeWidth: 1,
      dash: [5, 5],
      listening: false,
      visible: false,
    });
    const yAxis = new Konva.Line({
      points: [
        text.x() + text.width() / 2,
        0,
        text.x() + text.width() / 2,
        500,
      ],
      stroke: "blue",
      strokeWidth: 1,
      dash: [5, 5],
      listening: false,
      visible: false,
    });
    layer?.add(xAxis, yAxis);
    function updateAxes() {
      const centerX = text.x() + text.width() / 2;
      const centerY = text.y() + text.height() / 2;
      xAxis.points([0, centerY, 500, centerY]);
      yAxis.points([centerX, 0, centerX, 500]);
      layer?.batchDraw();
    }
    // Restrict text within T-shirt area
    text.on("dragmove", () => {
      const newX = Math.max(
        tshirtX,
        Math.min(text.x(), tshirtX + tshirtWidth - text.width())
      );
      const newY = Math.max(
        tshirtY,
        Math.min(text.y(), tshirtY + tshirtHeight - text.height())
      );
      text.position({ x: newX, y: newY });
      updateAxes();
      updateInfoDisplay();
      layer?.batchDraw();
    });
    // Update info display on resize
    text.on("transform", function () {
      text.setAttrs({
        width: text.width() * text.scaleX(),
        scaleX: 1,
      });
      updateInfoDisplay();
      layer?.batchDraw();
    });
    text.on("click", () => {
      xAxis.visible(true);
      yAxis.visible(true);
      sizeText.visible(true);
      angleText.visible(true);
      transformerRef.current?.nodes([text]);
      layer?.batchDraw();
    });
    stage?.on("click", (e) => {
      if (e.target !== text) {
        xAxis.visible(false);
        yAxis.visible(false);
        sizeText.visible(false);
        angleText.visible(false);
        transformerRef.current?.nodes([]);
        layer?.batchDraw();
      }
    });
    // Edit text on double-click
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
    // Cursor change on hover
    text.on("mouseover", () => {
      document.body.style.cursor = "move";
    });
    text.on("mouseout", () => {
      document.body.style.cursor = "default";
    });
    layer.add(text);
    addTextElement({ id: uuidv4(), node: text });
    transformerRef.current.nodes([...transformerRef.current.nodes(), text]);
    layer.draw();
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !layerRef.current || !transformerRef.current)
      return;
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
          // Create Text Elements for Resize and Rotation Info
          const sizeText = new Konva.Text({
            text: `W: ${img.width()} H: ${img.height()}`,
            fontSize: 16,
            fontFamily: "Arial",
            fill: "green",
            x: img.x() + img.width() + 10,
            y: img.y() + img.height() / 2,
            visible: false, // Initially hidden
            name: "sizeText",
          });
          const angleText = new Konva.Text({
            text: "0°",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "red",
            x: img.x() + img.width() / 2,
            y: img.y() - 30,
            visible: false, // Initially hidden
            name: "angleText",
          });
          layer?.add(sizeText, angleText);
          function updateInfoDisplay() {
            const width = Math.round(img.width() * img.scaleX());
            const height = Math.round(img.height() * img.scaleY());
            const angle = Math.round(img.rotation());
            sizeText.text(`W: ${width} H: ${height}`);
            sizeText.position({
              x: img.x() + width + 10,
              y: img.y() + height / 2,
            });
            angleText.text(`${angle}°`);
            angleText.position({
              x: img.x() + width / 2,
              y: img.y() - 30,
            });
            sizeText.visible(true);
            angleText.visible(true);
            layer?.batchDraw();
          }
          // Create X and Y axis guide lines
          const xAxis = new Konva.Line({
            points: [
              0,
              img.y() + img.height() / 2,
              500,
              img.y() + img.height() / 2,
            ],
            stroke: "blue",
            strokeWidth: 1,
            dash: [5, 5],
            listening: false,
            name: "axis",
            visible: false,
          });
          const yAxis = new Konva.Line({
            points: [
              img.x() + img.width() / 2,
              0,
              img.x() + img.width() / 2,
              500,
            ],
            stroke: "blue",
            strokeWidth: 1,
            dash: [5, 5],
            listening: false,
            name: "axis",
            visible: false,
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
            const newX = Math.max(
              tshirtX,
              Math.min(img.x(), tshirtX + tshirtWidth - img.width())
            );
            const newY = Math.max(
              tshirtY,
              Math.min(img.y(), tshirtY + tshirtHeight - img.height())
            );
            img.position({ x: newX, y: newY });
            updateAxes();
            updateInfoDisplay();
            layer?.batchDraw();
          });
          img.on("transform", () => {
            const newWidth = img.width() * img.scaleX();
            const newHeight = img.height() * img.scaleY();
            const newX = Math.max(
              tshirtX,
              Math.min(img.x(), tshirtX + tshirtWidth - newWidth)
            );
            const newY = Math.max(
              tshirtY,
              Math.min(img.y(), tshirtY + tshirtHeight - newHeight)
            );
            img.setAttrs({
              width: newWidth,
              height: newHeight,
              scaleX: 1,
              scaleY: 1,
              x: newX,
              y: newY,
            });
            updateAxes();
            updateInfoDisplay();
            layer?.batchDraw();
          });
          img.on("rotate", () => {
            updateInfoDisplay();
            layer?.batchDraw();
          });
          img.on("click", () => {
            xAxis.visible(true);
            yAxis.visible(true);
            sizeText.visible(true);
            angleText.visible(true);
            transformerRef.current?.nodes([img]);
            layer?.batchDraw();
          });
          stage?.on("click", (e) => {
            if (e.target !== img) {
              xAxis.visible(false);
              yAxis.visible(false);
              sizeText.visible(false);
              angleText.visible(false);
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
  const handleSizeClick = (size: string) => {
    setActiveSize(size);
    setSize(size);
  };
  return (
    <>
      <div>
        <div className="flex items-center space-x-2 text-gray-700 pl-20 pb-6">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100">
        ←
          </button>
          <span className="text-gray-900">White solid T-shirt</span>
          <span className="text-gray-400">|</span>
          <a href="#" className="font-semibold text-black hover:underline">
        Change Product
          </a>
        </div>
        <div className="flex flex-row justify-between ml-0">
          <div className="bg-white border border-gray-200 rounded-xl fixed left-20 w-24 flex flex-col items-center py-6 shadow-md relative m-0">
        <div className="space-y-8 z-40">
          <button
            onClick={() => setActiveTab("Product")}
            className={`w-full flex flex-col items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
          activeTab === "Product" ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <Tag size={32} />
            <span className="text-xs mt-1">Product</span>
          </button>
          <button
            onClick={() => setActiveTab("Layers")}
            className="w-full flex flex-col items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
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
        {activeTab === "Product" && (
          <div className="absolute left-20 top-5 bg-white text-black px-20 pt-20 pb-[19.3rem] rounded shadow-lg -z-10">
            <h2 className="text-xl font-semibold">Product Information</h2>
            <p className="text-gray-600 mt-2">
          White Solid T-shirt half sleeves
            </p>
            <div className="mt-4">
          <h3 className="font-medium">Printing Type</h3>
          <div className="flex gap-2 mt-2">
            <button className="bg-gray-200 px-4 py-2 rounded-lg shadow-sm">
              DTG Printing
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded-lg shadow-sm">
              Puff Printing
            </button>
          </div>
            </div>
            <div className="mt-4">
          <h3 className="font-medium">Color (White)</h3>
          <div className="flex gap-2 mt-2">
            <div className="w-6 h-6 rounded-full border border-gray-400 bg-white"></div>
            <div className="w-6 h-6 rounded-full bg-red-500"></div>
            <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
            <div className="w-6 h-6 rounded-full bg-blue-300"></div>
            <div className="w-6 h-6 rounded-full bg-black"></div>
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
            </div>
            <div className="mt-4">
          <h3 className="font-medium">Size ({size})</h3>
          <div className="flex space-x-2">
            {sizes.map((size) => (
              <button
            key={size}
            onClick={() => handleSizeClick(size)}
            className={`px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10 ${
              activeSize === size
                ? "border-blue-500 text-blue-500"
                : "border-gray-300"
            }`}
              >
            {size}
              </button>
            ))}
          </div>
            </div>
          </div>
        )}
          </div>
          <div>
        <div className="flex flex-row justify-between gap-4 pr-8">
          <div className="bg-white px-40 py-8 rounded-xl border">
            <div ref={stageRef} id="tshirt-canvas"></div>
          </div>
          <div className="relative w-64 h-64 bg-gray-300 rounded-lg flex items-center justify-center">
            <p className="text-lg font-semibold transform -rotate-90">
          Big Heart
            </p>
            <button className="absolute top-2 right-2 bg-white p-2 rounded shadow">
          &#x2197;
            </button>
            <div className="absolute bottom-2 flex space-x-2">
          <button className="bg-white p-2 rounded shadow">
            &#x2039;
          </button>
          <button className="bg-white p-2 rounded shadow">
            &#x203A;
          </button>
            </div>
          </div>
        </div>
        <div className=" pt-16">
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
          </div>
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
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
