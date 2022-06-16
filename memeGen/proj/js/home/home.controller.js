'use strict'

var gImgs = []
var gIds = []

function initg() {

    addMemes()
    renderGallery()
}


function renderGallery(){
    var elGallery = document.querySelector('.gallery-container')

    gImgs.forEach((img)=>{
        elGallery.innerHTML +=  ` <a href="editor.html"> <img  onclick="getMeme(${img.id})" class="gallery-img" id="${img.id}" src='${img.url}' alt=""></a>`
    })
}

function getMeme(img){
    var id = img.id
    var idx = _findIdxById(id , gImgs)
    gUrl = gImgs[idx].url
    console.log(gUrl);

    saveToStorage(URL_KEY , gUrl)
    saveToStorage(ID_KEY , id)
    
}


function addMemes() {
    console.log('h');
    for(var i = 0 ; i < 15 ; i++){
        var id = _makeId()
        gImgs.push({
            tags: ['funny'],
            id,
            url: `../meme-imgs (square)/${i+1}.jpg`
        })
    }    
}
