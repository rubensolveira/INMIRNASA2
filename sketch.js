//p5.disableFriendlyErrors = true;

function empezarGrabar() {
  //respuesta = confirm("Empezamos a grabar? No se guarda nada, solo escucho. Al menos por mi parte.");
  //if (respuesta == true) {
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.8, muestrasFFT);
  fft.setInput(mic);

  getAudioContext().resume();
  empezar = true;
  //mostrarEspectrograma();

  botonEmpezarGrabar.hide();

  botonObtenerMuestras = createButton('Empezar / Parar obtencion de muestras');
  botonObtenerMuestras.mousePressed(btnObtencionMuestras);

  // botonEntrenar = createButton('Entrenar');
  // botonEntrenar.mousePressed(ejecutarRed);

  // botonPredecir = createButton('Predecir');
  // botonPredecir.mousePressed(predecir);

  // botonArray = createButton('Mostrar array');
  // botonArray.mousePressed(mostrarArray);

  botonBorrarUltimaNota = createButton('Borrar ultima nota');
  botonBorrarUltimaNota.mousePressed(borrarUltimaNota);

  // botonEntrenarDatosGuardados = createButton('Entrenar con datos guardados');
  // botonEntrenarDatosGuardados.mousePressed(entrenarDatosGuardados);

  // botonMostrarPesos = createButton('Mostrar pesos');
  // botonMostrarPesos.mousePressed(mostrarPesos);
  //}
}

function setup() {

  createCanvas(_width, _height);

  nn = new NN(cantidadPrimerasMuestras, 64, nombreNotas.length);
  nntipo = new NN(cantidadPrimerasMuestras, 64, nombreTipo.length);

  //Cargar nn notas ya entrenada
  nn.weights_ih = Matrix.fromArray2(arrayih, 64, 1024);
  nn.weights_ho = Matrix.fromArray2(arrayho, 37, 64);
  nn.bias_h = Matrix.fromArray2(arraybh, 64, 1);
  nn.bias_o = Matrix.fromArray2(arraybo, 37, 1);

  //Entrenar nn tipo instrumento, me da pereza cargarla entrenada
  formarDatosGuardadosTipo();
  for (let i = 0; i < 8; i++) {
    entrenarTipo();
    testearTipo();
  }
  botonEmpezarGrabar = createButton('Empezar');
  botonEmpezarGrabar.mousePressed(empezarGrabar);
}

function draw() {
  background(250);

  if (empezar) {
    volumen = mic.getLevel()
    fill(50, 50, 255);
    stroke(50, 50, 255);
    text("Las notas que aparecen en azul justo debajo son conseguidas mediante", 10, 10);
    text("programacion if then else de toda la vida. Las notas en verde que aparecen", 10, 22);
    text("a la derecha del todo son predecidas por una red neuronal que programé desde 0.", 10, 34);
    mostrarVolumenTiempo();
    mostrarFrecuenciaDirecto();
    nombrarFrecuencias();

    if (empezarObtencionMuestras) {
      for (let i = 0; i < notasEntrenar.length; i++) {
        if (nota == i) {
          fill(0, 200, 0);
          stroke(0, 200, 0);
          textSize(16);
          text("Toca un " + notasEntrenar[i], 10, 200);
          stroke(0);
          fill(0);
          text("Si te equivocas de nota o, por el ", 10, 215);
          text("volumen se registra una por error", 10, 230);
          text("puedes 'Borrar ultima nota' y volver a tocarla", 10, 245);
        }
      }

      //Si se recogieron muestras de todas las notas, sustituir la red neuronal
      //y entrenar con las muestras obtenidas
      if (nota == notasEntrenar.length) {
        nn = new NN(1024, 64, notasEntrenar.length);
        ejecutarRed(); //Forma datos y entrena red
        //borrar el historial por si acaso el usuario ejecuta 2 veces
        historialFrecuencias = [];
        nota = 0;
        empezarObtencionMuestras = false;
      }
    } else {
      textSize(14);
      fill(0);
      stroke(0);
      text("Puedes entrenar tu propia red si la mia", 10, 100);
      text("no te funciona bien.", 10, 115);
      text("Pulsa en Empezar / Parar obtencion...", 10, 130);
      text("Se te pedirá que toques una nota", 10, 145);
      text("Empezando en Do y acabando en Si.", 10, 160);
      text("12 notas en total, luego la red quedará", 10, 175);
      text("entrenada con tus muestras y funcionará 99%", 10, 190);
    }

    //Si la nota a dar es un 'Silencio' esta se hace automaticamente
    //No hay que esperar por pico para que se active el micro
    if (intervaloConsumido && empezarObtencionMuestras && nota == 0) {
      iniciarGrabacion();
      console.log(nota);
    }

    if (empezarObtencionMuestras && esperarPorPico()) {
      iniciarGrabacion();
    }

    //enseñar frecuencias obtenidas en la grabacion
    //mientras no se pueda volver a hacer otra muestra
    if (intervaloConsumido == false && intervaloRetrasoConsumido == true) {
      //Mostrar la ultima obtenida
      mostrarFrecuencia(historialFrecuencias[historialFrecuencias.length - 1][1], 0, 220, 0, 90);
    }

    if (activarEntrenarDatosGuardados && epoca != 50) {
      formarDatosGuardados();
      entrenar();
      testear();
      epoca++;
    } else {
      activarEntrenarDatosGuardados = false;
      epoca = 0;
    }

    if (/*activarPredicion && */esperarPorPico()) {
      predecir();
    }

    nn.pintarRed(width / 2, height / 7, width / 2 - 70, height / 2.5);


    if (outputUltimaPredicion.length != 0) {
      nn.pintarOutputs(width / 2, height / 7, width / 2 - 70, height / 2.5, ultimoInput);
      nn.pintarLabel(width - 55, height / 7, height / 2.5, outputUltimaPredicion);
      fill(0);
      text("También hay una segunda red neuronal que estima que instrumento estas tocando", width - 600, height * 0.65);
      text("Solo esta entrenada con guitarra y piano, asique solo va a predecir estos dos", width - 600, height * 0.67);
      fill(0, 255, 0);
      text("Estas tocando un: " + decodificarOneHotTipo(outputUltimaPredicionTipo), width - 300, height * 0.7);
    }

    pintarActivacionVolumen();
  }
}

function btnObtencionMuestras() {
  empezarObtencionMuestras = !empezarObtencionMuestras;
}

function mostrarArray() {
  let p = document.getElementById("array");
  for (let f = 0; f < historialFrecuencias.length; f++) {
    p.innerHTML += "[";
    for (let a = 0; a < historialFrecuencias[f].length; a++) {
      p.innerHTML += "[";
      for (let e = 0; e < historialFrecuencias[f][a].length; e++) {
        p.innerHTML += historialFrecuencias[f][a][e];
        if (e < historialFrecuencias[f][a].length - 1)
          p.innerHTML += ",";
      }
      p.innerHTML += "]";
    }
    p.innerHTML += "],<br>";
  }
}

function borrarUltimaNota() {
  if (historialFrecuencias.length > 1) {
    historialFrecuencias.pop();
    nota--;
  }
}

/**Empezar a obtener muestra un poco despues de que se detecte
 * un pico */
function iniciarGrabacion() {
  intervaloConsumido = false;
  tempEmpezar = false;
  intervaloRetrasoConsumido = false;

  setTimeout(
    function () {
      obtenerMuestras();
    }, 230);
}

/**Obtener las frecuencias y volver a poner los flags
 * disponibles para volver a grabar */
function obtenerMuestras() {
  let array = obtenerFrecuencias();
  historialFrecuencias.push(array);

  let data = historialFrecuencias[historialFrecuencias.length - 1];
  //let sol = getOneHot();
  let sol = getOneHotOctava();
  let fila = [sol, data];

  historialFrecuencias[historialFrecuencias.length - 1] = fila;

  console.log(historialFrecuencias);
  intervaloRetrasoConsumido = true;

  setTimeout(
    function () {
      intervaloConsumido = true;
      tempEmpezar = true;
      nota++;
    }, tempIntervalo);
}

function pintarActivacionVolumen() {
  let altura = volumenMediaActivacion();
  altura = map(altura, 0, 1, height, 0);
  stroke(255, 90, 20);
  fill(255, 90, 20);
  line(width - 75, altura, width, altura);
  text("Activación: ", width - 75, altura - 10);
}

function esperarPorPico() {

  if (volumen > volumenMediaActivacion() && intervaloConsumido == true) {
    return true;
  } else {
    return false;
  }
}

function obtenerFrecuencias() {
  //Clonar y devolver array clonado
  let toret = [];
  //Se obtienen las muestras
  arrayTodasFrecuencias = fft.analyze();
  for (let i = 0; i < cantidadPrimerasMuestras; i++) {
    arrayFrecuencias[i] = arrayTodasFrecuencias[i];
    toret[i] = arrayTodasFrecuencias[i];
  }
  suavizarGraves(arrayFrecuencias);
  suavizarGraves(toret);
  return toret;
}

function mostrarFrecuencia(array, r, g, b, a) {
  // Responsivo, por si el width es mayor que la 'cantidadPrimerasFrecuencias'
  for (let x = 0; x < cantidadPrimerasMuestras; x++) {
    let xmap = map(x, 0, cantidadPrimerasMuestras, 0, width);
    let valor = array[x];
    let y = map(valor, 0, 255, height, 0);
    stroke(r, g, b, a);
    line(xmap, height, xmap, y);
  }
}

function mostrarFrecuenciaDirecto() {
  obtenerFrecuencias();

  // Responsivo, por si el width es mayor que la 'cantidadPrimerasFrecuencias'
  for (let x = 0; x < cantidadPrimerasMuestras; x++) {
    let xmap = map(x, 0, cantidadPrimerasMuestras, 0, width);
    let valor = arrayFrecuencias[x];
    let y = map(valor, 0, 255, height, 0);
    stroke(x / 8, x / 4, x / 4 + 128, 150);
    line(xmap, height, xmap, y);
  }

  //Pintar alrededor de la frecuencia mas alta de un azul mas oscuro
  let mayor = obtenerIndiceMayor(arrayFrecuencias);
  for (let i = mayor - 5; i < mayor + 5; i++) {
    let xmap = map(i, 0, cantidadPrimerasMuestras, 0, width);
    let valor = arrayFrecuencias[i];
    let y = map(valor, 0, 255, height, 0);
    stroke(0, 0, 255, 255);
    line(xmap, height, xmap, y);
  }
}


function mostrarVolumenTiempo() {
  arrayVolumen.push(volumen);
  stroke(255, 0, 0);
  beginShape();
  noFill();
  for (let i = 0; i < arrayVolumen.length; i++) {
    let y = map(arrayVolumen[i], 0, 1, height, 0);
    vertex(width - arrayVolumen.length + i, y);
  }
  endShape();

  if (arrayVolumen.length > width) {
    //Se elimina el primer elemento del array
    arrayVolumen.splice(0, 1);
  }

  let vol = arrayVolumen[arrayVolumen.length - 1]
  textSize(14);
  text("Volumen: " + str(vol * 100).substring(0, 4), width - 200, height - 50);
}

function volumenMediaActivacion() {
  let suma = 0;
  let media = 0;
  let muestrasHistorial = 20;
  for (let i = arrayVolumen.length - 1; i > arrayVolumen.length - muestrasHistorial; i--) {
    suma += arrayVolumen[i];
  }
  media = suma / muestrasHistorial;
  //Poner la activacion un poco alta para que no se active con poco ruido
  let activacion = media + media + 0.007;

  return activacion;
}

function suavizarGraves(array) {
  for (let i = 0; i < cantidadPrimerasMuestras / 25; i++) {
    array[i] = array[i] * 0.5;
  }
  return array;
}

