function logoutAjax(event) {
    fetch("logout.php", {
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(function(data){
        if (data.success) {
            console.log("Success Logout");
            document.getElementById('logoutButton').setAttribute('hidden', 'true');
            document.querySelector(".log_sign").style.display = "block";
            document.getElementById("loginMessage").style.display = "none";
            document.getElementById('new_event').setAttribute('hidden', 'true');
            // update calendar - remove events 
            updateCalendar(getCurTime());
        } else {
            console.log(`Cannot Logout: ${data.message}`);
        } 
    })
        .catch(err => console.error(err));
} 

document.getElementById("logoutButton").addEventListener("click", logoutAjax, false); // Bind the AJAX call to button click

