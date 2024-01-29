<?php

include "../config.php";

try {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->id) && (isset($data->text) || isset($data->status))) {
        $id = htmlspecialchars(strip_tags($data->id));
        $text = isset($data->text) ? htmlspecialchars(strip_tags($data->text)) : null;
        $status = isset($data->status) ? htmlspecialchars(strip_tags($data->status)) : null;

        if ($status !== null && !in_array($status, ["pending", "completed"])) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid status. Please provide 'pending' or 'completed'."));
            exit;
        }

        $query = "UPDATE tasks SET ";
        if ($text !== null) {
            $query .= "text = :text ";
        }
        if ($status !== null) {
            if ($text !== null) {
                $query .= ", ";
            }
            $query .= "status = :status ";
        }
        $query .= "WHERE id = :id";
        $stmt = $connection->prepare($query);
        if ($text !== null) {
            $stmt->bindParam(":text", $text);
        }
        if ($status !== null) {
            $stmt->bindParam(":status", $status);
        }
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
                http_response_code(404);
                echo json_encode(array("message" => "Task not found."));
            }
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to update task."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Incomplete data. Please provide 'id' and at least one of 'text' or 'status'."));
    }
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Failed to update task."));
}

?>
