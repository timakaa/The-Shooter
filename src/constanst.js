import * as THREE from "three";
import * as CANNON from "cannon-es";

export const TIME_STEP = 1 / 60;

export const GENERIC_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0xdddddd,
});

export const PHYSICS_MATERIAL = new CANNON.Material("physics");
export const PLAYER_MATERIAL = new CANNON.Material("player");
export const BOX_MATERIAL = new CANNON.Material("box");

export const COLLISION_GROUPS = {
  PLAYER: 1,
  BULLETS: 2,
  STATIC: 4,
  DEFAULT: 8,
};
