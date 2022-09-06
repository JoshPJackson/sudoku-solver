let state = Array(81);
state.fill(0, 0, 81);
setValueOfState(state, 0, 0, 2)
setValueOfState(state, 0, 3, 5)
setValueOfState(state, 0, 5, 7)
setValueOfState(state, 0, 6, 4)
setValueOfState(state, 0, 8, 6)
setValueOfState(state, 1, 4, 3)
setValueOfState(state, 1, 5, 1)
setValueOfState(state, 2, 6, 2)
setValueOfState(state, 2, 7, 3)
setValueOfState(state, 3, 4, 2)
setValueOfState(state, 4, 0, 8)
setValueOfState(state, 4, 1, 6)
setValueOfState(state, 4, 3, 3)
setValueOfState(state, 4, 4, 1)
setValueOfState(state, 5, 1, 4)
setValueOfState(state, 5, 2, 5)
setValueOfState(state, 6, 2, 9)
setValueOfState(state, 6, 6, 7)
setValueOfState(state, 7, 2, 6)
setValueOfState(state, 7, 3, 9)
setValueOfState(state, 7, 4, 5)
setValueOfState(state, 7, 8, 2)
setValueOfState(state, 8, 2, 1)
setValueOfState(state, 8, 5, 6)
setValueOfState(state, 8, 8, 8)

let areaStartIndices = []
let areaIndices = [];

for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
        areaStartIndices.push(i * 9 + j)
        let indicesForArea = [];
        for (let k = i; k < i + 3; k++) {
            for (let l = j; l < j + 3; l++) {
                indicesForArea.push(k * 9 + l)
            }
        }
        areaIndices.push(indicesForArea)
    }
}

function rootElem() {
    return document.getElementById('root')
}

function index(row, col) {
    return row * 9 + col
}

function setValueOfState(state, row, col, number) {
    state[index(row, col)] = number;
}

function showState(state) {
    for (i = 0; i < 81; i++) {
        if (state[i] > 0) {
            document.querySelector(`[data-index="${i}"]`).style.color = 'red'
        }
    }
}

function drawBoard(state) {
    let content = '<table><tbody>'

    for (let i = 0; i < 9; i++) {

        content += '<tr>'

        for (let j = 0; j < 9; j++) {
            content += `<td id="${i}-${j}" class="cell" data-row="${i}" data-col="${j}" data-index="${index(i, j)}">` + (state[i * 9 + j] ? state[i * 9 + j] : '') + '</td>'
        }

        content += '</tr>'
    }

    content += '</tbody></table>'

    rootElem().innerHTML = content
    showState(state)
}

function lastEditedIndex(currentIndex, state) {
    for (let i = 1; i < currentIndex; i++) {
        if (state[currentIndex - i] === 0) {
            return (currentIndex - i - 1)
        }
    }

    return -1;
}

function solve() {
    let iterations = 0
    let maxIterations = 2000
    let backtracks = 0
    let copyState = JSON.parse(JSON.stringify(state))

    for (let i = -1; i < 81; i++) {
        if (i == -1) {
            continue;
        }
        iterations++;

        // check if cell is not set from original puzzle
        if (state[i] === 0) {
            copyState[i] += 1

            document.querySelector(`[data-index="${i}"]`).innerText = copyState[i]

            // index cell is now 10, we need to backtrack
            if (copyState[i] === 10) {
                backtracks++
                iterations++
                copyState[i] = 0
                document.querySelector(`[data-index="${i}"]`).innerText = ''
                i = lastEditedIndex(i, state)
            } else {
                // check validity
                if (!(rowIsValid(i, copyState) && colIsValid(i, copyState) && areaIsValid(i, copyState))) {
                    i -= 1
                }
            }
        }
    }

    document.getElementById('iterations').innerText = iterations
    document.getElementById('backtracks').innerText = backtracks
}

function rowFromIndex(index) {
    return Math.floor(index / 9)
}

function colFromIndex(index) {
    return index % 9
}

function rowIsValid(index, state) {

    let counts = new Array(9).fill(0)
    let rowStart = rowFromIndex(index) * 9

    for (let i = rowStart; i < rowStart + 9; i++) {
        if (state[i] > 0) {
            counts[state[i] - 1]++
        }
    }

    return Math.max(...counts) < 2
}

function colIsValid(index, state) {

    let counts = new Array(9).fill(0)
    let colStart = colFromIndex(index) % 9

    for (let i = colStart; i < 81; i += 9) {
        if (state[i] > 0) {
            counts[state[i] - 1]++
        }
    }

    return Math.max(...counts) < 2
}

function areaIsValid(index, state) {
    // find the top-left cell of each area
    let indicesToCheck;

    for (let i = 0; i < 9; i++) {
        if (areaIndices[i].includes(index)) {
            indicesToCheck = areaIndices[i]
            break;
        }
    }

    let counts = new Array(9).fill(0)

    for (let i = 0; i < 9; i++) {
        let index = indicesToCheck[i]
        if (state[index] > 0) {
            counts[state[index] - 1]++
        }
    }

    return Math.max(...counts) < 2
}

let timeStart = Date.now()
drawBoard(state)
solve()
console.log('time taken:', Date.now() - timeStart)