<?php

include "../config.php";

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->text) || empty($data->text)) {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data. Please provide the 'text' field."));
    exit;
}

if (isset($data->status) && !in_array($data->status, array("pending", "completed"))) {
    http_response_code(400);
    echo json_encode(array("message" => "Invalid status. Please provide 'pending' or 'completed'."));
    exit;
}

try {
    $query = "INSERT INTO tasks (text, status) VALUES (:text, :status)";
    $stmt = $connection->prepare($query);

    $text = htmlspecialchars(strip_tags($data->text));
    $status = isset($data->status) ? htmlspecialchars(strip_tags($data->status)) : "pending";

    $stmt->bindParam(":text", $text);
    $stmt->bindParam(":status", $status);

    if ($stmt->execute()) {
        $lastId = $connection->lastInsertId();
        http_response_code(201);
        echo json_encode(array("message" => "Task was created.", "id" => $lastId));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Unable to create task."));
    }
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Internal server error."));
}

?>