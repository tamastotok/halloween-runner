import { CONFIG } from './config.js'; // Vagy az elérés, ahová tetted

export function createPlayer(scene, witchModel) {
  const { player, lanes } = CONFIG;
  // Modell klónozása és beállítása
  const mesh = witchModel.clone();

  // Egyedi árnyék beállítás
  mesh.traverse((child) => {
    if (child.isMesh) {
      child.receiveShadow = false;
    }
  });

  // Belső állapot (Ezeket kell majd módosítani a billentyűzet alapján)
  let currentLaneIndex = CONFIG.player.defaultLaneIndex;
  let baseY = CONFIG.player.startY;

  // Sidescroller kezdő pozíció beállítása a CONFIG alapján
  mesh.position.set(
    player.startX,
    baseY,
    lanes[currentLaneIndex], // Itt olvassa ki a pontos sáv Z koordinátáját!
  );

  // Boszi elforgatása jobbra
  mesh.rotation.y = player.rotationY;

  scene.add(mesh);

  // Update
  function update(delta, elapsedTime) {
    // Egy alap lebegés animáció
    mesh.position.y = baseY + Math.sin(elapsedTime * 2.5) * 0.2;

    // Hitbox frissítés (THREE.Box3) és oldalirányú mozgás
  }

  return {
    mesh,
    update,
  };
}
