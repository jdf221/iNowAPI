# iNowAPI
#### An API for accessing the Chalkable iNow grading system

## Why was this made and what is iNow?

iNow is the online grading system used by public schools in Alabama.
It's basically Blackboard/Canvas.
It allows you to see your current class grades and the indivudal assignment grades for what the teacher has assigned in class.

I made this in 11th grade so I could have assignment and test grades texted to me as soon as they were entered by the teacher.

___

## How does it work?

This API is using Puppeteer to load and interact with the iNow website. Puppeteer is a headless browser API, it allows you to interact with the browser and it's content programmatically.

Puppeteer was used instead of just plain old scraping the website because iNow relied heavily on Javascript to load and manage the state of the content. Trying to emulate all of that was more trouble then it was worth so I chose to use Puppeteer.

This library works by exposing an API that abstracts away the logic of loading each page and grabbing the data off of it. It also organizes all the data nicely in the objects it returns.

For example when you call the `login(username, password)` function, iNowAPI is loading the login page and inputting your detais. Then submitting the login form and returning true or false (representing successful login or not) via a promise.

Every API function in this library works like this, loading the corresponding page and returning the data via a promise.

___

## Detailed overview of how the API works

There are 2 main sections of this library. The **Raw API** and the **Nice API**. The Raw API is the Puppeteer abstraction. And the Nice API is the actual API we expose and is the one intended to be used.

The Nice API simply wraps the Raw APIs and error handles for you.

### Raw API

The main detail you need to know about the Raw API is that it consists of objects that correspond to elements on the iNow website.

Below is a list of all the objects and the functions they expose.

#### RawAPI.Login
  * async load()
    - Loads the login page
  * async submit()
    - Submits the login form
  * async getUsername()
    - Returns the username currently typed in the username input
  * async getPassword()
    - Returns the password currently typed in the password input
  * async getError()
    - Returns the error text if an error exists on the login page (from a previous failed login attempt)
    - Otherwise returns a blank string
  * async setUsername(username: string)
    - Sets the username in the username input
  * async setPassword(username: string)
    - Sets the password in the password input
    
#### RawAPI.Year
This is the academic year. This object is used to change what academic year the website is currently looking at. It is a select box on the grades page.

  * async load()
    - Loads the iNow grades page
  * async submit()
    - Triggers a change event on the year select box, this causes the website to update the year to the one you set via set()
  * async get()
    - Returns an array of academic years and their ids
  * async set(yearId: string)
    - Sets the year select box
    
#### RawAPI.NineWeeks
This object is used to change what nine weeks of the academic year the website is currently looking at. It is a select box on the grades page.

  * async load()
    - Loads the iNow grades page
  * async submit()
    - Triggers a change event on the nine weeks select box, this causes the website to update the nine weeks to the one you set via set()
  * async get()
    - Returns an array of nine weeks and their ids
  * async set(nineWeeksId: string)
    - Sets the nine weeks select box
    
#### RawAPI.Classes
This object is used to access the classes the logged in user is enrolled in and their current grade. Classes are listed on the grades page

  * async load()
    - Loads the iNow grades page
  * async get()
    - Returns an array of classes. Classes conform to the following object:
```javascript
{
id: string,
name: string, //Class name
teacher: string,
period: string, //Class period number, in my case it could be 1 to 7
grade: float
}
```
    
#### RawAPI.Assignments
This object is used to access the assignments from a class. Assignments are listed within a class's assignment page

  * async load(classId: string)
    - Loads classId's assignment page
  * async get()
    - Returns an array of assignments. Assignments conform to the following object:
```javascript
{
    timestamp: int, //Timestamp at which the assignment was added to iNow
    category: string, //Teacher assigned category
    name: string, //Name of assignment
    graded: boolean, //True if graded else false
    drp: boolean, //True if droped grade else false
    inc: boolean,
    late: boolean, //True if late else false
    score: float | false, //The score or false if no score
    maxScore: float | false, //The maximum score or false if no max score
    letterGrade: string, //The letter grade given
    comment: string //Teacher comment
}
```
