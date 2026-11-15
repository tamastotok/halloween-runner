import * as THREE from 'three';
import { CONFIG } from './config.js';
import { loadGameAssets } from './loader.js';
import { createPlayer } from './player.js';
import { createEnvironment } from './environment.js';
import { createEnemySpawner } from './spawners/enemy_spawner.js';
import { createTreatSpawner } from './spawners/treat_spawner.js';
import { createHUD } from './hud.js';

async function initGame() {
  const { mainScene, cam, defaultGameSettings } = CONFIG;
  // 1. Scene, Kamera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(mainScene.bgColor);
  scene.fog = new THREE.FogExp2(mainScene.fogColor, mainScene.fogDensity);

  // Kamera beállítása 2.5D Scroll nézethez
  const camera = new THREE.PerspectiveCamera(
    cam.perspective.fov,
    cam.perspective.aspectRatio,
    cam.perspective.nearPlane,
    cam.perspective.farPlane,
  );

  camera.position.set(cam.position.x, cam.position.y, cam.position.z);
  camera.lookAt(cam.lookAt.x, cam.lookAt.y, cam.lookAt.z);

  const canvas = document.querySelector('#game-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Assetek betöltése
  const models = await loadGameAssets();
  const environment = createEnvironment(scene, models);
  const player = createPlayer(scene, models.witch);
  const enemySpawner = createEnemySpawner(scene, models);
  const treatSpawner = createTreatSpawner(scene, models);

  //HUD Létrehozása
  const hud = createHUD();

  // Játék állapota (Ezt kell módosítani ütközéskor)
  const gameState = {
    score: 0,
    lives: defaultGameSettings.startLives,
    speed: defaultGameSettings.startSpeed,
    isGameOver: false,
  };

  // Game Loop
  const clock = new THREE.Timer();
  renderer.compile(scene, camera);

  function animate() {
    requestAnimationFrame(animate);

    clock.update();
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsed();

    if (!gameState.isGameOver) {
      // Pálya gyorsítása idővel (kb 2 percen át gyorsul a max sebességig)
      if (gameState.speed < defaultGameSettings.maxSpeed) {
        gameState.speed += delta * defaultGameSettings.acceleration;
      }

      environment.update(delta, gameState.speed);
      player.update(delta, elapsedTime);
      enemySpawner.update(delta, gameState.speed);
      treatSpawner.update(
        delta,
        gameState.speed,
        elapsedTime,
        enemySpawner.activeObjects,
      );

      // HUD frissítése az aktuális állapot alapján
      hud.update(gameState);

      // --- TESZTELÉSHEZ ---
      // Minden 100. frame-en kap egy cukorkát:
      //if (Math.random() < 0.01) gameState.score += 1;
      // Szimuláljuk, hogy sérül:
      //if (Math.random() < 0.001 && gameState.lives > 0) gameState.lives -= 1;
    }

    renderer.render(scene, camera);
  }

  animate();
}

initGame();
