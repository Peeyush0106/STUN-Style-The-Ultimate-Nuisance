var animationStarted = false;
var plottedMarksData = false;

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
                if (auth.currentUser) {
                    connectionMade = true;
                }
                else {
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