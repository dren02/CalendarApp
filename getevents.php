<?php
    header("Content-Type: application/json");
    //for checking if session is valid - uncomment when it works
    ini_set("session.cookie_httponly", 1);
    session_start();
    $json_obj = json_decode($json_str, true);

    $json_str = file_get_contents('php://input');
    // store data into associative array
    $json_obj = json_decode($json_str, true);

    $token = $json_obj['token'];
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

    //retrieve the data 
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);

    require 'connect.php';

    //sanitize strings
    $month = $mysqli->real_escape_string($json_obj['month']);
    $month = $month + 1;
    $date = $mysqli->real_escape_string($json_obj['date']);
    $userIn = $mysqli->real_escape_string($_SESSION['username']);
    $date = (string)$date;
    if (strlen($date) == 1){
        $date = "0" . $date;
    }
    $year = $mysqli->real_escape_string($json_obj['year']);
    $search = $year . "-" . $month . "-" . $date; 

    $stmt = $mysqli->prepare("SELECT * FROM events WHERE LEFT(dateandtime, 10) = LEFT(?, 10) AND (author=?) ");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    if (!$stmt->bind_param('ss', $search,  $userIn)) {
        printf("Bind Param Failed: %s\n", $stmt->error);
        exit;
    } 
    if ($stmt->execute()) {
        $result = $stmt->get_result(); // Get the result set

        $events = array(); // Create an array to hold the results

        while ($row = $result->fetch_assoc()) {
            $events[] = $row; // Populate the $events array with data from the database
        }

        $stmt->close();
        echo json_encode(array(
            "othermessage" => "executed sql statement",
            "success" => true,
            "message" => "valid session, loading events...",
            "events" => $events
        ));
        exit;
    } else {
        $stmt->close();
        echo json_encode(array(
            "success" => false,
            "message" => "failed to execute stmt with date: " . $search,
            "events" => "null"
        ));
        exit;
    }

?>