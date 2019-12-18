"use strict"

const estado = {
    jogador: {
        id: 1,
        direcao: 'DIREITA',
        y: 0,
        x: 0,
        pixels: [ ]
    },
    fruta: {
        x: 50,
        y: 50
    },
    game: {
        jogador: "#FFF",
        box: 10,
        fruta: "#C00",
        status: true,
        cena: 30,
        fps: 120,
        colisao: {},
        audio: {
            game_hover: document.querySelector('#game_over'),
            moeda: document.querySelector('#moeda')
        }
    },
    controle: {
    
        w: "CIMA",
        s: "BAIXO",
        a: "ESQUERDA",
        d: "DIREITA",
    
        ArrowUp: "CIMA",
        ArrowDown: "BAIXO",
        ArrowLeft: "ESQUERDA",
        ArrowRight: "DIREITA",
    
        W: "CIMA",
        S: "BAIXO",
        A: "ESQUERDA",
        D: "DIREITA",

    },
    neutralidade: {
        CIMA:0,
        BAIXO:0,
        ESQUERDA: 1,
        DIREITA: 1,
    }
}

function anda()
{
    switch ( estado.jogador.direcao ) 
    {
        case 'CIMA':
            estado.jogador.y -= estado.game.box
            break;
        case 'BAIXO':
            estado.jogador.y += estado.game.box
            break;
        case 'ESQUERDA':
            estado.jogador.x -= estado.game.box
            break;
        case 'DIREITA':
            estado.jogador.x += estado.game.box
            break;
    }
    estado.game.colisao = estado.jogador.pixels[0]
    estado.jogador.pixels.shift()
    estado.jogador.pixels.push( {
        x: estado.jogador.x,
        y: estado.jogador.y,
    } )
}

function morreu()
{
    estado.jogador.x       = 0
    estado.jogador.y       = 0
    estado.jogador.pixels  = []
    estado.jogador.direcao = 'DIREITA'
    estado.game.audio.game_hover.play()
}

function falalit()
{
    if( estado.jogador.x > estado.game.box * estado.game.cena ) { morreu() }
    if( estado.jogador.x < 0) { morreu() }
    if( estado.jogador.y > estado.game.box * estado.game.cena ) { morreu() }
    if( estado.jogador.y < 0 ) { morreu() }
}

function limparCena()
{
    cena.clearRect(0, 0, estado.game.box * estado.game.cena, estado.game.box * estado.game.cena )
}

function desenhaFruta() {
    cena.fillStyle = estado.game.fruta;
    cena.fillRect( estado.fruta.x, estado.fruta.y, estado.game.box, estado.game.box )
}

function colide()
{
    
    if( estado.fruta.x == estado.jogador.x && estado.fruta.y == estado.jogador.y )
    {
        estado.jogador.pixels.unshift( estado.game.colisao )
        estado.game.audio.moeda.play()
        frutaNova()
    }
}

function tropecarNoProprioPe()
{
    if( estado.jogador.pixels.length > 1 )
    {
        let localiza = estado.jogador.pixels.slice(0, -1).find( pixel => estado.jogador.x == pixel.x && estado.jogador.y == pixel.y   )
        if( localiza ) 
        {
            morreu()
        }
    }
}

function frutaNova()
{
    estado.fruta.x = posicaoAleatoria()
    estado.fruta.y = posicaoAleatoria()
}

function posicaoAleatoria()
{
    return Math.floor( Math.random()  * estado.game.cena ) * estado.game.box
}

function game() 
{
    limparCena()
    anda()
    tropecarNoProprioPe()
    colide()
    falalit()
    desenhaPixel()
    desenhaFruta()
}

function desenhaPixel()
{
    estado.jogador.pixels.forEach( pixel => {
        cena.fillStyle = estado.game.jogador;
        cena.fillRect( pixel.x, pixel.y, estado.game.box, estado.game.box )
    } )
}

window.addEventListener( 'keydown', function( e ) {
    let direcaoAtual  = estado.controle[ e.key ] || estado.jogador.direcao
    let direcaoPasada = estado.jogador.direcao
    if(  estado.neutralidade[direcaoAtual] != estado.neutralidade[direcaoPasada]  )
    {
        estado.jogador.direcao = direcaoAtual
    }
} )

const tv    = document.querySelector( "#game" )
tv.width    = estado.game.box * estado.game.cena
tv.height   = estado.game.box * estado.game.cena
const cena  = tv.getContext('2d')

estado.game.audio.moeda.volume = 0.2

setInterval( game, estado.game.fps )
