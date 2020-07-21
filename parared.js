//Forma los datos de las notas en directo 'historialFrecuencias' para entrenar la red
function formarDatos() {
    notasdata = [];
    notastrain = [];
    notastest = [];

    //Normalizar los datos
    for (let i = 0; i < historialFrecuencias.length; i++) {
        notasdata[i] = copiarArrayBi(historialFrecuencias[i]);
        notasdata[i][1] = normalizarInputs(notasdata[i][1]);
    }

    //Randomizar el array data
    notasdata = shuffle(notasdata);

    //Obtener el 20% de datos como datos para test
    let numtest = notasdata.length * 1;
    let totaldata = notasdata.length;

    for (let i = 0; i < totaldata; i++) {
        if (i < numtest) {
            notastrain.push(notasdata.pop());
        } else {
            notastest.push(notasdata.pop());
        }
    }

    // console.log(notasdata);
    // console.log(notastrain);
    // console.log(notastest);

}

//Forma los datos guardados en data.js para predecir las notas
function formarDatosGuardados() {
    notasdata = [];
    notastrain = [];
    notastest = [];

    //Normalizar los datos
    for (let i = 0; i < datosGuardados.length; i++) {
        notasdata[i] = copiarArrayBi(datosGuardados[i]);
        notasdata[i][1] = normalizarInputs(notasdata[i][1]);
    }

    //Randomizar el array data
    notasdata = shuffle(notasdata);

    //Obtener el 20% de datos como datos para test
    let numtest = notasdata.length * 0.8;
    let totaldata = notasdata.length;

    for (let i = 0; i < totaldata; i++) {
        if (i < numtest) {
            notastrain.push(notasdata.pop());
        } else {
            notastest.push(notasdata.pop());
        }
    }
}

//Forma los datos guardados en data.js para predecir el tipo
function formarDatosGuardadosTipo() {
    tipodata = [];
    tipotrain = [];
    tipotest = [];

    //Normalizar los datos
    for (let i = 0; i < datosGuardadosTipo.length; i++) {
        tipodata[i] = copiarArrayBi(datosGuardadosTipo[i]);
        tipodata[i][1] = normalizarInputs(tipodata[i][1]);
    }

    //Randomizar el array data
    tipodata = shuffle(tipodata);

    //Obtener el 20% de datos como datos para test
    let numtest = tipodata.length * 0.8;
    let totaldata = tipodata.length;

    for (let i = 0; i < totaldata; i++) {
        if (i < numtest) {
            tipotrain.push(tipodata.pop());
        } else {
            tipotest.push(tipodata.pop());
        }
    }
}

function ejecutarRed() {
    for (let i = 0; i < 100; i++) {
        formarDatos();
        entrenar();
        testear();
    }
}

function entrenarDatosGuardados() {
    //for (let i = 0; i < 100; i++) {
    //   formarDatosGuardados();
    //   entrenar();
    //   testear();
    //}
    activarEntrenarDatosGuardados = !activarEntrenarDatosGuardados;
}

function entrenar() {

    let correctos = 0;
    let porcentajeAcierto;

    for (let i = 0; i < notastrain.length; i++) {
        let inputs = notastrain[i][1];
        let sol = notastrain[i][0];
        nn.train(inputs, sol);
        let output = nn.feedforward(inputs);
        let tipoEstimado = getIndexArrayOne(output);
        let tipoReal = getIndexArrayOne(sol);
        if (tipoEstimado == tipoReal) correctos++;
        //console.log("Label estimada: " + output + ", Label real: " + label);
    }
    porcentajeAcierto = correctos / notastrain.length;
    console.log("Porcentaje de acierto en training " + porcentajeAcierto);
}

function entrenarTipo() {
    console.log("Entrenando nn tipo de instrumento");
    let correctos = 0;
    let porcentajeAcierto;

    for (let i = 0; i < tipotrain.length; i++) {
        let inputs = tipotrain[i][1];
        let sol = tipotrain[i][0];
        nntipo.train(inputs, sol);
        let output = nntipo.feedforward(inputs);
        let tipoEstimado = getIndexArrayOne(output);
        let tipoReal = getIndexArrayOne(sol);
        if (tipoEstimado == tipoReal) correctos++;
        //console.log("Label estimada: " + output + ", Label real: " + label);
    }
    porcentajeAcierto = correctos / tipotrain.length;
    console.log("Porcentaje de acierto en training en nn tipo instrumento " + porcentajeAcierto);
}

function testear() {
    let correctos = 0;
    let porcentajeAcierto;

    for (let i = 0; i < notastest.length; i++) {
        let inputs = notastest[i][1];
        let sol = notastest[i][0];
        let output = nn.feedforward(inputs);
        let tipoEstimado = getIndexArrayOne(output);
        let tipoReal = getIndexArrayOne(sol);
        if (tipoEstimado == tipoReal) correctos++;
        //console.log("Label estimada: " + output + ", Label real: " + label);
    }
    porcentajeAcierto = correctos / notastest.length;
    console.log("Porcentaje de acierto en test " + porcentajeAcierto);
}

function testearTipo() {
    console.log("Testeando nn tipo de instrumento");
    let correctos = 0;
    let porcentajeAcierto;

    for (let i = 0; i < tipotest.length; i++) {
        let inputs = tipotest[i][1];
        let sol = tipotest[i][0];
        let output = nntipo.feedforward(inputs);
        let tipoEstimado = getIndexArrayOne(output);
        let tipoReal = getIndexArrayOne(sol);
        if (tipoEstimado == tipoReal) correctos++;
        //console.log("Label estimada: " + output + ", Label real: " + label);
    }
    porcentajeAcierto = correctos / tipotest.length;
    console.log("Porcentaje de acierto en test de nn tipo de instrumento" + porcentajeAcierto);
}

function normalizarInputs(array) {
    let toret = [];
    for (let i = 0; i < array.length; i++) {
        toret[i] = array[i] / 255;
    }
    return toret;
}

function getIndexArrayOne(array) {
    //Si nos pasan [0.3, 0.2, 0.7] devolver 2 (el indice mas alto)
    return array.indexOf(max(array));
}

function getOneHot() {
    //Va a haber 36 notas, de DO3 a SI5 + 1 nota que será el silencio, indice 0
    let toret = [];
    for (let i = 0; i < nombreNotas.length; i++) {
        if (i == nota) {
            toret[i] = 1;
        } else {
            toret[i] = 0;
        }
    }
    //Silencio
    //[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...]
    //DO3
    //[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...]
    //DO+3
    //[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...]
    return toret;

}

function getOneHotOctava() {
    //Va a haber 8 notas, de DO a SI + 1 nota que será el silencio, indice 0
    let toret = [];
    for (let i = 0; i < notasEntrenar.length; i++) {
        if (i == nota) {
            toret[i] = 1;
        } else {
            toret[i] = 0;
        }
    }
    //Silencio
    //[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...]
    //DO3
    //[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...]
    //DO+3
    //[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...]
    return toret;
}

function decodificarOneHot(array) {
    //Se supone que pasamos el array OneHot, obtener el indice del 1
    let indice = array.indexOf(max(array));
    return nombreNotas[indice];
}

function decodificarOneHotTipo(array) {
    //Se supone que pasamos el array OneHot, obtener el indice del 1
    let indice = array.indexOf(max(array));
    return nombreTipo[indice];
}



function predecir() {
    activarPredicion = false;
    setTimeout(
        function () {
            ultimoInput = obtenerFrecuencias();
            ultimoInput = normalizarInputs(ultimoInput);
            outputUltimaPredicion = nn.feedforward(ultimoInput);
            console.log("Estimado nota: " + decodificarOneHot(outputUltimaPredicion));
            outputUltimaPredicionTipo = nntipo.feedforward(ultimoInput);
            console.log("Estimado tipo instrumento: " + decodificarOneHot(outputUltimaPredicionTipo));
            activarPredicion = true;
        }, 230);

}

function mostrarPesos() {
    let arrayih = nn.weights_ih.toArray();
    let arrayho = nn.weights_ho.toArray();
    let arraybh = nn.bias_h.toArray();
    let arraybo = nn.bias_o.toArray();

    let p = document.getElementById("array");

    p.innerHTML += "<br>arrayih = ";
    for (let i = 0; i < arrayih.length; i++) {
        p.innerHTML += arrayih[i] + ",";
    }

    p.innerHTML += "<br>arrayho = ";
    for (let i = 0; i < arrayho.length; i++) {
        p.innerHTML += arrayho[i] + ",";
    }

    p.innerHTML += "<br>arraybh = ";
    for (let i = 0; i < arraybh.length; i++) {
        p.innerHTML += arraybh[i] + ",";
    }

    p.innerHTML += "<br>arraybo = ";
    for (let i = 0; i < arraybo.length; i++) {
        p.innerHTML += arraybo[i] + ",";
    }

    console.log(nn.weights_ih.toArray());
}