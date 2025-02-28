document.addEventListener("DOMContentLoaded", function () {
    const studentForm = document.getElementById("student-form");
    const studentTable = document.querySelector("tbody");
    const searchInput = document.getElementById("search");
    const toggleDarkMode = document.getElementById("toggle-dark-mode");

    let students = [];

    // Add student record
    studentForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let student = {
            admissionNo: document.getElementById("admission-no").value,
            name: document.getElementById("name").value,
            address: document.getElementById("address").value,
            dob: document.getElementById("dob").value,
            doa: document.getElementById("doa").value,
            aadhar: document.getElementById("aadhar").value,
            cwsn: document.getElementById("cwsn").value,
            contact: document.getElementById("contact").value,
            hostler: document.getElementById("hostler").value
        };

        students.push(student);
        updateTable();
        studentForm.reset();
    });

    // Update student table
    function updateTable() {
        studentTable.innerHTML = "";
        students.forEach((student, index) => {
            let row = `
                <tr>
                    <td>${student.admissionNo}</td>
                    <td>${student.name}</td>
                    <td>${student.address}</td>
                    <td>${student.dob}</td>
                    <td>${student.doa}</td>
                    <td>${student.aadhar}</td>
                    <td>${student.cwsn}</td>
                    <td>${student.contact}</td>
                    <td>${student.hostler}</td>
                    <td>
                        <button class="edit-btn" onclick="editStudent(${index})">✏️</button>
                        <button class="delete-btn" onclick="deleteStudent(${index})">🗑️</button>
                    </td>
                </tr>
            `;
            studentTable.innerHTML += row;
        });
    }

    // Delete student record
    window.deleteStudent = function (index) {
        students.splice(index, 1);
        updateTable();
    };

    // Edit student record (To be implemented)
    window.editStudent = function (index) {
        alert("Edit feature will be added soon.");
    };

    // Sort table columns
    window.sortTable = function (colIndex) {
        students.sort((a, b) => {
            let valA = Object.values(a)[colIndex].toLowerCase();
            let valB = Object.values(b)[colIndex].toLowerCase();
            return valA.localeCompare(valB);
        });
        updateTable();
    };

    // Search functionality
    searchInput.addEventListener("input", function () {
        let searchTerm = searchInput.value.toLowerCase();
        document.querySelectorAll("tbody tr").forEach(row => {
            let text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? "" : "none";
        });
    });

    // Toggle Dark Mode
    toggleDarkMode.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });
});
