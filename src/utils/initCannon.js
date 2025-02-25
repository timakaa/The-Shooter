import * as CANNON from "cannon-es";
import * as THREE from "three";
import {
  COLLISION_GROUPS,
  GENERIC_MATERIAL,
  PHYSICS_MATERIAL,
  PLAYER_MATERIAL,
  BOX_MATERIAL,
} from "../constanst";
import cannonStore from "../store/cannonStore.js";

const boxMaterial = BOX_MATERIAL;

// Return in function
let ballBodies = [];
let world;

const balls = [];
const ballMeshes = [];
// =====

const material = GENERIC_MATERIAL;
const physicsMaterial = PHYSICS_MATERIAL;

export function initCannon(sphereBody) {
  world = new CANNON.World();

  // Tweak contact properties.
  // Contact stiffness - use to make softer/harder contacts
  world.defaultContactMaterial.contactEquationStiffness = 1e9;

  // Stabilization time in number of timesteps
  world.defaultContactMaterial.contactEquationRelaxation = 4;

  const solver = new CANNON.GSSolver();
  solver.iterations = 7;
  solver.tolerance = 0.1;
  world.solver = new CANNON.SplitSolver(solver);
  // use this to test non-split solver
  // world.solver = solver

  world.gravity.set(0, -10, 0);

  // Existing physics material for player (with low friction)
  const physics_physics = new CANNON.ContactMaterial(
    physicsMaterial,
    physicsMaterial,
    {
      friction: 0.0,
      restitution: 0.3,
    },
  );

  // Create contact material between box and physics material (player)
  const box_physics = new CANNON.ContactMaterial(boxMaterial, physicsMaterial, {
    friction: 0.5, // Keep it low for player movement
    restitution: 0.3,
  });

  // Create contact material between boxes
  const box_box = new CANNON.ContactMaterial(boxMaterial, boxMaterial, {
    friction: 0.5, // Higher friction between boxes
    restitution: 0.3,
  });

  // Create contact material between player and boxes
  const player_box = new CANNON.ContactMaterial(PLAYER_MATERIAL, boxMaterial, {
    friction: 0, // Higher friction between boxes
    restitution: 0.3,
  });

  const player_physics = new CANNON.ContactMaterial(
    PLAYER_MATERIAL,
    physicsMaterial,
    {
      friction: 0, // Higher friction between boxes
      restitution: 0.3,
    },
  );
  // Add all contact materials
  world.addContactMaterial(physics_physics);
  world.addContactMaterial(player_box);
  world.addContactMaterial(box_physics);
  world.addContactMaterial(box_box);
  world.addContactMaterial(player_physics);

  // Add the user collision sphere
  world.addBody(sphereBody);

  // Create the ground plane
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({
    mass: 0,
    material: physicsMaterial,
    collisionFilterGroup: COLLISION_GROUPS.STATIC,
    collisionFilterMask: -1,
  });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);

  cannonStore.getState().setWorld(world);
  cannonStore.getState().setBallBodies(ballBodies);
  cannonStore.getState().setBallMeshes(ballMeshes);
  cannonStore.getState().setBalls(balls);

  return {
    world,
    ballBodies,
    ballMeshes,
    balls,
  };
}
