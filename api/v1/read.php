<?php

include "../config.php";

function readTasks() {
  try {
    global $connection;
    $query = "SELECT id, text, status, created_at FROM tasks";
    $stmt = $connection->prepare($query);
    
    $stmt->execute();

    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    return $tasks;
  } catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Failed to retrieve tasks."));
    exit;
  }
}

echo json_encode(readTasks());

?>