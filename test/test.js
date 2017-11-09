const credentials = require("./credentials.js");

const iNowAPI = require("../");
const Puppeteer = require("puppeteer");

(async function() {
    const Browser = await Puppeteer.launch({
        headless: false
    });
    const Page = await Browser.newPage();


    const RawAPI = new iNowAPI.Objects.RawAPI(Page);

    await RawAPI.Login.load();
    await RawAPI.Login.setUsername(credentials.username);
    await RawAPI.Login.setPassword(credentials.password);
    await RawAPI.Login.submit();

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

    await RawAPI.Attendance.load();
    console.log(await RawAPI.Attendance.get());

    /*
    await RawAPI.CheckInOuts.load();
    console.log(await RawAPI.CheckInOuts.get());
    */

    await Browser.close();
})();