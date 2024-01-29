<?php

include "../config.php";

try {
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->id) && filter_var($data->id, FILTER_VALIDATE_INT)) {
        
        $id = (int) $data->id;

        $query = "DELETE FROM tasks WHERE id = :id";
        $stmt = $connection->prepare($query);

        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            $rowCount = $stmt->rowCount();
            if ($rowCount === 0) {
                http_response_code(404);
                echo json_encode(array("message" => "Task with the specified ID does not exist."));
            } else {
                echo json_encode(array("message" => "Task was deleted."));
            }
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to delete task."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Incomplete or invalid data."));
    }
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(array("message" => "Failed to delete task."));
}

?>