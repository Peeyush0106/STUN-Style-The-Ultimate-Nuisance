var animationStarted = false;

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
            console.log(snap);
            if (snap.val()) {
                animationStarted = false;
                canvas.elt.hidden = true;
                if (auth.currentUser) location.href = "signed-in_index.html";
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