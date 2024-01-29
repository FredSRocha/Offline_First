<?php

include "../config.php";

try {
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(array("message" => "ID not provided"));
        exit;
    }

    $id = htmlspecialchars(strip_tags($id));

    $query = "SELECT id, text, status, created_at, updated_at FROM tasks WHERE id = :id";
    $stmt = $connection->prepare($query);

    $stmt->bindParam(":id", $id);
    
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        echo json_encode($row);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Task not found."));
    }
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Failed to retrieve task."));
}

?>