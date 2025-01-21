<?php
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();

//retrieve the data 
$json_obj = json_decode($json_str, true);

$json_str = file_get_contents('php://input');
// store data into associative array
$json_obj = json_decode($json_str, true);

require "connect.php";

$user = $_SESSION['username'];
$event_id = $json_obj['event_id'];
$token = $json_obj['token'];

if ($_SESSION['token'] != null) {
    if ($_SESSION['token'] != $token) {
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

$datetime = $json_obj['edit_time'];
$color =  $json_obj['edit_color'];
$title = $mysqli->real_escape_string($json_obj['edit_title']);
$location = $mysqli->real_escape_string($json_obj['edit_location']);
$tag = $mysqli->real_escape_string($json_obj['edit_tag']);

if (isset($_SESSION['username'])) {
    $stmt = $mysqli->prepare("UPDATE events SET title = ?, dateandtime = ?, location = ?, tag = ?, color = ? WHERE id = ?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('sssssi', $title, $datetime, $location, $tag, $color, $event_id);
    if ($stmt->execute()) {
        $stmt->close();
        echo json_encode(array(
            "success" => true
        ));
        exit;
    } else {
        $stmt->close();
        echo json_encode(array(
            "success" => false
        ));
        exit;
    }
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid user"
    ));
    exit;
}

$stmt->close();
