var animationStarted = false;

/* We could also have used auth.onStateChanged, but that doesn't get called in disconnections
*/

checkConnectionEverySecond();

function checkConnectionEverySecond() {
    setTimeout(function () {
        checkConnectionEverySecond();
    }, 1000);

    var connectedRef = database.ref(".info/connected");
    connectedRef.on("value", function (snap) {
        console.log(snap);
        if (snap.val()) {
            if (auth.currentUser) location.href = "signed-in_index.html";
            else location.href = "sign-in_index.html";
        }
    });
}