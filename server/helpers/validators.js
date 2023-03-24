// Helpers to validate various inputs

// Input--
// A: [Object]
// B: [Object]
// Returns true if every element of A appears in B, there are no duplicates in A, and A is non-empty
// Returns false otherwise
exports.validValuesNoDuplicates = (A, B) => {
    let validValuesLeft = B;
    
    for(let i = 0; i < A.length; i++) {
        let index = validValuesLeft.indexOf(A[i]);
        if(index >= 0) {
            delete validValuesLeft[index];
        } else {
            return false;
        }
    }

    return A.length > 0;
};

// Input--
// A: [Object]
// B: [Object]
// Returns true if every element of A appears in B
// Returns false otherwise
exports.validValues = (A, B) => {
    for(let i = 0; i < A.length; i++) {
        if(B.indexOf(A[i]) < 0) {
            return false;
        }
    }

    return true;
};


// Checks if string is valid date

exports.isValidDate = (string) => {
    var time = Date.parse(string);
    
    return !isNaN(time);
};



