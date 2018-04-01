const credentials = require("./credentials.js");

const iNowAPI = require("../");
const Puppeteer = require("puppeteer");

(async function () {

    const RawAPI = await iNowAPI.newRawAPI({
        headless: false
    });

    await RawAPI.Login.load();
    await RawAPI.Login.setUsername(credentials.username);
    await RawAPI.Login.setPassword(credentials.password);
    await RawAPI.Login.submit();


    await RawAPI.Classes.load();
    console.log(await RawAPI.Classes.get());


    console.log(await RawAPI.Year.get());
    await RawAPI.Year.set("29");
    await RawAPI.Year.submit();

    console.log(await RawAPI.NineWeeks.get());
    await RawAPI.NineWeeks.set("75");
    await RawAPI.NineWeeks.submit();

    await RawAPI.Demographic.load();
    console.log(await RawAPI.Demographic.get());

    await RawAPI.Classes.load();
    console.log(await RawAPI.Classes.get());

    await RawAPI.Assignments.load("58314B72476F466A7538774974394B655441644F4C687A6F4E32553D2D55464A4A545546535756394A524430784E5451314F435A48556B46455355354858314246556B6C50524430334E535A445431565355305539516E567A4B31526C59326772515842776243744A");
    console.log(await RawAPI.Assignments.get());

    await RawAPI.Attendance.load();
    console.log(await RawAPI.Attendance.get());

    await RawAPI.PeriodAttendance.load();
    console.log(await RawAPI.PeriodAttendance.get());

    await RawAPI.CheckInOuts.load();
    console.log(await RawAPI.CheckInOuts.get());

    //await Browser.close();
})();