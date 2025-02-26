import * as THREE from "three";
import boxesStore from "../store/boxesStore.js";
import * as CANNON from "cannon-es";
import cannonStore from "../store/cannonStore.js";
import threeStore from "../store/threeStore.js";
import { BOX_MATERIAL, COLLISION_GROUPS } from "../constanst.js";

export function addBoxes() {
  let boxes = [];
  let boxMeshes = [];
  let updateHelpers = [];

  const boxTexture = boxesStore.getState().texture;

  const world = cannonStore.getState().world;
  const scene = threeStore.getState().scene;
  const boxMaterial = BOX_MATERIAL;

  // Instead of returning, use a default material if texture is not loaded
  const material = new THREE.MeshStandardMaterial({
    map: boxTexture || null,
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.3,
  });
  material.color.multiplyScalar(0.4);

  const halfExtents = new CANNON.Vec3(3, 3, 3);
  const boxShape = new CANNON.Box(halfExtents);
  const boxGeometry = new THREE.BoxGeometry(
    halfExtents.x * 2,
    halfExtents.y * 2,
    halfExtents.z * 2,
  );

  for (let i = 0; i < 30; i++) {
    const boxBody = new CANNON.Body({
      mass: 5,
      material: boxMaterial,
      collisionFilterGroup: COLLISION_GROUPS.STATIC,
      collisionFilterMask: -1,
    });
    boxBody.addShape(boxShape);
    const boxMesh = new THREE.Mesh(boxGeometry, material);

    const x = (Math.random() - 0.5) * 60;
    const y = (Math.random() - 0.5) * 1 + 4;
    const z = (Math.random() - 0.5) * 60;

    boxBody.position.set(x, y, z);
    boxMesh.position.copy(boxBody.position);

    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;

    // Create helper geometry and mesh for Cannon body
    const helperGeometry = new THREE.BoxGeometry(
      halfExtents.x * 2,
      halfExtents.y * 2,
      halfExtents.z * 2,
    );
    const helperMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    const helper = new THREE.Mesh(helperGeometry, helperMaterial);

    // Create update function for this helper
    const updateHelper = () => {
      helper.position.copy(boxBody.position);
      helper.quaternion.copy(boxBody.quaternion);
    };
    updateHelpers.push(updateHelper);

    world.addBody(boxBody);
    scene.add(boxMesh);

    boxes.push(boxBody);
    boxMeshes.push(boxMesh);
  }

  boxesStore.getState().setBoxes(boxes);
  boxesStore.getState().setBoxMeshes(boxMeshes);
  return updateHelpers;
}
