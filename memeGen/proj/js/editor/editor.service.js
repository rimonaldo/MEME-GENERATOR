'use strict'
const URL_KEY = 'URL'
const MEME_KEY = 'MEME'
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

var gStartPos
var gUrl
var gMemes = []
var gCanvas
var gCtx
var gCanvasBottom
var gCtxBottom
var gOpacity = 1
var gIsStroke = false

var gMeme = {
    url: '',
    imgId: 0,
    lineIdx: 0,
    lines: [{
        linePos: { x: 20, y: 100 },
        text: 'ENTER TEXT',
        size: 60,
        align: 'left',
        color: 'white',
        stroke: 'black',
        isStroke: false,
        isDrag: false,
        isClicked: false
    },
    {
        linePos: { x: 50, y: 450 },
        text: '',
        size: 60,
        align: 'left',
        color: 'white',
        stroke: 'black',
        isStroke: false,
        isDrag: false,
        isClicked: false
    }]
}



// UPDATE MODEL
//--------------------------------------------------------------------
function setImgId() {
    gMeme.imgId = loadFromStorage('IMGID')
    saveMeme()
}



// sets input value --> HTML and MODEL
function setInputVal(text) {
    var elInput = document.querySelector('.txt-input')
    elInput.value = text
    getLine().text = text
    saveMeme()

}



function drawImgFromlocal() {
    var img = new Image()
    img.src = loadFromStorage(URL_KEY)
    gMeme.url = loadFromStorage(URL_KEY)

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        gCtxBottom.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)   
        
        setText()
        gMeme.lines.forEach((line) => {
            var { x, y } = getLinePos()
            console.log(line.text);
            if(line.isClicked){
                _drawText(line.text, x, y)
            }
        })
    }
    saveMeme()
}


function renderImage() {
    var img = new Image()
    img.src = loadFromStorage(URL_KEY)
    gMeme.url = loadFromStorage(URL_KEY)

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        gCtxBottom.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)

        
        
        setText()
        
    }
    saveMeme()
}

function _setLine(direction, text) {
    if (direction === 'down') {
        gMeme.lineIdx++
    } else gMeme.lineIdx--
    if (gMeme.lineIdx >= gMeme.lines.length || gMeme.lineIdx <= 0) gMeme.lineIdx = 0

}

var gCurrTxt = loadFromStorage('MEME').lines[gMeme.lineIdx].text

function setModelTxt() {
    getLine().text = gCurrTxt
}

function align(direction){
    if (direction === 'left') getLine().align = 'left'
    if (direction === 'center') getLine().align = 'center'
    if (direction === 'right') getLine().align = 'right'
}



function setText(text = getLine().text) {
    var x = gMeme.lines[gMeme.lineIdx].linePos.x
    var y = gMeme.lines[gMeme.lineIdx].linePos.y
    _clearLineTxt(x, y)


    setInputVal(text)
    _drawText(text, x, y)
    saveMeme()

}

function addLine() {
    var line = {
        linePos: { x: 50, y: 250 },
        text: '',
        size: 40,
        align: 'left',
        color: 'white',
        stroke: 'black',
        isStroke: false,
        isDrag: false,
        isClicked: false
    }
    gMeme.lines.push(line)
    var newLine = getNewLine()
    var y = newLine.linePos.y
    _strokeRect(0, y)
    // gMeme.lineIdx++
    saveMeme()
}

function getNewLine(){
    console.log(gMeme.lines[gMeme.lines.length-1]);
    return gMeme.lines[gMeme.lines.length-1]
}

// Mouse and Touch events 

function onDown(ev) {
    const pos = getEvPos(ev)
    isTextClicked(pos)
    if (!getLine().isClicked) return

    getLine().isDrag = true
    setTextDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
    getLine().isClicked = false
}

// still not working --> currently calculating area of circle
function isTextClicked(clickedPos) {

    const { x, y } = getLinePos()
    var size = getLine().size
    var xStart = 0
    var xEnd = gCanvas.width
    var yStart = y - (size + 10)
    var yEnd = y + (size/2)

    if (clickedPos.y >= yStart && clickedPos.y <= yEnd) {
        console.log('text clicked');
        getLine().isClicked = true
        return true
    } else return false

    // const distance = Math.sqrt((x - clickedPos.x) ** 2 + (y - clickedPos.y) ** 2)
    //If its smaller then the radius of the circle we are inside
    // return distance <= getLine().size
}

function onMove(ev) {
    const line = getLine();

    if (line.isDrag) {
        const pos = getEvPos(ev)
        //Calc the delta , the diff we moved
        const dx = pos.x - line.linePos.x
        const dy = pos.y - line.linePos.y
        moveText(dx, dy)
        gStartPos = pos
        renderImage()
        // renderCanvas()
    }
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


function onUp() {
    setTextDrag(false)
    document.body.style.cursor = 'grab'
}







// HELPERS
// ------------------------------------------------------------
function setCanvas() {
    //top layer
    gCanvas = document.querySelector('.canvas')
    gCtx = gCanvas.getContext('2d')
    //bottom layer
    gCanvasBottom = document.querySelector('.canvas-bottom')
    gCtxBottom = gCanvasBottom.getContext('2d')
}

function getLinePos() {
    var line = getLine()
    var x = line.linePos.x
    var y = line.linePos.y
    return { x, y }
}

function getLine() {
    return gMeme.lines[gMeme.lineIdx]
}

function saveMeme(meme = gMeme) {
    saveToStorage(MEME_KEY, meme)
}

function loadMeme() {
    return loadFromStorage(MEME_KEY)
}




// CANVAS
// ------------------------------------------------------

function strokeOn() {
    if (getLine().isStroke) return
    var { x, y } = getLinePos()
    _strokeRect(x, y)
    getLine().isStroke = true
    saveMeme()
}

function strokeOff() {
    if (!getLine().isStroke) return
    var { x, y } = getLinePos()
    _clearStroke(x, y)
    getLine().isStroke = false
    saveMeme()
}






function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function _clearLineTxt(x = gCanvas.width, y = gCanvas.height) {
    var size = gMeme.lines[gMeme.lineIdx].size
    gCtx.clearRect(x, y - size, gCanvas.width, size + 20);
}

function _drawText(text, x, y) {
    var line = gMeme.lines[gMeme.lineIdx]
    gCtx.lineWidth = 3
    gCtx.strokeStyle = gMeme.lines[gMeme.lineIdx].stroke
    gCtx.font = line.size + 'px Impact'
    gCtx.fillStyle = line.color
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)

}


function _strokeRect(x, y) {

    var size = gMeme.lines[gMeme.lineIdx].size

    _drawLine(0, y - (size + 5))
    _drawLine(0, y + size / 2)

}

function _clearStroke() {
    var { x, y } = getLinePos()
    var size = gMeme.lines[gMeme.lineIdx].size
    //upper
    gCtx.beginPath();
    gCtx.clearRect(0, y - size - 8, gCanvas.width, 10);
    gCtx.stroke();
    //lower
    gCtx.beginPath()
    gCtx.clearRect(0, y + size / 3.5, gCanvas.width, size / 3);
    gCtx.stroke();

}




function _drawLine(x, y, xEnd = gCanvas.width, yEnd = y) {
    gCtx.lineWidth = 1;
    gCtx.moveTo(x, y);
    gCtx.lineTo(xEnd, yEnd);
    gCtx.strokeStyle = 'orange';
    gCtx.stroke();
}


