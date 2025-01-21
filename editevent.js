// Will make a popup where user can edit events
$(document).ready(function(){
    console.log("ready modify event doc");
    $( "#new_event" ).on( "click", function() {
        vex.dialog.open({
            message: 'Make a new event.',
            input: [
                '<input name="new_title" id="new_title" type="text" placeholder="New Event Title" required/>',
                '<input name="new_time" id="new_time" type="datetime-local" required />',
                '<input name="new_location" id="new_location" type="text" placeholder="Location"/>',
                '<input name="new_tag" id="new_tag" type="text" placeholder="Tag"/>',
                '<label for="new_color">Pick a tag color: </label>',
                '<select name="new_color" id="new_color">',
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
                $.extend({}, vex.dialog.buttons.YES, { text: 'Create Event' }),
                $.extend({}, vex.dialog.buttons.NO, { text: 'Exit' })
            ],
            callback: function (data) {
                if (!data) {
                    console.log("Input your event information");
                } else if (!data.new_title || !data.new_time) {
                    console.log("Please enter a title and a time.");
                } else {
                    let send = { "new_title": data.new_title, "new_time": data.new_time, "new_location": data.new_location, "new_tag": data.new_tag, "new_color": data.new_color};

                    fetch("event.php", {
                        method: 'POST',
                        body: JSON.stringify(send),
                        headers: { "Content-Type" : "application/json" }
                    })
                    .then(response => response.json())
                    .then(send => {
                        if (send.success) {
                            console.log("Event created successfully!");
                        } else {
                            console.log("Unable to create event.");
                        }
                    })
                    .catch(err => console.error(err));
                    
                }
            }
        })
    } );
});