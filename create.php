<?php
header("Content-Type: application/json");

ini_set("session.cookie_httponly", 1);
session_start();

//retrieve the data 
$json_str = file_get_contents('php://input');
// store data into associative array
$json_obj = json_decode($json_str, true);

require 'connect.php';

$token = $json_obj['token'];
$user = $_SESSION['username'];
$datetime = $json_obj['new_time'];
$color =  $json_obj['new_color'];
//sanitize strings
$newtitle = $mysqli->real_escape_string($json_obj['new_title']);
$loc = $mysqli->real_escape_string($json_obj['new_location']);
$tag = $mysqli->real_escape_string($json_obj['new_tag']);

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

if ($_SESSION['username']) {

    $stmt = $mysqli->prepare("INSERT INTO events (author, title, dateandtime, location, tag, color) VALUES(?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    if (!$stmt->bind_param('ssssss', $user, $newtitle, $datetime, $loc, $tag, $color)) {
        printf("Bind Param Failed: %s\n", $stmt->error);
        exit;
    }
    if ($stmt->execute()) {
        $stmt->close();
        echo json_encode(array(
            "success" => true,
            "message" => "event created"
        ));
        exit;
    } else {
        $stmt->close();
        echo json_encode(array(
            "success" => false,
            "message" => "event cannot be created"
        ));
        exit;
    }
}