'use strict'

function init() {
    gMeme = loadMeme()
    setCanvas()
    drawImgFromlocal()
    addListeners()
    setImgId()
    gCtx.textAlign = 'left'

}

// CANVAS
// ----------------------------------
function renderCanvas() {
    drawImgFromlocal()
    // setText()
}


// add a new line
function onAddLine() {
    addLine()
}

// stroke and model
function onSetLine(direction) {
    _clearStroke()
    _setLine(direction, getLine().text)
    var { x, y } = getLinePos()
    setInputVal(getLine().text)
    _strokeRect(x, y)
    saveMeme()
}


// text
function setFontColor(hex) {
    getLine().color = hex
    saveMeme()
    renderCanvas()
}

function setFontSize(size) {
    _clearStroke()
    var { x, y } = getLinePos()
    _clearLineTxt(x, y)
    getLine().size = +size
    _drawText(getLine().text, x, y)
    saveMeme()
}

function onAlign(direction) {
    align(direction)
    saveMeme()
}

function onDeleteLine() {

}

// DRAG and POSITION
// touch ev is currently bugged 
// ---------------------------------------------------------------
function getEvPos(ev) {
    //Gets the offset pos , the default pos
    var pos = { x: ev.offsetX, y: ev.offsetY }
    // Check if its a touch ev
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function setTextDrag(isDrag) {
    var line = getLine()
    line.isDrag = isDrag
}

// EVENT LISTENERS
// ----------------------------------------------------------------
function addListeners() {
    _addMouseListeners()
    _addTouchListeners()
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
