import * as THREE from "three";
import { initLights } from "./lights";
import Stats from "three/examples/jsm/libs/stats.module.js";
import threeStore from "../store/threeStore";

let camera, scene, renderer, stats;

export function initThree() {
  // Camera
  camera = new THREE.PerspectiveCamera(
    105,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  threeStore.getState().setCamera(camera);

  // Scene
  scene = new THREE.Scene();
  threeStore.getState().setScene(scene);
  scene.fog = new THREE.Fog(0x000000, 0, 500);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(scene.fog.color);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  threeStore.getState().setRenderer(renderer);

  document.body.appendChild(renderer.domElement);

  // Stats.js
  stats = new Stats();
  threeStore.getState().setStats(stats);
  document.body.appendChild(stats.dom);
  // Lights
  initLights(scene);

  window.addEventListener("resize", onWindowResize);

  return { camera, scene, renderer, stats };
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
