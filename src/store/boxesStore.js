import { createStore } from "zustand/vanilla";

const boxesStore = createStore((set) => ({
  boxes: [],
  boxMeshes: [],
  setBoxes: (boxes) => set({ boxes }),
  setBoxMeshes: (boxMeshes) => set({ boxMeshes }),
  texture: null,
  setTexture: (texture) => set({ texture }),
}));

export default boxesStore;
