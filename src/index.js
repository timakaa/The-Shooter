import * as CANNON from "cannon-es";
import * as THREE from "three";
import { initThree } from "./utils/initThree";
import { loadTextures } from "./utils/loadTextures";
import { initCannon } from "./utils/initCannon";
import {
  TIME_STEP,
  GENERIC_MATERIAL,
  COLLISION_GROUPS,
  PLAYER_MATERIAL,
} from "./constanst";
import { initPointerLock } from "./utils/initPointerLock";
import threeStore from "./store/threeStore";
import cannonStore from "./store/cannonStore";
import boxesStore from "./store/boxesStore";
import { addBoxes } from "./utils/addBoxes";
import bulletsStore from "./store/bulletsStore";

let lastCallTime = performance.now();

// Three store variables
let controls = null;
let scene = null;
let renderer = null;
let camera = null;
let stats = null;

threeStore.subscribe((state) => {
  controls = state.controls;
  scene = state.scene;
  renderer = state.renderer;
  camera = state.camera;
  stats = state.stats;
});

// Cannon store variables
let world = null;
let ballMeshes = [];
let balls = [];

cannonStore.subscribe((state) => {
  world = state.world;
  boxes = state.boxes;
  boxMeshes = state.boxMeshes;
  ballMeshes = state.ballMeshes;
  balls = state.balls;
});

let ballBodies = [];

// Boxes store variables
let boxes = [];
let boxMeshes = [];

boxesStore.subscribe((state) => {
  boxes = state.boxes;
  boxMeshes = state.boxMeshes;
});

// Create the user collision sphere
const userArea = 0.5;
const userHeight = 2;
const userShape = new CANNON.Box(
  new CANNON.Vec3(userArea, userHeight, userArea),
);
const userBody = new CANNON.Body({
  mass: 1,
  material: PLAYER_MATERIAL,
  fixedRotation: true,
  collisionFilterGroup: COLLISION_GROUPS.PLAYER,
  collisionFilterMask: ~COLLISION_GROUPS.BULLETS,
});
userBody.addShape(userShape);
userBody.position.set(0, 5, 0);
userBody.linearDamping = 0.92;
userBody.angularFactor.set(0, 0, 0);
userBody.friction = 0.5;
userBody.restitution = 0.3;

async function init() {
  initCannon(userBody);
  initThree();
  await loadTextures(); // Wait for textures to load
  initPointerLock(userBody);
  addBoxes();
  animate();
}

init();

// The shooting balls
const shootVelocity = 55;
const ballShape = new CANNON.Sphere(0.2);
const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);

// Returns a vector pointing the the diretion the camera is at
function getShootDirection() {
  const vector = new THREE.Vector3(0, 0, 1);
  vector.unproject(camera);
  const ray = new THREE.Ray(
    userBody.position,
    vector.sub(userBody.position).normalize(),
  );
  return ray.direction;
}

window.addEventListener("click", (event) => {
  if (!controls.enabled) {
    return;
  }

  const ballBody = new CANNON.Body({
    mass: 5000,
    collisionFilterGroup: COLLISION_GROUPS.BULLETS,
    collisionFilterMask: -1,
  });
  ballBody.addShape(ballShape);
  // const ballMesh = new THREE.Mesh(ballGeometry, GENERIC_MATERIAL);
  const textureMesh = bulletsStore.getState().textureMesh;
  const ballMesh = textureMesh.clone();

  ballMesh.castShadow = true;
  ballMesh.receiveShadow = true;

  world.addBody(ballBody);
  scene.add(ballMesh);
  balls.push(ballBody);
  ballMeshes.push(ballMesh);
  ballBodies.push(ballBody);

  const shootDirection = getShootDirection();
  ballBody.velocity.set(
    shootDirection.x * shootVelocity,
    shootDirection.y * shootVelocity,
    shootDirection.z * shootVelocity,
  );
  ballBody.angularVelocity.set(4, 10, 10);

  // Move the ball outside the player sphere
  const x =
    userBody.position.x + shootDirection.x * (userArea + ballShape.radius);
  const y =
    userBody.position.y +
    shootDirection.y * (userArea + ballShape.radius) +
    1.8;
  const z =
    userBody.position.z + shootDirection.z * (userArea + ballShape.radius);
  ballBody.position.set(x, y, z);
  ballMesh.position.copy(ballBody.position);

  setTimeout(() => {
    if (ballBodies.length > 0) {
      const lastBallBody = ballBodies.shift();
      const lastBallMesh = ballMeshes.shift();
      balls.shift();

      world.removeBody(lastBallBody);
      scene.remove(lastBallMesh);
    }
  }, 5000);
});

world.addEventListener("preStep", () => {
  for (let i = 0; i < ballBodies.length; i++) {
    // Define your custom gravity acceleration (m/s²)
    const customGravity = new CANNON.Vec3(0, 9, 0);

    // Calculate force: F = m * a (mass * acceleration)
    const gravityForce = customGravity.scale(ballBodies[i].mass);

    // Apply the force to the body
    ballBodies[i].applyForce(gravityForce);
  }

  const customGravityForUserWhenJumping = new CANNON.Vec3(0, -25, 0);
  const force = customGravityForUserWhenJumping.scale(userBody.mass);
  userBody.applyForce(force);
});

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() / 1000;
  const dt = time - lastCallTime;
  lastCallTime = time;

  if (controls?.enabled) {
    world.step(TIME_STEP, dt);

    // Update ball positions
    for (let i = 0; i < balls.length; i++) {
      ballMeshes[i].position.copy(balls[i].position);
      ballMeshes[i].quaternion.copy(balls[i].quaternion);
    }

    // Update box positions
    for (let i = 0; i < boxes.length; i++) {
      boxMeshes[i].position.copy(boxes[i].position);
      boxMeshes[i].quaternion.copy(boxes[i].quaternion);
    }
  }

  controls?.update(dt);
  renderer.render(scene, camera);
  stats.update();
}
