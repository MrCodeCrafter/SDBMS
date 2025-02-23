document.getElementById("login-btn").addEventListener("click", function() {
    let role = document.getElementById("role").value;
    sessionStorage.setItem("userRole", role);
    document.getElementById("login-section").style.display = "none";
    document.getElementById("main-content").style.display = "flex";
    
    if (role === "staff") {
        document.getElementById("export-csv").style.display = "none"; // Staff can't export
    }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", function() {
    sessionStorage.clear();
    location.reload();
});

// Handle form submission
document.getElementById("student-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form values
    let admissionNo = document.getElementById("admission-no").value;
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let dob = document.getElementById("dob").value;
    let doa = document.getElementById("doa").value;
    let aadhar = document.getElementById("aadhar").value;
    let cwsn = document.getElementById("cwsn").value;
    let father = document.getElementById("father").value;
    let mother = document.getElementById("mother").value;
    let contact = document.getElementById("contact").value;
    let hostler = document.getElementById("hostler").value;
    let guardian = document.getElementById("guardian").value;
    let guardianAddress = document.getElementById("guardian-address").value;
    let guardianContact = document.getElementById("guardian-contact").value;
    let email = document.getElementById("email").value;
    let idMarks = document.getElementById("id-marks").value;

    let table = document.querySelector("tbody");
    let row = table.insertRow();
    row.innerHTML = `
        <td>${admissionNo}</td>
        <td>${name}</td>
        <td>${address}</td>
        <td>${dob}</td>
        <td>${doa}</td>
        <td>${aadhar}</td>
        <td>${cwsn}</td>
        <td>${contact}</td>
        <td>${hostler}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    row.querySelector(".edit-btn").addEventListener("click", function() {
        editStudent(row);
    });

    row.querySelector(".delete-btn").addEventListener("click", function() {
        row.remove();
    });

    document.getElementById("student-form").reset();
});

// Edit Student Record
function editStudent(row) {
    let cells = row.getElementsByTagName("td");

    let admissionNo = prompt("Edit Admission No:", cells[0].innerText);
    let name = prompt("Edit Name:", cells[1].innerText);
    let address = prompt("Edit Address:", cells[2].innerText);
    let dob = prompt("Edit DOB:", cells[3].innerText);
    let doa = prompt("Edit Date of Admission:", cells[4].innerText);
    let aadhar = prompt("Edit Aadhar No:", cells[5].innerText);
    let cwsn = prompt("Edit CWSN Status:", cells[6].innerText);
    let contact = prompt("Edit Parent’s Contact:", cells[7].innerText);
    let hostler = prompt("Edit Hostler Status:", cells[8].innerText);

    if (admissionNo && name && address && dob && doa && aadhar && cwsn && contact && hostler) {
        cells[0].innerText = admissionNo;
        cells[1].innerText = name;
        cells[2].innerText = address;
        cells[3].innerText = dob;
        cells[4].innerText = doa;
        cells[5].innerText = aadhar;
        cells[6].innerText = cwsn;
        cells[7].innerText = contact;
        cells[8].innerText = hostler;
    }
}

// Sorting function
function sortTable(colIndex) {
    let table = document.querySelector("table tbody");
    let rows = Array.from(table.rows);
    rows.sort((a, b) => a.cells[colIndex].innerText.localeCompare(b.cells[colIndex].innerText));
    rows.forEach(row => table.appendChild(row));
}

// Dark Mode Toggle
document.getElementById("toggle-dark-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Search Functionality
document.getElementById("search").addEventListener("keyup", function() {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll("tbody tr");
    
    rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
});
