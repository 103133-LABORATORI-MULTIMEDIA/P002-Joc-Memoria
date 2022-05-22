
// AMPLIACIONS:
//      - marcador (clics restants + encerts actuals) -> es va actualitzant amb updateIntents() i updateEncerts()
//      - temporitzador -> dintre de $(function(){ ... })
//      - setup inicial:
//          - canviar el tamany del taulell. -> verificarDimensions()
//          - animació des d'una pila de cartes (es posen primer al mig i desde alla es reperteixen) -> posicionaCartes()
//          - tria de cartes per jugar -> triarCartesMenu()
//          - posibilitat de canviar el temps (60segons mes dificil fins a 240segons el mes facil.)
//      - audios (al girar carta, al encertar parella, parella equivocada, al guanyar i perdre.) -> audio[" ... "].play()
//      - posibilitat de canviar el "theme" (switch posicionat al top esquerra.) -> themeChanger()


const MIN_COLUMNA=2, MAX_COLUMNA=20,
      MIN_FILA=2, MAX_FILA=20;

      
const CARTES = {
    "poker":{
        x:79, y:124,
        width:79, height:119,
        img:"images/poker1.png",
        darrera:{
            x:0,y:496
        },
        rows:4, cols:13
    },
    "espanola":{
        x:208,y:319,
        width:208, height:319,
        img:"images/Baraja_española_completa.png",
        darrera:{
            x:208,y:1276
        },
        rows:4, cols:13
    },
    "deck":{
        x:80, y:120,
        width:80, height:120,
        img:"images/deck.png",
        darrera:{
            x:0,y:480
        },
        rows:4, cols:13
    }
};


var separacioH = 20,
    separacioV = 20;

var nFiles = 4,
    nColumnes = 4;

var intents = 0,
    encerts = 0,
    anterior = 0;

var timer=60;
    start_timer=false;

var jocCartes, 
    selectedCarta=CARTES["poker"];

// AMPLIACIO: Audios 
var audio={
        "CardFlip":new Audio("audio/card_flip.mp3"),  // girar carta
        "Tada":new Audio("audio/tada.mp3"), // guanyar partida
        "Fail":new Audio("audio/fail.mp3"), // perdre partida + parella equivocada
        "Point":new Audio("audio/point.mp3") // encertar parella
    };


// comprova si n es un numero.
function isNumber(n){
    return typeof n == "number" && !isNaN(n) && isFinite(n);
}

// remou els continguts de la array proporcionada.
function shuffle(arr){
    var m=arr.length, t, i;
    while (m){
        i=Math.floor(Math.random()*m--);
        t=arr[m]; arr[m]=arr[i]; arr[i]=t;
    }
    return arr;
}

// configura el css de les cartes pel joc de cartes que s'ha triat
function setupCarta(){
    $(".carta").css({
        "width":selectedCarta.width,
        "height":selectedCarta.height,
    });

    $(".davant").css(
        "background", 
        "url("+selectedCarta.img+")"
    );

    $(".darrera").css(
        "background", 
        "url("+selectedCarta.img+") "+
            "-"+selectedCarta.darrera.x+"px "+
            "-"+selectedCarta.darrera.y+"px "
    );
}

// assigna la propietat de background-position a cada carta.
function generarCssCartes() {
    
    for (let i=0; i<nFiles; i++) {
        for (let j=0;j< nColumnes; j++) {
            let x=(j*selectedCarta.x)%(selectedCarta.x*selectedCarta.cols),
                y=(i*selectedCarta.y)%(selectedCarta.y*selectedCarta.rows);

            $('.carta'+(i*nColumnes+j))
            .css(
                "background-position", 
                "-"+x+"px -"+y+"px "
            );
        }
    }
}

// crea una array amb el joc de cartes.
function generarjocCartes() {
    let jCartes = [];
    for (let i = 0; i < nFiles*nColumnes/2; i++) {
        jCartes.push('carta'+i);
        jCartes.push('carta'+i);
    }

    return jCartes;
}

// genera els divs de les cartes
function generarDivs() {
    let htmlcartas='';
    for (let f = 1; f <= nFiles; f++) {
        for (let c = 1; c <= nColumnes; c++) {
            htmlcartas+='<div class="carta" id="f'+f+'c'+c+'"><div class="cara darrera"></div><div class="cara davant"></div></div>';
        }
        htmlcartas+='\n';
    }
    return htmlcartas;
}

// assigna els valors inicials als missatges variants.
function setupMissatges(){
    // Clicks restants
    $("#max-intents").html(nFiles*nColumnes*3);
    $("#intents").html(nFiles*nColumnes*3);

    $("#max-encerts").html(nFiles*nColumnes/2);

    $("#seconds").text(timer);

    // dimensions del camp
    $("#capcalera").html(nFiles+'x'+nColumnes+' cartes');
}

// AMPLIACIO: posiciona cada carta al seu lloc predeterminat amb una animacio.
function posicionaCartes(){
    for (let f=1;f<=nFiles;f++) {
        for (let c=1;c<=nColumnes;c++) {
            let carta=$("#f"+f+"c"+c);
            carta.css({
                "left":($("#tauler").width()/2-ampladaCarta/2)+"px",
                "top":($("#tauler").height()/2-alcadaCarta/2)+"px"
            });
            carta.find(".davant").addClass(jocCartes.pop())
        }
    }


    for (let f=1;f<=nFiles;f++) {
        for (let c=1;c<=nColumnes;c++) {
            let carta=$("#f"+f+"c"+c);
            carta.delay(1000*(f-1)+300*(c-1)).animate({
                "left":((c-1)*(ampladaCarta+separacioH)+separacioH)+"px",
                "top":((f-1)*(alcadaCarta+separacioV)+separacioV)+"px"
            });
            carta.find(".davant").addClass(jocCartes.pop())
        }
    }
}

// AMPLIACIO: verifica les dimensions entrades pel usuari.
function verificarDimensions(){
    let uFiles=parseInt($("#fils").val());
    let uColumnes=parseInt($("#cols").val());
    
    let nums=isNumber(uColumnes) && isNumber(uFiles),
        parells=uColumnes*uFiles%2==0,
        minims=uColumnes>=MIN_COLUMNA && uFiles>=MIN_FILA,
        maxims=uColumnes<=MAX_COLUMNA && uFiles<=MAX_FILA;

    if(
        nums &&
        parells &&
        minims &&
        maxims 
    ) {
        nColumnes=uColumnes; nFiles=uFiles;
        return true;
    } else {
        msg="Hi ha hagut un error al triar les dimensions!\nS'han agafat les dimensions per defecte (4x4).\n\nErrors:\n";
        
        if(!nums){
            msg+="Les dades introduides han de ser numeros!\n";
        }
        if(!parells){
            msg+="El producte ha de resultar en num. parell!\n";
        }
        if(!minims){
            msg+="Heu introduit dades massa petites!\n";
        }
        if(!maxims){
            msg+="Heu introduit dades masses grans!\n";
        }

        window.alert(msg);
    }
    return false
}

// prepara el camp de joc. + AMPLIACIO (temporitzador: var timer)
function setupJoc(){
    timer=$("input[name=timer]:checked").val();

    setupMissatges();


    jocCartes=shuffle(generarjocCartes());
    $("#tauler").html(generarDivs()); 
    
    setupCarta();
    
    ampladaCarta=selectedCarta.width;
    alcadaCarta=selectedCarta.height;
    
    $("#tauler").css({
        "width": ampladaCarta*nColumnes+separacioH*(nColumnes+1)+"px",
        "height": alcadaCarta*nFiles+separacioV*(nFiles+1)+"px"
    });

    posicionaCartes();
    generarCssCartes();

    $(".joc").show(); 
    $(".prejoc").hide();
}

// funcio amb la logica principal del joc.
function gameProcess(carta){
    if(anterior!=carta){
        updateIntents();
        $(carta).toggleClass("carta-girada");
        audio["CardFlip"].play();

        if(anterior!=0){
            nCarta=$($(carta).find(".davant")[0]).attr("class").split(" ")[2].split("carta")[1]
            nAnterior=$($(anterior).find(".davant")[0]).attr("class").split(" ")[2].split("carta")[1]
            
            tmp=[carta,anterior];
            if(nCarta==nAnterior){
                cartesEncertades(nCarta,tmp);
                updateEncerts();
            }else{
                cartesEquivocades(tmp);               
            }
            anterior=0;
        }else{
            anterior=carta;
        }
    }
}

// Cas de si ambes cartes girades siguin les mateixess.
function cartesEncertades(cardNum, tmp){
    audio["Point"].play();
    for (let a of tmp){
        $(a).css("opacity","0.6");
    }
    $(".carta"+cardNum).parent().css("pointer-events", "none");
}

// Cas de que les dos cartes girades siguin diferents.
function cartesEquivocades(tmp){
    audio["Fail"].play();
    setTimeout(function() {
        for (let a of tmp){
            $(a).toggleClass("carta-girada");
        }

    }, 700);
}

// AMPLIACIO: Actualitza l'<span id="intents"> amb el numero de clicks actual.
function updateIntents(){
    intents++;
    let restants=(nColumnes*nFiles*3)-intents;
    $("#intents").html(restants);
    if(restants<=nColumnes*nFiles/2){
        $("#intents").css("color", "red");
    }

}

// AMPLIACIO: actualitza els encerts
function updateEncerts(){
    encerts++;
    $("#encerts").html(encerts);
}

// missatge de joc perdut
function gameover(){
    endgameMsg()
    $(".fail").show()
    audio["Fail"].play();
}

// missatge de joc guanyat
function goodgame(){
    endgameMsg()
    $(".success").show()
    audio["Tada"].play();
}

// fa visible el contanidor dels missatges de fi de joc
function endgameMsg(){
    start_timer=false;
    $(".end-game").show()
    location.href="#"; // avoid bug in webkit
    location.href="#capcelera";

    $("body").css("overflow", "hidden");
}

// AMPLIACIO: monta el menu per triar cartes i li dona funcionalitat.
function triarCartesMenu(){
    for(var c in CARTES){
        $(".cartes-holder").append(
            "<div class='carta triar-carta "+c+"'><div class='cara davant'></div><div class='cara darrera'></div></div>"
        );

        $("."+c).css({
            "width":CARTES[c].width,
            "height":CARTES[c].height,
        });
        
        $($("."+c).find(".davant")[0]).css(
            "background","url("+CARTES[c].img+") 0px 0px"
        )

        $($("."+c).find(".darrera")[0]).css(
            "background","url("+CARTES[c].img+") -"+CARTES[c].darrera.x+"px -"+CARTES[c].darrera.y+"px"
        )

        $(".cartes-radio").append(
            "<input type='radio' name='carta' class='carta-rd' value='"+c+"' "+((Object.keys(CARTES).indexOf(c)==0)? "checked":"")+">"
        );
    }
    
    $(".triar-carta").click(function(){
        $(this).toggleClass("carta-girada");
        audio["CardFlip"].play();
    });

    var prev=0;
    $(".carta-rd").click(function(){
        classe=$(this).val();
        if(prev!=classe){
            $("."+prev).removeClass("fix");
            $("."+classe).addClass("fix");
            selectedCarta=CARTES[classe];
        }
        prev=classe;
    });
}

// AMPLIACIO: cambia el "theme" de la pag. web.
function themeChanger(){
    $("body").toggleClass("dark");
}

$(function() {
    triarCartesMenu();

    $(".jugar").click(function(){
        if(verificarDimensions()){
            setupJoc();
            $(".carta").click(function(){
                start_timer=true; 
                gameProcess(this);

                if(intents>=nColumnes*nFiles*3){
                    gameover();
                }else if(encerts==(nColumnes*nFiles/2)){
                    goodgame();
                }
            });

            // AMPLIACIO: Temporitzador
            setInterval(function() {
                if(start_timer){
                    if (timer<0){
                        gameover();
                    } else {
                        $("#seconds").text(timer--);
                    }
                }
                
            }, 1000);
        }
    });    
});
// // //