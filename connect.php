<?php
ini_set("session.cookie_httponly", 1);
    // user is webnews; database named calendar
    $mysqli = new mysqli('localhost', 'webnews', 'php', 'calendar');
    if($mysqli->connect_errno) {
	    printf("Connection Failed: %s\n", $mysqli->connect_error);
	    exit;
    }
?>