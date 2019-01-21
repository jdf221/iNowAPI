# iNowAPI
#### An API for accessing the Chalkable iNow grading system

## Why was this made and what is iNow?

iNow is the online grading system used by public schools in Alabama. It's basically Blackboard/Canvas. It allows you to see your current class grades and the indivudal assignment grades for what the teacher has assigned in class.

A version of this API was made for fun in my 11th grade year and I set it up to check my grades every 30 minutes and send me a text when a teacher updated an assignment or test grade.

Later in my 12th grade year I updated the API to be better overall, specifically in seperating the behind the scenes stuff into a Raw API and then only exposing a simple API to be used.

## How does it work?

This API is using Puppeteer to load and interact with the iNow website. The obvious way to create an API that relies on scraping a website is to just request the website HTML plain and not load up an entire browser, but the iNow website replied heavily on Javascript to load and manage the state of the content. Puppeteer was the easiest solution for this quick fun project I wanted to do over a weekend.

Using Puppeteer was also a huge learning experience and Puppeteer overall is just pretty cool.

iNowAPI automatily saves the session ID cookie so that your stay logged in, and it also exposes a function so that you can save the session ID yourself.

## Screenshot of the text message notifications

![Screenshot of text notifications](https://i.imgur.com/4tz6Qz7.png)

## Example taken from test/niceTest.js

```javascript
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
```
