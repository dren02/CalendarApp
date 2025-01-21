// user login
function loginAjax() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = { "username": username, "password": password };

    fetch("login.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type" : "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
           // document.cookie = "loggedIn=true"; 
            const loginMessage = document.getElementById("loginMessage");
            loginMessage.textContent = `Hello, ${username}!`;
             // Clear input fields once user logs in
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            document.getElementById("signupMessage").textContent= "";
            document.getElementById('logoutButton').removeAttribute('hidden');
            document.getElementById('new_event').removeAttribute('hidden');
             // remove login and signup inputs
             document.querySelector('.log_sign').style.display='none';
            localStorage.setItem("token", data.token);
            // modified:
            localStorage.setItem("username", data.username);
            updateCalendar(getCurTime());

            // csrf_token();
        } else {
            loginMessage.textContent = `You are not logged in: ${data.message}`;
        }
    })
    .catch(err => console.error(err));
}
$(document).ready(function(){
    document.getElementById("login_btn").addEventListener("click", loginAjax, false);
});
function csrf_token () {
    fetch("verifysession.php", {
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(function(data) {
        if (data.success) {
            token = data.token;
        } else {
            console.log("invalid token");
        } 
    })
    .catch(err => console.error(err));

}