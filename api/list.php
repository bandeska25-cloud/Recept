<?php
require __DIR__ . '/config.php';

try {
    $stmt = db()->query(
        'SELECT r.id, r.nev, r.kategoriaid, k.nev AS kategoria,
                DATE_FORMAT(r.felirdatum, "%Y-%m-%d") AS felirdatum,
                DATE_FORMAT(r.elsodatum, "%Y-%m-%d") AS elsodatum
         FROM receptek r
         LEFT JOIN kategoriak k ON k.id = r.kategoriaid
         ORDER BY r.id'
    );
    json_response(['success' => true, 'data' => $stmt->fetchAll()]);
} catch (PDOException $e) {
    json_response(['success' => false, 'error' => $e->getMessage()], 500);
}
