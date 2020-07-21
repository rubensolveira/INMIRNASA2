let mic; //Guardar objeto Audio
let empezar = false;
let fft; //Guardar objeto Fft
let volumen;
let arrayVolumen = []; //para guardar historial volumen

let botonEmpezarGrabar;
let botonObtenerMuestras;
let botonEntrenar;
let botonPredecir;
let botonArray;
let botonBorrarUltimaNota;
let botonEntrenarDatosGuardados;
let botonMostrarPesos;
let activarEntrenarDatosGuardados = false;

//Se realizan n muestrasFFT(el rango va de 0Hz a 44000Hz), pero solo se cogen las n cantidadPrimerasMuestras
//ya que son las mas representativas y audibles
const muestrasFFT = 8192;
const cantidadPrimerasMuestras = 1024;
let arrayTodasFrecuencias = []; //Va a haber 'muestrasFFt' valores de 0Hz a 44000Hz
let arrayFrecuencias = []; //Va a haber 'cantidadPrimerasMuestras' valores de 0Hz a 3000Hz, este es el que interesa

let arrayEspectrograma = [];

let empezarObtencionMuestras = false;
let activarPredicion = false;

//Para temporizar tiempos
let tempInicio;
let tempIntervalo = 1000; //ms
let tempEmpezar = true;
let intervaloConsumido = true;
let intervaloRetrasoConsumido = true;

//Array de arrays, se iran guardando todas las muestras
let historialFrecuencias = [];
let notasdata = []; //Es el 'historialFrecuencias' pero con los datos formateados para entrenar

// --- NN --------------------------------------------------------------------------------
//para predecir notas
let nn;
let notastrain = [];
let notastest = [];

//Para predecir tipo de instrumento
let nntipo;
let tipodata = [];
let tipotrain = [];
let tipotest = [];

//Notas por defecto de mi nn
let nombreNotas = [
    'Silencio',
    'DO3', 'DO3 Sostenido', 'RE3', 'RE3 Sostenido', 'MI3', 'FA3', 'FA3 Sostenido', 'SOL3', 'SOL3 Sostenido', 'LA3', 'LA3 Sostenido', 'SI3',
    'DO4', 'DO4 Sostenido', 'RE4', 'RE4 Sostenido', 'MI4', 'FA4', 'FA4 Sostenido', 'SOL4', 'SOL4 Sostenido', 'LA4', 'LA4 Sostenido', 'SI4',
    'DO5', 'DO5 Sostenido', 'RE5', 'RE5 Sostenido', 'MI5', 'FA5', 'FA5 Sostenido', 'SOL5', 'SOL5 Sostenido', 'LA5', 'LA5 Sostenido', 'SI5',
];

//Si se quiere entrenar una nueva nn esta solo considera una octava
let notasEntrenar = ['Silencio', 'DO', 'DO Sostenido', 'RE', 'RE Sostenido', 'MI', 'FA', 'FA Sostenido', 'SOL', 'SOL Sostenido', 'LA', 'LA Sostenido', 'SI'];

let nombreTipo = [
    'Piano', 'Guitarra'
];

let nota = 0; // 0-silencio, 1 DO3, 2 DO3+ ...
let outputUltimaPredicion = [];
let outputUltimaPredicionTipo = [];
let ultimoInput = [];
let mostrarOutputNN = false;
let epoca = 0;

const _width = window.innerWidth;
const _height = window.innerHeight * 0.76;
