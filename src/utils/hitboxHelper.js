import * as THREE from "three";
import threeStore from "../store/threeStore";

export function createHitboxHelper(body, color = 0xff0000) {
  // Create a mesh that matches the hitbox
  const geometry = new THREE.BoxGeometry(
    body.shapes[0].halfExtents.x * 2, // width
    body.shapes[0].halfExtents.y * 2, // height
    body.shapes[0].halfExtents.z * 2, // depth
  );
  const material = new THREE.MeshBasicMaterial({
    color: color,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const hitboxMesh = new THREE.Mesh(geometry, material);

  // Add to scene
  threeStore.getState().scene.add(hitboxMesh);

  // Update function to sync with physics body
  function updateHitbox() {
    hitboxMesh.position.copy(body.position);
    hitboxMesh.quaternion.copy(body.quaternion);
  }

  return {
    mesh: hitboxMesh,
    update: updateHitbox,
  };
}
