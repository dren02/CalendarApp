<?php
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();

//retrieve the data 
$json_obj = json_decode($json_str, true);

$json_str = file_get_contents('php://input');
// store data into associative array
$event_id = $json_obj['event_id'];
$token = $json_obj['token'];

require "connect.php";

if($_SESSION['token'] != null){
    if ($_SESSION['token'] != $token){
        die(json_encode(array(
            "success" => false,
            "message" => "Forgery request detected"
        )));
    }
} else {
    die(json_encode(array(
        "success" => false,
        "message" => "No active session"
    )));
}

$stmt = $mysqli->prepare("DELETE FROM events where id= ?");
if (!$stmt) {
    echo json_encode(array(
        "success" => false,
        "message" => "event failed to be deleted"
    ));
    exit;
}  

$stmt->bind_param('i', $event_id);
if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $stmt->close();
            echo json_encode(array(
                "success" => true,
                "message" => "Event deletet."
            ));
            exit;
        } else {
            $stmt->close();
            echo json_encode(array(
                "success" => false,
                "message" => "Event does not exist in the database: " . $event_id
            ));
            exit;
        }
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "event cannot be deleted"
    ));
}
