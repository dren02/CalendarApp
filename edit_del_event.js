// Will make a popup where user can edit events
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function modify(){
    $( "#calendar" ).on( "click", ".edit", function() {
        // Get event id from the button that was clicked
        console.log($(this).parent().parent().attr("id"));
        let event_id = $(this).parent().parent().attr("id");
        console.log("edit button click detected");
        vex.dialog.open({
            message: 'Edit Event',
            input: [ 
                '<input type="hidden" name="event_id" id="event_id" value="' + event_id + '" />',
                '<input name="edit_token" id="edit_token" type="hidden" required/>',
                '<input name="edit_title" id="edit_title" type="text" placeholder="New Event Title" required/>',
                '<input name="edit_time" id="edit_time" type="datetime-local" required />',
                '<input name="edit_location" id="edit_location" type="text" placeholder="Location"/>',
                '<input name="edit_tag" id="edit_tag" type="text" placeholder="Tag"/>',
                '<label for="edit_color">Pick a tag color: </label>',
                '<select name="edit_color" id="edit_color">',
                    '<option value="red">Red</option>',
                    '<option value="orange">Orange</option>',
                    '<option value="yellow">Yellow</option>',
                    '<option value="green">Green</option>',
                    '<option value="blue">Blue</option>',
                    '<option value="purple">Purple</option>',
                    '<option value="pink">Pink</option>',
                '</select>'

            ].join(''),
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, { text: 'Edit Event' }),
                $.extend({}, vex.dialog.buttons.NO, { text: 'Exit' })
            ],
            callback: function (data) { 
                if (!data) { 
                    console.log("Input your event information");
                } else if (data.new_title != null && !data.new_time != null) {
                    console.log("Please enter a title and a time.");
                } else {
                    let send = {
                    "event_id":  event_id, 
                    "token": localStorage.getItem("token"), 
                    "edit_title": data.edit_title, 
                    "edit_time": data.edit_time, 
                    "edit_location": data.edit_location, 
                    "edit_tag": data.edit_tag, 
                    "edit_color": data.edit_color
                };
                    fetch("editevent.php", {
                        method: 'POST',
                        body: JSON.stringify(send),
                        headers: { "Content-Type" : "application/json" }
                    })
                    .then(response => response.json())
                    .then(send => {
                        if (send.success) {
                            console.log("Event Edited!");
                            updateCalendar(getCurTime());
                        } else {
                            console.log("Unable to edit event.");
                        }
                    })
                    .catch(err => console.error(err));
                    
                }
            }
        })
    } );
}

// Will make a popup where user can delete events
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteListen(){
    console.log("Delete event doc");
    $( "#calendar" ).on( "click", ".delete", function() {
        console.log($(this).parent().parent().attr("id"));
        let event_id = $(this).parent().parent().attr("id");
        vex.dialog.open({
            message: 'Are you sure?',
            input: [
                '<input type="hidden" name="event_id" id="event_id" value="' + event_id + '" />'
            ].join(''),
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, { text: 'Delete Event' }),
                $.extend({}, vex.dialog.buttons.NO, { text: 'Exit' })
            ],
            callback: function (data) {
                let send = {'event_id': event_id, 'token': localStorage.getItem("token")};
                fetch("deleteevent.php", {
                    method: 'POST',
                    body: JSON.stringify(send),
                    headers: { "Content-Type" : "application/json" }
                })
                .then(response => response.json())
                .then(send => {
                    if (send.success) {
                        console.log("Event Deleted!");
                        updateCalendar(getCurTime());
                    } else {
                        console.log("Unable to delete event.");
                    }
                })
                .catch(err => console.error(err));
                    
                }
        })
    } );
}
