const iNowAPI = require("../");
const Puppeteer = require("puppeteer");

let password = "";
(function(){
   password = "";
}());

(async () => {
    const Browser = await Puppeteer.launch({
        headless: false
    });
    const Page = await Browser.newPage();


    const RawAPI = new iNowAPI.Objects.RawAPI(Page);

    await RawAPI.Login.load();
    await RawAPI.Login.setUsername("");
    await RawAPI.Login.setPassword(password);
    await RawAPI.Login.submit();

    /*
    //console.log(await RawAPI.Year.get());
    await RawAPI.Year.set("17");
    await RawAPI.Year.submit();

    //console.log(await RawAPI.NineWeeks.get());
    await RawAPI.NineWeeks.set("49");
    await RawAPI.NineWeeks.submit();
    */

    await RawAPI.Demographic.load();
    console.log(await RawAPI.Demographic.get());


    //await Browser.close();
})();