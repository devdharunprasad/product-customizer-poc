import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { BoxSelect, Database, GripVertical, Link, Tag,  Trash2,  Type } from "lucide-react";
import useTShirtStore from "../store/useTShirtStore";
import "./tshirt.css";
import mytshirt from "../assets/Group 1000002904.png";
import { CiImageOn } from "react-icons/ci";
import useEditorStore from "../store/FabricStore";
declare module "fabric" {
  interface Canvas {
    gridBounds?: { left: number; right: number; top: number; bottom: number };
  }
}
const FabricTextComponent = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {textObjects,imageObjects} = useEditorStore();
//   const [textObjects, setTextObjects] = useState<
//   { id: string; text: fabric.IText; widthInches: number; heightInches: number; angle: number }[]
// >([]);
// const [imageObjects, setImageObjects] = useState<
// { id: string; image: fabric.FabricImage; widthImageInches: number; heightImageInches: number; angleImage: number }[]
// >([]);
  const { view, setView } = useTShirtStore();
  // const [angle, setAngle] = useState(0);
  // const [widthInches, setWidthInches] = useState<string>("");
  // const [heightInches, setHeightInches] = useState<string>("");
  // const [widthImageInches, setWidthImageInches] = useState<string>("");
  // const [heightImageInches, setHeightImageInches] = useState<string>("");
  // const [angleImage, setAngleImage] = useState(0);
  const GRID_SIZE:number = 12.75; // Each grid cell size in pixels
  // Function to convert pixels to grid cells
  interface ConvertToGridCells {
    (pixels: number): string;
  }
  const convertToGridCells: ConvertToGridCells = (pixels) => {
    return (pixels / GRID_SIZE).toFixed(2); // Convert and round to 2 decimal places
  };
  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = new fabric.Canvas("canvas");
    }
    drawGrid();
  }, []);
  const drawGrid = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const baseCellSize = 12.75;
      const gridSizeX = 16;
      const gridSizeY = 20;
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const offsetX = (canvasWidth - gridSizeX * baseCellSize) / 2;
      const offsetY = (canvasHeight - gridSizeY * baseCellSize) / 2;
      canvas.getObjects("line").forEach((obj) => canvas.remove(obj));
      canvas.gridBounds = {
        left: offsetX,
        right: offsetX + gridSizeX * baseCellSize,
        top: offsetY,
        bottom: offsetY + gridSizeY * baseCellSize,
      };
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
      canvas.renderAll();
    }
  };

  const addText = () => {
    setIsOpen(true);
    if (!canvasRef.current) return;  
    const canvas = canvasRef.current;
    const id = `text-${Date.now()}`;  
    const text = new fabric.IText("New Text", {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      fontSize: 30,
      fill: "black",
      originX: "center",
      originY: "center",
    });  
    text.setControlsVisibility({
      ml: false,
      mr: false,
      mt: false,
      mb: false,
    });  
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();  
    const { addTextObject, updateTextObject } = useEditorStore.getState();  
    // Add text object to Zustand store
    addTextObject({
      id,
      text,
      widthInches: parseFloat(convertToGridCells(text.getScaledWidth())),
      heightInches: parseFloat(convertToGridCells(text.getScaledHeight())),
      angle: text.angle ?? 0,
      left: text.left ?? 0,
      top: text.top ?? 0,
    });  
    // Function to update Zustand store on changes
    const updateTextState = () => {
      updateTextObject(id, {
        widthInches: parseFloat(convertToGridCells(text.getScaledWidth())),
        heightInches: parseFloat(convertToGridCells(text.getScaledHeight())),
        angle: Math.round(text.angle ?? 0),
        left: text.left ?? 0,
        top: text.top ?? 0,
      });
    };  
    // Attach event listeners for real-time updates
    text.on("moving", updateTextState);
    text.on("scaling", updateTextState);
    text.on("rotating", updateTextState);
    text.on("modified", updateTextState);
    handleTextMove(text, canvas);
    restrictTextScalingAndRotation(text, canvas);
    updateTextState();
  };  
  interface CustomFabricText extends fabric.IText {
    lastValidAngle?: number;
  }
  const restrictTextScalingAndRotation = (text: CustomFabricText, canvas: fabric.Canvas) => {
    text.on("rotating", () => {
        const bounds = canvas.gridBounds as { left: number; right: number; top: number; bottom: number };
        const bbox = text.getBoundingRect();        
        // Round the angle to the nearest integer
        text.angle = Math.round(text.angle || 0);
        if (
            bbox.left < bounds.left ||
            bbox.top < bounds.top ||
            bbox.left + bbox.width > bounds.right ||
            bbox.top + bbox.height > bounds.bottom
        ) {
            // Prevent rotation outside the grid
            text.angle = text.lastValidAngle || 0;
        } else {
            // Store last valid integer angle
            text.lastValidAngle = text.angle;
        }
        canvas.renderAll();
    });
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
    const textWidth = textObj.width! * textObj.scaleX!;
    const textHeight = textObj.height! * textObj.scaleY!;
    const minX = bounds.left + textWidth / 2;
    const maxX = bounds.right - textWidth / 2;
    const minY = bounds.top + textHeight / 3;
    const maxY = bounds.bottom - textHeight / 3;
    const newLeft = Math.max(minX, Math.min(maxX, textObj.left || 0));
    const newTop = Math.max(minY, Math.min(maxY, textObj.top || 0));
    textObj.set({ left: newLeft, top: newTop });
    removeGuidelines(canvas);
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
    canvas.on("mouse:down", (event) => {
      if (!event.target || event.target !== textObj) {
        removeGuidelines(canvas);
      }
    });
  };
// Ensure mouse down event is added only once
// Removed unused setupGuidelineRemoval function
  const monitorTextMovement = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.on("object:moving", (e) => {
        const obj = e.target as fabric.Object;
        if (!obj || !canvas.gridBounds) return;
        obj.set("opacity", 1);
        canvas.renderAll();
      });
    }
  };
  monitorTextMovement();
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    if (!canvasRef.current || !event.target.files) return;  
    const canvas = canvasRef.current;
    const files = Array.from(event.target.files);  
    if (!canvas.gridBounds) return;  
    const { addImageObject, updateImageObject } = useEditorStore.getState(); 
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result || typeof e.target.result !== "string") return;  
        const imgObj = new Image();
        imgObj.src = e.target.result;
        imgObj.onload = () => {
          const id = Date.now().toString();
          const maxDisplaySize = 100;
          let scaleFactor = maxDisplaySize / Math.max(imgObj.width, imgObj.height);
          scaleFactor = Math.min(scaleFactor, 1);  
          const { left: gridLeft, right: gridRight, top: gridTop, bottom: gridBottom } = canvas.gridBounds!;
          const imgWidth = imgObj.width * scaleFactor;
          const imgHeight = imgObj.height * scaleFactor;
          const minX = gridLeft + imgWidth / 2;
          const maxX = gridRight - imgWidth / 2;
          const minY = gridTop + imgHeight / 2;
          const maxY = gridBottom - imgHeight / 2; 
          const fabricImg = new fabric.Image(imgObj, {
            left: Math.random() * (maxX - minX) + minX,
            top: Math.random() * (maxY - minY) + minY,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            originX: "center",
            originY: "center",
            lockScalingFlip: true,
          });
          addImageObject({
            id,
            image: fabricImg,
            widthImageInches: parseFloat(convertToGridCells(fabricImg.getScaledWidth())),
            heightImageInches: parseFloat(convertToGridCells(fabricImg.getScaledHeight())),
            angleImage: fabricImg.angle ?? 0,
          });  
          const updateInfoDisplay = () => {
            updateImageObject(id, {
              widthImageInches: parseFloat(convertToGridCells(fabricImg.getScaledWidth())),
              heightImageInches: parseFloat(convertToGridCells(fabricImg.getScaledHeight())),
              angleImage: Math.round(fabricImg.angle ?? 0),
            });
            canvas.renderAll();
          };  
          fabricImg.on("moving", () => {
            handleImageMove(fabricImg, canvas);
            updateInfoDisplay();
          });  
          fabricImg.on("scaling", () => {
            handleImageScaling(fabricImg, canvas);
            updateInfoDisplay();
          });  
          fabricImg.on("rotating", updateInfoDisplay);            
          restrictImageScalingAndRotation(fabricImg, canvas);  
          canvas.on("mouse:down", (event) => {
            if (!event.target || event.target !== fabricImg) {
              canvas.renderAll();
            }
          });
          fabricImg.setControlsVisibility({
            ml: false,
            mr: false,
            mt: false,
            mb: false,
          });  
          canvas.add(fabricImg);
          canvas.renderAll();
        };
      };
      reader.readAsDataURL(file);
    });
    // Reset file input to allow re-uploading the same file
    event.target.value = "";
};

  interface CustomFabricImage extends fabric.Image {
    lastValidAngle?: number;
}
interface CustomFabricImage extends fabric.Image {
  lastValidAngle?: number;
  lastValidScaleX?: number;
  lastValidScaleY?: number;
}
const restrictImageScalingAndRotation = (imgObj: CustomFabricImage, canvas: fabric.Canvas) => {
  const bounds = canvas.gridBounds as { left: number; right: number; top: number; bottom: number };
  // Initialize default values if they do not exist
  if (imgObj.lastValidAngle === undefined) imgObj.lastValidAngle = 0;
  if (imgObj.lastValidScaleX === undefined) imgObj.lastValidScaleX = imgObj.scaleX || 1;
  if (imgObj.lastValidScaleY === undefined) imgObj.lastValidScaleY = imgObj.scaleY || 1;
  // Restrict Rotation to Integers & Keep within Bounds
  imgObj.on("rotating", () => {
      const bbox = imgObj.getBoundingRect();      
      // Round the angle to prevent decimal values
      imgObj.angle = Math.round(imgObj.angle || 0);
      if (
          bbox.left < bounds.left ||
          bbox.top < bounds.top ||
          bbox.left + bbox.width > bounds.right ||
          bbox.top + bbox.height > bounds.bottom
      ) {
          imgObj.angle = imgObj.lastValidAngle ?? 0;
      } else {
          imgObj.lastValidAngle = imgObj.angle;
      }
      canvas.renderAll();
  });
  // Restrict Scaling & Prevent Overscaling Outside Bounds
  imgObj.on("scaling", () => {
      const scaledWidth = imgObj.width! * imgObj.scaleX!;
      const scaledHeight = imgObj.height! * imgObj.scaleY!;
      if (
          imgObj.left! - scaledWidth / 2 < bounds.left ||
          imgObj.left! + scaledWidth / 2 > bounds.right ||
          imgObj.top! - scaledHeight / 2 < bounds.top ||
          imgObj.top! + scaledHeight / 2 > bounds.bottom
      ) {
          // Restore last valid scale
          imgObj.scaleX = imgObj.lastValidScaleX ?? 1;
          imgObj.scaleY = imgObj.lastValidScaleY ?? 1;
      } else {
          // Store valid scale
          imgObj.lastValidScaleX = imgObj.scaleX!;
          imgObj.lastValidScaleY = imgObj.scaleY!;
      }
      canvas.renderAll();
  });
  // Restrict Movement Within Bounds
  imgObj.on("moving", () => {
      const imgWidth = imgObj.width! * imgObj.scaleX!;
      const imgHeight = imgObj.height! * imgObj.scaleY!;
      const minX = bounds.left + imgWidth / 2;
      const maxX = bounds.right - imgWidth / 2;
      const minY = bounds.top + imgHeight / 2;
      const maxY = bounds.bottom - imgHeight / 2;
      imgObj.left = Math.max(minX, Math.min(maxX, imgObj.left!));
      imgObj.top = Math.max(minY, Math.min(maxY, imgObj.top!));
      canvas.renderAll();
  });
};
// Handles Image Movement and Guides
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
  // Restrict image movement within bounds
  const newLeft = Math.max(minX, Math.min(maxX, imgObj.left || 0));
  const newTop = Math.max(minY, Math.min(maxY, imgObj.top || 0));
  imgObj.set({ left: newLeft, top: newTop });
  // Calculate center positions
  const canvasCenterX = (bounds.left + bounds.right) / 2;
  const canvasCenterY = (bounds.top + bounds.bottom) / 2;
  const isCenteredX = Math.abs(newLeft - canvasCenterX) < 2; // Allow slight deviation
  const isCenteredY = Math.abs(newTop - canvasCenterY) < 2;
  // Remove previous guidelines
  removeGuidelines(canvas);
  // Add guidelines only if the image is centered
  if (isCenteredX || isCenteredY) {
    if (isCenteredX) {
      const yGuide = new fabric.Line([canvasCenterX, 0, canvasCenterX, canvas.getHeight()], {
        stroke: "blue",
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      }) as CustomFabricObject;
      yGuide.customId = "y-guide";
      canvas.add(yGuide);
    }
    if (isCenteredY) {
      const xGuide = new fabric.Line([0, canvasCenterY, canvas.getWidth(), canvasCenterY], {
        stroke: "blue",
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      }) as CustomFabricObject;
      xGuide.customId = "x-guide";
      canvas.add(xGuide);
    }
  }
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
  // Preserve original scale without snapping
  imgObj.scaleX = imgWidth / imgObj.width!;
  imgObj.scaleY = imgHeight / imgObj.height!;
  // If you want position snapping but no scaling snapping, keep this:
  const baseCellSize = 12.75;  
  const nearestX = Math.round((imgObj.left! - bounds.left) / baseCellSize) * baseCellSize + bounds.left;
  const nearestY = Math.round((imgObj.top! - bounds.top) / baseCellSize) * baseCellSize + bounds.top;  
  imgObj.set({
    left: nearestX,
    top: nearestY
  });  
  removeGuidelines(canvas);  
  // Add visual guidelines
  const yGuide = new fabric.Line([imgObj.left!, 0, imgObj.left!, canvas.getHeight()], {
    stroke: "blue",
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false
  }) as CustomFabricObject;
  yGuide.customId = "y-guide"; 
  const xGuide = new fabric.Line([0, imgObj.top!, canvas.getWidth(), imgObj.top!], {
    stroke: "blue",
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false
  }) as CustomFabricObject;
  xGuide.customId = "x-guide"; 
  canvas.add(yGuide, xGuide);
  canvas.renderAll();
};  
  const removeGuidelines = (canvas: fabric.Canvas) => {
    canvas.getObjects().forEach((obj) => {
      const fabricObj = obj as CustomFabricObject;
      if (
        fabricObj.customId === "x-guide" ||
        fabricObj.customId === "y-guide"
      ) {
        canvas.remove(fabricObj);
      }
    });
    canvas.renderAll();
  };
  const deleteText = (id: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;  
    const { textObjects, removeTextObject } = useEditorStore.getState();
    const textObj = textObjects.find((obj) => obj.id === id);  
    if (textObj) {
      canvas.remove(textObj.text as unknown as fabric.Object);
      removeTextObject(id);
      canvas.renderAll();
    }
  };
  const deleteImage = (id: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;  
    const { imageObjects, removeImageObject } = useEditorStore.getState();
    const imageObj = imageObjects.find((obj) => obj.id === id);  
    if (imageObj) {
      canvas.remove(imageObj.image as unknown as fabric.Object);
      removeImageObject(id);
      canvas.renderAll();
    }
  };
  const downloadMockup = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const gridLines = canvas
        .getObjects()
        .filter((obj) => obj instanceof fabric.Line);
      gridLines.forEach((line) => line.set({ visible: false }));
      canvas.renderAll();
      const background = new Image();
      background.src = mytshirt;
      background.onload = () => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = 452;
        tempCanvas.height = 500;
        const ctx = tempCanvas.getContext("2d");
        ctx?.drawImage(background, 0, 0, tempCanvas.width, tempCanvas.height);
        const fabricDataURL = canvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 1,
        });
        const overlayImage = new Image();
        overlayImage.src = fabricDataURL;
        overlayImage.onload = () => {
          ctx?.drawImage(overlayImage, 125, 70, 205, 258);
          const finalDataURL = tempCanvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = finalDataURL;
          link.download = "mockup.png";
          link.click();
          setTimeout(() => {
            gridLines.forEach((line) => line.set({ visible: true }));
            canvas.renderAll();
          }, 100);
        };
      };
    }
  };
  const downloadMockupAssets = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const gridLines = canvas.getObjects().filter((obj) => obj instanceof fabric.Line);
      gridLines.forEach((line) => line.set({ visible: false }));  
      canvas.renderAll();  
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 1,
      });  
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "mockup.png";
      link.click();  
      setTimeout(() => {
        gridLines.forEach((line) => line.set({ visible: true }));
        canvas.renderAll();
      }, 100);
    }
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
            <CiImageOn size={32} />
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
      <div className="flex flex-row  gap-4 pt-8 pr-8">
        <div className="bg-white p-8 rounded-xl border ">
          <div
            id="tshirt-div"
            className="bg-white w-[28.25rem] h-[25.25rem] relative"
          >
            <img
              id="tshirt-backgroundpicture"
              src={mytshirt}
              alt="T-Shirt"
              className="w-full absolute"
            />
            <div className="drawing-area absolute top-[5.375rem] left-[7.5rem] w-[1.25rem] h-[25rem]">
              <canvas id="canvas" width="205" height="258"></canvas>
            </div>
          </div>
        </div>
        {/* <div className="relative w-64 h-64 bg-gray-300 rounded-lg flex items-center justify-center">
          <p className="text-lg font-semibold transform -rotate-90">
            Big Heart
          </p>
          <button className="absolute top-2 right-2 bg-white p-2 rounded shadow">
            &#x2197;
          </button>
          <div className="absolute bottom-2 flex space-x-2">
            <button className="bg-white p-2 rounded shadow">&#x2039;</button>
            <button className="bg-white p-2 rounded shadow">&#x203A;</button>
          </div>
        </div> */}
        {/* <div
          style={{
            width: "200px",
            padding: "10px",
            borderRight: "1px solid #ccc",
          }}
        >
          <h3>Text Elements</h3>
          {textObjects.map(({ id, text }) => (
            <div key={id} style={{ marginBottom: "10px" }}>
              <span>{text.text}</span>
              <button
                onClick={() => deleteText(id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div
          style={{
            width: "200px",
            padding: "10px",
            borderRight: "1px solid #ccc",
          }}
        >
          <h3>Image Elements</h3>
            {imageObjects.map(({ id, image }) => (
            <div key={id} style={{ marginBottom: "10px" }}>
              <img
              src={image.getSrc()}
              alt={`Image ${id.slice(-4)}`}
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <button
              onClick={() => deleteImage(id)}
              style={{ marginLeft: "10px" }}
              >
              Delete
              </button>
            </div>
            ))}
        </div> */}
        <div className="w-96 p-4 border rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Variants and layers</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-sm font-medium text-gray-500">
          {isOpen ? "✖" : "☰"}
        </button>
      </div>      
      {isOpen && (
        <div className="max-h-96 overflow-y-auto">
          {/* Variants Section */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold">Variants</h3>
            <button className="mt-2 w-full border p-2 rounded-lg">Select variants</button>
            <div className="mt-2 w-10 h-10 border rounded-full bg-gray-200"></div>
          </div>          
          {/* Layers Section */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold">Layers</h3>
            {imageObjects.map(({ id, image }) => (
              <div key={id} className="p-3 border rounded-lg mt-2 bg-gray-50">
              {/* Image and Actions - First Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={image.getSrc()}
                    alt={`Image ${id.slice(-4)}`}
                    className="w-12 h-12 object-cover rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => deleteImage(id)}>
                    <Trash2 className="w-5 h-5 text-gray-500 cursor-pointer" />
                  </button>
                  <GripVertical className="w-5 h-5 text-gray-500 cursor-move" />
                </div>
              </div>            
              {/* Image Properties - Second Row */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "Rotate", value: image.angle },
                  {
                    label: "Width",
                    value: imageObjects.find(obj => obj.id === id)?.widthImageInches || '',
                  },
                  {
                    label: "Height",
                    value: imageObjects.find(obj => obj.id === id)?.heightImageInches || '',
                  },
                  { label: "Position Top", value: image.top },
                  { label: "Position Left", value: image.left },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="text-xs font-medium">{label}</label>
                    <input
                      type="number"
                      value={value}
                      className="mt-1 w-full border p-1 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
            ))}
            {textObjects.map(({ id, text }) => (
              <div key={id} className="p-3 border rounded-lg mt-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border rounded bg-gray-100 font-bold">Tt</div>
                    <div>
                      <p className="text-sm font-medium">{text.text}</p>
                      <p className="text-xs text-gray-500">Abel</p>
                    </div>
                  </div>
                  <button onClick={() => deleteText(id)}>
                    <Trash2 className="w-5 h-5 text-gray-500 cursor-pointer" />
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium">Rotate</label>
                    <input type="number" value={text.angle} className="mt-1 w-full border p-1 rounded" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">width</label>
                    <input type="number" value={textObjects.find(obj => obj.id === id)?.widthInches || ''} className="mt-1 w-full border p-1 rounded" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Height </label>
                    <input type="number" value={textObjects.find(obj => obj.id === id)?.heightInches || ''} className="mt-1 w-full border p-1 rounded" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Position top</label>
                    <input type="number" value={text.top} className="mt-1 w-full border p-1 rounded" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Position left</label>
                    <input type="number" value={text.left} className="mt-1 w-full border p-1 rounded" />
                  </div>             
                  </div>                
                <div className="mt-2 flex gap-2 justify-center">
                  <button className="p-2 border rounded">↔</button>
                  <button className="p-2 border rounded">↕</button>
                  <button className="p-2 border rounded">⬆</button>
                  <button className="p-2 border rounded">⬇</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
      </div>
      <div className="flex  flex-col justify-center w-full">
        <div className="flex flex-row justify-center pt-4 space-x-2">
          <button
            className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
            onClick={() => drawGrid()}
          >
            S
          </button>
          <button
            className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
            onClick={() => drawGrid()}
          >
            M
          </button>
          <button
            className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
            onClick={() => drawGrid()}
          >
            L
          </button>
          <button
            className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
            onClick={() => drawGrid()}
          >
            XL
          </button>
          <button
            className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
            onClick={() => drawGrid()}
          >
            2XL
          </button>
          <button
            className="px-4 py-2 rounded-lg shadow-sm border transition-all relative z-10"
            onClick={() => drawGrid()}
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
            ].map((v: string) => (
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
      </div>
      {/* <div>
        <label>Width (Grid Cells):</label>
        <input type="text" value={widthInches} readOnly />

        <label>Height (Grid Cells):</label>
        <input type="text" value={heightInches} readOnly />

        <label>Angle:</label>
        <input type="text" value={angle} readOnly />
      </div> */}
      {/* <div>
        <label>Width (Grid Cells):</label>
        <input type="text" value={widthImageInches} readOnly />
        <label>Height (Grid Cells):</label>
        <input type="text" value={heightImageInches} readOnly />
        <label>Angle:</label>
        <input type="text" value={angleImage} readOnly />
      </div>
      */}
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
        <button onClick={downloadMockupAssets}>download</button>
        <button
          onClick={downloadMockup}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Download to Mockup
        </button>
      </div>
    </div>
  );
};
export default FabricTextComponent;
