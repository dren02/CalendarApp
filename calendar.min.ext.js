// extension of calendar methods/functions given by CSE 330 wiki
function findFirstDayofWeek(week){
    const thisSunday = week.sunday;
    numDate = thisSunday.getDay();
    dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayOfWeek[numDate];
}