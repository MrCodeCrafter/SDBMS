document.getElementById("export-csv").addEventListener("click", function() {
    let rows = document.querySelectorAll("table tr");
    let csv = Array.from(rows).map(row =>
        Array.from(row.cells).map(cell => cell.innerText).join(",")
    ).join("\n");

    let blob = new Blob([csv], { type: "text/csv" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "student_records.csv";
    a.click();
});
