<?php
require __DIR__ . '/config.php';

$body = read_json_body();
$id = (int)($body['id'] ?? ($_GET['id'] ?? 0));
if ($id <= 0) {
    json_response(['success' => false, 'error' => 'Hianyzo id.'], 400);
}

try {
    $stmt = db()->prepare('DELETE FROM receptek WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['success' => true, 'rows' => $stmt->rowCount()]);
} catch (PDOException $e) {
    json_response(['success' => false, 'error' => $e->getMessage()], 500);
}
