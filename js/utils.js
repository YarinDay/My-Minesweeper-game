// function printMat(mat, selector) {
//     var strHTML = '<table border="0"><tbody>'
//     for (var i = 0; i < mat.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < mat[0].length; j++) {
//             const cell = mat[i][j]
//             const className = `cell cell-${i}-${j}`
//             strHTML += `<td class="${className}"> ${cell} </td>`
//         }
//         strHTML += '</tr>'
//     }
//     strHTML += '</tbody></table>'
//     const elContainer = document.querySelector(selector)
//     elContainer.innerHTML = strHTML
// }

// location such as: {i: 2, j: 7}
// function renderCell(location, value) {
//     // Select the elCell and set the value
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }

// Random number (int) max inclusive
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

// Random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// function countNeighbors(cellI, cellJ, mat) {
//     var neighborsCount = 0;
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (i === cellI && j === cellJ) continue;
//             if (j < 0 || j >= mat[i].length) continue;
//             if (mat[i][j] === '') neighborsCount++;
//         }
//     }
//     return neighborsCount;
// }

function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

function getEmptyCell(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === EMPTY) {
                emptyCells.push({ i, j })
            }
        }
    }
    var randCellIdx = getRandomIntInclusive(0, emptyCells.length-1)
    return emptyCells[randCellIdx]
}

// Drawing a rand num from an array
function drawNum(nums) {
    var randNumIdx = getRandomInt(0, nums.length)
    var num = nums[randNumIdx]
    nums.splice(randNumIdx, 1)
    return num
}

function stoper() {
    var milliseconds = 0
    var seconds = 0
    timerRef = document.querySelector('.timer-display')
    if (gGame.isOn) {
        int = setInterval(displayTimer, 10)
    }
    if (!gGame.isOn) clearInterval(int)
    function displayTimer() {
        milliseconds += 10
        if (milliseconds == 1000) {
            milliseconds = 0
            seconds++
        }
        
        var s = seconds < 10 ? "0" + seconds : seconds
        var ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds
        
        timerRef.innerHTML = ` ${s} : ${ms}`
    }
}