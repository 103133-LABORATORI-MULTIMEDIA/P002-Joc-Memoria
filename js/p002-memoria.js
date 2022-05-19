var ampladaCarta, alcadaCarta;
var separacioH = 20,
    separacioV = 20;
var nFiles = 4,
    nColumnes = 4;
var intents = 0,
    anterior = 0;


var jocCartes = generarjocCartes();
// var jocCartes = shuffle(generarjocCartes());



function shuffle(arr){
    var m=arr.length, t, i;
    while (m){
        i=Math.floor(Math.random()*m--);
        t=arr[m]; arr[m]=arr[i]; arr[i]=t;
    }
    return arr;
}

function generarCssCartes() {
    for (var i = 0; i<nFiles; i++) {
        for (var j = 0; j < nColumnes; j++) {
            $('.carta' + (i * nColumnes + j)).css("background-position", "-"+(j*79)%(79*13)+"px -"+(i*124)%(124*4)+"px");
        }
    }
}


function generarjocCartes() {
    var jocCartes = [];
    for (var i = 0; i < nFiles*nColumnes/2; i++) {
        jocCartes.push('carta' + i);
        jocCartes.push('carta' + i);
    }

    return jocCartes;
}

function generarDivs() {
    var htmlcartas = '';
    for (f = 1; f <= nFiles; f++) {
        for (c = 1; c <= nColumnes; c++) {
            htmlcartas += '<div class="carta" id="f' + f + 'c' + c + '"><div class="cara darrera"></div><div class="cara davant"></div></div>';
        }
        htmlcartas += '\n';
    }
    return htmlcartas;
}


$(function() {
    $(".joc").hide(); $(".prejoc").show();
    

    $(".jugar").click(function(){ 
        u_nFiles=parseInt($("#fils").val());
        u_nColumnes=parseInt($("#cols").val());

        // manage u_data

        $("#capcalera").html(nFiles+'x'+nColumnes+' cartes');

        $(".joc").show(); 
        $(".prejoc").hide();

        $("#tauler").html(generarDivs()); 
        // posible animacio: posarles en X i Y random per fora de la pantalla.
        // despres moureho tot a la seva posicio correcte. 

        ampladaCarta=$(".carta").width();
        alcadaCarta=$(".carta").height();
        
        // mida del tauler
        $("#tauler").css({
            "width": ampladaCarta * nColumnes + separacioH * (nColumnes + 1) + "px",
            "height": alcadaCarta * nFiles + separacioV * (nFiles + 1) + "px"
        });

        // inicialitzem totes les cartes: posició
        // animacio de moure les cartes al seu lloc aqui?
        for (let f = 1; f <= nFiles; f++) {
            for (let c = 1; c <= nColumnes; c++) {
                let carta=$("#f"+f+"c"+c);
                
                carta.css({
                    "left":((c-1)*(ampladaCarta+separacioH)+separacioH) + "px",
                    "top":((f-1)*(alcadaCarta+separacioV)+separacioV) + "px"
                });
                carta.find(".davant").addClass(jocCartes.pop())
            }
        }
        generarCssCartes();

        $(".carta").click(function(){
            intents++;
            
            if(anterior!=this){
                $(this).toggleClass("carta-girada");
    
                if(anterior!=0){
                    ncarta=$($(this).find(".davant")[0]).attr("class").split(" ")[2].split("carta")[1]
                    nanterior=$($(anterior).find(".davant")[0]).attr("class").split(" ")[2].split("carta")[1]
                    
                    if(ncarta==nanterior){
                        for (let a of [this,anterior]){
                            $(a).css("opacity","0.6");
                        }
                        $(".carta"+ncarta).parent().css("pointer-events", "none");
                    }else{
                        tmp=[this,anterior];
                        setTimeout(function() {
                            for (let a of tmp){
                                $(a).toggleClass("carta-girada");
                            }
    
                        }, 700);                
                    }
                    anterior=0;
                }else{
                    anterior=this;
                }
            }
        });
    });    
});


// Detecteu la situació de final de partida: totes les cartes eliminades. Feu aparèixer un missatge 
// quan es doni aquesta situació i permeteu tornar a jugar una altra partida. 

// Detecteu si l’usuari ha fet tants clics com el triple de cartes del joc. En aquest cas, l’usuari perd 
// la partida. Feu aparèixer un missatge quan es doni aquesta situació i permeteu tornar a jugar 
// una altra partida