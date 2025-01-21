<?php
    header("Content-Type: application/json"); 
    ini_set("session.cookie_httponly", 1);
    session_start();
    // will return the current session token (if set) and success
    if ($_SESSION['token']) {
        echo json_encode(array(
            "success" => true,
            "token" => $_SESSION['token'],
            "username" => $_SESSION['username']
        ));
    } else {
        echo json_encode(array(
            "success" => false,
            "token" => null,
            "username" => null
        ));
    }
    
?>