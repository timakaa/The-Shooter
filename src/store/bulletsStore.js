import { createStore } from "zustand/vanilla";

// Create and export store directly
const bulletsStore = createStore((set) => ({
  bullets: [],
  setBullets: (bullets) => set({ bullets }),
  bulletMesh: null,
  setBulletMesh: (bulletMesh) => set({ bulletMesh }),
  textureMesh: null,
  setTextureMesh: (textureMesh) => set({ textureMesh }),
}));

export default bulletsStore;
