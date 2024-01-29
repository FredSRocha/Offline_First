<?php

include "../config.php";

try {
    $data = json_decode(file_get_contents("php://input"));

    if (
        isset($data->id) &&
        isset($data->text) &&
        isset($data->status) &&
        filter_var($data->id, FILTER_VALIDATE_INT) !== false
    ) {
        $query = "UPDATE tasks SET text = :text, status = :status WHERE id = :id";
        $stmt = $connection->prepare($query);

        $text = htmlspecialchars(strip_tags($data->text));
        $status = htmlspecialchars(strip_tags($data->status));
        $id = (int) $data->id;

        $stmt->bindParam(":text", $text);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            $sqlQuery = "SELECT updated_at FROM tasks WHERE id = :id";
            $statement = $connection->prepare($sqlQuery);

            $statement->bindParam(":id", $id);

            $statement->execute();

            if ($updatedAt = $statement->fetch(PDO::FETCH_ASSOC)) {
                http_response_code(200);
                echo json_encode(array("message" => "Task was updated.", "updated_at" => $updatedAt["updated_at"]));
              } else {
                http_response_code(200);
                echo json_encode(array("message" => "Task not found."));
              }
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to update task."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Incomplete or invalid data."));
    }
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Failed to update task."));
}

?>