import * as THREE from "three";

export function initLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(10, 100, 200);
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.intensity = 0.7;
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 10;
  directionalLight.shadow.camera.far = 400;
  directionalLight.shadow.camera.fov = 30;

  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  directionalLight.shadow.camera.left = -200;
  directionalLight.shadow.camera.right = 200;
  directionalLight.shadow.camera.top = 200;
  directionalLight.shadow.camera.bottom = -200;
  directionalLight.shadow.camera.near = 0.1;

  directionalLight.castShadow = true;
  scene.add(directionalLight);

  //? Helper
  // const directionalLightHelper = new THREE.DirectionalLightHelper(
  //   directionalLight,
  // );
  // scene.add(directionalLightHelper);
  // const directionalLightShadowHelper = new THREE.CameraHelper(
  //   directionalLight.shadow.camera,
  // );
  // scene.add(directionalLightShadowHelper);
}
