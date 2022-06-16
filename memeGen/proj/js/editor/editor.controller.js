'use strict'

function init() {
    setCanvas()
    drawImgFromlocal()
    addListeners()
    setImgId()
}

function renderCanvas() {
    drawImgFromlocal()
    setText()
}



// add a new line
function onAddLine() {
    addLine()
}

// sets the line the user is editing
function onSetLine() {
    var line = getLine()
    var text = line.text
    var { x, y } = getLinePos()
    // _clearStroke(x, y)
    toggleStroke()
    _setLine(text)
    setInputVal(text)
    if (!line.isStroke) {
        toggleStroke()
    } else _clearStroke(x, y)
    saveMeme()
    console.log('lineIDX',loadFromStorage('MEME').lineIdx);
}


function onDeleteLine() {

}

function onInput() {

    var line = getLine()
    if (!line.isStroke) toggleStroke()
    else return
}









function addListeners() {
    _addMouseListeners()
    _addTouchListeners()
}






// still not working --> currently calculating area of circle
function isTextClicked(clickedPos) {
    const { x, y } = getLinePos()
    const distance = Math.sqrt((x - clickedPos.x) ** 2 + (y - clickedPos.y) ** 2)
    //If its smaller then the radius of the circle we are inside
    return distance <= getLine().size
}

function setTextDrag(isDrag) {
    var line = getLine()
    line.isDrag = isDrag
}

function getEvPos(ev) {

    //Gets the offset pos , the default pos
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }

    // Check if its a touch ev
    if (gTouchEvs.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
        //Gets the first touch point
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function moveText(dx, dy) {
    var { x, y } = getLinePos()
    var line = getLine()
    // add diff
    var diff = (line.text.length) ? line.text.length * 16 : 160
    console.log(diff);
    x += dx - diff 
    y += dy 
    // sets position in line object pos
    line.linePos.x = x
    line.linePos.y = y
}


function _addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function _addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}
