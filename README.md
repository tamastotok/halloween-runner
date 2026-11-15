# Halloween Runner - 2.5D Three.js WebGL Projekt

Ez a dokumentáció a projekt jelenlegi architektúráját és a hátralévő implementációs feladatokat (irányítás, ütközésvizsgálat, játékmenet) foglalja össze. A projekt magja, a környezet és az entitások procedurális generálása (Side-scrolling logika) elkészült.

## Architektúra és Fájlstruktúra

A kód szigorúan szétválasztja a statikus konfigurációt és a dinamikus játékállapotot.

- **`config.js` (A Központi Agy):** Minden fix beállítás (pálya méretei, sebességhatárok, sávok Z koordinátái, modellek eltolásai) itt található. Ha teszteléshez gyorsítani kell a játékot, vagy át kell állítani egy sáv helyzetét, az ebben a fájlban végrehajtható.
- **`main.js`:** A belépési pont. Tartalmazza a Three.js inicializálását, a Game Loop-ot (`animate`), és a dinamikusan változó `gameState` objektumot (aktuális pontszám, sebesség, életek).
- **`environment.js`:** A végtelenített, görgetett talaj és háttér (kerítés) logikája.
- **`enemy_spawner.js` & `treat_spawner.js`:** Az akadályokat (ellenségek) és a felszedhető tárgyakat (cukorkák) sorsolják a megadott 3 sáv valamelyikére. A cukorka spawner figyeli az ellenségeket, így sosem spawnolnak egymásba.
- **`player.js`:** A boszorkány (játékos) logikája és pozícionálása.
- **`hud.js`:** DOM manipuláció a pontszámokhoz és az élet-szívecskékhez.

---

## Hátralévő Feladatok

A játékmechanika befejezéséhez az alábbi három logikai lépést kell kidolgozni a meglévő alapokon.

### 1. Játékos Irányítás (Sávos rendszer)

A mozgás nem analóg, hanem szigorúan 3 sávos (bináris) rendszerben történik.

- A sávok pontos Z koordinátái a `CONFIG.lanes` tömbben vannak (index: 0, 1, 2).
- **Feladat (`player.js`):** Eseményfigyelők (Event Listener) bekötése a billentyűzetre (pl. Fel/Le vagy Bal/Jobb nyilak). Gombnyomásra a `currentLaneIndex` értéket kell növelni/csökkenteni (0 és 2 között tartva), és a boszorkány Z pozícióját a `CONFIG.lanes[aktualisIndex]` értékre frissíteni.

### 2. Ütközésvizsgálat (Collision Detection)

A két spawner folyamatosan frissülő tömböket ad vissza az aktív elemekről: `enemySpawner.activeObjects` és `itemSpawner.activeTreats`.
Minden legenerált 3D modell (`mesh`) rendelkezik egy egyedi `userData` objektummal, ami tartalmazza a naprakész Hitboxot.

- Egy objektum doboza (Bounding Box): `obj.userData.hitbox` (Ez egy `THREE.Box3` objektum).
- Típusa: `obj.userData.type` (Értéke: `'enemy'` vagy `'treat'`).
- **Feladat (`main.js`):** A Game Loop-on belül a boszorkány Hitboxát (ezt is létre kell hozni/frissíteni a `player.js`-ben) össze kell vetni a pályán lévő aktív elemek Hitboxaival.

### 3. Játékállapot és Pontozás (Game State)

A `main.js`-ben található `state` objektum tartalmazza az eredményjelző adatait.

- **Feladat (`main.js`):** Ütközés esetén a típustól függően módosítani kell a `state`-et:
  - Ha `type === 'treat'`: `state.score += 1` (majd törölni kell a cukorkát a scene-ből és a tömbből, hogy ne adja hozzá frame-enként).
  - Ha `type === 'obstacle'`: `state.lives -= 1` (érdemes egy rövid sérthetetlenségi ablakot (iframes) vagy debounce-ot írni, hogy egy ütközés ne vigye le az összes életet egyszerre).
- A HUD modul ezt a `state` objektumot kapja meg minden frame-ben, és automatikusan frissíti a HTML felületet (pontszám, piros/szürke szívek), ha változást érzékel.

## Linkek

Modellek:  
[Stylized Halloween Asset Pack](https://www.cgtrader.com/free-3d-models/various/various-models/free-stylized-halloween-asset-pack)

Saját talaj és kerítés modellek udemy kurzus alapján elkészítve:  
[Complete Blender Creator: 3D Modelling](https://www.udemy.com/share/101Wbc/)
