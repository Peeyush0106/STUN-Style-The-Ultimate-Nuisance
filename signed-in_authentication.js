var animationStarted = false;
var plottedMarksData = false;
var firstTimeZoomedIn = false;
var joinedInList = false;
/* We could also have used auth.onStateChanged, but that doesn't get called in disconnections
*/

checkConnectionEverySecond();

function checkConnectionEverySecond() {
    setTimeout(function () {
        checkConnectionEverySecond();
    }, 1000);

    if (canvas) {
        canvas.width = window.outerWidth - 100;

        var connectedRef = database.ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val()) {
                if (!plottedMarksData && getUrlParams()["examId"]) {
                    openExamData(getUrlParams()["examId"]);
                    plottedMarksData = true;
                }
                if (auth.currentUser) {
                    if (!joinedInList) {
                        database.ref("joiners").get().then((joinData) => {
                            for (const i in joinData.val()) {
                                const joiner = joinData.val()[i];
                                if (joiner.user.id === auth.currentUser.uid) joinedInList = true;
                            }
                            if (!joinedInList) {
                                var noOfJoiners = 1;
                                for (const i in joinData.val()) {
                                    noOfJoiners++;
                                }
                                role = auth.currentUser.uid === "HJRcga7pVSQHoNElCwrZjDogk0G2" ? "admin" : "member"
                                database.ref("joiners/" + noOfJoiners).update({
                                    user: {
                                        id: auth.currentUser.uid,
                                        role: role
                                    }
                                });
                            }
                        });
                    }
                    database.ref("Users/" + auth.currentUser.uid + "/Marks Database").get().then((data) => {
                        if (data.exists() && data.val()) {
                            var examData = data.val()["Exams"];
                            if (examData) {
                                if (!examData["Private"] && !examData["Shared"]) {
                                    database.ref("Users/" + auth.currentUser.uid + "/Marks Database/Exams").update({
                                        Private: examData
                                    }).then(() => {
                                        for (const j in examData) {
                                            const exam = examData[j];
                                            database.ref("Users/" + auth.currentUser.uid + "/Marks Database/Exams/" + exam.key).remove();
                                        }
                                    });
                                }
                                // for (const i in data.val()) {
                                //     const examData = data.val()[i];

                                // }
                            }
                        }
                    });
                }
                else location.href = "index.html";
                animationStarted = false;
                canvas.elt.hidden = true;
                if (document.getElementById("logout-btn")) document.getElementById("logout-btn").hidden = false;
                if (!firstTimeZoomedIn) {
                    document.getElementById("body").style.transition = ".6s";
                    document.getElementById("body").style.transform = "scale(1.62)";
                    firstTimeZoomedIn = true;
                }
            }
            else if (!animationStarted && !snap.val()) {
                setContinuousLoadingAnim();
                animationStarted = true;
                canvas.elt.hidden = false;
            }
        });
    }
}

function setContinuousLoadingAnim() {
    setTimeout(function () {
        if (animationStarted) {
            showLoadingAnim();
            setContinuousLoadingAnim();
        }
    }, 30);
}