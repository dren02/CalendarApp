let curMonth = getCurTime();
$(document).ready(function(){
    
    updateCalendar(getCurTime()); 

    // Note: january is month 0
    document.getElementById("nextMonth").addEventListener("click", function(){
        curMonth = curMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
        // returns 330 doc Month
        updateCalendar(curMonth); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    }, false);

    // view previous month when button is clicked
    document.getElementById("prevMonth").addEventListener("click", function(){
        curMonth = curMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
        // returns 330 doc Month
        updateCalendar(curMonth); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    }, false);

});
// for now, uses user's current time
function updateCalendar(month){
    // console.log("in initcalendar");
    // every month has 6
    // let curTime = month.getDate(6);
    document.getElementById("calendartitle").textContent = numToMonth(month.month) + " " + month.year;

    let daysw1 = $("#firstweek").find("div.date")
    let daysw2 = $("#secondweek").find("div.date");
    let daysw3 = $("#thirdweek").find("div.date");
    let daysw4 = $("#fourthweek").find("div.date");
    let daysw5 = $("#fifthweek").find("div.date");
    let daysw6 = $("#sixthweek").find("div.date");
    
    let curWeeks = month.getWeeks();   
    for (let i = 0; i < 6; i++){  
        // seven days in a week
        for (let j = 0; j < 7; j++){
            if (i == 0) {
                daysw1[j].textContent = curWeeks[i].getDates()[j].getDate();
                clearEvents(daysw1[j]);
                showEvents(curWeeks[i].getDates()[j], daysw1[j].parentElement);
                if (curWeeks[i].getDates()[j].getMonth() != month.month){
                    $(daysw1[j]).parent().attr("class", "day other-month");
                } else {
                    $(daysw5[j]).parent().attr("class", "day");
                }
            } else if (i == 1){
                daysw2[j].textContent = curWeeks[i].getDates()[j].getDate();
                clearEvents(daysw2[j]);
                showEvents(curWeeks[i].getDates()[j], daysw2[j].parentElement);
                
            } else if (i == 2){
                daysw3[j].textContent = curWeeks[i].getDates()[j].getDate();
                clearEvents(daysw3[j]);
                showEvents(curWeeks[i].getDates()[j], daysw3[j].parentElement);
            } else if (i == 3){
                daysw4[j].textContent = curWeeks[i].getDates()[j].getDate();
                clearEvents(daysw4[j]);
                showEvents(curWeeks[i].getDates()[j], daysw4[j].parentElement);
            } else if (i == 4){
                //  Handle February (Some Februaries are only 4 weeks exactly)
                if (curWeeks.length < 5){
                    let monthAfter = month.nextMonth();
                    let nextMonthFirstWeek = monthAfter.getWeeks()[0];
                    daysw5[j].textContent = nextMonthFirstWeek.getDates()[j].getDate();
                    clearEvents(daysw5[j]);
                    showEvents(curWeeks[i].getDates()[j], daysw5[j].parentElement);
                    // if the date isn't the current month, change the CSS
                    if (nextMonthFirstWeek.getDates()[j].getMonth() != month.month){
                        $(daysw5[j]).parent().attr("class", "day other-month");
                    } else {
                        $(daysw5[j]).parent().attr("class", "day");
                    }
                } else {
                    daysw5[j].textContent = curWeeks[i].getDates()[j].getDate();
                    clearEvents(daysw5[j]);
                    showEvents(curWeeks[i].getDates()[j], daysw5[j].parentElement);
                    // if the date isn't the current month, change the CSS
                    if (curWeeks[i].getDates()[j].getMonth() != month.month){
                        $(daysw5[j]).parent().attr("class", "day other-month");
                    } else {
                        $(daysw5[j]).parent().attr("class", "day");
                    }
                }
            } else {
                // Handle 5 week only months
                if (curWeeks.length < 6){
                    // Auto set to first week of the next month
                    let weekofNextMonth = 0;
                    if (curWeeks.length == 5){
                        // else, choose next week (like a non-leap February)
                        weekofNextMonth = 1;
                    }
                    let monthAfter = month.nextMonth();
                    let nextMonthWeek = monthAfter.getWeeks()[weekofNextMonth];
                    daysw6[j].textContent = nextMonthWeek.getDates()[j].getDate();
                    clearEvents(daysw6[j]);
                    showEvents(nextMonthWeek.getDates()[j], daysw6[j].parentElement);
                    if (nextMonthWeek.getDates()[j].getMonth() != month.month){
                        $(daysw6[j]).parent().attr("class", "day other-month");
                    } else {
                        $(daysw5[j]).parent().attr("class", "day");
                    }
                } else {
                    daysw6[j].textContent = curWeeks[i].getDates()[j].getDate();
                    clearEvents(daysw6[j]);
                    showEvents(curWeeks[i].getDates()[j], daysw6[j].parentElement);
                    if (curWeeks[i].getDates()[j].getMonth() != month.month){
                        $(daysw6[j]).parent().attr("class", "day other-month");
                    } else {
                        $(daysw5[j]).parent().attr("class", "day");
                    }
                }
            } 
        } 
    }
    modify();
    deleteListen();
}

function numToMonth(num){
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[num];
}

function getEvents(inputDay){ 
    return new Promise((resolve, reject) => {
    let data = {"date": inputDay.getDate(), "month": inputDay.getMonth(), "year": inputDay.getFullYear(), "username": localStorage.getItem("username"), "token": localStorage.getItem("token") };
    fetch("getevents.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-Type" : "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            resolve(data.events);
        } else {
            resolve(null);
        }
    })
    .catch(err => {
        console.error(err);
        reject(err);
    });
    });
}
/////////////////////// Working ///////////////////////////////////////
// input is the day of the week and the html element that's the day of the week
function showEvents(inputDay, htmlElementDayOfWeek){
    getEvents(inputDay)
    .then(returnEvents => {
        if (returnEvents != null){ 
            for (let i = 0; i < returnEvents.length; i++){
                // gets where we're going to add events so events show up in the right place
                let newEvent = document.createElement("div") 
                // create main div of the class
                newEvent.className = "event";
                newEvent.id = returnEvents[i]['id'];
                newEvent.style.backgroundColor  = getBackgroundColor(returnEvents[i]['color']);
                // Inner event-desc div tag
                let innerdesctag = document.createElement("div");
                innerdesctag.className = "event-desc";
                if (returnEvents[i]['tag'] != null){
                    innerdesctag.textContent = returnEvents[i]['title']  + " (" + returnEvents[i]['tag'] + ")";
                } else {
                    innerdesctag.textContent = returnEvents[i]['title'];
                }
                // add tag!
                newEvent.appendChild(innerdesctag);
                // Inner event-time div tag
                let innereventtag = document.createElement("div");
                innereventtag.className = "event-time";
                // gets hours and minutes
                let time = returnEvents[i]['dateandtime'].substring(11, 16);
                let hours = parseInt(time.substring(0, 2), 10);
                let outputTime = "";
                // check if time is AM or PM, display as so
                if (hours > 12){
                    outputTime = (hours - 12) + ":" + time.substring(3, 5) + "PM";
                } else if (hours == 12) {
                    outputTime = hours + ":" + time.substring(3, 5) + "PM";
                } else {
                    outputTime = hours + ":" + time.substring(3, 5) + "AM"; 
                }
                // if location is set:
                if (returnEvents[i]['location'] != null){
                    innereventtag.textContent = returnEvents[i]['location'] + " at " + outputTime;
                } else {
                    innereventtag.textContent = outputTime;
                }
                innereventtag.appendChild(document.createElement("br"));
                let editbutton = document.createElement("button");
                editbutton.className = "edit";
                editbutton.textContent = "Edit";
                // added edit button!
                innereventtag.appendChild(editbutton);
                
                let deletebutton = document.createElement("button");
                deletebutton.className = "delete";
                deletebutton.textContent = "Delete";
                innereventtag.appendChild(deletebutton);

                // add tag!
                newEvent.appendChild(innereventtag);
                
                htmlElementDayOfWeek.appendChild(newEvent);
                
            }
            
        } else { 
            console.log("didn't make tags");
        }
    })
    .catch(err => {
        console.error(err);
    });
}
// dayChild should be the div with class="day"
function clearEvents(dayChild){
    $("#calendar").off("click", ".edit");
    $("#calendar").off("click", ".delete");
    let parent = dayChild.parentElement;
    let children = parent.children;

    for (let i = children.length - 1; i > 0; i--) {
        children[i].remove();
    }
}

// converts to 330 library Month object
function getCurTime(){
    let userCurMonth = new Date();
    return new Month(userCurMonth.getFullYear(), userCurMonth.getMonth());
}

// gets background color based on sql output
function getBackgroundColor(c){
    const colors = {"red": "#ffdbdb", "orange": "#ffeee2", "yellow": "#fcfade", "green": "#e2fce6", "blue": "#e4f2f2", "purple": "#e3e3ff", "pink": "#fbe1f3"};
    return colors[c];
}
