var animationStarted = false;
var plottedPlanData = false;

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
                animationStarted = false;
                canvas.elt.hidden = true;
                if (document.getElementById("logout-btn")) document.getElementById("logout-btn").hidden = false;
                if (document.getElementById("dnlad-btn")) document.getElementById("dnlad-btn").hidden = false;
                if (!plottedPlanData) {
                    plottedPlanData = true;
                    getMyPlans();
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

function getUrlParams() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getMyPlans() {
    if (getUrlParams()["plan"]) {
        database.ref("Users/" + auth.currentUser.uid + "/Plans/" + getUrlParams()["plan"]).get().then((data) => {
            if (data.exists()) {
                plotMyPlans(data);
            }
            else {
                alert("This plan does not exist.");
                location.href = "index.html";
            }
        })
    }
    else {
        location.href = "index.html";
    }
}

function plotMyPlans(data) {
    console.log("call");
    if (!document.getElementById("main-plan-table")) {
        createPlanTable();
    }
    var planData = data.val().planData;
    tableMade = true;
    for (const v in planData) {
        const subjectData = planData[v];
        plotPlanData(subjectData);
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