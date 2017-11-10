const iNowAPI = function() {
    const iNowAPI = this;

    iNowAPI.Objects = {};

    iNowAPI.Objects.RawAPI = function(PuppeteerPage) {
        const RawAPI = this;

        RawAPI.Options = {
            PathMap: {
                root: "https://sis-jacksonvillecity.chalkableinformationnow.com/InformationNow/",

                login: "Login.aspx",

                demographic: "ParentPortal/Sti.Home.UI.Web/Student/Demographic.aspx",

                grades: "ParentPortal/Sti.Home.UI.Web/Student/Grades.aspx",
                assignments: "ParentPortal/Sti.Home.UI.Web/Student/ActivityDetail.aspx?x=%s",

                attendance: "ParentPortal/Sti.Home.UI.Web/Student/Attendance.aspx",
                periodAttendance: "ParentPortal/Sti.Home.UI.Web/Student/PeriodAttendance.aspx",
                checkInCheckOut: "ParentPortal/Sti.Home.UI.Web/Student/CheckInCheckOut.aspx"
            }
        };

        RawAPI.PuppeteerPage = PuppeteerPage;


        RawAPI.Login = {
            load: async function() {
                await RawAPI.PuppeteerPage.goto(RawAPI.Options.PathMap.root + RawAPI.Options.PathMap.login);
            },
            submit: async function() {
                await RawAPI.PuppeteerPage.click("#btnLogin");

                await RawAPI.PuppeteerPage.waitForNavigation();
            },

            getUsername: async function() {
                return await RawAPI.PuppeteerPage.$eval("#txtUsername", function(element) {
                    return element.value;
                });
            },
            getPassword: async function() {
                return await RawAPI.PuppeteerPage.$eval("#txtPassword", function(element) {
                    element.value;
                });
            },
            getError: async function() {
                return await RawAPI.PuppeteerPage.$eval(".LiError.error", function(element) {
                    element.innerText;
                });
            },

            setUsername: async function(username) {
                await RawAPI.PuppeteerPage.$eval("#txtUsername", function(element, username) {
                    element.value = username;
                }, username);
            },
            setPassword: async function(password) {
                await RawAPI.PuppeteerPage.$eval("#txtPassword", function(element, password) {
                    element.value = password;
                }, password);
            }
        };

        RawAPI.Year = {
            submit: async function() {
                await RawAPI.PuppeteerPage.$eval("#ctl00_ddStudentAcadSession", function(element) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    element.dispatchEvent(evt);
                });

                //Changing the year reloads the entire page, so we don't need any specials options for waitForNavigation
                await RawAPI.PuppeteerPage.waitForNavigation();
            },

            get: async function() {
                return await RawAPI.PuppeteerPage.$eval("#ctl00_ddStudentAcadSession", function(element) {
                    const allOptions = [];

                    [].forEach.call(element.options, function(option, index) {
                        allOptions.push({
                            id: option.value,
                            name: option.innerHTML,
                            selected: (element.selectedIndex === index)
                        });
                    });

                    return allOptions;
                });
            },

            set: async function(yearId) {
                await RawAPI.PuppeteerPage.$eval("#ctl00_ddStudentAcadSession", function(element, yearId) {
                    element.value = yearId;
                }, yearId);
            }
        };

        RawAPI.NineWeeks = {
            submit: async function() {
                await RawAPI.PuppeteerPage.$eval("#ctl00_ContentPlaceHolder1_ddGradingPeriodList", function(element) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    element.dispatchEvent(evt);
                });

                //Changing the nine weeks doesn't reload the entire page. So we need to be sure to wait until networkidle.
                await RawAPI.PuppeteerPage.waitForNavigation({
                    waitUntil: "networkidle"
                });
            },

            get: async function() {
                return await RawAPI.PuppeteerPage.$eval("#ctl00_ContentPlaceHolder1_ddGradingPeriodList", function(element) {
                    const allOptions = [];

                    [].forEach.call(element.options, function(option, index) {
                        allOptions.push({
                            id: option.value,
                            name: option.innerHTML,
                            selected: (element.selectedIndex === index)
                        });
                    });

                    return allOptions;
                });
            },

            set: async function(nineWeeksId) {
                await RawAPI.PuppeteerPage.$eval("#ctl00_ContentPlaceHolder1_ddGradingPeriodList", function(element, nineWeeksId) {
                    element.value = nineWeeksId;
                }, nineWeeksId);
            }
        };

        RawAPI.Demographic = {
            load: async function() {
                await RawAPI.PuppeteerPage.goto(RawAPI.Options.PathMap.root + RawAPI.Options.PathMap.demographic);
            },

            get: async function() {
                return await RawAPI.PuppeteerPage.$eval("#MasterChildContent", function(element) {
                    let finalDemographicsObject = {};
                    let demographicSections = [];

                    element.querySelectorAll(".DetailBand").forEach(function(section) {
                        demographicSections.push(section.querySelectorAll("li"));
                    });

                    //TODO: Some of these I don't know what the possible values are, so I've had to just stick with a normal string. I would like to be able to turn some of them into a true/false value but what ever, can't until I know more.
                    finalDemographicsObject.PersonalInformation = {
                        name: demographicSections[0][0].children[1].innerText.trim(),
                        number: demographicSections[0][1].children[1].innerText.trim(),
                        altNumber: demographicSections[0][2].children[1].innerText.trim(),
                        dob: demographicSections[0][3].children[1].innerText.trim(),
                        gender: demographicSections[0][4].children[1].innerText.trim(), //TODO: On the site this is "Gender-Generation". And has a dash after my gender, so I'm just keeping it with the dash til I know how other sites handle it
                        phone: demographicSections[0][5].children[1].innerText.trim(),
                        maritalStatus: demographicSections[0][6].children[1].innerText.trim(),
                        religion: demographicSections[0][7].children[1].innerText.trim(),
                        grade: demographicSections[0][8].children[1].innerText.trim()
                    };

                    finalDemographicsObject.originResidency = {
                        nationality: demographicSections[1][0].children[1].innerText.trim(),
                        country: demographicSections[1][1].children[1].innerText.trim(),
                        residencyStatus: demographicSections[1][2].children[1].innerText.trim(),
                        stateId: demographicSections[1][3].children[1].innerText.trim(),
                        ethnicity: demographicSections[1][4].children[1].innerText.trim(),
                        migrant: demographicSections[1][5].children[1].innerText.trim(),
                        foreignExchange: demographicSections[1][6].children[1].innerText.trim(),
                        immigrant: demographicSections[1][7].children[1].innerText.trim(),
                        birthCertificate: demographicSections[1][8].children[1].innerText.trim(),
                        birthCertificateVerification: demographicSections[1][9].children[1].innerText.trim(),
                        employer: demographicSections[1][10].children[1].innerText.trim()
                    };

                    finalDemographicsObject.mailingAddress = {
                        addressLine1: demographicSections[2][0].children[1].innerText.trim(),
                        addressLine2: demographicSections[2][1].children[1].innerText.trim(),
                        city: demographicSections[2][2].children[1].innerText.trim(),
                        state: demographicSections[2][3].children[1].innerText.trim(),
                        zipCode: demographicSections[2][4].children[1].innerText.trim(),
                        country: demographicSections[2][5].children[1].innerText.trim()
                    };

                    finalDemographicsObject.physicalAddress = {
                        addressLine1: demographicSections[3][0].children[1].innerText.trim(),
                        addressLine2: demographicSections[3][1].children[1].innerText.trim(),
                        city: demographicSections[3][2].children[1].innerText.trim(),
                        state: demographicSections[3][3].children[1].innerText.trim(),
                        zipCode: demographicSections[3][4].children[1].innerText.trim(),
                        country: demographicSections[3][5].children[1].innerText.trim()
                    };

                    finalDemographicsObject.identification = {
                        email: demographicSections[4][0].children[1].innerText.trim(),
                        messenger: demographicSections[4][1].children[1].innerText.trim()
                    };

                    finalDemographicsObject.services = {
                        language: demographicSections[5][0].children[1].innerText.trim(),
                        lep: demographicSections[5][1].children[1].innerText.trim(),
                        section504: demographicSections[5][2].children[1].innerText.trim(),
                        homeless: demographicSections[5][3].children[1].innerText.trim()
                    };

                    return finalDemographicsObject;
                });
            }
        };

        RawAPI.Classes = {
            load: async function() {
                await RawAPI.PuppeteerPage.goto(RawAPI.Options.PathMap.root + RawAPI.Options.PathMap.grades);
            },

            get: async function() {
                return await RawAPI.PuppeteerPage.$eval("#ctl00_ContentPlaceHolder1_grdGrades", function(element) {
                    const finalClassesArray = [];

                    [].forEach.call(element.children[0].children, function(grade, index) {
                        if(index > 0) {
                            finalClassesArray.push({
                                id: /onclick="window\.location = 'ActivityDetail\.aspx\?x=(.*)';"/.exec(grade.children[4].innerHTML)[1],
                                name: grade.children[0].innerHTML,
                                teacher: grade.children[1].innerHTML,
                                period: grade.children[2].innerHTML,
                                grade: (grade.children[3].children[0].innerHTML.slice(0, -3)) || false
                            });
                        }
                    });

                    return finalClassesArray;
                });
            }
        };

        RawAPI.Assignments = {
            load: async function(classId) {
                await RawAPI.PuppeteerPage.goto(RawAPI.Options.PathMap.root + RawAPI.Options.PathMap.assignments.replace("%s", classId));
            },

            get: async function() {
                return await RawAPI.PuppeteerPage.$eval("#ctl00_ContentPlaceHolder1_grdActivities", function(element) {
                    const finalAssignmentsArray = [];

                    [].forEach.call(element.querySelectorAll(".gridRow, .gridAlternatingRow"), function(assignment, index) {
                        if(index > 0) {
                            const splitScoreObject = assignment.children[8].innerHTML.split("/");

                            finalAssignmentsArray.push({
                                timestamp: (new Date(assignment.children[1].innerHTML)).getTime(),
                                category: assignment.children[2].innerHTML,
                                name: assignment.children[3].innerHTML,
                                graded: (assignment.children[4].innerHTML === "Y"),
                                drp: (assignment.children[5].innerHTML === "Y"),
                                inc: (assignment.children[6].innerHTML === "Y"),
                                late: (assignment.children[7].innerHTML === "Y"),
                                score: (splitScoreObject.length > 1) ? splitScoreObject[0] : false,
                                maxScore: (splitScoreObject.length > 1) ? splitScoreObject[1].split(" ")[0] : false,
                                letterGrade: (splitScoreObject.length > 1) ? splitScoreObject[1].substr(-1) : false,
                                comment: assignment.nextElementSibling.querySelector("span").innerHTML
                            });
                        }
                    });

                    return finalAssignmentsArray;
                });
            }
        };

        RawAPI.Attendance = {
            load: async function() {
                await RawAPI.PuppeteerPage.goto(RawAPI.Options.PathMap.root + RawAPI.Options.PathMap.attendance);
            },

            get: async function() {
                return await RawAPI.PuppeteerPage.$eval("#ctl00_ContentPlaceHolder1_grdAttendance", function(element) {
                    const finalDaysArray = [];

                    [].forEach.call(element.children[0].children, function(day, index) {
                        if(index > 0) {
                            finalDaysArray.push({
                                timestamp: (new Date(day.querySelector("a").innerHTML)).getTime(),
                                term: day.children[1].innerHTML,
                                periods: day.children[2].innerHTML.split(","),
                                level: day.children[3].innerHTML,
                                reason: day.children[4].innerHTML,
                                excused: (day.children[5].innerHTML === "E"),
                                note: day.children[6].innerHTML
                            });
                        }
                    });

                    return finalDaysArray;
                });
            }
        };

        RawAPI.PeriodAttendance = {
            load: async function() {
                await RawAPI.PuppeteerPage.goto(RawAPI.Options.PathMap.root + RawAPI.Options.PathMap.periodAttendance);
            },

            get: async function() {
                return await RawAPI.PuppeteerPage.$eval("#ctl00_ContentPlaceHolder1_grdAttendance", function(element) {
                    const finalPeriodsArray = [];

                    [].forEach.call(element.children[0].children, function(period, index) {
                        if(index > 0) {
                            finalPeriodsArray.push({
                                timestamp: (new Date(period.children[0].innerHTML)).getTime(),
                                period: period.children[1].innerHTML,
                                course: period.children[2].innerHTML,
                                level: period.children[3].innerHTML,
                                reason: period.children[4].innerHTML,
                                excused: (period.children[5].innerHTML === "E"),
                                note: period.children[6].innerHTML,
                            });
                        }
                    });

                    return finalPeriodsArray;
                });
            }
        };


        RawAPI.CheckInOuts = {
            load: async function() {
                await RawAPI.PuppeteerPage.goto(RawAPI.Options.PathMap.root + RawAPI.Options.PathMap.checkInCheckOut);
            },

            get: async function() {
                return await RawAPI.PuppeteerPage.$eval("#ctl00_ContentPlaceHolder1_grdAttendance", function(element) {
                    const finalTimesArray = [];

                    [].forEach.call(element.children[0].children, function(time, index) {
                        if(index > 0) {
                            finalTimesArray.push({
                                timestamp: (new Date(time.children[1].innerHTML)).getTime(),
                                type: time.children[0].innerHTML.toLowerCase(),
                                time: time.children[2].innerHTML, //Possibly convert this to a timestamp based on the date provided
                                period: time.children[3].innerHTML,
                                excused: (time.children[4].innerHTML === "E"),
                                reason: time.children[5].innerHTML,
                                note: time.children[6].innerHTML
                            });
                        }
                    });

                    return finalTimesArray;
                });
            }
        };

        return RawAPI;
    };

    return iNowAPI;
};

module.exports = new iNowAPI();