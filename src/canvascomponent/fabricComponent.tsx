import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { BoxSelect, Database, Link, Tag, Type } from "lucide-react";
import useTShirtStore from "../store/useTShirtStore";
import './tshirt.css';
declare module "fabric" {
  interface Canvas {
    gridBounds?: { left: number; right: number; top: number; bottom: number };
  }
}
const FabricTextComponent = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const { view, setView } = useTShirtStore();  
  useEffect(() => {
    if (!canvasRef.current) {
      // Initialize Fabric.js canvas
      canvasRef.current = new fabric.Canvas("canvas");
     
    }
    drawGrid('S');    
      }, []);  
  const drawGrid = (size: string) => {
    if (canvasRef.current) {
        const canvas = canvasRef.current;
        // Original Length and Breadth (Replace with actual values if needed)
        const originalDimensions = {
            S: 12.75, // Base size for 'S'
            M: 11.75, // 12.75 - 2
            L: 10.75,  // 12.75 - 4
            XL: 9.75, // 12.75 - 6
            "2XL": 8.75, // 12.75 - 8
            "3XL": 7.75, // 12.75 - 10
        };
        // Get the size value or fall back to the default 'S' size
        const baseCellSize = originalDimensions[size] || 12.75;
        // Define grid size
        const gridSizeX = 16;
        const gridSizeY = 20;
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        // Offsets for centering the grid
        const offsetX = (canvasWidth - gridSizeX * baseCellSize) / 2;
        const offsetY = (canvasHeight - gridSizeY * baseCellSize) / 2;
        // Remove existing grid lines
        canvas.getObjects("line").forEach((obj) => canvas.remove(obj));
        // Define grid bounds
        canvas.gridBounds = {
            left: offsetX,
            right: offsetX + gridSizeX * baseCellSize,
            top: offsetY,
            bottom: offsetY + gridSizeY * baseCellSize,
        };
        // Draw vertical lines
        for (let i = 0; i <= gridSizeX; i++) {
            const x = offsetX + i * baseCellSize;
            const line = new fabric.Line(
                [x, offsetY, x, offsetY + gridSizeY * baseCellSize],
                {
                    stroke: "red",
                    strokeWidth: 0.3,
                    selectable: false,
                    evented: false,
                }
            );
            canvas.add(line);
        }
        // Draw horizontal lines
        for (let j = 0; j <= gridSizeY; j++) {
            const y = offsetY + j * baseCellSize;
            const line = new fabric.Line(
                [offsetX, y, offsetX + gridSizeX * baseCellSize, y],
                {
                    stroke: "red",
                    strokeWidth: 0.3,
                    selectable: false,
                    evented: false,
                }
            );
            canvas.add(line);
        }
        canvas.renderAll(); // Render everything
    }
};
  const addText = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const text = new fabric.IText("New Text", {
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        fontSize: 30,
        fill: "black",
        editable: true,
        originX: "center",
        originY: "center",
      });  
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();  
      // Create floating text for size and angle
      const infoText = new fabric.FabricText ("", {
        left: text.left! + text.width! / 2 + 10,
        top: text.top! - 20,
        fontSize: 14,
        fill: "red",
        selectable: false,
        evented: false,
      });  
      canvas.add(infoText);  
      // Function to update size and rotation info
      const updateInfoDisplay = () => {
        const width = Math.round(text.getScaledWidth());
        const height = Math.round(text.getScaledHeight());
        const angle = Math.round(text.angle!);  
        infoText.set({
          text: `W: ${width} H: ${height}  Angle: ${angle}°`,
          left: text.left! + text.width! / 2 + 10,
          top: text.top! - 20,
          visible: true,
        });
          canvas.renderAll();
      };
        // Attach event listeners
      text.on("moving", () => {
        handleTextMove(text, canvas);
        updateInfoDisplay();
      });
      canvas.on("mouse:down", (event) => {
        if (!event.target || event.target !== text) {
          removeGuidelines(canvas);
          infoText.set({ visible: false }); // Hide the info text
          canvas.renderAll();
        }
      });
      text.on("scaling", updateInfoDisplay);
      text.on("rotating", updateInfoDisplay);
      text.on("modified", updateInfoDisplay); // Updates on final modification  
      updateInfoDisplay(); // Initial Update
    }
  };
  interface CustomFabricObject extends fabric.Object {
    customId?: string;
  }
  const handleTextMove = (textObj: fabric.IText, canvas: fabric.Canvas) => {
    const bounds = canvas.gridBounds as {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };  
    // Calculate text boundaries with scaling
    const textWidth = textObj.width! * textObj.scaleX!;
    const textHeight = textObj.height! * textObj.scaleY!;
    const minX = bounds.left + textWidth / 2;
    const maxX = bounds.right - textWidth / 2;
    const minY = bounds.top + textHeight / 2;
    const maxY = bounds.bottom - textHeight / 2;  
    // Clamp text position within canvas bounds
    const newLeft = Math.max(minX, Math.min(maxX, textObj.left || 0));
    const newTop = Math.max(minY, Math.min(maxY, textObj.top || 0));  
    textObj.set({ left: newLeft, top: newTop });  
    // Remove previous guidelines
    removeGuidelines(canvas);  
    // Add new guidelines
    const yGuide = new fabric.Line([newLeft, 0, newLeft, canvas.getHeight()], {
      stroke: "red",
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    }) as CustomFabricObject;  
    const xGuide = new fabric.Line([0, newTop, canvas.getWidth(), newTop], {
      stroke: "red",
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    }) as CustomFabricObject;  
    yGuide.customId = "y-guide";
    xGuide.customId = "x-guide";
    canvas.add(yGuide, xGuide);
    canvas.renderAll();  
    // Remove guidelines when clicking outside the text object
    canvas.on("mouse:down", (event) => {
      if (!event.target || event.target !== textObj) {
        removeGuidelines(canvas);
      }
    });
  };  
  const monitorTextMovement = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.on("object:moving", (e) => {
        const obj = e.target as fabric.Object;
        if (!obj || !canvas.gridBounds) return;
        const left = obj.left!;
        const top = obj.top!;
        const isOutside =
          left < canvas.gridBounds.left ||
          left > canvas.gridBounds.right ||
          top < canvas.gridBounds.top ||
          top > canvas.gridBounds.bottom;
        obj.set("opacity", isOutside ? 0 : 1);
        canvas.renderAll();
      });
    }
  };
  monitorTextMovement();
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (canvasRef.current && event.target.files) {
      const canvas = canvasRef.current;
      const files = Array.from(event.target.files);
      if (!canvas.gridBounds) return;  
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && typeof e.target.result === "string") {
            const imgObj = new Image();
            imgObj.src = e.target.result;
            imgObj.onload = () => {
              const maxDisplaySize = 100;
              let scaleFactor = maxDisplaySize / Math.max(imgObj.width, imgObj.height);
              scaleFactor = Math.min(scaleFactor, 1);  
              const fabricImg = new fabric.Image(imgObj, {
                scaleX: scaleFactor,
                scaleY: scaleFactor,
                originX: "center",
                originY: "center",
                lockScalingFlip: true,
              });
                // Info Text for displaying width, height, angle
              const infoText = new fabric.FabricText("", {
                left: 0,
                top: 0,
                fontSize: 14,
                fill: "red",
                selectable: false,
                evented: false,
              });
              canvas.add(infoText);  
              // Function to update width, height, angle
              const updateInfoDisplay = () => {
                const width = Math.round(fabricImg.getScaledWidth());
                const height = Math.round(fabricImg.getScaledHeight());
                const angle = Math.round(fabricImg.angle || 0);  
                infoText.set({
                  text: `W: ${width} H: ${height} Angle: ${angle}°`,
                  left: fabricImg.left! + width / 2 + 10,
                  top: fabricImg.top! - 20,
                  visible: true,
                });
                  canvas.renderAll();
              };  
              // Boundary constraints
              const gridLeft = canvas.gridBounds!.left;
              const gridRight = canvas.gridBounds!.right;
              const gridTop = canvas.gridBounds!.top;
              const gridBottom = canvas.gridBounds!.bottom;  
              const imgWidth = imgObj.width * scaleFactor;
              const imgHeight = imgObj.height * scaleFactor;  
              const minX = gridLeft + imgWidth / 2;
              const maxX = gridRight - imgWidth / 2;
              const minY = gridTop + imgHeight / 2;
              const maxY = gridBottom - imgHeight / 2;  
              fabricImg.left = Math.random() * (maxX - minX) + minX;
              fabricImg.top = Math.random() * (maxY - minY) + minY;
                // Event Listeners for updates
              fabricImg.on("moving", () => {
                handleImageMove(fabricImg, canvas);
                updateInfoDisplay();
              });  
              fabricImg.on("scaling", () => {
                handleImageScaling(fabricImg, canvas);
                updateInfoDisplay();
              });  
              fabricImg.on("rotating", updateInfoDisplay);  
              // Hide info on click outside
              canvas.on("mouse:down", (event) => {
                if (!event.target || event.target !== fabricImg) {
                  infoText.set({ visible: false });
                  canvas.renderAll();
                }
              });  
              // Initial update
              updateInfoDisplay();
              canvas.add(fabricImg);
              canvas.renderAll();
            };
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };  
  const handleImageMove = (imgObj: fabric.Image, canvas: fabric.Canvas) => {
    const bounds = canvas.gridBounds as {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
    const imgWidth = imgObj.width! * imgObj.scaleX!;
    const imgHeight = imgObj.height! * imgObj.scaleY!;
    const minX = bounds.left + imgWidth / 2;
    const maxX = bounds.right - imgWidth / 2;
    const minY = bounds.top + imgHeight / 2;
    const maxY = bounds.bottom - imgHeight / 2;
    imgObj.set({
      left: Math.max(minX, Math.min(maxX, imgObj.left || 0)),
      top: Math.max(minY, Math.min(maxY, imgObj.top || 0)),
    });
    removeGuidelines(canvas);
    const yGuide = new fabric.Line(
      [imgObj.left!, 0, imgObj.left!, canvas.getHeight()],
      {
        stroke: "blue",
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      }
    ) as CustomFabricObject;
    yGuide.customId = "y-guide";
    const xGuide = new fabric.Line(
      [0, imgObj.top!, canvas.getWidth(), imgObj.top!],
      {
        stroke: "blue",
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      }
    ) as CustomFabricObject;
    xGuide.customId = "x-guide";
    canvas.add(yGuide, xGuide);
    canvas.renderAll();
  };
  const handleImageScaling = (imgObj: fabric.Image, canvas: fabric.Canvas) => {
    const bounds = canvas.gridBounds as {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
    const imgWidth = imgObj.width! * imgObj.scaleX!;
    const imgHeight = imgObj.height! * imgObj.scaleY!;
    const minX = bounds.left + imgWidth / 2;
    const maxX = bounds.right - imgWidth / 2;
    const minY = bounds.top + imgHeight / 2;
    const maxY = bounds.bottom - imgHeight / 2;
    if (
      imgWidth > bounds.right - bounds.left ||
      imgHeight > bounds.bottom - bounds.top
    ) {
      imgObj.scaleX = imgObj.scaleX! * 0.95;
      imgObj.scaleY = imgObj.scaleY! * 0.95;
    }
    imgObj.set({
      left: Math.max(minX, Math.min(maxX, imgObj.left || 0)),
      top: Math.max(minY, Math.min(maxY, imgObj.top || 0)),
    });
    canvas.renderAll();
  };
  const removeGuidelines = (canvas: fabric.Canvas) => {
    canvas.getObjects().forEach((obj) => {
      const fabricObj = obj as CustomFabricObject;
      if (fabricObj.customId === "x-guide" || fabricObj.customId === "y-guide") {
        canvas.remove(fabricObj);
      }
    });
    canvas.renderAll();
  };
  return (
    <div className=" min-h-screen flex flex-col items-center pb-6">
      <div className=" bg-white border border-gray-200 rounded-xl fixed left-20 top-4 w-24 flex flex-col items-center py-6 space-y-8 shadow-md">
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
      {/* <button onClick={addText} style={{ marginBottom: '10px', marginRight: '10px' }}>Add Text</button>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '10px' }} /> */}

      <div className="flex flex-row justify-between gap-4 pr-8">
      <div className="bg-white px-40 py-8 rounded-xl border ">
        <div className="tshirt">
          <canvas id="canvas" width="600" height="500"></canvas>
        </div>
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
      <div className="flex flex-row items-center pt-4  space-x-2">
        <button
          className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
          onClick={() => drawGrid("S")}
        >
          S
        </button>
        <button
          className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
          onClick={() => drawGrid("M")}
        >
          M
        </button>
        <button
          className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
          onClick={() => drawGrid("L")}
        >
          L
        </button>
        <button
          className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
          onClick={() => drawGrid("XL")}
        >
          XL
        </button>
        <button
          className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
          onClick={() => drawGrid("2XL")}
        >
          2XL
        </button>
        <button
          className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
          onClick={() => drawGrid("3XL")}
        >
          3XL
        </button>
      </div>
      <div className="flex justify-center pt-8">
        <div className="flex justify-center space-x-4 bg-white rounded-lg border px-10 py-2 w-fit">
          {[
            "Front side",
            "Back side",
            "Left sleeve",
            "Right Sleeve",
            "Pocket",
          ].map((v:string) => (
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
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md flex items-center justify-between">
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
            <p className="text-sm text-gray-700 font-medium">Rs.21.12</p>
          </div>
        </div>
        <button className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition">
          Continue to Mockup
        </button>
      </div>
    </div>
  );
};
export default FabricTextComponent;
