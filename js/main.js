'use strict'
const elRestart = document.querySelector(`.restart`)
var isFirstClick = true
var int = null
var timerRef
var countFlags = 0
var gBoard
const MINE = '💥'
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gElSelectedCell = null
var gCell = {}

function initGame() {
    countFlags = 0
    gBoard = createBoard()
    renderBoard(gBoard, '.board-container')
    for (var i = 0; i < gLevel.MINES; i++) {
        addRandomMine()
    }
    // console.log(showMines())
    console.log(gBoard);

}
function selectLevel(elButton, clicked_id) {
    gLevel.SIZE = +elButton.classList.value
    // gLevel.MINES = +elButton
    gLevel.MINES = +clicked_id
    console.log(gLevel.MINES);
    initGame()
    gGame.isOn = true
    elRestart.innerText = '😃'
    timerRef.innerHTML = `00 : 000`
    clearInterval(int)
    isFirstClick = true
}
function createBoard() {
    var tableRows = gLevel.SIZE
    var tableCols = tableRows
    const board = []
    for (var i = 0; i < tableRows; i++) {
        board[i] = []
        for (var j = 0; j < tableCols; j++) {
            gCell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            if (board[i][j] === MINE) {
                gCell.isMine = true
            }
            board[i][j] = gCell
        }
    }
    return board
}

function renderBoard(board, selector) {
    var strHTML = '<table border="1"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`

        for (var j = 0; j < board[0].length; j++) {

            if (gCell.isShown) {
                var cell = setMinesNegsCount({ i, j })
            } else {
                var cell = ''
            }

            if (board[i][j] === MINE && gCell.isShown) {
                cell = board[i][j]
            }
            const cellId = `cell-${i}-${j}`
            var className = (gCell.isMarked) ? 'marked' : ''
            className += (gCell.isShown) ? ' shown' : ''

            strHTML += `\t<td onclick="cellClicked(this, ${i}, ${j})" 
            class="cell ${className} ${cellId}" oncontextmenu="redFlag(this)">${cell}
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    strHTML += '</tbody></table>'
    // console.log(strHTML)

    const elOpts = document.querySelector(selector)
    elOpts.innerHTML = strHTML
}

function addRandomMine() {
    var randPos = getNoMineCell()
    var randPosI = randPos.i
    var randPosJ = randPos.j
    // Model
    gBoard[randPosI][randPosJ] = MINE
    // DOM 

    renderBoard(gBoard, '.board-container')
}

function getNoMineCell() {
    var noMinesCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] !== MINE) {
                noMinesCells.push({ i, j })
            }
        }
    }
    var randCellIdx = getRandomInt(0, noMinesCells.length)
    return noMinesCells[randCellIdx]
}

function cellClicked(elCell, i, j) {
    if (elCell.classList.contains('marked')) return
    cell = oncontextmenu
    if (!gGame.isOn) return

    var cell = gBoard[i][j]
    if (isFirstClick) {
        stoper()
    }
    isFirstClick = false
    if (cell === MINE) {
        renderCell({ i, j }, MINE)
        var showMinesArr = showMines()
        for (var k = 0; k < showMinesArr.length; k++) {
            console.log(showMinesArr[k]);
            renderCell({ i: showMinesArr[k].i, j: showMinesArr[k].j }, MINE)
        }
        // THE SAME!!!
        //     for (var k = 0; k < gBoard.length; k++) {
        //         for (var y = 0; y < gBoard.length; y++) {
        //             var cell = gBoard[k][y]
        //             if (cell === MINE) {
        //                 renderCell({ i:k, j:y }, MINE)
        //             }
        //     }
        // }
        gCell.isShown = true
        // console.log(showMinesArr[1])
        clearInterval(int)
        gCell.isMine = true
        // elCell.classList.add('mine')
        // console.log(elCell.classList.contains('mine'))
        gGame.isOn = false
        elRestart.innerText = '😥'
        return
    }

    cell.isShown = true
    if (cell.isShown) cell.minesAroundCount = setMinesNegsCount({ i, j })
    renderCell({ i, j }, cell.minesAroundCount)
    console.log('cell', cell);
    gElSelectedCell = (gElSelectedCell !== elCell) ? elCell : ''
    if (!gElSelectedCell) return
    if (gElSelectedCell) {
        gElSelectedCell.classList.add('selected')
    }
    if (cell === MINE && gElSelectedCell) {
        gElSelectedCell.classList.add('mine')
    }
    checkIfWon()

}

function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    gCell.minesAroundCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j] === MINE) {
                neighborsCount++;
                gCell.minesAroundCount = neighborsCount
            }
        }
    }
    // console.log('gCell', gCell.minesAroundCount);
    return neighborsCount;
}

function setMinesNegsCount(pos) {
    const cell = gBoard[pos.i][pos.j]
    if (cell.isShown) {
        var nearCells = countNeighbors(pos.i, pos.j, gBoard)
        gCell.minesAroundCount = nearCells
        // renderBoard(gBoard, '.board-container')
    }
    return nearCells
}

function showMines() {
    var onlyMines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (cell === MINE) {
                onlyMines.push({ i, j })
            }
        }
    }
    return onlyMines
}

function restartGame() {
    gGame.isOn = true
    elRestart.innerText = '😃'
    clearInterval(int)
    isFirstClick = true
    timerRef.innerHTML = `00 : 000`
    initGame()
}

window.oncontextmenu = function () {
    console.log(gCell.minesAroundCount);
    return false;     // cancel default menu
}

function checkIfWon() {
    var countShown = 0
    var totalCells = gLevel.SIZE ** 2
    var totalMines = gLevel.MINES
    var goodCells = totalCells - totalMines
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (cell.isShown) {
                countShown++
            }
        }

    }
    if (countShown === goodCells && countFlags === totalMines) {
        elRestart.innerText = '😎'
        clearInterval(int)
        gGame.isOn = false
    }
}

function redFlag(cell) {
    if (isFirstClick) stoper()
    isFirstClick = false
    if (!gGame.isOn) return
    console.log(gBoard)
    if (cell.innerText !== '' && cell.innerHTML !== '🚩') return
    cell.classList.toggle('marked')
    if (cell.classList.contains('marked')) {
        console.log(cell.innerHTML = '🚩');
        countFlags++
    } else {
        cell.innerHTML = ''
        countFlags--
    }
    checkIfWon()

}
