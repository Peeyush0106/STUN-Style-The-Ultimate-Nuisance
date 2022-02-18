function exportData(tableId, fileName) {
    /* Get the HTML data using Element by Id */
    var table = document.getElementById(tableId);

    /* Declaring array variable */
    var rows = [];


    //iterate through rows of table
    for (var i = 0, row; row = table.rows[i]; i++) {
        //rows would be accessed using the "row" variable assigned in the for loop
        //Get each cell value/column from the row
        var column7 = row.cells[6].innerText.replace(",", "-").replace(",", "-");
        var column8 = row.cells[7].innerText.replace(",", "-").replace(",", "-");
        console.log(column7, column8);
        column1 = row.cells[0].innerText;
        column2 = row.cells[1].innerText;
        column3 = row.cells[2].innerText;
        column4 = row.cells[3].innerText;
        column5 = row.cells[4].innerText;
        column6 = row.cells[5].innerText;
        column7 = column7;
        column8 = column8;

        /* add a new records in the array */
        rows.push(
            [
                column1,
                column2,
                column3,
                column4,
                column5,
                column6,
                column7,
                column8
            ]
        );

    }
    csvContent = "data:text/csv;charset=utf-8,";
    /* add the column delimiter as comma(,) and each row splitted by new line character (\n) */
    rows.forEach(function (rowArray) {
        row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    /* create a hidden <a> DOM node and set its download attribute */
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName + ".csv");
    document.getElementById("body").appendChild(link);
    /* download the data file named "Stock_Price_Report.csv" */
    link.click();
}