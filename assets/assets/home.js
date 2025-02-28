document.addEventListener("DOMContentLoaded", function () {
    let menuBtn = document.getElementById("menu-btn");
    let loginMenu = document.getElementById("login-menu");
    let closeMenuBtn = document.getElementById("close-menu");

    // Open Login Menu
    menuBtn.addEventListener("click", function () {
        loginMenu.style.display = "block";
    });

    // Close Login Menu
    closeMenuBtn.addEventListener("click", function () {
        loginMenu.style.display = "none";
    });

    // Close login menu when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === loginMenu) {
            loginMenu.style.display = "none";
        }
    });
});

// Admin Login Function
function loginAdmin() {
    let username = document.getElementById("admin-username").value;
    let password = document.getElementById("admin-password").value;

    if (username === "admin" && password === "admin123") {
        window.location.href = "admin.html"; // Redirect to Admin Dashboard
    } else {
        alert("Invalid Admin Credentials");
    }
}

// Teacher Login Function
function loginTeacher() {
    let classPage = document.getElementById("class-select").value;
    let username = document.getElementById("teacher-username").value;
    let password = document.getElementById("teacher-password").value;

    if (!classPage) {
        alert("Please select a class.");
        return;
    }

    if (username === "teacher" && password === "teacher123") {
        window.location.href = classPage; // Redirect to respective class page
    } else {
        alert("Invalid Teacher Credentials");
    }
}
