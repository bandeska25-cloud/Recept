# PRD - Recepttár beadandó

## Cél

A Webprogramozás 1 előadás beadandó követelményeinek megfelelő, több menüpontos receptes webalkalmazás elkészítése.

## Követelmények lefedése

- Főoldal: `index.html`, H1 címsorral és lábléccel.
- JavaScript CRUD: `javascript.html`, kliens oldali tömbbel.
- React CRUD: `react.html`, `react/react-app/src` és `dist` mappával.
- SPA: `spa.html`, két React mini-alkalmazással.
- Fetch API: `fetchapi.html`, `js/fetchapi-crud.js`, `api/*.php`.
- Axios: `axios.html`, `react/axios-app`.
- OOJS: `oojs.html`, `js/oojs-app.js` class, constructor, metódus, extends, super és `document.body.appendChild` használattal.
- SQL: `sql/schema.sql`, recept, kategória, hozzávaló és kapcsolat táblákkal.

## Adatmodell

- `kategoriak(id, nev)`
- `receptek(id, nev, kategoriaid, felirdatum, elsodatum)`
- `hozzavalok(id, nev)`
- `hasznalt(id, mennyiseg, egyseg, etelid, hozzavaloid)`

## Készítő

- Molnár Ádám, Neptun kód: MFG82Z.
