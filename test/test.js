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

    await RawAPI.Classes.load();
    console.log(await RawAPI.Classes.get());

    //await Browser.close();
})();