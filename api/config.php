<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$host = "localhost";
$db_name = "";
$username = "";
$password = "";
$connection = null;

try {
    $connection = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $connection->exec("set names utf8");
} catch (PDOException $exception) {
    echo "Connection error: " . $exception->getMessage();
    exit();
}