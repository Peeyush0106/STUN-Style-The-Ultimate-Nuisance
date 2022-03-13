var animationStarted = false;
var plottedMarksData = false;
var firstTimeZoomedIn = false;

checkConnectionEverySecond();

function checkConnectionEverySecond() {
    setTimeout(function () {
        checkConnectionEverySecond();
    }, 1000);

    var connectedRef = database.ref(".info/connected");
    connectedRef.on("value", function (snap) {
        if (canvas) {
            if (snap.val()) {
                animationStarted = false;
                canvas.elt.hidden = true;
                if (!firstTimeZoomedIn) {
                    document.getElementById("body").style.transition = ".6s";
                    document.getElementById("body").style.transform = "scale(1.62)";
                    firstTimeZoomedIn = true;
                    getTasks();
                }
                if (auth.currentUser) {
                    connectionMade = true;
                }
                else {
                    alert("Redirect");
                    location.href = "index.html";
                }
            }
            else if (!animationStarted) {
                setContinuousLoadingAnim();
                animationStarted = true;
                canvas.elt.hidden = false;
            }
        }
    });
}

function setContinuousLoadingAnim() {
    setTimeout(function () {
        if (animationStarted) {
            showLoadingAnim();
            setContinuousLoadingAnim();
        }
    }, 30);
}