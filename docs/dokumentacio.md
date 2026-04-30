# Recepttár - dokumentáció forrás

Készítette: **Molnár Ádám (MFG82Z)**

## 1. Projekt bemutatása

A beadandó egy recepttár webalkalmazás, amely a kapott recept adatbázis fájljait dolgozza fel. A weboldal egységes fejléccel, navigációval és lábléccel rendelkezik.

## 2. Felhasznált adatok

- `etel.txt`: 116 étel.
- `kategoria.txt`: 6 kategória.
- `hozzavalo.txt`: 231 hozzávaló.
- `hasznalt.txt`: 1108 recept-hozzávaló kapcsolat.

## 3. Főoldal

Az `index.html` bemutatja az alkalmazást, tartalmazza a kötelező H1 címet és a menüpontokat.

## 4. JavaScript CRUD

A `javascript.html` oldal a `js/data.js` seed adatait tölti be, és a `js/javascript-crud.js` végzi a létrehozás, listázás, módosítás és törlés műveleteket.

## 5. React CRUD

A `react.html` egy iframe-ben tölti be a `react/react-app/dist/index.html` kimenetet. A forrás a `react/react-app/src/` mappában található.

## 6. SPA

A `spa.html` két menüpontos React SPA-t tartalmaz: adag kalkulátort és konyhai memóriajátékot. Mindkettő komponenseket és `useState` állapotot használ.

## 7. Fetch API

A `fetchapi.html` oldal Fetch API-val kommunikál a PHP végpontokkal: `list.php`, `create.php`, `update.php`, `delete.php`.

## 8. Axios

Az `axios.html` oldal React + Axios megoldást használ ugyanarra a PHP API-ra.

## 9. OOJS

Az `oojs.html` Canvas alapú grafikus alkalmazás. A `js/oojs-app.js` tartalmazza az objektumorientált megoldást.

## 10. Adatbázis

Az `sql/schema.sql` importálható phpMyAdminban. A `receptek` tábla idegen kulccsal kapcsolódik a `kategoriak` táblához, a `hasznalt` tábla pedig a recepteket és hozzávalókat köti össze.

## 11. Telepítés

1. SQL importálása.
2. `api/config.php` adatainak beállítása.
3. Fájlok feltöltése FTP-n.
4. Oldal ellenőrzése a tárhely URL-jén.

## 12. GitHub

A repository legyen publikus, legalább öt commit legyen benne időben elosztva.

## 13. Beadáshoz kitöltendő mezők

- Weboldal URL: `http://<subdomain>.nhely.hu`
- GitHub URL: beadás előtt kitöltendő
- FTP felhasználó: kitöltendő
- FTP jelszó: kitöltendő
- Adatbázis felhasználó: kitöltendő
- Adatbázis jelszó: kitöltendő

## 14. Képernyőképek helye

A végleges PDF dokumentációba minden menüpontról képernyőképet kell illeszteni.

## 15. Munkamegosztás

- Molnár Ádám: teljes alkalmazás, recept adatfeldolgozás, frontend oldalak, React részek, PHP API és dokumentáció előkészítése.
