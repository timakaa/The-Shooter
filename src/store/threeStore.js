import { createStore } from "zustand/vanilla";

// Create and export store directly
const threeStore = createStore((set) => ({
  renderer: null,
  setRenderer: (renderer) => set({ renderer }),
  scene: null,
  setScene: (scene) => set({ scene }),
  camera: null,
  setCamera: (camera) => set({ camera }),
  stats: null,
  setStats: (stats) => set({ stats }),
  controls: null,
  setControls: (controls) => set({ controls }),
}));

export default threeStore;
