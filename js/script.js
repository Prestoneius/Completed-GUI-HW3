/*
    Name: Preston Wilson
    Email: preston_wilson@student.uml.edu
    Assignment: GUI Programming HW3
    Description: This file reads the four form values, validates them, and then
                 builds a multiplication table completely with JavaScript.
                 
*/

const MIN_ALLOWED = -50;
const MAX_ALLOWED = 50;
const MAX_TABLE_CELLS = 10201;

const form = document.getElementById("table-form");
const message = document.getElementById("message");
const tableContainer = document.getElementById("table-container");
const rangeSummary = document.getElementById("range-summary");

// This listener lets JavaScript handle the form instead of reloading the page.
form.addEventListener("submit", function(event) {
    event.preventDefault();
    makeTableFromForm();
});

// A small default table is created when the page first loads.
makeTableFromForm();

function makeTableFromForm() {
    clearMessage();

    const minColumn = getIntegerValue("min-column", "Minimum Column Value");
    const maxColumn = getIntegerValue("max-column", "Maximum Column Value");
    const minRow = getIntegerValue("min-row", "Minimum Row Value");
    const maxRow = getIntegerValue("max-row", "Maximum Row Value");

    // Stop if any field is empty or not an integer.
    if (!minColumn.valid || !maxColumn.valid || !minRow.valid || !maxRow.valid) {
        return;
    }

    const errors = validateRanges(minColumn.value, maxColumn.value, minRow.value, maxRow.value);

    if (errors.length > 0) {
        showMessage(errors.join(" "), "error");
        tableContainer.innerHTML = "";
        rangeSummary.textContent = "Please fix the form errors and try again.";
        return;
    }

    buildTable(minColumn.value, maxColumn.value, minRow.value, maxRow.value);

    rangeSummary.textContent = "Columns: " + minColumn.value + " to " + maxColumn.value +
        " | Rows: " + minRow.value + " to " + maxRow.value;

    showMessage("Table generated successfully.", "success");
}

function getIntegerValue(id, label) {
    const input = document.getElementById(id);
    const textValue = input.value.trim();

    if (textValue === "") {
        showMessage(label + " is required.", "error");
        return { valid: false, value: 0 };
    }

    // This regular expression allows whole numbers like -3, 0, and 25.
    if (!/^-?\d+$/.test(textValue)) {
        showMessage(label + " must be a whole number.", "error");
        return { valid: false, value: 0 };
    }

    return { valid: true, value: parseInt(textValue, 10) };
}

function validateRanges(minColumn, maxColumn, minRow, maxRow) {
    const errors = [];
    const values = [minColumn, maxColumn, minRow, maxRow];

    for (let i = 0; i < values.length; i++) {
        if (values[i] < MIN_ALLOWED || values[i] > MAX_ALLOWED) {
            errors.push("All values must be between " + MIN_ALLOWED + " and " + MAX_ALLOWED + ".");
            break;
        }
    }

    if (minColumn > maxColumn) {
        errors.push("The minimum column value cannot be greater than the maximum column value.");
    }

    if (minRow > maxRow) {
        errors.push("The minimum row value cannot be greater than the maximum row value.");
    }

    const columnCount = maxColumn - minColumn + 1;
    const rowCount = maxRow - minRow + 1;
    const totalCells = columnCount * rowCount;

    if (totalCells > MAX_TABLE_CELLS) {
        errors.push("That table is too large to display safely.");
    }

    return errors;
}

function buildTable(minColumn, maxColumn, minRow, maxRow) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const headerRow = document.createElement("tr");
    const blankCorner = document.createElement("th");
    blankCorner.textContent = "";
    headerRow.appendChild(blankCorner);

    // Create the column headers across the top of the table.
    for (let column = minColumn; column <= maxColumn; column++) {
        const th = document.createElement("th");
        th.textContent = column;
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);

    // Create each row and multiply the row value by each column value.
    for (let row = minRow; row <= maxRow; row++) {
        const tableRow = document.createElement("tr");
        const rowHeader = document.createElement("th");
        rowHeader.textContent = row;
        tableRow.appendChild(rowHeader);

        for (let column = minColumn; column <= maxColumn; column++) {
            const td = document.createElement("td");
            td.textContent = row * column;
            tableRow.appendChild(td);
        }

        tbody.appendChild(tableRow);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

function clearMessage() {
    message.textContent = "";
    message.className = "";
}
