import { createStore } from "zustand/vanilla";

const cannonStore = createStore((set) => ({
  world: null,
  setWorld: (world) => set({ world }),
  ballBodies: [],
  setBallBodies: (ballBodies) => set({ ballBodies }),
  ballMeshes: [],
  setBallMeshes: (ballMeshes) => set({ ballMeshes }),
  balls: [],
  setBalls: (balls) => set({ balls }),
}));

export default cannonStore;
