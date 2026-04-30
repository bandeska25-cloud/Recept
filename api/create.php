<?php
require __DIR__ . '/config.php';

$body = read_json_body();
$nev = trim((string)($body['nev'] ?? ''));
$kategoriaid = (int)($body['kategoriaid'] ?? 0);
$felirdatum = clean_date($body['felirdatum'] ?? null);
$elsodatum = clean_date($body['elsodatum'] ?? null);

if ($nev === '' || $kategoriaid <= 0 || $felirdatum === null) {
    json_response(['success' => false, 'error' => 'Hianyzo kotelezo mezo.'], 400);
}

try {
    $stmt = db()->prepare(
        'INSERT INTO receptek (nev, kategoriaid, felirdatum, elsodatum) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$nev, $kategoriaid, $felirdatum, $elsodatum]);
    $id = (int) db()->lastInsertId();

    json_response([
        'success' => true,
        'data' => compact('id', 'nev', 'kategoriaid', 'felirdatum', 'elsodatum')
    ], 201);
} catch (PDOException $e) {
    json_response(['success' => false, 'error' => $e->getMessage()], 500);
}
