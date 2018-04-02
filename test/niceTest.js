const credentials = require("./credentials.js");

const iNowAPI = require("../");

(async function () {

    const Session = await iNowAPI.newSession({
        headless: false
    });

    try {
        console.log("Login", await Session.login(credentials.username, credentials.password));
        console.log("authcode", await Session.getAuthCode());

        console.log("Years", await Session.getYears());
        console.log("NineWeeks", await Session.getNineWeeks("29"));

        let classesArray = await Session.getClasses(undefined, "75"); //First param is year id, 2nd param is nineWeeksId
        console.log("Classes", classesArray);

        console.log(classesArray[2].name + " Assignments", await Session.getClassAssignments(classesArray[2].id));

        console.log("Demographics", await Session.getDemographics());
        console.log("Attendance", await Session.getAttendance()); //Accepts a yearId
        console.log("Period Attendance", await Session.getPeriodAttendance()); //Accepts a yearId
        console.log("Check Ins and Check Outs", await Session.getCheckInOuts()); //Accepts a yearId
    }
    catch (error) {
        console.log("Error:", error);
    }

}());