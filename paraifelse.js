function obtenerMayor(array) {
    let mayor = -1;
    //pasar de los 21 primeros, ya que el Do1 empieza en el 22
    for (let i = 22; i < array.length; i++) {
        if (array[i] > mayor) {
            mayor = array[i];
        }
    }
    return mayor;
}

function obtenerIndiceMayor(array) {
    let mayor = -1;
    let indice = 0;
    //pasar de los 21 primeros, ya que el Do1 empieza en el 22
    for (let i = 22; i < array.length; i++) {
        if (array[i] > mayor) {
            mayor = array[i];
            indice = i;
        }
    }
    return indice;
}

//Funcion pensada para obtener la mejor nota
//En el piano real cuando das una nota alta, ej. Do7, las frecuencias mas
//bajas van a tener un valor muy alto, y se va a marcar el Do1 en vez de el Do7
//Hacer que si hay alguna nota alta en la mitad superior de las frecuencias, se
//tenga en cuenta esta y no la más alta de todas, que seguramente será una baja
function obtenerMejorIndice() {

    if (obtenerIndiceMayor(arrayFrecuencias) > cantidadPrimerasMuestras / 2) {
        return obtenerIndiceMayor(arrayFrecuencias);
    } else {
        let valorMitadSuperior = -1; //Contiene la intensidad de la nota mitad superior
        let valoreMitadInferior = -1; //Contiene la intensidad de la nota mitad inferior
        let indiceMitadSuperior = 0; //Contiene indice nota mas alta de la mitad superior
        let indiceMitadInferior = 0; //Contiene indice nota mas alta de la mitad inferior

        //Comprobar primero si en la mitad superior hay alguna nota alta
        //Coger el indice mas alto de la mitad superior
        for (let i = cantidadPrimerasMuestras / 2; i < cantidadPrimerasMuestras; i++) {
            if (arrayFrecuencias[i] > valorMitadSuperior) {
                valorMitadSuperior = arrayFrecuencias[i];
                indiceMitadSuperior = i;
            }
        }

        //Coger el indice mas alto de la mitad inferior
        for (let i = 0; i < cantidadPrimerasMuestras / 2; i++) {
            if (arrayFrecuencias[i] > valoreMitadInferior) {
                valoreMitadInferior = arrayFrecuencias[i];
                indiceMitadInferior = i;
            }
        }

        // Si la nota superior es al menos el 300% de intensidad de la nota inferior,
        // entonces se tendrá en cuenta la nota superior, si no se dará la nota inferior
        if (valorMitadSuperior * 3 > valoreMitadInferior) {
            return indiceMitadSuperior;
        } else {
            return indiceMitadInferior;
        }
    }
}

function getIndiceDeFrecuencia(frecuencia) {
    //Las frecuencias actuales van de 0Hz a 2999Hz
    //Quiero obtener el indice de 'arrayFrecuencias' (cantidadPrimerasMuestras = 1024)
    // que contenga la 'frecuencia'
    return map(frecuencia, 0, 2999, 0, cantidadPrimerasMuestras - 1);
}

function getFrecuenciaDeIndice(indice) {
    //Las frecuencias actuales van de 0Hz a 2999Hz
    //Quiero obtener la frecuencia dado el indice 
    //  de 'arrayFrecuencias' (cantidadPrimerasMuestras = 1024)
    return map(indice, 0, cantidadPrimerasMuestras - 1, 0, 2999);
}

function estaEntornoIndice(indice) {
    //Tener en cuenta un pequeño desvio de los indices
    //En el piano real, las frecuencias altas están un poco más altas de lo debido
    // asique aplicar mayor ajuste de error

    //Si las frecuencias son pequeñas, aplicar menor error
    if (indice <= 350) {
        if (obtenerMejorIndice() == indice ||
            obtenerMejorIndice() == indice - 1 ||
            obtenerMejorIndice() == indice + 1) {
            return true;
        } else {
            return false;
        }

    } else {
        //Si las frecuencias son altas, aplicar mayor error
        if (obtenerMejorIndice() == indice ||
            obtenerMejorIndice() == indice - 1 ||
            obtenerMejorIndice() == indice - 2 ||
            obtenerMejorIndice() == indice + 1 ||
            obtenerMejorIndice() == indice + 2 ||
            obtenerMejorIndice() == indice + 3 ||
            obtenerMejorIndice() == indice + 4 ||
            obtenerMejorIndice() == indice + 5 ||
            obtenerMejorIndice() == indice + 6 ||
            obtenerMejorIndice() == indice + 7 ||
            obtenerMejorIndice() == indice + 8 ||
            obtenerMejorIndice() == indice + 9 ||
            obtenerMejorIndice() == indice + 10 ||
            obtenerMejorIndice() == indice + 11) {
            return true;
        } else {
            return false;
        }
    }
}

function estaEntornoFrecuencia(frecuencia) {
    const indice = Math.round(getIndiceDeFrecuencia(frecuencia));
    if (estaEntornoIndice(indice)) {
        return true;
    } else {
        return false;
    }
}

function nombrarFrecuencias() {
    let indiceFrecuencia = obtenerMejorIndice();
    let x; //Para posicionar texto. Se mapea, le doy un % y me devuelve el pixel
    // text("Indice mas alto: " + indiceFrecuencia, 10, 50);
    // text("Dada una frecuencia: " + getIndiceDeFrecuencia(440), 10, 70);
    text("Frecuencia mas alta (aprox): " + str(getFrecuenciaDeIndice(indiceFrecuencia)).substring(0, 6) + " Hz", 10, 85);

    // for(let i = 0; i <= 100; i++){
    //   text(i, map(i, 0,100, 0,width), 20);
    // }
    stroke(0);
    fill(0, 0, 255);
    textSize(24);
    let posytext = height - 100;

    if (estaEntornoFrecuencia(65)) {
        x = map(2, 0, 100, 0, width);
        text("Do", x, posytext);
    }
    if (estaEntornoFrecuencia(131)) {
        x = map(4, 0, 100, 0, width);
        text("Do3", x, posytext);
    }
    if (estaEntornoFrecuencia(262)) {
        x = map(8, 0, 100, 0, width);
        text("Do4", x, posytext);
    }
    if (estaEntornoFrecuencia(523)) {
        x = map(17, 0, 100, 0, width);
        text("Do5", x, posytext);
    }
    if (estaEntornoFrecuencia(1047)) {
        x = map(35, 0, 100, 0, width);
        text("Do6", x, posytext);
    }
    if (estaEntornoFrecuencia(2093)) {
        x = map(69, 0, 100, 0, width);
        text("Do7", x, posytext);
    }


    if (estaEntornoFrecuencia(69)) {
        x = map(2, 0, 100, 0, width);
        text("Do Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(139)) {
        x = map(4, 0, 100, 0, width);
        text("Do3 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(277)) {
        x = map(8, 0, 100, 0, width);
        text("Do4 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(554)) {
        x = map(18, 0, 100, 0, width);
        text("Do5 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(1109)) {
        x = map(37, 0, 100, 0, width);
        text("Do6 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(2217)) {
        x = map(74, 0, 100, 0, width);
        text("Do7 Sostenido", x, posytext);
    }


    if (estaEntornoFrecuencia(73)) {
        x = map(2, 0, 100, 0, width);
        text("Re", x, posytext);
    }
    if (estaEntornoFrecuencia(147)) {
        x = map(5, 0, 100, 0, width);
        text("Re3", x, posytext);
    }
    if (estaEntornoFrecuencia(294)) {
        x = map(9, 0, 100, 0, width);
        text("Re4", x, posytext);
    }
    if (estaEntornoFrecuencia(587)) {
        x = map(19, 0, 100, 0, width);
        text("Re5", x, posytext);
    }
    if (estaEntornoFrecuencia(1175)) {
        x = map(39, 0, 100, 0, width);
        text("Re6", x, posytext);
    }
    if (estaEntornoFrecuencia(2349)) {
        x = map(78, 0, 100, 0, width);
        text("Re7", x, posytext);
    }


    if (estaEntornoFrecuencia(78)) {
        x = map(2, 0, 100, 0, width);
        text("Re Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(156)) {
        x = map(5, 0, 100, 0, width);
        text("Re3 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(311)) {
        x = map(10, 0, 100, 0, width);
        text("Re4 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(622)) {
        x = map(20, 0, 100, 0, width);
        text("Re5 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(1245)) {
        x = map(41, 0, 100, 0, width);
        text("Re6 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(2489)) {
        x = map(82, 0, 100, 0, width);
        text("Re7 Sostenido", x, posytext);
    }


    if (estaEntornoFrecuencia(82)) {
        x = map(2, 0, 100, 0, width);
        text("Mi", x, posytext);
    }
    if (estaEntornoFrecuencia(165)) {
        x = map(5, 0, 100, 0, width);
        text("Mi3", x, posytext);
    }
    if (estaEntornoFrecuencia(330)) {
        x = map(11, 0, 100, 0, width);
        text("Mi4", x, posytext);
    }
    if (estaEntornoFrecuencia(659)) {
        x = map(22, 0, 100, 0, width);
        text("Mi5", x, posytext);
    }
    if (estaEntornoFrecuencia(1319)) {
        x = map(43, 0, 100, 0, width);
        text("Mi6", x, posytext);
    }
    if (estaEntornoFrecuencia(2637)) {
        x = map(87, 0, 100, 0, width);
        text("Mi7", x, posytext);
    }


    if (estaEntornoFrecuencia(87)) {
        x = map(3, 0, 100, 0, width);
        text("Fa", x, posytext);
    }
    if (estaEntornoFrecuencia(175)) {
        x = map(6, 0, 100, 0, width);
        text("Fa3", x, posytext);
    }
    if (estaEntornoFrecuencia(349)) {
        x = map(11, 0, 100, 0, width);
        text("Fa4", x, posytext);
    }
    if (estaEntornoFrecuencia(698)) {
        x = map(23, 0, 100, 0, width);
        text("Fa5", x, posytext);
    }
    if (estaEntornoFrecuencia(1397)) {
        x = map(46, 0, 100, 0, width);
        text("Fa6", x, posytext);
    }
    if (estaEntornoFrecuencia(2794)) {
        x = map(93, 0, 100, 0, width);
        text("Fa7", x, posytext);
    }


    if (estaEntornoFrecuencia(92)) {
        x = map(3, 0, 100, 0, width);
        text("Fa Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(185)) {
        x = map(6, 0, 100, 0, width);
        text("Fa3 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(370)) {
        x = map(11, 0, 100, 0, width);
        text("Fa4 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(740)) {
        x = map(24, 0, 100, 0, width);
        text("Fa5 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(1480)) {
        x = map(48, 0, 100, 0, width);
        text("Fa6 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(2960)) {
        x = map(96, 0, 100, 0, width);
        text("Fa7 Sostenido", x, posytext);
    }


    if (estaEntornoFrecuencia(98)) {
        x = map(3, 0, 100, 0, width);
        text("Sol", x, posytext);
    }
    if (estaEntornoFrecuencia(196)) {
        x = map(6, 0, 100, 0, width);
        text("Sol3", x, posytext);
    }
    if (estaEntornoFrecuencia(392)) {
        x = map(12, 0, 100, 0, width);
        text("Sol4", x, posytext);
    }
    if (estaEntornoFrecuencia(784)) {
        x = map(25, 0, 100, 0, width);
        text("Sol5", x, posytext);
    }
    if (estaEntornoFrecuencia(1568)) {
        x = map(51, 0, 100, 0, width);
        text("Sol6", x, posytext);
    }


    if (estaEntornoFrecuencia(104)) {
        x = map(3, 0, 100, 0, width);
        text("Sol Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(208)) {
        x = map(6, 0, 100, 0, width);
        text("Sol3 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(415)) {
        x = map(13, 0, 100, 0, width);
        text("Sol4 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(831)) {
        x = map(26, 0, 100, 0, width);
        text("Sol5 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(1661)) {
        x = map(54, 0, 100, 0, width);
        text("Sol6 Sostenido", x, posytext);
    }


    if (estaEntornoFrecuencia(110)) {
        x = map(3, 0, 100, 0, width);
        text("La", x, posytext);
    }
    if (estaEntornoFrecuencia(220)) {
        x = map(7, 0, 100, 0, width);
        text("La3", x, posytext);
    }
    if (estaEntornoFrecuencia(440)) {
        x = map(14, 0, 100, 0, width);
        text("La4", x, posytext);
    }
    if (estaEntornoFrecuencia(880)) {
        x = map(28, 0, 100, 0, width);
        text("La5", x, posytext);
    }
    if (estaEntornoFrecuencia(1760)) {
        x = map(58, 0, 100, 0, width);
        text("La6", x, posytext);
    }


    if (estaEntornoFrecuencia(117)) {
        x = map(3, 0, 100, 0, width);
        text("La Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(233)) {
        x = map(7, 0, 100, 0, width);
        text("La3 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(466)) {
        x = map(15, 0, 100, 0, width);
        text("La4 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(932)) {
        x = map(30, 0, 100, 0, width);
        text("La5 Sostenido", x, posytext);
    }
    if (estaEntornoFrecuencia(1865)) {
        x = map(61, 0, 100, 0, width);
        text("La6 Sostenido", x, posytext);
    }


    if (estaEntornoFrecuencia(123)) {
        x = map(4, 0, 100, 0, width);
        text("Si", x, posytext);
    }
    if (estaEntornoFrecuencia(247)) {
        x = map(8, 0, 100, 0, width);
        text("Si3", x, posytext);
    }
    if (estaEntornoFrecuencia(494)) {
        x = map(16, 0, 100, 0, width);
        text("Si4", x, posytext);
    }
    if (estaEntornoFrecuencia(988)) {
        x = map(32, 0, 100, 0, width);
        text("Si5", x, posytext);
    }
    if (estaEntornoFrecuencia(1976)) {
        x = map(65, 0, 100, 0, width);
        text("Si6", x, posytext);
    }
}

function copiarArray(array) {
    let toret = [];
    for (const i in array) {
        toret[i] = array[i];
    }
    return toret;
}

function copiarArrayBi(array) {
    let toret = [];
    for (let i in array) {
        toret[i] = copiarArray(array[i]);
    }
    return toret;
}
