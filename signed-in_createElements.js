var choseSubjects = [];
var allCheckBoxes = [];

var subjectSelectorDiv, choosePlanTableDiv;

function createMarksGetStartedElts() {
    currentFormInfo.innerHTML = "You can either set your marks or you can get the history of your marks here.";

    var div;

    if (document.getElementById("marks-div")) {
        document.getElementById("marks-div").innerHTML = "";
        div = document.getElementById("marks-div");
    }
    else {
        var div = document.createElement("div");
        div.id = "marks-div";
        document.getElementById("body").appendChild(div);
        div.appendChild(document.createElement("br"));
    }
    
    var h2 = document.createElement("h2");
    h2.innerHTML = "Set up your marks database with a few entries.";
    h2.id = "set-up";
    div.appendChild(h2);

    var imgDiv = document.createElement("div");
    imgDiv.id = "marks-img-div";
    div.appendChild(imgDiv);

    var img1 = document.createElement("img");
    img1.src = "donkey-work.gif";
    img1.id = "marks-set-up-img-1";
    img1.height = window.innerWidth * 300 / 1440;
    imgDiv.appendChild(img1);
    var imgTxt = document.createElement("h1");
    imgTxt.innerText = "vs.";
    imgTxt.style.fontSize = (window.innerWidth * 100 / 1440) + "px";
    imgDiv.appendChild(imgTxt);
    var img2 = document.createElement("img");
    img2.src = "smart-work.gif";
    img2.id = "marks-set-up-img-2";
    img2.height = window.innerWidth * 300 / 1440;
    imgDiv.appendChild(img2);

    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    var getStartedDiv = document.createElement("div");
    getStartedDiv.id = "get-started-marks-div";
    getStartedDiv.innerHTML = `
        <button onclick="startMarksDatabaseEngine()">
            Get Started
        </button>
    `;
    div.appendChild(getStartedDiv);
}

function createSubjectSelector() {
    currentFormInfo.innerHTML = "Click on each subject that you wish to add to your plan. <br> You need not click on the checkbox, you can easily click on the name";

    subjectSelectorDiv = document.createElement("div");
    subjectSelectorDiv.id = "subject-selector-div";

    var selectSbjctsForm = document.createElement("form");
    selectSbjctsForm.id = "select-sbjcts";

    document.getElementById("body").appendChild(subjectSelectorDiv);
    subjectSelectorDiv.appendChild(selectSbjctsForm);

    for (var i in commonSubjects) {
        /*
            IMPORTANT: 
            -----> We could have used the below code, but the label.for doesn't work.
            -----> I even tried it using docuemnt.getElementId(<<label-id>>).for = ...;
            -----> but that too didn't work.
            -----> So I am defining the html structure in the uncommented way.
            
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "checkbox" + parseInt(i);
            label = document.createElement("label");
            label.for = checkbox.id;
            label.id = "label" + label.for;
            label.innerText = commonSubjects[i];
        */

        // Making all the elements
        var subject = commonSubjects[i];
        var id = "checkbox" + parseInt(i);
        var div = document.createElement('div');
        div.id = "div-check" + i;
        div.innerHTML = `
            <label for="` + id + `" class="checkbox-elt">
            ` + subject + `
            </label>
            <input type="checkbox" id=` + id + ` class="checkbox-elt">
        `;
        selectSbjctsForm.appendChild(div);
        selectSbjctsForm.appendChild(document.createElement("br"));
        allCheckBoxes.push(document.getElementById(id));

        if (parseInt(i) + 1 === commonSubjects.length) {
            createOtherBtn();
            subjectSelectorDiv.appendChild(removableBr1);
            subjectSelectorDiv.appendChild(removableBr2);
            createSubmitSbjctsBtn();
        }
    }
}

function createOtherBtn() {
    otherBtn = document.createElement("input");
    otherBtn.type = "button";
    otherBtn.value = "Add other subject";
    otherBtn.addEventListener("click", () => {
        if (!addedOtherInptBoxShown) {
            var info = document.createElement("p");
            info.innerText = "You can leave the text boxes blank if you wish to change your mind to not add an extra subject";
            subjectSelectorDiv.appendChild(info);
            addedOtherInptBoxShown = true;
        }
        showOtherInputSubjectBox(otherBtn, submitSbjctsBtn);
    });
    subjectSelectorDiv.appendChild(otherBtn);
}

function showOtherInputSubjectBox() {
    var exisitingInputBoxIsEmpty;

    for (const j in inputSubjectBoxes) exisitingInputBoxIsEmpty = inputSubjectBoxes[j].value === "";

    if (!exisitingInputBoxIsEmpty) {
        var inputSubjectBox = document.createElement("input");
        inputSubjectBox.type = "text";
        inputSubjectBox.placeholder = "| Add Other Subject |";
        inputSubjectBoxes.push(inputSubjectBox);

        // Remving some elements because we have to put them after the input box, and we won't be able to position them exactly as html does, so, we remove them and add another one.
        for (const k in arguments) subjectSelectorDiv.removeChild(arguments[k]);

        subjectSelectorDiv.removeChild(removableBr1);
        subjectSelectorDiv.removeChild(removableBr2);

        // Adding all the elements to the body
        subjectSelectorDiv.appendChild(inputSubjectBox);
        // Adding OtherBtn and Submit Button
        subjectSelectorDiv.appendChild(removableBr1);
        subjectSelectorDiv.appendChild(removableBr2);
        createOtherBtn();

        subjectSelectorDiv.appendChild(document.createElement("br"));
        subjectSelectorDiv.appendChild(document.createElement("br"));
        createSubmitSbjctsBtn();
    }
    // Higlighting the already existing input box
    inputSubjectBoxes[inputSubjectBoxes.length - 1].focus();
}

function createSubmitSbjctsBtn() {
    submitSbjctsBtn = document.createElement("input");
    submitSbjctsBtn.type = "submit";
    submitSbjctsBtn.value = "Submit";
    submitSbjctsBtn.addEventListener("click", () => {
        var noOfCheckBoxes = 0;
        for (const l in allCheckBoxes) {
            const chkBox = allCheckBoxes[l];
            if (chkBox.checked) {
                choseSubjects.push(chkBox.labels[0].innerText);
                noOfCheckBoxes += 1;
            }
        }
        if ((choseSubjects[0] !== undefined && choseSubjects[0] !== "") || noOfCheckBoxes > 0 || inputSubjectBoxes[0].value !== "") {
            for (const m in inputSubjectBoxes) {
                const searchBox = inputSubjectBoxes[m];
                choseSubjects.push(searchBox.value);
            }
            subjectSelectorDiv.hidden = true;
            createSubjectRatingTable(choseSubjects);
        }
        else if (inputSubjectBoxes[0].value === "") alert("Please choose at least one subject");
    });
    subjectSelectorDiv.appendChild(submitSbjctsBtn);
}

function createSubjectRatingTable(allSubjects) {
    currentFormInfo.innerHTML = "Rate each subject according to the ones you selected. <br> Add specific details so that we can compute your data to provide you your plan.";

    var ratingForm = document.createElement("div");
    ratingForm.id = "rating-form";
    document.getElementById("body").appendChild(ratingForm);

    var tableDiv = document.createElement("div");
    tableDiv.innerHTML = `
        <table id="parent-rating-table">
            <thead>
                <th>
                    Subject
                </th>
                <th>
                    Ratings
                </th>
                <th>
                    All details
                </th>
            </thead>
            <tbody id="body-of-rating-table"></tbody>
        </table>
    `;
    document.getElementById("rating-form").appendChild(tableDiv);

    for (const n in allSubjects) {
        const subject = allSubjects[n];
        if (subject === "") continue;

        var subjectTrDiv = document.createElement("tr");
        subjectTrDiv.id = subject + "-tr";
        subjectTrDiv.innerHTML = `
            <td style="background-color: purple; color: white;">
                ` + subject + `
                <br>
                <!-- <button id="cancelBtn-` + subject + `"> </button> -->
            </td>
            <td>
                <table style="background-color: yellow; color: red" id="rating-table-child">
                    <thead>
                        <th>
                            Difficulty
                        </th>
                        <th>
                            Level
                        </th>
                    </thead>
                    <tbody style="background-color: black" id="star-radios">
                        <tr style="color: lawngreen">
                            <td>
                                1. No worries..
                            </td>
                            <td>
                                <label>
                                    <input type="radio" name="rating-` + subject + `" id="easiest-` + subject + `" value="1" />
                                    <!-- <img src="star.jpg" width=20 draggable="false" /> -->
                                </label>
                            </td>
                        </tr>
                        <tr style="color: lightcyan">
                            <td>
                                2. Easy
                            </td>
                            <td>
                                <label>
                                    <input type="radio" name="rating-` + subject + `" id="easy-` + subject + `" value="2"/>
                                    <!-- <img src="star.jpg" width=20 draggable="false" /> -->
                                </label>
                            </td>
                        </tr>
                        <tr style="color: yellow;" >
                            <td>
                                3. Normal
                            </td>
                            <td>
                                <label>
                                    <input type="radio" name="rating-` + subject + `" checked="true" id="normal-` + subject + `" value="3" />
                                    <!-- <img src="star.jpg" width=20 draggable="false" /> -->
                                </label>
                            </td>
                        </tr>
                        <tr style="color: darkorange">
                            <td>
                                4. Difficult
                            </td>
                            <td>
                                <label>
                                    <input type="radio" name="rating-` + subject + `" id="hard-` + subject + `" value="4" />
                                    <!-- <img src="star.jpg" width=20 draggable="false" /> -->
                                </label>
                            </td>
                        </tr>
                        <tr style="color: orangered">
                            <td>
                                5. Impossible!! <br> (The program will make it possible)
                            </td>
                            <td>
                                <label>
                                    <input type="radio" name="rating-` + subject + `" id="hardest-` + subject + `" value="5" />
                                    <!-- <img src="star.jpg" width=20 draggable="false" /> -->
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td style="background-color: cyan; color: red" >
                <label for="no-of-ch-` + subject + `">
                    No of chapters in syllabus:
                </label>
                <input type="number" min=1 id="no-of-ch-` + subject + `" value=5 />
                <br><br>
                <label for="time-for-each-ch-` + subject + `">
                    Average no. of hours for each chapter:
                </label>
                <input type="number" min=1 id="time-for-each-ch-` + subject + `" value=2 />
            </td>
        `;

        // var cancelImg = document.createElement("img");
        // cancelImg.src = "delete_grn.png ";
        // cancelImg.width = 30;

        document.getElementById("body-of-rating-table").appendChild(subjectTrDiv);
        // document.getElementById("cancelBtn-" + subject).appendChild(cancelImg);

        // document.getElementById("cancelBtn-" + subject).style["box-shadow"] = "none";
        // document.getElementById("cancelBtn-" + subject).onclick = function () {
        //     console.log("Removed", subject);
        // }
    }
    var inputs = document.getElementsByTagName("input");
    for (const q in inputs) {
        const input = inputs[q];
        if (input.type === "number") {
            document.getElementsByTagName("input")[q].addEventListener("change", function (e) {
                // Making sure we have selected only the number format
                if (input.value === "" || parseInt(input.value) === 0) {
                    input.value = 1;
                }
            });
        }
    }
    createSubmitRatingBtn();
}

function createSubmitRatingBtn() {
    submitRtngBtn = document.createElement("input");
    submitRtngBtn.type = "submit";
    submitRtngBtn.value = "Submit";
    submitRtngBtn.addEventListener("click", () => {
        choosePlanType();
        document.getElementById("rating-form").hidden = true;
    });
    document.getElementById("rating-form").appendChild(submitRtngBtn);
}

function askForWhenIsTheExam() {
    var info = document.createElement("p");
    info.innerHTML = "Select the target date for completing the syllabus. Default is set to 3 weeks after. <br> Click on the calender icon to get a virtual calnder where you can choose a date.";

    var dateSelector = document.createElement("input");
    dateSelector.type = "date";

    document.getElementById("body").appendChild(info);
    document.getElementById("body").appendChild(dateSelector);
    dateSelector.id = "target-date";
    defaultDate = new Date(Date.now() + defaultNoOfDaysLeft * 24 * 60 * 60 * 1000);
    var year, month, date;
    // No Of Days Left For The Exam * hrs/pd * mins/ph * secs/pm * millis/ps

    year = defaultDate.getFullYear();
    // month starts from 0
    month = defaultDate.getMonth() + 1;
    if (month > 12) {
        month = 1;
        year += 1;
    }
    date = defaultDate.getDate();

    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    dateSelector.value = year + "-" + month + "-" + date;
}

function choosePlanType() {
    currentFormInfo.innerHTML = "Choose the type of plan you want. <br> <strong style='font-size: 40px; color: cyan; background-color: red;'> For basic prototype version, we are only supporting basic plan (2nd option) until now. Other plans will be added soon... </strong>";
    currentFormInfo.style["background-color"] = "lightgreen";

    var choosePlanTypeDiv = document.createElement("div");
    choosePlanTypeDiv.id = "choose-plan-type-div";
    choosePlanTypeDiv.style.backgroundColor = "lightyellow";
    document.getElementById("body").appendChild(choosePlanTypeDiv);

    choosePlanTypeDiv.appendChild(document.createElement("br"));
    choosePlanTypeDiv.appendChild(document.createElement("br"));

    choosePlanTableDiv = document.createElement("div");
    choosePlanTableDiv.id = "choose-plan-div";
    choosePlanTypeDiv.appendChild(choosePlanTableDiv);

    var info = document.createElement("p");
    info.innerText = "Choose the type of the plan you want.";

    document.getElementById(choosePlanTableDiv.id).appendChild(info);

    document.getElementById(choosePlanTableDiv.id).appendChild(document.createElement("hr"));

    var tableDiv = document.createElement("div");
    tableDiv.innerHTML = `
        <table cellpadding="2" cellspacing="4" id="choose-plan-type-table" align="center" />
    `;
    document.getElementById(choosePlanTableDiv.id).appendChild(tableDiv);
    for (var p in planTypeAnswers) {
        var tableRowForPlanType = document.createElement("tr");
        tableRowForPlanType.innerHTML = `
            <td nowrap="nowrap" align="left" style="font-size: 25px;">
                <label for="choose-plan-type-` + p + `" id="label-for-choose-plan-type-` + p + `" disabled=true>
                    ` + planTypeAnswers[p] + `
                </label>
            </td>
            <td>
                <input type="radio" name="choose-plan-type" id="choose-plan-type-` + p + `" disabled=true />
            </td>
        `;

        document.getElementById("choose-plan-type-table").appendChild(tableRowForPlanType);
        document.getElementById("label-for-choose-plan-type-" + p).style.color = "gray";
    }

    /* 
        To-do --> when the other plans are available, the 0th radio should be checked
        ----------------> also the disabled property for the options will be removed. The style.color is also to be removed.
    */
    document.getElementById("choose-plan-type-1").checked = true;
    document.getElementById("choose-plan-type-1").disabled = false;
    document.getElementById("label-for-choose-plan-type-1").style.color = "blue";

    createSubmitPlanTypeBtn();
}

function createSubmitPlanTypeBtn() {
    document.getElementById("body").appendChild(document.createElement("br"));
    submitPlnTypBtn = document.createElement("input");
    submitPlnTypBtn.type = "submit";
    submitPlnTypBtn.value = "Submit";
    submitPlnTypBtn.addEventListener("click", () => {
        askForWhenIsTheExam();
        askSpecificQuestions();
        document.getElementById("choose-plan-type-div").hidden = true;
    });
    choosePlanTableDiv.appendChild(submitPlnTypBtn);
}

function askSpecificQuestions() {
    currentFormInfo.style["backgroundColor"] = "cyan";
    currentFormInfo.innerHTML = "Please answer some of our important quesions. <br> These are important to generate your plan.";
    currentFormInfo.style["background-color"] = "lightgreen";

    choosePlanTableDiv.hidden = true;

    var questionsDiv = document.createElement("div");
    questionsDiv.innerHTML = `
        <br>
        <label for="time-each-day-input">
            How many hours do you want to study each day?
        </label>
        <input type="number" id="time-each-day-input" min=1 value=4 max=24 onchange="setInptValueTo1IfInvalid('time-each-day-input')" />
    `;
    var viewPlanDiv = document.createElement("div");
    viewPlanDiv.innerHTML = `
        <br><br>
        <button id="view-plan-btn" onclick="runRuleEngine()">
            Submit and View your Plan
        </button>
    `;

    document.getElementById("body").appendChild(questionsDiv);
    document.getElementById("body").appendChild(viewPlanDiv);
}

function setInptValueTo1IfInvalid(eltId) {
    var value = document.getElementById(eltId).value
    if (value === "" || parseInt(value) === 0) value = 1;
    if (value > 24) value = 24;
    document.getElementById(eltId).value = value;
}

