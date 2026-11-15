import * as THREE from 'three';
import { CONFIG } from '../config.js';

export function createEnemySpawner(scene, models) {
  const { enemies, lanes } = CONFIG;
  const activeObjects = [];
  let spawnTimer = 0;
  let spawnInterval = 2.0;

  // A betöltött ellenségek nevei
  const enemyTypes = ['mummy', 'skeleton', 'zombie'];

  function spawn() {
    // Random ellenség sorsolás
    const randomType =
      enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    // Ha a sorsolt modell még nincs betöltve, kilépünk
    if (!models[randomType]) return;

    const modelConfig = enemies.models[randomType];

    // Modell forgatása bal oldalra a CONFIG alapján
    const mesh = models[randomType].clone();
    mesh.rotation.y = modelConfig.rotationY;

    // Árnyékok engedélyezése a szörnyeken
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Sáv (Z) és Pozíció (X, Y) sorsolása
    const randomLaneIndex = Math.floor(Math.random() * lanes.length);
    const zPos = lanes[randomLaneIndex];

    mesh.position.set(enemies.spawnX, enemies.startY, zPos);

    // Adatok ütközésvizsgálathoz
    mesh.userData = {
      type: 'enemy', // életlevonás
      enemyName: randomType, // mivel ütközött
      laneIndex: randomLaneIndex,
      hitbox: new THREE.Box3().setFromObject(mesh),
    };

    scene.add(mesh);
    activeObjects.push(mesh);
  }

  function update(delta, speed) {
    // Időzítő növelése
    spawnTimer += delta;
    if (spawnTimer >= spawnInterval) {
      spawn();

      // Újrasorsoljuk az időt a CONFIG alapján
      spawnTimer = 0;
      const { min, max } = enemies.interval;
      spawnInterval = min + Math.random() * (max - min);
    }

    // Mozgatás és takarítás
    for (let i = activeObjects.length - 1; i >= 0; i--) {
      const obj = activeObjects[i];

      obj.position.x -= speed * delta;

      // Hitbox frissítése
      obj.userData.hitbox.setFromObject(obj);

      // Törlés, ha kiért a képernyőről
      if (obj.position.x < enemies.despawnX) {
        scene.remove(obj);
        activeObjects.splice(i, 1);
      }
    }
  }

  return {
    update,
    activeObjects,
  };
}
