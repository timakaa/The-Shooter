import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import threeStore from "../store/threeStore.js";
import boxesStore from "../store/boxesStore.js";

export function loadTextures() {
  const scene = threeStore.getState().scene;
  const renderer = threeStore.getState().renderer;

  const loadingManager = new THREE.LoadingManager();
  const progressBar = document.getElementById("progress-bar");
  const progressBarContainer = document.querySelector(
    ".progress-bar-container",
  );

  // Loaders
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const exrLoader = new EXRLoader(loadingManager);

  loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log("Loading file:", url);
    console.log(`Loaded ${itemsLoaded} of ${itemsTotal} files`);
  };

  loadingManager.onLoad = function () {
    console.log("Loading complete!");
    progressBarContainer.style.display = "none";
  };

  loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(`Loading file: ${url}`);
    console.log(`Progress: ${(itemsLoaded / itemsTotal) * 100}%`);
    progressBar.value = (itemsLoaded / itemsTotal) * 100;
  };

  loadingManager.onError = function (url) {
    console.log("Error loading file: " + url);
  };

  const floorTextureUrl = new URL("../assets/floor.jpg", import.meta.url).href;
  let floorTexture;

  textureLoader.load(
    floorTextureUrl,
    (texture) => {
      // Success callback
      floorTexture = texture;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(200, 200);

      try {
        scene.background = new THREE.Color(0x808080);

        // Create floor material after texture is loaded
        const floorMaterial = new THREE.MeshStandardMaterial({
          map: texture,
        });
        const floorGeometry = new THREE.PlaneGeometry(300, 300, 100, 100);
        floorGeometry.rotateX(-Math.PI / 2);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.receiveShadow = true;
        scene.add(floor);
      } catch (error) {
        console.error("Error processing texture:", error);
        // Fallback to simple color
        scene.background = new THREE.Color(0x808080);
        const floorMaterial = new THREE.MeshStandardMaterial({
          color: 0x808080,
        });
        const floorGeometry = new THREE.PlaneGeometry(300, 300, 100, 100);
        floorGeometry.rotateX(-Math.PI / 2);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.receiveShadow = true;
        scene.add(floor);
      }
    },
    // Progress callback
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // Error callback
    (error) => {
      console.error("Error loading texture:", error);
      // Fallback to simple color
      scene.background = new THREE.Color(0x808080);
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
      });
      const floorGeometry = new THREE.PlaneGeometry(300, 300, 100, 100);
      floorGeometry.rotateX(-Math.PI / 2);
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.receiveShadow = true;
      scene.add(floor);
    },
  );

  const backgroundTextureUrl = new URL(
    "../assets/background.exr",
    import.meta.url,
  ).href;

  exrLoader.load(
    backgroundTextureUrl,
    function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      // Adjust exposure and tone mapping to control brightness
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.4;

      scene.background = texture;
      scene.environment = texture;
    },
    undefined,
    function (error) {
      console.error("Error loading EXR:", error);
    },
  );

  const mainBoxTextureUrl = new URL("../assets/mainBox.jpeg", import.meta.url)
    .href;

  const mainBoxTexture = new Promise((resolve) => {
    textureLoader.load(
      mainBoxTextureUrl,
      (texture) => {
        boxesStore.getState().setTexture(texture);
        resolve();
      },
      undefined,
      (error) => {
        console.error("Error loading texture:", error);
        resolve(); // Resolve anyway to not block the app
      },
    );
  });

  return Promise.all([mainBoxTexture]);
}
