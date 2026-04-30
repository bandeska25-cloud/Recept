<?php
require __DIR__ . '/config.php';

$body = read_json_body();
$id = (int)($body['id'] ?? 0);
if ($id <= 0) {
    json_response(['success' => false, 'error' => 'Hianyzo id.'], 400);
}

$nev = trim((string)($body['nev'] ?? ''));
$kategoriaid = (int)($body['kategoriaid'] ?? 0);
$felirdatum = clean_date($body['felirdatum'] ?? null);
$elsodatum = clean_date($body['elsodatum'] ?? null);

if ($nev === '' || $kategoriaid <= 0 || $felirdatum === null) {
    json_response(['success' => false, 'error' => 'Hianyzo kotelezo mezo.'], 400);
}

try {
    $stmt = db()->prepare(
        'UPDATE receptek SET nev = ?, kategoriaid = ?, felirdatum = ?, elsodatum = ? WHERE id = ?'
    );
    $stmt->execute([$nev, $kategoriaid, $felirdatum, $elsodatum, $id]);

    json_response([
        'success' => true,
        'data' => compact('id', 'nev', 'kategoriaid', 'felirdatum', 'elsodatum'),
        'rows' => $stmt->rowCount()
    ]);
} catch (PDOException $e) {
    json_response(['success' => false, 'error' => $e->getMessage()], 500);
}
