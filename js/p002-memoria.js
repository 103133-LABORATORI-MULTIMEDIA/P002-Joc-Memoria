const MIN_COLUMNA = 2,
    MAX_COLUMNA = 20,
    MIN_FILA = 2,
    MAX_FILA = 20;

const CARTES = {
    "poker": {
        x: 79,
        y: 124,
        width: 79,
        height: 119,
        img: "images/poker1.png",
        darrera: {
            x: 0,
            y: 496
        },
        rows: 4,
        cols: 13
    },
    "espanola": {
        x: 208,
        y: 319,
        width: 208,
        height: 319,
        img: "images/Baraja_española_completa.png",
        darrera: {
            x: 208,
            y: 1276
        },
        rows: 4,
        cols: 13
    },
    "deck": {
        x: 80,
        y: 120,
        width: 80,
        height: 120,
        img: "images/deck.png",
        darrera: {
            x: 0,
            y: 480
        },
        rows: 4,
        cols: 13
    }
};

var separacioH = 20,
    separacioV = 20;

var nFiles = 4,
    nColumnes = 4;

var intents = 0,
    encerts = 0,
    anterior = 0;

var jocCartes,
    selectedCarta = CARTES["poker"];



// comprova si n es un numero.
function isNumber(n) {
    return typeof n == "number" && !isNaN(n) && isFinite(n);
}

// remou els continguts de la array proporcionada.
function shuffle(arr) {
    var m = arr.length,
        t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
}

// configura el css de les cartes pel joc de cartes que s'ha triat
function setupCarta() {
    $(".carta").css({
        "width": selectedCarta.width,
        "height": selectedCarta.height,
    });

    $(".davant").css(
        "background",
        "url(" + selectedCarta.img + ")"
    );

    $(".darrera").css(
        "background",
        "url(" + selectedCarta.img + ") " +
        "-" + selectedCarta.darrera.x + "px " +
        "-" + selectedCarta.darrera.y + "px "
    );
}

// assigna la propietat de background-position a cada carta.
function generarCssCartes() {

    for (let i = 0; i < nFiles; i++) {
        for (let j = 0; j < nColumnes; j++) {
            let x = (j * selectedCarta.x) % (selectedCarta.x * selectedCarta.cols),
                y = (i * selectedCarta.y) % (selectedCarta.y * selectedCarta.rows);

            $('.carta' + (i * nColumnes + j))
                .css(
                    "background-position",
                    "-" + x + "px -" + y + "px "
                );
        }
    }
}

// crea una array amb el joc de cartes.
function generarjocCartes() {
    let jCartes = [];
    for (let i = 0; i < nFiles * nColumnes / 2; i++) {
        jCartes.push('carta' + i);
        jCartes.push('carta' + i);
    }

    return jCartes;
}

// genera els divs de les cartes
function generarDivs() {
    let htmlcartas = '';
    for (let f = 1; f <= nFiles; f++) {
        for (let c = 1; c <= nColumnes; c++) {
            htmlcartas += '<div class="carta" id="f' + f + 'c' + c + '"><div class="cara darrera"></div><div class="cara davant"></div></div>';
        }
        htmlcartas += '\n';
    }
    return htmlcartas;
}

// assigna els valors inicials als missatges variants.
function setupMissatges() {
    // Clicks restants
    $("#max-intents").html(nFiles * nColumnes * 3);
    $("#intents").html(nFiles * nColumnes * 3);

    // dimensions del camp
    $("#capcalera").html(nFiles + 'x' + nColumnes + ' cartes');
}

// posiciona cada carta al seu lloc predeterminat.

function posicionaCartes() {
    for (let f = 1; f <= nFiles; f++) {
        for (let c = 1; c <= nColumnes; c++) {
            let carta = $("#f" + f + "c" + c);
            carta.css({
                "left": (((c - 1) + ((f - 1) * nFiles)) * 1 + separacioH) + "px",
                "top": (((c - 1) + ((f - 1) * nFiles)) * 1 + separacioH) + "px"
            });
            carta.find(".davant").addClass(jocCartes.pop())
        }
    }

    for (let f = 1; f <= nFiles; f++) {
        for (let c = 1; c <= nColumnes; c++) {
            setTimeout(function() {
                let carta = $("#f" + f + "c" + c);
                carta.css({
                    "left": ((c - 1) * (ampladaCarta + separacioH) + separacioH) + "px",
                    "top": ((f - 1) * (alcadaCarta + separacioV) + separacioV) + "px"
                });
            }, ((nColumnes - c) + ((nFiles - f) * nFiles)) * 100 + 50);
        }
    }
}

// verifica les dimensions entrades pel usuari.
function verificarDimensions() {
    let uFiles = parseInt($("#fils").val());
    let uColumnes = parseInt($("#cols").val());

    let nums = isNumber(uColumnes) && isNumber(uFiles),
        parells = uColumnes * uFiles % 2 == 0,
        minims = uColumnes >= MIN_COLUMNA && uFiles >= MIN_FILA,
        maxims = uColumnes <= MAX_COLUMNA && uFiles <= MAX_FILA;

    if (
        nums &&
        parells &&
        minims &&
        maxims
    ) {
        nColumnes = uColumnes;
        nFiles = uFiles;
    } else {
        msg = "Hi ha hagut un error al triar les dimensions!\nS'han agafat les dimensions per defecte (4x4).\n\nErrors:\n";

        if (!nums) {
            msg += "Les dades introduides han de ser numeros!\n";
        }
        if (!parells) {
            msg += "El producte ha de resultar en num. parell!\n";
        }
        if (!minims) {
            msg += "Heu introduit dades massa petites!\n";
        }
        if (!maxims) {
            msg += "Heu introduit dades masses grans!\n";
        }

        window.alert(msg);
    }
}

// prepara el camp de joc.
function setupJoc() {
    verificarDimensions();
    setupMissatges();

    jocCartes = generarjocCartes()
        // jocCartes = shuffle(generarjocCartes());
    $("#tauler").html(generarDivs());


    // posible animacio: posarles en X i Y random per fora de la pantalla.
    // despres moureho tot a la seva posicio correcte. 


    setupCarta();

    ampladaCarta = selectedCarta.width;
    alcadaCarta = selectedCarta.height;


    posicionaCartes();
    generarCssCartes();

    $("#tauler").css({
        "width": ampladaCarta * nColumnes + separacioH * (nColumnes + 1) + "px",
        "height": alcadaCarta * nFiles + separacioV * (nFiles + 1) + "px"
    });

    $(".joc").show();
    $(".prejoc").hide();
}

// funcio amb la logica principal del joc.
function gameProcess(carta) {
    if (anterior != carta) {
        updateIntents();
        $(carta).toggleClass("carta-girada");

        if (anterior != 0) {
            nCarta = $($(carta).find(".davant")[0]).attr("class").split(" ")[2].split("carta")[1]
            nAnterior = $($(anterior).find(".davant")[0]).attr("class").split(" ")[2].split("carta")[1]
            console.log(nCarta, nAnterior);
            tmp = [carta, anterior];
            console.log(tmp);
            if (nCarta == nAnterior) {
                cartesEncertades(nCarta, tmp);
                updateEncerts();
            } else {
                cartesEquivocades(tmp);
            }
            anterior = 0;
        } else {
            anterior = carta;
        }
    }
}

// Cas de si ambes cartes girades siguin les mateixess.
function cartesEncertades(cardNum, tmp) {
    for (let a of tmp) {
        $(a).css("opacity", "0.6");
    }
    console.log(cardNum);
    $(".carta" + cardNum).parent().css("pointer-events", "none");
}

// Cas de que les dos cartes girades siguin diferents.
function cartesEquivocades(tmp) {
    setTimeout(function() {
        for (let a of tmp) {
            $(a).toggleClass("carta-girada");
        }

    }, 700);
}

// Actualitza l'<span id="intents"> amb el numero de clicks actual.
function updateIntents() {
    intents++;
    let restants = (nColumnes * nFiles * 3) - intents;
    $("#intents").html(restants);
    if (restants <= nColumnes * nFiles / 2) {
        $("#intents").css("color", "red");
    }

}

// actualitza els encerts
// actualment no fa res, simplement augmenta var encert.
function updateEncerts() {
    encerts++;
    // $("#encerts").html(encerts);
}

// missatge de joc perdut
function gameover() {
    endgameMsg()
    $(".fail").show()
}
0
// missatge de joc guanyat
function goodgame() {
    endgameMsg()
    $(".success").show()
}

// fa visible el contanidor dels missatges de fi de joc
function endgameMsg() {
    $(".end-game").show()
    location.href = "#"; // avoid bug in webkit
    location.href = "#capcelera";

    $("body").css("overflow", "hidden");
}

// monta el menu per triar cartes i li dona funcionalitat.
function triarCartesMenu() {
    for (var c in CARTES) {
        $(".cartes-holder")
            .append(
                "<div class='carta triar-carta " + c + "'><div class='cara davant'></div><div class='cara darrera'></div></div>"
            );

        $("." + c).css({
            "width": CARTES[c].width,
            "height": CARTES[c].height,
        });

        $($("." + c).find(".davant")[0]).css(
            "background", "url(" + CARTES[c].img + ") 0px 0px"
        )

        $($("." + c).find(".darrera")[0]).css(
            "background", "url(" + CARTES[c].img + ") -" + CARTES[c].darrera.x + "px -" + CARTES[c].darrera.y + "px"
        )

        $(".cartes-radio").append(
            "<input type='radio' name='carta' class='carta-rd' value='" + c + "'>"
        );
    }

    $(".triar-carta").click(function() {
        $(this).toggleClass("carta-girada");
    });

    var prev = 0;
    $(".carta-rd").click(function() {
        classe = $(this).val();
        if (prev != classe) {
            $("." + prev).removeClass("fix");
            $("." + classe).addClass("fix");
            selectedCarta = CARTES[classe];
        }
        prev = classe;
    });
}

$(function() {
    triarCartesMenu();
    $(".jugar").click(function() {

        setupJoc();
        $(".carta").click(function() {
            gameProcess(this);

            if (intents >= nColumnes * nFiles * 3) {
                gameover();
            } else if (encerts == (nColumnes * nFiles / 2)) {
                goodgame();
            }
        });
    });
});


// audios