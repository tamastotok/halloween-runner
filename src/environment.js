import * as THREE from 'three';
import { CONFIG } from './config.js';

export function createEnvironment(scene, models) {
  const { lights, tile, fence } = CONFIG.environment;

  // Fények
  const ambientLight = new THREE.AmbientLight(
    lights.ambient.color,
    lights.ambient.intensity,
  );
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(
    lights.directional.color,
    lights.directional.intensity,
  );

  dirLight.position.set(
    lights.directional.pos.x,
    lights.directional.pos.y,
    lights.directional.pos.z,
  );

  // Árnyékok
  const SHADOW_CENTER_X = 13;
  dirLight.position.x += SHADOW_CENTER_X;
  dirLight.target.position.set(SHADOW_CENTER_X, 0, 0);
  scene.add(dirLight.target);

  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.bias = -0.0005;
  dirLight.shadow.normalBias = 0.03;
  dirLight.shadow.camera.left = -40;
  dirLight.shadow.camera.right = 40;
  dirLight.shadow.camera.top = 20;
  dirLight.shadow.camera.bottom = -20;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 60;
  dirLight.shadow.camera.updateProjectionMatrix();
  scene.add(dirLight);

  // Talaj/csempe
  const groundTiles = [];

  for (let i = 0; i < tile.count; i++) {
    const tileGroup = new THREE.Group();
    const tileClone = models.tile1.clone();

    // Csempe spawn pozíciója az objektumból kinyerve
    tileClone.position.set(
      tile.spawnOffset.x,
      tile.spawnOffset.y,
      tile.spawnOffset.z,
    );
    tileGroup.add(tileClone);

    // Képernyőn kívülről indítjuk (balról) és pakoljuk egymás mellé
    tileGroup.position.x = (i - 2) * tile.width;
    scene.add(tileGroup);
    groundTiles.push(tileGroup);
  }

  // Kerítés
  // Árnyék: a kerítés vet árnyékot, de nem fogad, így a szomszédos szegmensek
  // nem árnyékolják egymást az illesztésnél.
  models.fence.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = false;
    }
  });

  const stepWidth = fence.rawWidth * fence.overlap;
  const fenceCount = Math.ceil((tile.count * tile.width) / stepWidth) + 3;
  const fenceSegments = [];

  for (let i = 0; i < fenceCount; i++) {
    const fenceClone = models.fence.clone();

    // Kerítés pozícionálása
    fenceClone.position.set(
      (i - 2) * stepWidth + fence.spawnOffset.x,
      fence.spawnOffset.y,
      fence.spawnOffset.z,
    );

    scene.add(fenceClone);
    fenceSegments.push(fenceClone);
  }

  // Update
  function update(delta, speed) {
    const moveDistance = speed * delta;

    // Talaj görgetése
    groundTiles.forEach((gTile) => {
      gTile.position.x -= moveDistance;
    });

    const firstTile = groundTiles[0];

    if (firstTile.position.x < -tile.width * tile.hideOffsetMult) {
      const lastTile = groundTiles[groundTiles.length - 1];

      // Áttesszük a sor végére jobb oldalra
      firstTile.position.x = lastTile.position.x + tile.width;
      groundTiles.push(groundTiles.shift());
    }

    // Kerítés görgetése
    fenceSegments.forEach((fSegment) => {
      fSegment.position.x -= moveDistance;
    });

    const firstFence = fenceSegments[0];

    if (firstFence.position.x < -stepWidth * 4 + fence.spawnOffset.x) {
      const lastFence = fenceSegments[fenceSegments.length - 1];
      firstFence.position.x = lastFence.position.x + stepWidth;
      fenceSegments.push(fenceSegments.shift());
    }
  }

  return { update };
}
