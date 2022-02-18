var schedule;

class Subject {
    constructor(name, difficultyLevel, chapterCount, timePerChapter) {
        this.name = name;
        this.difficultyLevel = difficultyLevel;
        this.chapterCount = chapterCount;
        this.timePerChapter = timePerChapter;
        this.totalTime = this.chapterCount * this.timePerChapter;
        this.daysCount;
        this.startDate;
        this.endDate;
    }
}

function runRuleEngine() {
    var subjects = calculateTotalNoOfHours();
    var targetDate = document.getElementById("target-date").value;
    var eachDayTime = document.getElementById("time-each-day-input").value;

    var totalDays = 0;
    for (const t in subjects) {
        const subjectObj = subjects[t];
        subjectObj.daysCount = Math.ceil(subjectObj.totalTime / eachDayTime);
        totalDays += subjectObj.daysCount;
    }

    var targetDateObj = Date.parse(targetDate);
    var startDate = addDaysToDate(targetDateObj, 1 - totalDays);

    var runningStartDate = startDate;

    for (const x in subjects) {
        const subjectObj = subjects[x];
        subjectObj.startDate = runningStartDate;
        subjectObj.endDate = addDaysToDate(runningStartDate, subjectObj.daysCount - 1);
        runningStartDate = addDaysToDate(runningStartDate, subjectObj.daysCount);
    }
    console.log(subjects);
    schedule = subjects;
    updateUserInputs(schedule);
}

function addDaysToDate(dateObj, days) {
    const daysConst = 1000 * 60 * 60 * 24;
    var daysSince1970 = Math.round(dateObj / daysConst);
    var updatedDateInDays = daysSince1970 + days;

    return new Date(updatedDateInDays * 86400 * 1000);
}

function calculateTotalNoOfHours() {
    var subjects = [];
    for (const r in choseSubjects) {
        const subject = choseSubjects[r];
        var chTime = document.getElementById("time-for-each-ch-" + subject).value;
        var chCount = document.getElementById("no-of-ch-" + subject).value;
        var difficultyLevel = 3;
        var difficultyLevelElements = document.getElementsByName("rating-" + subject);
        for (const s in difficultyLevelElements) {
            var difficultyLevelElement = difficultyLevelElements[s];
            if (difficultyLevelElement.checked) {
                console.log(difficultyLevelElement.value);
                difficultyLevel = difficultyLevelElement.value;
                break;
            }
        }
        var subjectObj = new Subject(subject, difficultyLevel, chCount, chTime);
        console.log(subjectObj.totalTime);
        subjects.push(subjectObj);
    }
    console.log(subjects);
    return subjects;
}

function updateUserInputs(data) {
    const planName = prompt("Enter a Plan Name");
    if (planName) {
        var planRef = database.ref("Users/" + auth.currentUser.uid + "/Plans/").push();
        var key = planRef.key;
        planRef.update({
            planData: data,
            planName: planName
        }).then(() => {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("plan", key);
            window.location.search = urlParams;
            location.href = "signed-in_view-plan.html?" + urlParams;
        });
    }
}