var animationStarted = false;
var plottedMarksData = false;
var firstTimeZoomedIn = false;

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
                animationStarted = false;
                canvas.elt.hidden = true;
                if (document.getElementById("logout-btn")) document.getElementById("logout-btn").hidden = false;
                if (!firstTimeZoomedIn) {
                    document.getElementById("body").style.transition = ".6s";
                    document.getElementById("body").style.transform = "scale(1.62)";
                    firstTimeZoomedIn = true;
                }
                if (!auth.currentUser) location.href = "index.html";
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