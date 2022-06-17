'use strict'

var gImgs = []
var gIds = []

function initg() {

    addMemes()
    renderGallery()
}


function renderGallery() {
    var elGallery = document.querySelector('.gallery-container')

    gImgs.forEach((img) => {
        elGallery.innerHTML += ` <a href="editor.html"> <img  onclick="getMeme(${img.id})" class="gallery-img" id="${img.id}" src='${img.url}' alt=""></a>`
    })
}

function getMeme(img) {
    var id = img.id
    var idx = _findIdxById(id, gImgs)
    gUrl = gImgs[idx].url
    console.log(gUrl);

    saveToStorage(URL_KEY, gUrl)
    saveToStorage(ID_KEY, id)

}


function addMemes(url) {
    
    console.log('h');
    for (var i = 0; i < 15; i++) {
        var id = _makeId()
        gImgs.push({
            tags: ['funny'],
            id,
            url: `../meme-imgs (square)/${i + 1}.jpg`
        })
    }

}



var imageInput = document.querySelector('#image-input')
var uploadedImg = ""

function loadImg(val) {
    console.log(val);
    var file = document.querySelector('#image-input').files[0]
    var fReader = new FileReader()
    console.log(file);
    fReader.readAsDataURL(file)

    fReader.onloadend = function (event) {
        var elNewImg = document.querySelector('.new-image')
        elNewImg.innerHTML = `<a href="#" class="gallery-img img-target"></a>`
        elNewImg.style.display = 'block'
        console.log(event.target.result);
        document.querySelector('.img-target').style.backgroundImage = `url(${event.target.result})`
    }

}
