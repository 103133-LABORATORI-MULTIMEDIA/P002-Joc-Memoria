var ampladaCarta, alcadaCarta;
var separacioH = 20,
    separacioV = 20;
var nFiles = 4,
    nColumnes = 4;

// [
var jocCartes = shuffle(generarjocCartes());


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
    var f, c, carta;
    
    $("#capcalera").html(nFiles+'x'+nColumnes+' cartes');
    $("#tauler").html(generarDivs());

    ampladaCarta=$(".carta").width();
    alcadaCarta=$(".carta").height();
    // mida del tauler
    $("#tauler").css({
        "width": ampladaCarta * nColumnes + separacioH * (nColumnes + 1) + "px",
        "height": alcadaCarta * nFiles + separacioV * (nFiles + 1) + "px"
    });
    // inicialitzem totes les cartes: posició
    for (f = 1; f <= nFiles; f++) {
        for (c = 1; c <= nColumnes; c++) {
            carta=$("#f" + f + "c" + c);
            carta.css({
                "left": ((c - 1) * (ampladaCarta + separacioH) + separacioH) + "px",
                "top": ((f - 1) * (alcadaCarta + separacioV) + separacioV) + "px"
            });
            carta.find(".davant").addClass(jocCartes.pop())
        }
    }
    generarCssCartes();

    $(".carta").click(function() {
        $(this).toggleClass("carta-girada");
        console.log($($(this).find(".davant")[0]).attr("class").split("carta")[1]);
    });

});