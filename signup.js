// new user sign up
function signupAjax() {
    const newuser = document.getElementById("usersignup").value;
    const newpass = document.getElementById("pwsignup").value;
    
    const data = { 'usersignup': newuser, 'pwsignup': newpass };
    console.log(data['usersignup']);
    console.log(data['pwsignup']);
    fetch("signup.php", { 
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(data =>  {
        const signupMessage = document.getElementById("signupMessage");
        if (data.success) {
            signupMessage.textContent = "Signed up successfully!";
            // Clear input fieldsonce user signs
            document.getElementById("usersignup").value = "";
            document.getElementById("pwsignup").value = "";
        } else {
            signupMessage.textContent = "Cannot sign up. Please try again";
        }
    })
}

document.getElementById("signup_btn").addEventListener("click", signupAjax, false);
