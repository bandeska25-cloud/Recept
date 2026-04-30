# Recepttár - Webprogramozás 1 Előadás Beadandó

Készítette: **Molnár Ádám (MFG82Z)**

## Élő weboldal

`http://<subdomain>.nhely.hu` - telepítés után ide kerül.

## Menüpontok

| Fájl | Technológia | Pont |
|---|---|---|
| `index.html` | Főoldal és navigáció | 2 |
| `javascript.html` | Vanilla JS CRUD, tömbben tárolt adatok | 2 |
| `react.html` | React CRUD, kliens oldali state | 2 |
| `spa.html` | React SPA két mini-alkalmazással | 3 |
| `fetchapi.html` | Fetch API + PHP/MySQL CRUD | 4 |
| `axios.html` | React + Axios + PHP/MySQL CRUD | 4 |
| `oojs.html` | Objektumorientált JavaScript grafikus app | 3 |

## Választott adatbázis

A recept adatbázis fájljai: `etel.txt`, `kategoria.txt`, `hozzavalo.txt`, `hasznalt.txt`.
A CRUD oldalak az `etel.txt` adataira épülnek, kategórianévvel kiegészítve.

## Telepítés Nethely.hu-ra

1. Hozz létre MySQL adatbázist.
2. Importáld az `sql/schema.sql` fájlt phpMyAdminban.
3. Írd át az `api/config.php` fájlban a DB nevet, felhasználót és jelszót.
4. FTP-vel töltsd fel a HTML fájlokat, a `css/`, `js/`, `assets/`, `api/`, `sql/`, `react/` mappákat.

## React appok

A beadandó szerkezetéhez igazodva mindhárom React app tartalmaz `src` és működő `dist` mappát:

- `react/react-app/`
- `react/spa-app/`
- `react/axios-app/`

A `dist` mappák pinelt React/Axios UMD fájlokat használnak a `react/vendor/` könyvtárból, CDN tartalékkal.
