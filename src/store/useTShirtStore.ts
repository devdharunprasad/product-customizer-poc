import { create } from "zustand";
import Konva from "konva";

interface TShirtState {
  color: string;
  view: string;
  textElements: { id: string; node: Konva.Text }[];
  imageElements: { id: string; node: Konva.Image }[];
  rows: number;
  columns: number;
  dragRect: { x: number; y: number };
  setColor: (color: string) => void;
  setView: (view: "Front side" | "Back side") => void;
  addTextElement: (text: { id: string; node: Konva.Text }) => void;
  addImageElement: (image: { id: string; node: Konva.Image }) => void;
  updateGrid: (cols: number, rows: number) => void;
  updateDragRect: (x: number, y: number) => void;
}

const useTShirtStore = create<TShirtState>((set) => ({
  color: "white",
  view: "Front side",
  textElements: [],
  imageElements: [],
  rows: 20,
  columns: 16,
  dragRect: { x: 300, y: 400 },
  
  setColor: (color) => set({ color }),
  setView: (view) => set({ view }),
  
  addTextElement: (text) =>
    set((state) => ({ textElements: [...state.textElements, text] })),

  addImageElement: (image) =>
    set((state) => ({ imageElements: [...state.imageElements, image] })),

  updateGrid: (cols, rows) => set({ columns: cols, rows: rows }),

  updateDragRect: (x, y) => set({ dragRect: { x, y } }),
}));

export default useTShirtStore;
