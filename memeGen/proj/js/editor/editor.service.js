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
        text: 'Enter Text',
        size: 60,
        align: 'left',
        color: 'white',
        stroke: 'black',
        isStroke: false,
        isDrag: false
    },
    {
        linePos: { x: 50, y: 450 },
        text: '',
        size: 40,
        align: 'left',
        color: 'white',
        stroke: 'black',
        isStroke: false,
        isDrag: false
    }]
}



// UPDATE MODEL
//--------------------------------------------------------------------
function setImgId() {
    gMeme.imgId = loadFromStorage('IMGID')
    console.log(gMeme);
    saveMeme()
    console.log(loadFromStorage('MEME'));
}



// sets input value --> HTML and MODEL
function setInputVal(text) {
    var elInput = document.querySelector('.txt-input')
    getLine().text = elInput.value
    elInput.value = text
}



function drawImgFromlocal() {
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

function _setLine(text) {
    gMeme.lineIdx++
    if (gMeme.lineIdx >= gMeme.lines.length) gMeme.lineIdx = 0
    setInputVal(text)
}

var gCurrTxt = loadFromStorage('MEME').lines[gMeme.lineIdx].text

function setModelTxt() {
    getLine().text = gCurrTxt
}

function setText(text = gCurrTxt) {
    var x = gMeme.lines[gMeme.lineIdx].linePos.x
    var y = gMeme.lines[gMeme.lineIdx].linePos.y
    _clearLineTxt(x, y)


    setInputVal(text)
    _drawText(text, x, y)
    saveMeme()
    console.log(loadFromStorage('MEME'));
}

function setText(text = getLine().text) {
    var x = gMeme.lines[gMeme.lineIdx].linePos.x
    var y = gMeme.lines[gMeme.lineIdx].linePos.y
    _clearLineTxt(x, y)


    setInputVal(text)
    _drawText(text, x, y)
    saveMeme()
    console.log(loadFromStorage('MEME'));
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
        isDrag: false
    }
    gMeme.lines.push(line)
}


// Mouse and Touch events 

function onDown(ev) {
    const line = getLine()
    line.isDrag = true
    const pos = getEvPos(ev)
    // if (!isTextClicked(pos)) return
    setTextDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
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
        renderCanvas()
    }
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
    loadFromStorage(MEME_KEY)
}




// CANVAS
// ------------------------------------------------------
function toggleStroke() {
    var line = getLine()
    var x = line.linePos.x
    var y = line.linePos.y

    line.isStroke = !line.isStroke
    !line.isStroke ? _clearStroke(x, y) : _strokeRect(x, y)
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
    gCtx.lineWidth = 1
    gCtx.strokeStyle = gMeme.lines[gMeme.lineIdx].stroke
    gCtx.font = line.size + 'px Arial'
    gCtx.fillStyle = line.color
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)

}


function _strokeRect(x, y) {

    var size = gMeme.lines[gMeme.lineIdx].size
    gCtx.beginPath();
    gCtx.rect(0, y - size - 5, gCanvas.width, size * 1.6);
    gCtx.strokeStyle = 'orange'
    gCtx.stroke();

}

function _clearStroke(x, y) {
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




function _drawLine(x, y, xEnd = gCanvas.width, yEnd = gCanvas.height) {
    gCtx.lineWidth = 2;
    gCtx.moveTo(x, y);
    gCtx.lineTo(xEnd, yEnd);
    gCtx.strokeStyle = 'red';
    gCtx.stroke();
}

