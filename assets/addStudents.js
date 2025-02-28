document.addEventListener('DOMContentLoaded', function () {
    // Initialize application state
    const appState = {
        darkMode: localStorage.getItem('darkMode') === 'true',
        students: JSON.parse(localStorage.getItem('students') || '[]'),
        currentView: 'dashboard',
        currentStudentIndex: -1
    };

    // Sidebar Toggle
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.querySelector('.sidebar');

    if (menuIcon && sidebar) {
        menuIcon.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }
});


    // DOM Elements
    const elements = {
        sidebar: document.querySelector('.sidebar'),
        menuIcon: document.querySelector('.menu-icon'),
        mainContent: document.getElementById('main-content'),
        studentForm: document.getElementById('student-form'),
        tableSection: document.querySelector('.table-section'),
        searchInput: document.getElementById('search'),
        studentsTable: document.querySelector('table tbody'),
        contentTitle: document.querySelector('.content-header h1'),
        addStudentSection: document.getElementById('add-student-section'),
        addStudentMenu: document.getElementById('add-student-menu'),
        viewRecordsMenu: document.getElementById('view-records-menu'),
        exportCsvBtn: document.getElementById('export-csv'),
        toggleDarkMode: document.getElementById('toggle-dark-mode'),
        logoutBtn: document.getElementById('logout-btn')
    };

    // ---------- Event Listeners ----------

    // Mobile menu toggle
    if (elements.menuIcon) {
        elements.menuIcon.addEventListener('click', function() {
            elements.sidebar.classList.toggle('active');
        });
    }

    // Form submission
    elements.studentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            if (appState.currentStudentIndex === -1) {
                addStudent();
            } else {
                updateStudent(appState.currentStudentIndex);
            }
        }
    });

    // Search functionality
    elements.searchInput.addEventListener('input', function() {
        filterStudents(this.value.toLowerCase());
    });

    // Navigation menu handlers
    if (elements.addStudentMenu) {
        elements.addStudentMenu.addEventListener('click', function(e) {
            e.preventDefault();
            showView('add-student');
        });
    }

    if (elements.viewRecordsMenu) {
        elements.viewRecordsMenu.addEventListener('click', function(e) {
            e.preventDefault();
            showView('view-records');
        });
    }

    // Export to CSV
    if (elements.exportCsvBtn) {
        elements.exportCsvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            exportToCSV();
        });
    }

    // Dark mode toggle
    if (elements.toggleDarkMode) {
        elements.toggleDarkMode.addEventListener('click', function(e) {
            e.preventDefault();
            toggleDarkMode();
        });
    }

    // Logout functionality
if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            // In a real application, this would clear the session
            window.location.href = 'addStudents.html'; // Updated to match your HTML file name
        }
    });
}

    // ---------- Core Functions ----------

    // Validate form inputs
    function validateForm() {
        // Required fields
        const requiredFields = [
            'admission-no', 'name', 'address', 'dob', 'doa', 
            'father', 'mother', 'contact-father'
        ];
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                markInvalid(input, `${input.previousElementSibling.textContent} is required`);
                isValid = false;
            } else {
                markValid(input);
            }
        });
        
        // Validate Aadhar number (if provided)
        const aadharInput = document.getElementById('aadhar');
        if (aadharInput.value && !/^\d{12}$/.test(aadharInput.value)) {
            markInvalid(aadharInput, 'Aadhar number must be 12 digits');
            isValid = false;
        } else if (aadharInput.value) {
            markValid(aadharInput);
        }
        
        // Validate contact numbers
        const contactFields = ['contact-father', 'contact-mother', 'guardian-contact', 'alternate-no'];
        contactFields.forEach(field => {
            const input = document.getElementById(field);
            if (input.value && !/^\d{10}$/.test(input.value)) {
                markInvalid(input, 'Contact number must be 10 digits');
                isValid = false;
            } else if (input.value) {
                markValid(input);
            }
        });
        
        // Validate email
        const emailInput = document.getElementById('email');
        if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            markInvalid(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else if (emailInput.value) {
            markValid(emailInput);
        }
        
        // Check for duplicate admission number when adding new student
        if (isValid && appState.currentStudentIndex === -1) {
            const admissionNo = document.getElementById('admission-no').value;
            const isDuplicate = appState.students.some(student => student.admissionNo === admissionNo);
            
            if (isDuplicate) {
                markInvalid(document.getElementById('admission-no'), 'This admission number already exists');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Helper functions for form validation
    function markInvalid(element, message) {
        element.classList.add('invalid');
        
        // Create or update error message
        let errorMsg = element.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            element.parentNode.insertBefore(errorMsg, element.nextSibling);
        }
        
        errorMsg.textContent = message;
    }
    
    function markValid(element) {
        element.classList.remove('invalid');
        
        // Remove error message if exists
        const errorMsg = element.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
        }
    }

    // Add new student record
    function addStudent() {
        const student = collectFormData();
        
        // Add unique ID and creation timestamp
        student.id = generateUniqueId();
        student.createdAt = new Date().toISOString();
        
        appState.students.push(student);
        saveStudents();
        resetForm();
        
        showNotification('Student record added successfully!', 'success');
        
        // Refresh table if in view records mode
        if (appState.currentView === 'view-records') {
            populateStudentsTable();
        }
    }

    // Update existing student record
    function updateStudent(index) {
        const student = collectFormData();
        
        // Preserve id and createdAt, update modifiedAt
        student.id = appState.students[index].id;
        student.createdAt = appState.students[index].createdAt;
        student.modifiedAt = new Date().toISOString();
        
        appState.students[index] = student;
        saveStudents();
        
        showNotification('Student record updated successfully!', 'success');
        resetForm();
        
        // Reset current student index
        appState.currentStudentIndex = -1;
        
        // Update button text
        const submitBtn = elements.studentForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Save Record';
        
        // Refresh table if in view records mode
        if (appState.currentView === 'view-records') {
            populateStudentsTable();
        }
    }

    // Delete student record
    function deleteStudent(index) {
        if (confirm('Are you sure you want to delete this student record?')) {
            appState.students.splice(index, 1);
            saveStudents();
            populateStudentsTable();
            showNotification('Student record deleted successfully!', 'success');
        }
    }

    // Collect all form data into a student object
    function collectFormData() {
        const student = {
            admissionNo: document.getElementById('admission-no').value,
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            dob: document.getElementById('dob').value,
            doa: document.getElementById('doa').value,
            class: document.getElementById('class') ? document.getElementById('class').value : '',
            aadhar: document.getElementById('aadhar').value,
            cwsn: document.getElementById('cwsn').value,
            father: document.getElementById('father').value,
            mother: document.getElementById('mother').value,
            contactFather: document.getElementById('contact-father') ? document.getElementById('contact-father').value : '',
            contactMother: document.getElementById('contact-mother') ? document.getElementById('contact-mother').value : '',
            hostler: document.getElementById('hostler').value,
            guardian: document.getElementById('guardian').value,
            guardianAddress: document.getElementById('guardian-address').value,
            guardianContact: document.getElementById('guardian-contact').value,
            alternateNo: document.getElementById('alternate-no') ? document.getElementById('alternate-no').value : '',
            email: document.getElementById('email').value,
            idMarks: document.getElementById('id-marks').value
        };
        
        // Additional fields if they exist
        if (document.getElementById('bank-name')) {
            student.bankDetails = {
                bankName: document.getElementById('bank-name').value,
                branchName: document.getElementById('branch-name').value,
                ifscCode: document.getElementById('ifsc').value,
                accountNo: document.getElementById('account-no').value
            };
        }
        
        if (document.getElementById('religion')) {
            student.socioEconomic = {
                religion: document.getElementById('religion').value,
                category: document.getElementById('category').value,
                fatherQualification: document.getElementById('father-qualification').value,
                fatherOccupation: document.getElementById('father-occupation').value,
                motherQualification: document.getElementById('mother-qualification').value,
                motherOccupation: document.getElementById('mother-occupation').value,
                annualIncome: document.getElementById('annual-income').value
            };
        }
        
        // Family members
        if (document.querySelector('.family-table')) {
            student.familyMembers = [];
            const rows = document.querySelectorAll('.family-table tbody tr');
            
            rows.forEach(row => {
                const inputs = row.querySelectorAll('input');
                if (inputs[0].value) {  // Only add if name is not empty
                    student.familyMembers.push({
                        name: inputs[0].value,
                        relationship: inputs[1].value,
                        qualification: inputs[2].value,
                        occupation: inputs[3].value
                    });
                }
            });
        }
        
        // Health data
        if (document.getElementById('height')) {
            student.healthData = {
                height: document.getElementById('height').value,
                weight: document.getElementById('weight').value,
                bloodGroup: document.getElementById('blood-group').value,
                specialDiseases: document.getElementById('special-diseases').value,
                vaccinationDetails: document.getElementById('vaccination-details').value
            };
        }
        
        return student;
    }

    // Reset form fields and state
    function resetForm() {
        elements.studentForm.reset();
        
        // Clear any validation errors
        const errorMessages = elements.studentForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        const invalidInputs = elements.studentForm.querySelectorAll('.invalid');
        invalidInputs.forEach(input => input.classList.remove('invalid'));
        
        // Reset current student index
        appState.currentStudentIndex = -1;
        
        // Update button text
        const submitBtn = elements.studentForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Save Record';
    }

    // Populate table with student records
    function populateStudentsTable() {
        elements.studentsTable.innerHTML = '';
        
        if (appState.students.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="10" class="no-data">No student records found</td>';
            elements.studentsTable.appendChild(row);
            return;
        }
        
        appState.students.forEach((student, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${student.admissionNo}</td>
                <td>${student.name}</td>
                <td>${student.address}</td>
                <td>${formatDate(student.dob)}</td>
                <td>${formatDate(student.doa)}</td>
                <td>${student.aadhar || '-'}</td>
                <td>${student.cwsn}</td>
                <td>${student.contactFather || student.contact || '-'}</td>
                <td>${student.hostler}</td>
                <td>
                    <button class="action-btn edit" data-index="${index}">Edit</button>
                    <button class="action-btn delete" data-index="${index}">Delete</button>
                    <button class="action-btn view" data-index="${index}">View</button>
                </td>
            `;
            
            elements.studentsTable.appendChild(row);
        });
        
        // Add event listeners to action buttons
        elements.studentsTable.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                editStudent(parseInt(this.dataset.index));
            });
        });
        
        elements.studentsTable.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteStudent(parseInt(this.dataset.index));
            });
        });
        
        elements.studentsTable.querySelectorAll('.view').forEach(btn => {
            btn.addEventListener('click', function() {
                viewStudent(parseInt(this.dataset.index));
            });
        });
    }

    // Filter students based on search query
    function filterStudents(query) {
        if (!query) {
            populateStudentsTable();
            return;
        }
        
        const filteredStudents = appState.students.filter(student => {
            return (
                student.admissionNo.toLowerCase().includes(query) ||
                student.name.toLowerCase().includes(query) ||
                student.address.toLowerCase().includes(query) ||
                (student.father && student.father.toLowerCase().includes(query)) ||
                (student.mother && student.mother.toLowerCase().includes(query)) ||
                (student.aadhar && student.aadhar.includes(query))
            );
        });
        
        elements.studentsTable.innerHTML = '';
        
        if (filteredStudents.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="10" class="no-data">No matching records found</td>';
            elements.studentsTable.appendChild(row);
            return;
        }
        
        filteredStudents.forEach((student, i) => {
            // Find the original index in the full students array
            const originalIndex = appState.students.findIndex(s => s.id === student.id);
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${student.admissionNo}</td>
                <td>${student.name}</td>
                <td>${student.address}</td>
                <td>${formatDate(student.dob)}</td>
                <td>${formatDate(student.doa)}</td>
                <td>${student.aadhar || '-'}</td>
                <td>${student.cwsn}</td>
                <td>${student.contactFather || student.contact || '-'}</td>
                <td>${student.hostler}</td>
                <td>
                    <button class="action-btn edit" data-index="${originalIndex}">Edit</button>
                    <button class="action-btn delete" data-index="${originalIndex}">Delete</button>
                    <button class="action-btn view" data-index="${originalIndex}">View</button>
                </td>
            `;
            
            elements.studentsTable.appendChild(row);
        });
        
        // Re-add event listeners to action buttons
        elements.studentsTable.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                editStudent(parseInt(this.dataset.index));
            });
        });
        
        elements.studentsTable.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteStudent(parseInt(this.dataset.index));
            });
        });
        
        elements.studentsTable.querySelectorAll('.view').forEach(btn => {
            btn.addEventListener('click', function() {
                viewStudent(parseInt(this.dataset.index));
            });
        });
    }

    // Show student details for editing
    function editStudent(index) {
        const student = appState.students[index];
        
        // Set form values
        document.getElementById('admission-no').value = student.admissionNo;
        document.getElementById('name').value = student.name;
        document.getElementById('address').value = student.address;
        document.getElementById('dob').value = student.dob;
        document.getElementById('doa').value = student.doa;
        if (document.getElementById('class')) document.getElementById('class').value = student.class || '';
        document.getElementById('aadhar').value = student.aadhar || '';
        document.getElementById('cwsn').value = student.cwsn;
        document.getElementById('father').value = student.father;
        document.getElementById('mother').value = student.mother;
        
        // Handle new field structure
        if (document.getElementById('contact-father')) {
            document.getElementById('contact-father').value = student.contactFather || '';
        }
        if (document.getElementById('contact-mother')) {
            document.getElementById('contact-mother').value = student.contactMother || '';
        }
        
        // Legacy field
        if (document.getElementById('contact')) {
            document.getElementById('contact').value = student.contact || '';
        }
        
        document.getElementById('hostler').value = student.hostler;
        document.getElementById('guardian').value = student.guardian || '';
        document.getElementById('guardian-address').value = student.guardianAddress || '';
        document.getElementById('guardian-contact').value = student.guardianContact || '';
        
        if (document.getElementById('alternate-no')) {
            document.getElementById('alternate-no').value = student.alternateNo || '';
        }
        
        document.getElementById('email').value = student.email || '';
        document.getElementById('id-marks').value = student.idMarks || '';
        
        // Additional fields if they exist
        if (student.bankDetails && document.getElementById('bank-name')) {
            document.getElementById('bank-name').value = student.bankDetails.bankName || '';
            document.getElementById('branch-name').value = student.bankDetails.branchName || '';
            document.getElementById('ifsc').value = student.bankDetails.ifscCode || '';
            document.getElementById('account-no').value = student.bankDetails.accountNo || '';
        }
        
        if (student.socioEconomic && document.getElementById('religion')) {
            document.getElementById('religion').value = student.socioEconomic.religion || '';
            document.getElementById('category').value = student.socioEconomic.category || '';
            document.getElementById('father-qualification').value = student.socioEconomic.fatherQualification || '';
            document.getElementById('father-occupation').value = student.socioEconomic.fatherOccupation || '';
            document.getElementById('mother-qualification').value = student.socioEconomic.motherQualification || '';
            document.getElementById('mother-occupation').value = student.socioEconomic.motherOccupation || '';
            document.getElementById('annual-income').value = student.socioEconomic.annualIncome || '';
        }
        
        // Family members
        if (student.familyMembers && document.querySelector('.family-table')) {
            const rows = document.querySelectorAll('.family-table tbody tr');
            
            student.familyMembers.forEach((member, i) => {
                if (i < rows.length) {
                    const inputs = rows[i].querySelectorAll('input');
                    inputs[0].value = member.name;
                    inputs[1].value = member.relationship;
                    inputs[2].value = member.qualification;
                    inputs[3].value = member.occupation;
                }
            });
        }
        
        // Health data
        if (student.healthData && document.getElementById('height')) {
            document.getElementById('height').value = student.healthData.height || '';
            document.getElementById('weight').value = student.healthData.weight || '';
            document.getElementById('blood-group').value = student.healthData.bloodGroup || '';
            document.getElementById('special-diseases').value = student.healthData.specialDiseases || '';
            document.getElementById('vaccination-details').value = student.healthData.vaccinationDetails || '';
        }
        
        // Set current student index
        appState.currentStudentIndex = index;
        
        // Update button text
        const submitBtn = elements.studentForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Record';
        
        // Switch to add student view
        showView('add-student');
        
        // Scroll to top of form
        elements.addStudentSection.scrollIntoView({ behavior: 'smooth' });
    }

    // View full student details
    function viewStudent(index) {
        const student = appState.students[index];
        
        // Create modal for viewing student details
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Student Details</h2>
                <div class="student-details">
                    <div class="detail-section">
                        <h3>Personal Information</h3>
                        <p><strong>Admission No:</strong> ${student.admissionNo}</p>
                        <p><strong>Name:</strong> ${student.name}</p>
                        <p><strong>Address:</strong> ${student.address}</p>
                        <p><strong>Date of Birth:</strong> ${formatDate(student.dob)}</p>
                        <p><strong>Date of Admission:</strong> ${formatDate(student.doa)}</p>
                        <p><strong>Class:</strong> ${student.class || '-'}</p>
                        <p><strong>Aadhar Number:</strong> ${student.aadhar || '-'}</p>
                        <p><strong>CWSN:</strong> ${student.cwsn}</p>
                        <p><strong>Identification Marks:</strong> ${student.idMarks || '-'}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Contact Information</h3>
                        <p><strong>Father's Name:</strong> ${student.father}</p>
                        <p><strong>Father's Contact:</strong> ${student.contactFather || student.contact || '-'}</p>
                        <p><strong>Mother's Name:</strong> ${student.mother}</p>
                        <p><strong>Mother's Contact:</strong> ${student.contactMother || '-'}</p>
                        <p><strong>Email:</strong> ${student.email || '-'}</p>
                        <p><strong>Hostler:</strong> ${student.hostler}</p>
                        ${student.guardian ? `
                            <p><strong>Guardian's Name:</strong> ${student.guardian}</p>
                            <p><strong>Guardian's Address:</strong> ${student.guardianAddress || '-'}</p>
                            <p><strong>Guardian's Contact:</strong> ${student.guardianContact || '-'}</p>
                            <p><strong>Alternate Contact:</strong> ${student.alternateNo || '-'}</p>
                        ` : ''}
                    </div>
                    
                    ${student.bankDetails ? `
                        <div class="detail-section">
                            <h3>Bank Details</h3>
                            <p><strong>Bank Name:</strong> ${student.bankDetails.bankName || '-'}</p>
                            <p><strong>Branch Name:</strong> ${student.bankDetails.branchName || '-'}</p>
                            <p><strong>IFSC Code:</strong> ${student.bankDetails.ifscCode || '-'}</p>
                            <p><strong>Account Number:</strong> ${student.bankDetails.accountNo || '-'}</p>
                        </div>
                    ` : ''}
                    
                    ${student.socioEconomic ? `
                        <div class="detail-section">
                            <h3>Socio-Economic Status</h3>
                            <p><strong>Religion/Caste:</strong> ${student.socioEconomic.religion || '-'}</p>
                            <p><strong>Category:</strong> ${student.socioEconomic.category || '-'}</p>
                            <p><strong>Father's Qualification:</strong> ${student.socioEconomic.fatherQualification || '-'}</p>
                            <p><strong>Father's Occupation:</strong> ${student.socioEconomic.fatherOccupation || '-'}</p>
                            <p><strong>Mother's Qualification:</strong> ${student.socioEconomic.motherQualification || '-'}</p>
                            <p><strong>Mother's Occupation:</strong> ${student.socioEconomic.motherOccupation || '-'}</p>
                            <p><strong>Annual Family Income:</strong> ${student.socioEconomic.annualIncome || '-'}</p>
                        </div>
                    ` : ''}
                    
                    ${student.familyMembers && student.familyMembers.length > 0 ? `
                        <div class="detail-section">
                            <h3>Family Members</h3>
                            <table class="detail-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Relationship</th>
                                        <th>Qualification</th>
                                        <th>Occupation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${student.familyMembers.map(member => `
                                        <tr>
                                            <td>${member.name}</td>
                                            <td>${member.relationship || '-'}</td>
                                            <td>${member.qualification || '-'}</td>
                                            <td>${member.occupation || '-'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : ''}
                    
                    ${student.healthData ? `
                        <div class="detail-section">
                            <h3>Health Information</h3>
                            <p><strong>Height:</strong> ${student.healthData.height || '-'}</p>
                            <p><strong>Weight:</strong> ${student.healthData.weight || '-'}</p>
                            <p><strong>Blood Group:</strong> ${student.healthData.bloodGroup || '-'}</p>
                            <p><strong>Special Diseases:</strong> ${student.healthData.specialDiseases || 'None'}</p>
                            <p><strong>Vaccination Details:</strong> ${student.healthData.vaccinationDetails || '-'}</p>
                        </div>
                    ` : ''}
                    
                    <div class="detail-section">
                        <h3>Record Information</h3>
                        <p><strong>Created:</strong> ${formatDateTime(student.createdAt)}</p>
                        ${student.modifiedAt ? `<p><strong>Last Modified:</strong> ${formatDateTime(student.modifiedAt)}</p>` : ''}
                    </div>
                    
                    <div class="modal-actions">
                        <button class="edit-btn" data-index="${index}">Edit Record</button>
                        <button class="print-btn">Print Record</button>
                        <button class="close-btn">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Close modal on 'x' click
        modal.querySelector('.close').addEventListener('click', () => {
            closeModal(modal);
        });
        
        // Close modal on 'Close' button click
        modal.querySelector('.close-btn').addEventListener('click', () => {
            closeModal(modal);
        });
        
        // Edit student from modal
        modal.querySelector('.edit-btn').addEventListener('click', () => {
            closeModal(modal);
            editStudent(index);
        });
        
        // Print student record
        modal.querySelector('.print-btn').addEventListener('click', () => {
            printStudentRecord(student);
        });
        
        // Close modal if clicked outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }

    // Close modal with animation
    function closeModal(modal) {
        modal.classList.remove('active');
        
        // Remove modal after animation
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    }

// Print student record
function printStudentRecord(student) {
    const printWindow = window.open('', '_blank');
    
    // Generate HTML for print
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Student Record - ${student.name}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                }
                .school-name {
                    font-size: 18px;
                    font-weight: bold;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .section {
                    margin-bottom: 20px;
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 5px;
                }
                .section h2 {
                    margin-top: 0;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #ddd;
                }
                .row {
                    display: flex;
                    margin-bottom: 8px;
                }
                .label {
                    font-weight: bold;
                    width: 150px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="school-name">GOVT. HIGH SCHOOL PINAVOORKUDI</div>
                <h1>Student Record</h1>
            </div>

            <div class="section">
                <h2>Personal Information</h2>
                <div class="row"><span class="label">Name:</span> ${student.name}</div>
                <div class="row"><span class="label">Admission Number:</span> ${student.admissionNumber}</div>
                <div class="row"><span class="label">Date of Birth:</span> ${student.dob}</div>
                <div class="row"><span class="label">Class:</span> ${student.class}</div>
            </div>

            <div class="section">
                <h2>Contact Information</h2>
                <div class="row"><span class="label">Address:</span> ${student.address}</div>
                <div class="row"><span class="label">Parent Name:</span> ${student.parentName}</div>
                <div class="row"><span class="label">Contact Number:</span> ${student.contactNumber}</div>
            </div>

            <div class="section">
                <h2>Academic Performance</h2>
                <div class="row"><span class="label">Overall Grade:</span> ${student.grade}</div>
                <div class="row"><span class="label">Attendance:</span> ${student.attendance}%</div>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
}
