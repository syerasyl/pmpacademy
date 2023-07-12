let correctAns = [2, 4, 5, 5, 3];

let opcion_elegida = [];

let cantidad_correctas = 0;

function requesta(num_pregunda, seleccionada) {
    opcion_elegida[num_pregunda] = seleccionada.value;

    id = "p" + num_pregunda;

    labels = document.getElementById(id).childNodes;
    labels[1].style.backgroundColor = "white";
    labels[3].style.backgroundColor = "white";
    labels[5].style.backgroundColor = "white";
    labels[7].style.backgroundColor = "white";
    labels[9].style.backgroundColor = "white";


    seleccionada.parentNode.style.backgroundColor = "rgb(0, 196, 0)";
}

function corregjir() {
    cantidad_correctas = 0;
    for (i = 0; i < correctAns.length; i++) {
        if (correctAns[i] == opcion_elegida[i]) {
            cantidad_correctas++;
        }
    }

    document.getElementById("resulta").innerHTML = cantidad_correctas;
}