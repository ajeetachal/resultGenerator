document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const printBtn = document.getElementById('printBtn');
    const resultContainer = document.getElementById('resultContainer');
    const studentForm = document.getElementById('studentForm');
    const subjectContainer = document.getElementById('subjectContainer');
    const streamSelect = document.getElementById('stream');
    const classSelect = document.getElementById('className');
    
    // All available subjects (updated with Sanskrit & Urdu)
    const allSubjects = [
        "Physics", "Philosophy", "Entrepreneurship", "Political Science", 
        "Accountancy", "Mathematics", "Business Studies", "Geography", 
        "Biology", "English", "Hindi", "Sanskrit", "Urdu", "Regional Languages", 
        "Computer Science", "Multimedia and Web Technology", "Sociology", 
        "Music", "Agriculture", "Economics", "Psychology", "History", "Home Science"
    ];
    
    // Stream-specific subjects
    const streamSubjects = {
        "Science(PCM)": ["Physics", "Chemistry", "Mathematics"],
        "Science(PCB)": ["Physics", "Chemistry", "Biology"],
        "Commerce": ["Accountancy", "Business Studies", "Economics"],
        "Arts": ["History", "Political Science", "Geography"],
        "General": ["Mathematics", "Science", "Social Studies"] // For 9th & 10th
    };
    
    // Common subjects for all streams
    const commonSubjects = ["English", "Hindi", "Sanskrit", "Urdu"];
    
    // Additional subjects
    const additionalSubjects = allSubjects.filter(sub => 
        ![...Object.values(streamSubjects).flat(), ...commonSubjects].includes(sub)
    );
    
    let selectedSubjects = [];
    
    // Update stream options based on class selection
    classSelect.addEventListener('change', function() {
        const selectedClass = this.value;
        streamSelect.innerHTML = '<option value="">Select Stream</option>';
        
        // Add streams based on class
        const streams = {
            "9th": ["General"],
            "10th": ["General"],
            "11th": ["Science(PCM)", "Science(PCB)", "Commerce", "Arts"],
            "12th": ["Science(PCM)", "Science(PCB)", "Commerce", "Arts"]
        };
        
        streams[selectedClass].forEach(stream => {
            const option = document.createElement('option');
            option.value = stream;
            option.textContent = stream;
            streamSelect.appendChild(option);
        });
        
        // Reset subjects when class changes
        initializeSubjects();
    });
    
    // Initialize subject inputs
    function initializeSubjects() {
        subjectContainer.innerHTML = '';
        selectedSubjects = [];
        
        // Add 5 main subject inputs
        for (let i = 1; i <= 5; i++) {
            createSubjectInput(i, i <= 3); // First 3 are compulsory based on stream
        }
        
        // Add additional subject input
        createSubjectInput(6, false, true);
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
        if (isAdditional) {
            availableSubjects = additionalSubjects;
        } else if (index <= 3) {
            const stream = streamSelect.value;
            availableSubjects = [...streamSubjects[stream], ...commonSubjects];
        } else {
            availableSubjects = ["English", "Hindi", "Sanskrit", "Urdu", ...allSubjects.filter(sub => 
                ![...streamSubjects[streamSelect.value], ...commonSubjects, "English", "Hindi", "Sanskrit", "Urdu"].includes(sub)
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
