document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const printBtn = document.getElementById('printBtn');
    const resultContainer = document.getElementById('resultContainer');
    const studentForm = document.getElementById('studentForm');
    const subjectContainer = document.getElementById('subjectContainer');
    const streamSelect = document.getElementById('stream');
    
    // All available subjects
    const allSubjects = [
        "Physics", "Philosophy", "Entrepreneurship", "Political Science", 
        "Accountancy", "Mathematics", "Business Studies", "Geography", 
        "Biology", "English", "Hindi", "Regional Languages", "Computer Science", 
        "Multimedia and Web Technology", "Sociology", "Music", "Sanskrit", "Urdu", "Agriculture", 
        "Economics", "Psychology", "History", "Home Science", "Science", 
        "Social Science", "Chemistry"
    ];
    
    // Stream-specific subjects
    const streamSubjects = {
        "9th": ["Mathematics", "Science", "Social Science"],
        "10th": ["Mathematics", "Science", "Social Science"],
        "Science(PCM)": ["Physics", "Chemistry", "Mathematics"],
        "Science(PCB)": ["Physics", "Chemistry", "Biology"],
        "Commerce": ["Accountancy", "Business Studies", "Economics"],
        "Arts": ["History", "Political Science", "Geography"]
    };
    
    // Common subjects for all streams
    const commonSubjects = ["English"];
    
    // Additional subjects
    const additionalSubjects = allSubjects.filter(sub => 
        ![...Object.values(streamSubjects).flat(), ...commonSubjects].includes(sub)
    );
    
    let selectedSubjects = [];
    
    // Initialize subject inputs
    function initializeSubjects() {
        subjectContainer.innerHTML = '';
        selectedSubjects = [];
        
        const stream = streamSelect.value;
        const isSecondary = stream === "9th" || stream === "10th";
        
        // Add 5 main subject inputs
        for (let i = 1; i <= 5; i++) {
            createSubjectInput(i, i <= (isSecondary ? 3 : 3)); // First 3 are compulsory
        }
        
        // Add additional subject input
        createSubjectInput(6, false, true);
        
        // Update class for styling
        subjectContainer.className = isSecondary ? 'marks-grid stream-9th-10th' : 'marks-grid';
    }
    
    // Create a subject input group
    function createSubjectInput(index, isCompulsory, isAdditional = false) {
        const group = document.createElement('div');
        group.className = 'subject-group';
        
        const label = document.createElement('label');
        label.textContent = isAdditional ? 'Additional Subject:' : `Subject ${index}:`;
        if (isCompulsory) label.textContent += ' (Compulsory)';
        
        const select = document.createElement('select');
        select.className = 'subject-select';
        select.required = !isAdditional;
        select.dataset.index = index;
        
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Select Subject';
        select.appendChild(option);
        
        // Add appropriate subjects based on stream and whether it's additional
        let availableSubjects = [];
        const stream = streamSelect.value;
        
        if (isAdditional) {
            availableSubjects = additionalSubjects;
        } else if (index <= 3) {
            availableSubjects = [...streamSubjects[stream], ...commonSubjects];
        } else {
            // For subject 4 and 5, include English and Hindi plus other available subjects
            availableSubjects = ["English", "Hindi", ...allSubjects.filter(sub => 
                ![...streamSubjects[stream], ...commonSubjects, "English", "Hindi"].includes(sub)
            )];
        }
        
        availableSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            select.appendChild(option);
        });
        
        select.addEventListener('change', function() {
            updateSubjectOptions();
        });
        
        const marksInput = document.createElement('input');
        marksInput.type = 'number';
        marksInput.min = '0';
        marksInput.max = '100';
        marksInput.placeholder = 'Marks (0-100)';
        marksInput.required = !isAdditional;
        marksInput.className = 'marks-input';
        
        group.appendChild(label);
        group.appendChild(select);
        group.appendChild(marksInput);
        
        subjectContainer.appendChild(group);
    }
    
    // Update subject options to prevent duplicates
    function updateSubjectOptions() {
        const selects = document.querySelectorAll('.subject-select');
        selectedSubjects = [];
        
        // Get all currently selected subjects
        selects.forEach(select => {
            if (select.value) {
                selectedSubjects.push(select.value);
            }
        });
        
        // Update each select to disable already selected options
        selects.forEach(select => {
            const currentValue = select.value;
            Array.from(select.options).forEach(option => {
                if (option.value && option.value !== currentValue) {
                    option.disabled = selectedSubjects.includes(option.value);
                }
            });
        });
    }
    
    // Stream change handler
    streamSelect.addEventListener('change', function() {
        if (this.value) {
            initializeSubjects();
        }
    });
    
    // Generate result
    generateBtn.addEventListener('click', generateResult);
    printBtn.addEventListener('click', printResult);
    
    function generateResult() {
        // Get basic info
        const schoolName = document.getElementById('schoolName').value;
        const studentName = document.getElementById('studentName').value;
        const fatherName = document.getElementById('fatherName').value;
        const rollNumber = document.getElementById('rollNumber').value;
        const admissionNumber = document.getElementById('admissionNumber').value;
        const className = document.getElementById('className').value;
        const section = document.getElementById('section').value;
        const stream = document.getElementById('stream').value;
        const session = document.getElementById('session').value;
        const examType = document.getElementById('examType').value;
        
        // Get subjects and marks
        const subjectGroups = document.querySelectorAll('.subject-group');
        const subjects = [];
        let totalMarks = 0;
        let subjectCount = 0;
        
        subjectGroups.forEach(group => {
            const select = group.querySelector('.subject-select');
            const marksInput = group.querySelector('.marks-input');
            
            if (select.value && marksInput.value) {
                const marks = parseInt(marksInput.value);
                subjects.push({
                    name: select.value,
                    marks: marks,
                    maxMarks: 100
                });
                totalMarks += marks;
                subjectCount++;
            }
        });
        
        // Calculate percentage (only for first 5 subjects)
        const mainSubjects = subjects.slice(0, 5);
        const mainTotal = mainSubjects.reduce((sum, sub) => sum + sub.marks, 0);
        const percentage = (mainTotal / 500) * 100;
        
        // Generate result HTML
        const resultHTML = `
            <div class="result-header">
                <h2>${schoolName}</h2>
                <p>${examType} Examination Result - ${session}</p>
            </div>
            
            <div class="student-details">
                <h3>Student Details</h3>
                <div class="details-grid-result">
                    <div class="detail-item"><strong>Student Name:</strong> ${studentName}</div>
                    <div class="detail-item"><strong>Father's Name:</strong> ${fatherName}</div>
                    <div class="detail-item"><strong>Roll Number:</strong> ${rollNumber}</div>
                    <div class="detail-item"><strong>Admission No.:</strong> ${admissionNumber || 'N/A'}</div>
                    <div class="detail-item"><strong>Class:</strong> ${className}</div>
                    <div class="detail-item"><strong>Section:</strong> ${section}</div>
                    <div class="detail-item"><strong>Stream:</strong> ${stream}</div>
                    <div class="detail-item"><strong>Session:</strong> ${session}</div>
                    <div class="detail-item"><strong>Exam Type:</strong> ${examType}</div>
                </div>
            </div>
            
            <div class="student-marks">
                <h3>Academic Performance</h3>
                <table class="marks-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Marks Obtained</th>
                            <th>Maximum Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subjects.map(subject => `
                            <tr ${subject.name === subjects[5]?.name ? 'class="additional-subject"' : ''}>
                                <td>${subject.name}</td>
                                <td>${subject.marks}</td>
                                <td>${subject.maxMarks}</td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td>Total (Main 5 Subjects)</td>
                            <td>${mainTotal}</td>
                            <td>500</td>
                        </tr>
                        <tr class="total-row">
                            <td>Percentage</td>
                            <td colspan="2">${percentage.toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="signature-area">
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <p>Class Teacher</p>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <p>Principal</p>
                    </div>
                </div>
            </div>
        `;
        
        // Display the result
        resultContainer.innerHTML = resultHTML;
        resultContainer.style.display = 'block';
        printBtn.style.display = 'block';
    }
    
    function printResult() {
        window.print();
    }
    
    // Initialize the form
    initializeSubjects();
});
