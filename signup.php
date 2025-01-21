
<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$newuser = $json_obj['usersignup'];
$newpassword = $json_obj['pwsignup'];
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Register user
require 'connect.php';
if (isset($json_obj['usersignup']) && isset($json_obj['pwsignup'])) {
    if (!empty($newuser) && !empty($newpassword)) {
        // sanitize the strings
        $newuser = $mysqli->real_escape_string($newuser);
        $newpass = $mysqli->real_escape_string($newpassword);
        $hashpass = password_hash($newpass, PASSWORD_BCRYPT);
        $stmt = $mysqli->prepare("SELECT * FROM users WHERE user = ?");
        $stmt->bind_param("s", $newuser);
        $stmt->execute();
        $stmt->bind_result($usertest);
        $stmt->fetch();
        if ($usertest == 0) {
            $stmt = $mysqli->prepare("INSERT INTO users (user, pass) VALUES (?, ?)");
            if (!$stmt) {
                echo json_encode(array(
                    "success" => false,
                    "message" => "Try again!"
                ));
                exit;
            }
            $stmt->bind_param('ss', $newuser, $hashpass);
            if ($stmt->execute()) {
                $stmt->close();
                echo json_encode(array(
                    "success" => true
                ));
                exit;
            } else {
                $stmt->close();
                echo json_encode(array(
                    "success" => false,
                    "message" => "Cannot register user"
                ));
                exit;
            }
        } else {
            echo json_encode(array(
                "success" => false,
                "message" => "User already exist"
            ));
            exit;
        }
    } else {
        echo json_encode(array(
            "success" => false,
            "message" => "Cannot be blank"
        ));
        exit;
    }
} else {
    $stmt->close();
    echo json_encode(array(
        "success" => false,
        "message" => "Account not created"
    ));
    exit;
}
?>