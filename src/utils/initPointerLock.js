import { DOM } from "../domElements";
import { PointerLockControlsCannon } from "./PointerLockControlsCannon.js";
import threeStore from "../store/threeStore.js";
const { instructions } = DOM;

export function initPointerLock(sphereBody) {
  const scene = threeStore.getState().scene;
  const camera = threeStore.getState().camera;

  const controls = new PointerLockControlsCannon(camera, sphereBody);
  threeStore.getState().setControls(controls);
  scene.add(controls.getObject());

  instructions.addEventListener("click", () => {
    controls.lock();
  });

  controls.addEventListener("lock", () => {
    controls.enabled = true;
    instructions.style.display = "none";
  });

  controls.addEventListener("unlock", () => {
    controls.enabled = false;
    instructions.style.display = null;
  });
}
