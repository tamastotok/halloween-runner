export const CONFIG = {
  // Scene, Kamera, GameState - main.js
  mainScene: {
    bgColor: 0x130924,
    fogColor: 0x130924,
    fogDensity: 0.04,
  },
  cam: {
    perspective: {
      fov: 60,
      aspectRatio: window.innerWidth / window.innerHeight,
      nearPlane: 0.1,
      farPlane: 1000,
    },
    position: { x: 0, y: 3, z: 12 },
    lookAt: { x: 0, y: -1, z: 4 },
  },
  defaultGameSettings: {
    startLives: 3,
    startSpeed: 5.0,
    maxSpeed: 18.0,
    acceleration: 0.1,
  },

  // A 3 sáv pontos mélységi (Z) koordinátája: [hátsó, középső, első]
  lanes: [3, 5, 7],

  // Alap játékos beállítások
  player: {
    startX: 0, // Mennyire legyen balra a képernyőn
    startY: 0, // Alap magasság (lebegés)
    defaultLaneIndex: 1, // lanes indexe, 1 = Középső sáv, (index 0, 1, 2)
    rotationY: Math.PI / 3, // Merre nézzen a modell
    scale: 1.0,
  },

  // Környezeti beállítások (fények, talaj/csempe, kerítés)
  environment: {
    lights: {
      ambient: { color: 0x5a3d7a, intensity: 1.8 },
      directional: {
        color: 0xffa233,
        intensity: 2.5,
        pos: { x: 5, y: 8, z: 4 },
      },
    },
    tile: {
      width: 12.0,
      count: 8,
      spawnOffset: { x: -30, y: -1, z: -4 },
      hideOffsetMult: 4,
    },
    fence: {
      rawWidth: 4.0,
      overlap: 0.9,
      spawnOffset: { x: -32, y: -1, z: 10 },
    },
  },

  // Ellenség beállítások - enemy_spawner.js
  enemies: {
    spawnX: 25, // Hol jelenjen meg a képernyőn kívül jobbra
    despawnX: -15, // Hol tűnjön el balra
    startY: -0.35, // Alap magasság (a csempéhez igazítva)
    interval: {
      min: 1.5, // Minimum idő másodpercben két akadály között
      max: 3.0, // Maximum idő
    },
    models: {
      mummy: { rotationY: -Math.PI / 2, scale: 1.0 },
      skeleton: { rotationY: -Math.PI / 2, scale: 1.0 },
      zombie: { rotationY: -Math.PI / 2, scale: 1.0 },
    },
  },

  // Cukorka beállítások - item_spawner.js
  treats: {
    spawnX: 25,
    despawnX: -15,
    startY: 0.25, // Kicsit magasabbra tesszük, mint az ellenségeket!
    interval: {
      min: 0.8, // Sűrűbben jönnek, mint a szörnyek
      max: 1.5,
    },
    models: {
      treat1: { rotationY: 0, scale: 1.0 },
      treat2: { rotationY: 0, scale: 1.0 },
      treat3: { rotationY: 0, scale: 1.0 },
    },
  },
};
