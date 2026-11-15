import * as THREE from 'three';
import { CONFIG } from '../config.js';

export function createTreatSpawner(scene, models) {
  const { treats, lanes } = CONFIG;
  const activeTreats = [];
  let spawnTimer = 0;
  let spawnInterval = 1.0;

  // A betöltött cukorkák nevei
  const treatTypes = ['treat1', 'treat2', 'treat3'];

  function spawn(activeEnemies) {
    // Random cukorka sorsolás
    const randomType =
      treatTypes[Math.floor(Math.random() * treatTypes.length)];
    // Ha a sorsolt modell még nincs betöltve, kilépünk
    if (!models[randomType]) return;

    let randomLaneIndex;
    let isSafe = false;
    let attempts = 0;
    const minDistance = 5.0;

    // Megvizsgáljuk, hogy hol van az ellenség ezzel elkerülve a két modell egymásba spawnolását
    while (!isSafe && attempts < 10) {
      randomLaneIndex = Math.floor(Math.random() * lanes.length);

      const enemyInWay = activeEnemies.find((enemy) => {
        return (
          enemy.userData.laneIndex === randomLaneIndex &&
          Math.abs(enemy.position.x - treats.spawnX) < minDistance
        );
      });

      if (!enemyInWay) {
        isSafe = true;
      }
      attempts++;
    }

    if (!isSafe) return;

    const mesh = models[randomType].clone();
    const modelConfig = treats.models[randomType];

    mesh.rotation.y = modelConfig.rotationY;

    // Kicsi véletlenszerű méretezés a változatosságért
    const randomScale = modelConfig.scale * (0.8 + Math.random() * 0.4);
    mesh.scale.set(randomScale, randomScale, randomScale);

    // Árnyékok engedélyezése a cukorkákon
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const zPos = lanes[randomLaneIndex];

    mesh.position.set(treats.spawnX, treats.startY, zPos);

    // Adatokat ütközésvizsgálathoz
    mesh.userData = {
      type: 'treat', // számláló növelése
      treatName: randomType, // mivel ütközött
      laneIndex: randomLaneIndex,
      hitbox: new THREE.Box3().setFromObject(mesh),
      // Belső adatok a lebegő animációhoz
      baseY: treats.startY,
      randomOffset: Math.random() * Math.PI * 2, // Hogy ne egyszerre mozogjon az összes fel-le
    };

    scene.add(mesh);
    activeTreats.push(mesh);
  }

  function update(delta, speed, elapsedTime, activeEnemies) {
    // Időzítő növelése
    spawnTimer += delta;
    if (spawnTimer >= spawnInterval) {
      spawn(activeEnemies);

      // Újrasorsoljuk az időt a CONFIG alapján
      spawnTimer = 0;
      const { min, max } = treats.interval;
      spawnInterval = min + Math.random() * (max - min);
    }

    // Mozgatás és takarítás
    for (let i = activeTreats.length - 1; i >= 0; i--) {
      const treat = activeTreats[i];

      // Mozgatás balra (a pálya haladási sebességével)
      treat.position.x -= speed * delta;

      // Cukorka folyamatos forgása
      treat.rotation.y += delta * 2.0;

      // Cukorka lebegése
      treat.position.y =
        treat.userData.baseY +
        Math.sin(elapsedTime * 3.0 + treat.userData.randomOffset) * 0.2;

      // Hitbox frissítése a mozgás után
      treat.userData.hitbox.setFromObject(treat);

      // Törlés, ha kiért a képernyőről
      if (treat.position.x < treats.despawnX) {
        scene.remove(treat);
        activeTreats.splice(i, 1);
      }
    }
  }

  return {
    update,
    activeTreats,
  };
}
