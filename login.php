<?php
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();
 // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

// equivalent to $_POST['username'] and $_POST['password']
$username = $json_obj['username'];
$password = $json_obj['password'];

// Check to see if the username and password are valid. 
require 'connect.php';

// escape user input
$pw = $mysqli->real_escape_string($password);
$user = $mysqli->real_escape_string($username);

// Use a prepared statement
// correct login is entered, select relevant info from database
if (isset($json_obj['username']) && isset($json_obj['password'])) {
    if (!empty($username) && !empty($password)) {
        $stmt = $mysqli->prepare("SELECT COUNT(*), user, pass FROM users WHERE user=?");
        $stmt->bind_param('s', $user);
        $stmt->execute();
        $stmt->bind_result($cnt, $user_id, $pwd_hash);
        $stmt->fetch();
        // Compare the submitted password to the actual password hash
        if ($cnt == 1 && password_verify($pw, $pwd_hash)) {
            // Login succeeded
            
            $_SESSION['username'] = $username;
            $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
            echo json_encode(array(
                "success" => true,
                "token" => $_SESSION['token'],
                "message" => "You have been logged in!",
                "username" => $user
            ));
            exit;
        } else {
            echo json_encode(array(
                "success" => false,
                "token" => null,
                "message" => "Incorrect Username or Password."
            ));
            exit;
        }
    } else {
        echo json_encode(array(
            "success" => false,
            "token" => null,
            "message" => "Username or password cannot be blank"
        ));
    }
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Username/password invalid"
    ));
    exit;
}
