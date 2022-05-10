var ampladaCarta, alcadaCarta;
var separacioH = 20,
    separacioV = 20;
var nFiles = 4,
    nColumnes = 4;

var jocCartes = [
    'carta1', 'carta1',
    'carta3', 'carta3',
]

function generarjocCartes() {
    var jocCartes = [];
    for (var i = 0; i < nFiles; i++) {
        for (var j = 0; j < nColumnes; j++) {
            jocCartes.push('carta' + (i * nColumnes + j + 1));
        }
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

    $("#tauler").html(generarDivs());

    ampladaCarta = $(".carta").width();
    alcadaCarta = $(".carta").height();
    // mida del tauler
    $("#tauler").css({
        "width": ampladaCarta * nColumnes + separacioH * (nColumnes + 1) + "px",
        "height": alcadaCarta * nFiles + separacioV * (nFiles + 1) + "px"
    });
    // inicialitzem totes les cartes: posició
    for (f = 1; f <= nFiles; f++)
        for (c = 1; c <= nColumnes; c++) {
            carta = $("#f" + f + "c" + c);
            carta.css({
                "left": ((c - 1) * (ampladaCarta + separacioH) + separacioH) + "px",
                "top": ((f - 1) * (alcadaCarta + separacioV) + separacioV) + "px"
            });
            carta.find(".davant").addClass(jocCartes.pop());

        }

    $(".carta").click(function() {
        $(this).toggleClass("carta-girada");
    });

});