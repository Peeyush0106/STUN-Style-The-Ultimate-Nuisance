function createPlanTable() {
    var planTableDiv = document.createElement("table");
    planTableDiv.innerHTML = `
        <thead>
            <th>
                Subject
            </th>
            <th>
                Dfficulty
            </th>
            <th>
                No of chapters
            </th>
            <th>
                Time for each chapter
            </th>
            <th>
                Total No. of hours required
            </th>
            <th>
                Days needed
            </th>
            <th>
                Start Date
            </th>
            <th>
                End Date
            </th>
        </thead>
        <tbody id="main-body-of-final-plan-table">
        </tbody>
    `;
    document.getElementById("body").appendChild(planTableDiv);
    planTableDiv.id = "main-plan-table";
}

function plotPlanData(data) {
    const months = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var weekDays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    var startDate = months[parseInt(data.startDate.slice(5, 7)) - 1] + " " + data.startDate.slice(8, 10) + ", " + data.startDate.slice(0, 4);

    var endDate = months[parseInt(data.endDate.slice(5, 7)) - 1] + " " + data.endDate.slice(8, 10) + ", " + data.endDate.slice(0, 4);

    var bodyOfPlanTable = document.createElement("tr");
    bodyOfPlanTable.innerHTML = `
    <td>
        `+ data.name + `
    </td>
    <td>
        `+ data.difficultyLevel + `
    </td>
    <td>
        `+ data.chapterCount + `
    </td>
    <td>
        `+ data.timePerChapter + ` hour(s)
    </td>
    <td>
        `+ data.totalTime + ` hour(s)
    </td>
    <td>
        `+ data.daysCount + ` day(s)
    </td>
    <td>
        `+ weekDays[parseInt(new Date(startDate).getDay())] + ", " + startDate + `
    </td>
    <td>
        `+ weekDays[parseInt(new Date(endDate).getDay())] + ", " + endDate + `
    </td>
    `;
    document.getElementById("main-body-of-final-plan-table").appendChild(bodyOfPlanTable);
}