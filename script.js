const inputfield = document.querySelectorAll(".numberonly");
const inputs = document.querySelectorAll('.excel-table input');
//const gradefields = document.querySelectorAll(".gradeonly");
const submitbtn = document.getElementById('submitbtn');

/*function caltotal() {
    totalsum = 0;
    inputfield.forEach(function(input) {
        let = fieldValue = parseInt(input.value) || 0;
        totalsum = totalsum + fieldValue;
    });

    console.log("Total; ", totalsum);
};*/

function validateGrade(input) {
    input.value = input.value.toUpperCase();

    const validpa = /^(A[+-]?|B[+-]?|C[+-]?|D[+-]?|E|MC?|NE?)?$/;

    if (!validpa.test(input.value)) {
        input.value = input.value.slice(0, -1);
    }
};

// gpa calculation
function cal_semesterGPA() {
    const gradeValue = {
        "A+": 4.00,
        "A": 4.00,
        "A-": 3.70,
        "B+": 3.30,
        "B": 3.00,
        "B-": 2.70,
        "C+": 2.30,
        "C": 2.00,
        "C-": 1.70,
        "D+": 1.30,
        "D": 1.00,
        "E": 0.00,
        "MC": 0.00
    };

    const creditInputs = document.querySelectorAll('.numberonly');
    const gradeInputs = document.querySelectorAll('.grade input');

    let totalweightedpoint = 0;
    let totalCredits = 0;
    let errors = []; //Array to store all error messages
    let hasRepeat = false;

    creditInputs.forEach((creditInput, index) => {
        const creditsVal = creditInput.value.trim();
        const gradeinput = gradeInputs[index];
        const gradeVal = gradeInputs[index] ? gradeInputs[index].value.trim().toUpperCase() : '';

        const hasCredit = creditsVal !== '';
        const hasGrade = gradeVal !== '';

        if (gradeinput) {
            gradeinput.style.backgroundColor = "";
            gradeinput.style.color = "";
        }

        if (gradeVal === "MC" || gradeVal === "E") {
            hasRepeat = true;
            gradeinput.style.backgroundColor = "rgb(255, 71, 98)";
            gradeinput.style.color = "white";
        }

        if (!hasCredit && hasGrade) {
            errors.push(`Column ${index + 1}: Missing credits...!`);
        }
        else if (hasCredit && !hasGrade) {
            errors.push(`Column ${index + 1}: Missing grade...!`);
        }
        else if (hasCredit && hasGrade) {
            const credit = parseFloat(creditsVal) || 0;

            if (gradeVal in gradeValue) {
                const points = gradeValue[gradeVal];

                totalweightedpoint += credit * points;
                //console.log(totalweightedpoint)
                totalCredits += credit;
                
            } else {
                errors.push(`Column ${index + 1}: Invalid grade "${gradeVal}"`);
            }
        }    
    });

    if (errors.length > 0) {
        return { hasError: true, messages: errors};
    }

    const gpa = totalCredits > 0 ? (totalweightedpoint / totalCredits) : 0;

    return {
        hasError: false,
        totalPoints: totalweightedpoint.toFixed(2),
        totalCredits: totalCredits,
        gpa: gpa.toFixed(2),
        status: hasRepeat ? "Repeat" : "Pass"
    };
}

submitbtn.addEventListener('click', function(event) {
    event.preventDefault();

    const result = cal_semesterGPA();

    const miss = document.getElementById('mis');
    const dispalyDiv = document.getElementById('semGPA');
    const tocredits = document.querySelector('.totalCredit');

    miss.innerHTML = "";

    //check if errors occurred
    if (result.hasError) {
        dispalyDiv.textContent = "";
        miss.style.color = "red";
        miss.innerHTML = result.messages.join("<br>");
        return;
    }

    if (result.totalCredits > 0) {

        tocredits.textContent = result.totalCredits;
        
        if (result.status === "Repeat") {
            dispalyDiv.style.color = "#ececec";
            dispalyDiv.style.backgroundColor = "#ff4762";
            dispalyDiv.textContent = "Repeat";
        } else {
            dispalyDiv.style.color = "#ececec";
            dispalyDiv.style.backgroundColor = "hsl(125, 26%, 45%)";
            dispalyDiv.textContent = result.gpa;
        }
    } else {
        dispalyDiv.style.color = "black";
        dispalyDiv.textContent = "Please enter at least one valid grade and credit pair.";
    }
});

inputfield.forEach(function(input) {
    input.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-5]/g, '');

        if (this.value.length > 1) {
            this.value = this.value.substring(0,1);
        }
        caltotal();
    });
});

inputs.forEach((input, index) => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            if (input.selectionStart === input.value.length) {
                e.preventDefault();
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }

        if (e.key ==="ArrowLeft") {
            if (input.selectionStart === 0) {
                e.preventDefault();
                const prevInput = inputs[index - 1];
                if (prevInput) {
                    prevInput.focus();
                }
            }
        }
    });
});