// var started = null;
// window.addEventListener('click', () => {
//   if (started) return;
//   started = true;
//   mostrarEspectrograma();
// })

function mostrarEspectrograma() {

  //Crear canvas
  const CANVAS = document.body.querySelector('canvas');
  const CONTEXT = CANVAS.getContext('2d');
  const WIDTHesp = CANVAS.width = window.innerWidth;
  const HEIGHTesp = CANVAS.height = window.innerHeight;

  //Para el audio. Del ANALYSER se obtienen las muestras de frecuencias
  const AUDCONTEXT = new AudioContext();
  const ANALYSER = AUDCONTEXT.createAnalyser();

  //Indicar numero de muestras
  ANALYSER.fftSize = muestrasFFT;

  //Activar funcion 'procesarEspectro' cuando se detecta micro. Se ejecuta en bucle
  navigator.mediaDevices.getUserMedia({ audio: true }).then(procesarEspectro);

  //Pasar los datos del audio, osea el stream
  function procesarEspectro(stream) {
    //Enlazar el audio con el ANALYSER
    const SOURCE = AUDCONTEXT.createMediaStreamSource(stream);
    SOURCE.connect(ANALYSER);

    //Obtener las Frecuencias
    //Se devuelve un array con 'ANALYSER.fftSize * 2' frecuencias.
    //El valor de cada frecuencia va de 0 a 255
    const DATA = new Uint8Array(ANALYSER.frequencyBinCount);
    // Por alguna razon desconocida (supongo que por el UintArray), el DATA.length
    // es el doble que el espectrograma del p5js, asique dividir por 2.
    const LEN = cantidadPrimerasMuestras / 2;
    const h = HEIGHTesp / LEN;
    const x = WIDTHesp - 1;
    CONTEXT.fillStyle = 'hsl(280, 100%, 10%)';
    //CONTEXT.fillStyle = '#000';
    CONTEXT.fillRect(0, 0, WIDTHesp, HEIGHTesp);

    loop();

    //Pintar el espectrograma
    function loop() {
      window.requestAnimationFrame(loop);
      let imgData = CONTEXT.getImageData(1, 0, WIDTHesp - 1, HEIGHTesp);
      CONTEXT.fillRect(0, 0, WIDTHesp, HEIGHTesp);
      CONTEXT.putImageData(imgData, 0, 0);
      ANALYSER.getByteFrequencyData(DATA);
      for (let i = 0; i < LEN; i++) {
        let rat = DATA[i] / 255;
        let hue = Math.round((rat * 120) + 280 % 360);
        let sat = '100%';
        let lit = 10 + (70 * rat) + '%';
        CONTEXT.beginPath();
        CONTEXT.strokeStyle = `hsl(${hue}, ${sat}, ${lit})`;
        //CONTEXT.strokeStyle = `rgb(${DATA[i]}, ${DATA[i]}, ${DATA[i]})`;
        CONTEXT.moveTo(x, HEIGHTesp - (i * h));
        CONTEXT.lineTo(x, HEIGHTesp - (i * h + h));
        CONTEXT.stroke();
      }
    }
  }
}
