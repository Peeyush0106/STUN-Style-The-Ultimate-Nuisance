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
    var def_startDate = new Date(data.startDate).toString();
    var def_endDate = new Date(data.endDate).toString();

    var startDate = def_startDate.slice(0, 3) + ", " + def_startDate.slice(4, 7) + " " + def_startDate.slice(8, 10) + ", " + def_startDate.slice(11, 15);

    var endDate = def_endDate.slice(0, 3) + ", " + def_endDate.slice(4, 7) + " " + def_endDate.slice(8, 10) + ", " + def_endDate.slice(11, 15);

    var bodyOfPlanTable = document.createElement("tr");
    bodyOfPlanTable.innerHTML = `
    <td>
        `+ data.name + `
    </td>
    <td>
        `+ data.difficultyLevel + `/5
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
        ` + startDate + `
    </td>
    <td>
        ` + endDate + `
    </td>
    `;
    document.getElementById("main-body-of-final-plan-table").appendChild(bodyOfPlanTable);
}