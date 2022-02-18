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

    var connectedRef = database.ref(".info/connected");
    connectedRef.on("value", function (snap) {
        if (snap.val()) {
            loading.hidden = true;
            if (!firstTimeZoomedIn) {
                document.getElementById("body").style.transition = ".6s";
                document.getElementById("body").style.transform = "scale(1.62)";
                firstTimeZoomedIn = true;
            }
            if (auth.currentUser) {
                connectionMade = true;
                if (allData) {
                    loading.hidden = true;
                    bAndWDrawingBtn.hidden = _drawBAndWPressed;
                    showDrawingList.hidden = _drawBAndWPressed;
                }
                else {
                    loading.hidden = false;
                    bAndWDrawingBtn.hidden = true;
                    showDrawingList.hidden = true;
                }
            }
            else {
                alert("Redirect");
                // location.href = "index.html";
            }
        }
        else if (!animationStarted && !snap.val()) {
            loading.hidden = false;
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