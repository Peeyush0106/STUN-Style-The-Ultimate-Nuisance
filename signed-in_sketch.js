/*                                              
                        |   |
                        |---| |--| | |  __
                        |   | |--| | | |  |
                        |   | |___ | | |__|

Hello !!!

This is STUN - Style The Ultimate Nuisance.

The full-fledge version of this app includes a lot more features than this one.
It will also include study related tools like Shared Canvas (for team work with friends), To-do manager (For task management), File Sharers (Sharing study files with a team), etc.

Hope this helps you in your daily-life and lessens your issues !!

Thanks for veiwing STUN - Style The Ultimate Nuisance.
Hope you will like it.



*/


var userName, submitSbjctsBtn;
var inputSubjectBoxes = [];
var commonSubjects = ["English", "Science", "Social Studies", "Information Technology (Computers)", "Deutsch (German)", "Français (French)"];
var addedOtherInptBoxShown = false;
var planTypeAnswers = [
    "Aggressive Start, Light End (Recommended) - unsupported",
    "Basic Plan - supported",
    "Even Plan, stays equal effort everyday - unsupported",
    "Light Start, Aggressive End <br> (Not recommended for people who find difficulty in studying) - unsupported",
    "Random - unsupported",
    "Aggressive + Light - One day tough, next day easy - unsupported"
];
var defaultNoOfDaysLeft = 21;
var directlyAtHome = false;

// These elements won't be seen until we appendChild it in th body.
var removableBr1 = document.createElement("br");
removableBr1.id = "r-br1";
var removableBr2 = document.createElement("br");
removableBr2.id = "r-br2";

var currentFormInfo = document.getElementById("current-form-info");
currentFormInfo.innerHTML = "Hello user, here are some very useful apps you can use for your benefit, enjoy enjoying them!";

currentStatus = "home";

document.getElementById("exam-planning").width = window.innerWidth * 300 / 1440;
document.getElementById("marks-database").width = window.innerWidth * 300 / 1440;

function examPlanning() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            createSubjectSelector();
            database.ref("Users/" + auth.currentUser.uid + "/Plans").get().then((data) => {
                document.getElementById("view-plan-ul").innerHTML = "";
                for (const i in data.val()) {
                    const plan = data.val()[i];
                    var li = document.createElement("li");
                    li.innerText = plan.planName;
                    li.className = "plan-link";
                    li.onclick = function () {
                        const urlParams = new URLSearchParams(window.location.search);
                        urlParams.set("plan", i);
                        window.location.search = urlParams;
                        location.href = "signed-in_view-plan.html?" + urlParams;
                    }
                    document.getElementById("view-plan-ul").appendChild(li);
                    document.getElementById("view-plan-ul").appendChild(document.createElement("br"));
                    document.getElementById("view-plan-ul").appendChild(document.createElement("br"));
                }
                document.getElementById("view-plan-div").hidden = false;
            });
            currentStatus = "plan";
            document.getElementById("exam-planner-btn").hidden = true;
            document.getElementById("exam-marks-btn").hidden = true;
            document.getElementById("secret-diary-btn").hidden = true;
            document.getElementById("drawing-canvas-btn").hidden = true;
            document.getElementById("squizzy-btn").hidden = true;
            document.getElementById("housie-btn").hidden = true;
            document.getElementById("word-game-btn").hidden = true;
            document.getElementById("my-tasks-btn").hidden = true;
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function examMarks(onlineReferenceRequired) {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            if (!animationStarted) {
                setContinuousLoadingAnim();
                animationStarted = true;
                canvas.elt.hidden = false;
            }
            currentStatus = "marks";
            document.getElementById("exam-planner-btn").hidden = true;
            document.getElementById("exam-marks-btn").hidden = true;
            document.getElementById("secret-diary-btn").hidden = true;
            document.getElementById("drawing-canvas-btn").hidden = true;
            document.getElementById("squizzy-btn").hidden = true;
            document.getElementById("housie-btn").hidden = true;
            document.getElementById("word-game-btn").hidden = true;
            document.getElementById("my-tasks-btn").hidden = true;
            if (onlineReferenceRequired) {
                database.ref("Users/" + auth.currentUser.uid + "/Marks Database/gotStarted").get().then((data) => {
                    if (data.exists() && data.val() == true) {
                        startMarksDatabaseEngine();
                    }
                    else {
                        createMarksGetStartedElts();
                    }
                });
            }
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function secretDiary() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            location.href = "signed-in_secret-notes_index.html";
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function drawingCanvas() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            location.href = "signed-in_drawing-app_index.html";
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function wordGame() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            location.href = "signed-in_word-game_index.html";
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function toDo() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            location.href = "signed-in_to-do-app_index.html";
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function classChat() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            location.href = "signed-in_chat-app_index.html";
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function backToHome() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            currentFormInfo.innerHTML = "Hello user, here are some very useful apps you can use for your benefit, enjoy enjoying them!";
            document.getElementById("view-plan-div").hidden = false;
            if (document.getElementById("database-does-not-exist")) {
                document.getElementById("database-does-not-exist").parentElement.removeChild(document.getElementById("database-does-not-exist"));
            }
            if (getUrlParams()["examId"]) {
                location.href = removeParam("examId", location.href);
            }
            if (currentStatus === "plan") {
                setTimeout(function () {
                    document.getElementById("body").style.transition = ".6s";
                    document.getElementById("body").style.transform = "scale(0.01)";
                    setTimeout(function () {
                        location.reload();
                        setTimeout(function () {
                            document.getElementById("body").style.transition = "1s";
                            document.getElementById("body").style.transform = "scale(1.62)";
                        }, 500);
                    }, 600);
                }, 100);
            }
            else if (currentStatus === "marks") {
                document.getElementById("body").removeChild(document.getElementById("marks-div"));
                document.getElementById("home-btn").style.top = "10%";
            }
            currentStatus = "home";
            document.getElementById("exam-planner-btn").hidden = false;
            document.getElementById("exam-marks-btn").hidden = false;
            document.getElementById("secret-diary-btn").hidden = false;
            document.getElementById("drawing-canvas-btn").hidden = false;
            document.getElementById("squizzy-btn").hidden = false;
            document.getElementById("housie-btn").hidden = false;
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function startMarksDatabaseEngine() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            database.ref("Users/" + auth.currentUser.uid + "/Marks Database").update({
                gotStarted: true
            }).then(() => {
                currentFormInfo.innerHTML = "You can either set your marks or you can get the history of your marks here.";

                if (document.getElementById("marks-div")) {
                    document.getElementById("marks-div").innerHTML = "";
                }
                else {
                    var div = document.createElement("div");
                    div.id = "marks-div";
                    document.getElementById("body").appendChild(div);
                    div.appendChild(document.createElement("br"));
                }

                addExamBtn = document.createElement("button");
                addExamBtn.id = "add-exam";
                addExamBtn.innerHTML = `
                    <img src="plus.png" height="` + window.innerWidth * 300 / 1440 + `" />
                    <p>
                        Add an exam
                    </p>
                `;

                var examUl = document.createElement("ul");
                database.ref("Users/" + auth.currentUser.uid + "/Marks Database/Exams").get().then((data) => {
                    var allExamsData = data.val();
                    for (const i in allExamsData) {
                        const exam = allExamsData[i];
                        var listObj = document.createElement("li");
                        listObj.innerHTML = `
                            <p id="examLiP` + exam.key + `" class="examLiP">
                                Open ` + exam.name + ` of Grade ` + exam.grade + ` Exam Database
                            </p>
                        `;
                        examUl.appendChild(listObj);
                        document.getElementById("examLiP" + exam.key).addEventListener("click", () => {
                            const urlParams = new URLSearchParams(window.location.search);
                            urlParams.set("examId", exam.key);
                            window.location.search = urlParams;
                        });
                    }
                });

                document.getElementById("marks-div").appendChild(addExamBtn);
                document.getElementById("marks-div").appendChild(examUl);

                document.getElementById("add-exam").addEventListener("click", (e) => {
                    e.preventDefault();
                    createAddExamForm();
                });
            });
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function createAddExamForm() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            document.getElementById("add-exam").parentElement.removeChild(document.getElementById("add-exam"));
            document.getElementById("marks-div").innerHTML = "";
            var form = document.createElement("form");
            form.innerHTML = `
                <label for="add-exam-grade"> For which grade/class would you like to add an exam?: </label>
                <input type="number" id="add-exam-grade" min="1" />
        
                <br><br>
        
                <label for="add-exam-name"> What is the label/tag/name you would like to keep for your exam?: </label>
                <input type="text" id="add-exam-name" />
        
                <br><br>
        
                <label for="add-exam-count"> Number of subjects/exams in the exam series: </label>
                <input type="number" id="add-exam-count" min="1" />
        
                <br><br>
        
                <input type="submit" id="submit-add-exam-form">
            `;

            document.getElementById("marks-div").appendChild(form);

            document.getElementById("add-exam-count").value = 1;
            document.getElementById("add-exam-grade").value = 1;
            document.getElementById("add-exam-name").value = "Exam";

            document.getElementById("add-exam-count").addEventListener("change", () => {
                if (document.getElementById("add-exam-count").value === ""
                    || parseInt(document.getElementById("add-exam-count").value) === 0) {
                    document.getElementById("submit-add-exam-form").disabled = true;
                }
                else if (document.getElementById("add-exam-grade").value !== ""
                    && parseInt(document.getElementById("add-exam-grade").value) !== 0) {
                    document.getElementById("submit-add-exam-form").disabled = false;
                }
            });
            document.getElementById("add-exam-grade").addEventListener("change", () => {
                if (document.getElementById("add-exam-grade").value === ""
                    || parseInt(document.getElementById("add-exam-grade").value) === 0) {
                    document.getElementById("submit-add-exam-form").disabled = true;
                }
                else if (document.getElementById("add-exam-count").value !== ""
                    && parseInt(document.getElementById("add-exam-count").value) !== 0) {
                    document.getElementById("submit-add-exam-form").disabled = false;
                }
            });
            document.getElementById("add-exam-name").addEventListener("change", () => {
                if (document.getElementById("add-exam-name").value === "") {
                    document.getElementById("submit-add-exam-form").disabled = true;
                }
                else {
                    document.getElementById("submit-add-exam-form").disabled = false;
                }
            });
            document.getElementById("submit-add-exam-form").addEventListener("click", (e) => {
                e.preventDefault();
                createSubjectNamingForm();
            });

            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function createSubjectNamingForm() {
    var commonDiv = document.createElement("div");
    document.getElementById("marks-div").appendChild(commonDiv);
    for (var i = 0; i < parseInt(document.getElementById("add-exam-count").value); i++) {
        var div = document.createElement("div");
        div.innerHTML = `
            <label for="subject-inpt-` + (i + 1) + `">Subject #` + (i + 1) + `</label>
            <input type="text" id="subject-inpt-` + (i + 1) + `" />

            <label for="marks-inpt-` + (i + 1) + `">Marks: </label>
            <input type="number" id="marks-inpt-` + (i + 1) + `" />

            <label for="outof-inpt-` + (i + 1) + `">Out of: </label>
            <input type="number" id="outof-inpt-` + (i + 1) + `" />
        `;
        commonDiv.appendChild(div);
    }

    var submit = document.createElement("input");
    submit.type = "submit";
    submit.id = "add-exam-submit-sbjcts-btn";
    commonDiv.appendChild(submit);
    document.getElementById("add-exam-submit-sbjcts-btn").disabled = true;

    for (var i = 0; i < parseInt(document.getElementById("add-exam-count").value); i++) {
        var subjectInput = document.getElementById("subject-inpt-" + (i + 1));
        var marksInput = document.getElementById("marks-inpt-" + (i + 1));
        var outofInput = document.getElementById("outof-inpt-" + (i + 1));
        document.getElementById("subject-inpt-" + (i + 1)).addEventListener("change", () => {
            if (subjectInput.value === "") {
                document.getElementById("add-exam-submit-sbjcts-btn").disabled = true;
            }
            else if (marksInput.value !== "" && outofInput.value !== "") {
                document.getElementById("add-exam-submit-sbjcts-btn").disabled = false;
            }
        });
        document.getElementById("marks-inpt-" + (i + 1)).addEventListener("change", () => {
            if (marksInput.value === "") {
                document.getElementById("add-exam-submit-sbjcts-btn").disabled = true;
            }
            else if (subjectInput.value !== "" && outofInput.value !== "") {
                document.getElementById("add-exam-submit-sbjcts-btn").disabled = false;
            }
        });
        document.getElementById("outof-inpt-" + (i + 1)).addEventListener("change", () => {
            if (outofInput.value === "") {
                document.getElementById("add-exam-submit-sbjcts-btn").disabled = true;
            }
            else if (marksInput.value !== "" && subjectInput.value !== "") {
                document.getElementById("add-exam-submit-sbjcts-btn").disabled = false;
            }
        });
    }

    document.getElementById("add-exam-submit-sbjcts-btn").addEventListener("click", (e) => {
        e.preventDefault();
        submitAddExamForm();
    });
}

function submitAddExamForm() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            if (!animationStarted) {
                setContinuousLoadingAnim();
                animationStarted = true;
                canvas.elt.hidden = false;
            }

            var subjects = {};

            for (var i = 0; i < parseInt(document.getElementById("add-exam-count").value); i++) {
                subjects[i + 1] = {};
                subjects[i + 1].subject = document.getElementById("subject-inpt-" + (i + 1)).value;
                subjects[i + 1].marks = document.getElementById("marks-inpt-" + (i + 1)).value;
                subjects[i + 1].outof = document.getElementById("outof-inpt-" + (i + 1)).value;
            }
            var examDataRef = database.ref("Users/" + auth.currentUser.uid + "/Marks Database/Exams").push();
            var examDataKey = examDataRef.key;

            var examData = {
                subjects: subjects,
                name: document.getElementById("add-exam-name").value,
                grade: document.getElementById("add-exam-grade").value,
                key: examDataKey
            }
            examDataRef.update(examData).then(() => {
                backToHome();
            });
            console.log(examDataKey);
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

window.onload = function () {
    if (getUrlParams()["examId"]) {
        examMarks(false);
    }
}

function getUrlParams() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function openExamData(examId) {
    console.log("started 1");
    database.ref("Users/" + auth.currentUser.uid + "/Marks Database/Exams/" + examId).get().then((data) => {
        if (data.exists()) {
            document.getElementById("marks-div").hidden = true;
            console.log("started 2");
            var examData = data.val();
            var subjects = examData["subjects"];
            var tableDiv = document.getElementById("marks-data-table-div");
            tableDiv.innerHTML = `
                <table id="exam-marks-data-table">
                    <thead id="exam-data-head"></thead>
                    <tbody id="exam-data-body"></tbody>
                </table>
            `;

            var tableHeaders = ["Subject", "Marks", "Out of", "Percentage"]
            var tr = document.createElement("tr");
            document.getElementById("exam-data-head").appendChild(tr);
            for (const i in tableHeaders) {
                tr.innerHTML += `
                    <th>` + tableHeaders[i] + `</th>
                `;
            }

            var marksTotal = 0, percentageTotal = 0, totalTotal = 0;
            for (const i in subjects) {
                const subject = subjects[i];
                var tr = document.createElement("tr");
                percentage = (parseInt(subject.marks) / parseInt(subject.outof)) * 100;
                tr.innerHTML = `
                    <td>` + subject.subject + `</td>
                    <td>` + parseInt(subject.marks).toFixed(2) + `</td>
                    <td>` + parseInt(subject.outof).toFixed(2) + `</td>
                    <td>` + percentage.toFixed(2) + `%</td>
                `;
                document.getElementById("exam-data-body").appendChild(tr);
                marksTotal += parseInt(subject.marks);
                totalTotal += parseInt(subject.outof);
            }
            percentageTotal = (marksTotal / totalTotal) * 100
            var statisticsDiv = document.createElement("div");
            statisticsDiv.innerHTML = `
                <p id="exam-marks-statistics">
                    Total marks: ` + marksTotal.toFixed(2) +
                `<br> Out of total: ` + totalTotal.toFixed(2) +
                `<br> Overall Percentage: ` + percentageTotal.toFixed(2) + `%
                </p>
            `;
            document.getElementById("exam-marks-statistics").appendChild(statisticsDiv);
        }
        else {
            var h1 = document.createElement("h1");
            h1.id = "database-does-not-exist";
            h1.innerHTML = "This database does not exist, or we are having issues. <br> Please try again later if you are sure if this exists.";
            document.getElementById("body").appendChild(h1);
        }
    });
}

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}