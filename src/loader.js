import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function loadGameAssets() {
  const gltfLoader = new GLTFLoader();
  const models = {};

  const assetPaths = {
    // Játékos
    witch: '/assets/models/character/witch.glb',

    // Környezet
    tile1: '/assets/models/environment/tile_01.glb',
    tile2: '/assets/models/environment/tile_02.glb',
    tile3: '/assets/models/environment/tile_03.glb',
    fence: '/assets/models/environment/fence.glb',

    // Ellenségek
    mummy: '/assets/models/enemies/mummy.glb',
    skeleton: '/assets/models/enemies/skeleton.glb',
    zombie: '/assets/models/enemies/zombie.glb',

    // Cukorkák
    treat1: '/assets/models/items/treat_01.glb',
    treat2: '/assets/models/items/treat_02.glb',
    treat3: '/assets/models/items/treat_03.glb',
  };

  const promises = Object.entries(assetPaths).map(([name, path]) => {
    return new Promise((resolve, reject) => {
      gltfLoader.load(
        path,
        (gltf) => {
          const scene = gltf.scene;
          scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.position.set(0, 0, 0);
            }
          });
          models[name] = scene;
          resolve();
        },
        undefined,
        reject,
      );
    });
  });

  await Promise.all(promises);
  return models;
}
