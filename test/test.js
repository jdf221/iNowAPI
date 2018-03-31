const credentials = require("./credentials.js");

const iNowAPI = require("../");
const Puppeteer = require("puppeteer");

(async function () {

    const Session = await iNowAPI.newSession({
        headless: false
    });

    try {
        //console.log(await Session.getYears());

        console.log("Login", await Session.login(credentials.username, credentials.password));

        console.log("Years", await Session.getYears());
        console.log("NineWeeks", await Session.getNineWeeks("29"));

        let classesArray = await Session.getClasses(undefined, "75");
        console.log("Classes", classesArray);

        console.log(classesArray[2].name + " Assignments", await Session.getClassAssignments(classesArray[2].id));
    }
    catch (error) {
        console.log("Error:", error);
    }

    /*const RawAPI = await iNowAPI.newRawAPI({
        headless: false
    });

    await RawAPI.Login.load();
    await RawAPI.Login.setUsername(credentials.username);
    await RawAPI.Login.setPassword(credentials.password);
    await RawAPI.Login.submit();


    await RawAPI.Classes.load();
    console.log(await RawAPI.Classes.get());
*/

    /*
    //console.log(await RawAPI.Year.get());
    await RawAPI.Year.set("17");
    await RawAPI.Year.submit();
    */

    /*
    //console.log(await RawAPI.NineWeeks.get());
    await RawAPI.NineWeeks.set("49");
    await RawAPI.NineWeeks.submit();
    */

    /*
    await RawAPI.Demographic.load();
    console.log(await RawAPI.Demographic.get());
    */

    /*
    await RawAPI.Classes.load();
    console.log(await RawAPI.Classes.get());
    */

    /*
    await RawAPI.Assignments.load("5A74613641787446547041595266314B524D356A6D686C355872343D2D55464A4A545546535756394A524430784E5445324E695A48556B46455355354858314246556B6C50524430334E435A445431565355305539515735686447397465513D3D");
    console.log(await RawAPI.Assignments.get());
    */

    /*
    await RawAPI.Attendance.load();
    console.log(await RawAPI.Attendance.get());
    */

    /*
    await RawAPI.PeriodAttendance.load();
    console.log(await RawAPI.PeriodAttendance.get());
    */

    /*
    await RawAPI.CheckInOuts.load();
    console.log(await RawAPI.CheckInOuts.get());
    */

    //await Browser.close();
})();