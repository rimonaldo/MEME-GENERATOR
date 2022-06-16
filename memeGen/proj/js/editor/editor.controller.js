'use strict'

function init() {
    setCanvas()
    drawImgFromlocal()
    addListeners()
    setImgId()
    gCtx.textAlign = 'left'
}

function renderCanvas() {
    drawImgFromlocal()
    setText()
}

function setFontColor(hex){
    getLine().color = hex 
    saveMeme()
    renderCanvas()

}

// add a new line
function onAddLine() {
    addLine()
}

// sets the line the user is editing
function onSetLine(direction) {
    // var line = getLine()
    // var text = line.text
    // console.log('text\n', line.text);
    // var { x, y } = getLinePos()
    // // _clearStroke(x, y)
    // toggleStroke()
    // setInputVal(text)
    // _setLine(direction,text)
    // if (!line.isStroke) {
    //     toggleStroke()
    // } else _clearStroke(x, y)

    // saveMeme()

}

function onSetLine(direction){

    _clearStroke()
    _setLine(direction, getLine().text)
    var { x, y } = getLinePos()
    setInputVal(getLine().text)
    _strokeRect(x, y)  
    saveMeme()
}

function setFontSize(size){
    _clearStroke()
    var {x,y} = getLinePos()
    
    _clearLineTxt(x, y)
    
    getLine().size = +size
    _drawText(getLine().text, x, y)
    saveMeme()
}

function onAlign(direction){
    if (direction === 'left') return
    if (direction === 'center') getLine().align = 'center'
    if (direction === 'right') getLine().align = 'right'

   
}

function onDeleteLine() {

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
