class NN {

    constructor(input_nodes, hidden_nodes, output_nodes) {
        this.input_nodes = input_nodes;
        this.hidden_nodes = hidden_nodes;
        this.output_nodes = output_nodes;

        this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
        this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
        this.weights_ih.randomize();
        this.weights_ho.randomize();

        this.bias_h = new Matrix(this.hidden_nodes, 1);
        this.bias_o = new Matrix(this.output_nodes, 1);
        this.bias_h.randomize();
        this.bias_o.randomize();

        this.learning_rate = 0.1;
    }

    //Obtener resultado del modelo actual
    feedforward(inputArray) {
        let inputs = Matrix.fromArray(inputArray);

        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.sigmoid();

        let output = Matrix.multiply(this.weights_ho, hidden);
        output.add(this.bias_o);
        output.sigmoid();

        return output.toArray();
    }

    //Entrenar al modelo actual, se le pasa los inputs y la respuesta conocida
    train(inputArray, targets_array) {
        //Feedforward
        let inputs = Matrix.fromArray(inputArray);

        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.sigmoid();

        let outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.sigmoid();

        let targets = Matrix.fromArray(targets_array);

        //Backpropagation
        //--- Calcular output error -------------------------------------
        //Error = Answer - Outputs
        let output_errors = Matrix.subtract(targets, outputs);
        //Gradiente output = lr * Errores * (sigmoid(wo) * (1 - sigmoid(wo)) * wh)
        //let gradient = outputs

        //Calcular gradiente output
        let gradients = outputs.copy();
        gradients.dsigmoid();
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);


        //Calcular deltas hidden->output
        let hidden_T = Matrix.transpose(hidden);
        let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);
        this.weights_ho.add(weight_ho_deltas);
        this.bias_o.add(gradients);

        //--- Calcular hidden layers errors ------------------------------
        let who_t = Matrix.transpose(this.weights_ho);
        let hidden_errors = Matrix.multiply(who_t, output_errors);

        //Calcular gradiente hidden
        let hidden_gradient = hidden.copy();
        hidden_gradient.dsigmoid();
        hidden_gradient.multiply(hidden_errors);
        hidden_gradient.multiply(this.learning_rate);

        //Calcular deltas input->hidden
        let inputs_t = Matrix.transpose(inputs);
        let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_t);
        this.weights_ih.add(weight_ih_deltas);
        this.bias_h.add(hidden_gradient);

        // outputs.print();
        // targets.print();
        // output_errors.print();

    }

    pintarRed(px, py, sizex, sizey) {
        const espacioInputs = sizey / this.input_nodes;
        const espacioHidden = sizey / this.hidden_nodes;
        const espacioOutputs = sizey / this.output_nodes;
        const espacioWidth = sizex / 2;
        const radio = 15;

        //Para pintar los pesos de colores
        //La matriz de pesos contiene valores 'random' que van de menos algo a más algo
        //Pillar su minimo y su maximo y normalizarlo a 0-1 para poder multiplicar despues por 255
        let wih = this.weights_ih.toArray();
        wih = normalizarArray(wih);
        let who = this.weights_ho.toArray();
        who = normalizarArray(who);

        //Pintar pesos input-hidden
        let contadorConexion = 0;
        for (let i = 0; i < this.input_nodes; i++) {
            for (let j = 0; j < this.hidden_nodes; j++) {
                //Si hay demasiados inputs, pintar solo la mitad o lo que me parezca
                if (contadorConexion % 201 == 0) {
                    const valorPeso = wih[contadorConexion];
                    stroke(valorPeso * 255, 50, 90, 255);
                    strokeWeight((valorPeso + 0.5) ** 4);
                    line(px, py + (espacioInputs * i), px + espacioWidth, py + (espacioHidden * j));
                }
                contadorConexion++;
            }
        }

        //Pintar pesos hidden-output
        contadorConexion = 0;
        for (let i = 0; i < this.hidden_nodes; i++) {
            for (let j = 0; j < this.output_nodes; j++) {
                //Si hay demasiados inputs, pintar solo la mitad o lo que me parezca
                if (contadorConexion % 10 == 0) {
                    const valorPeso = who[contadorConexion];
                    stroke(valorPeso * 255, 50, 90, 255);
                    strokeWeight((valorPeso + 0.5) ** 4);
                    line(px + espacioWidth, py + (espacioHidden * i), px + sizex, py + (espacioOutputs * j));
                }
                contadorConexion++;
            }
        }

        //Pintar neuronas
        strokeWeight(1);
        stroke(0);
        fill(0);
        textSize(14);
        text(this.input_nodes + " nodos", px - 15, py - 15);
        for (let i = 0; i < this.input_nodes; i++) {
            let valor = arrayFrecuencias[i];
            if (i % 26 == 0 || valor > 75) {
                valor = arrayFrecuencias[i] / 255 + 1;
                fill(i / 8, i / 4, i / 4 + 128);
                ellipse(px, py + (espacioInputs * i), radio * valor ** 2, radio * valor ** 2);
            }
        }

        fill(0);
        text(this.hidden_nodes + " nodos", px + espacioWidth - 15, py - 15);
        for (let i = 0; i < this.hidden_nodes; i++) {
            if (i % 2 == 0) {
                fill(255);
                ellipse(px + espacioWidth, py + (espacioHidden * i), radio, radio);
            }
        }

        fill(0);
        text(this.output_nodes + " nodos", px + sizex - 15, py - 15);
        for (let i = 0; i < this.output_nodes; i++) {
            fill(255);
            ellipse(px + sizex, py + (espacioOutputs * i), radio, radio);

        }
    }


    pintarOutputs(px, py, sizex, sizey, arrayInputs) {
        //Para que quede alineado la funcion pintarRed() y pintarOutputs() deben tener los mismos valores en los parametros
        const espacioInputs = sizey / this.input_nodes;
        const espacioHidden = sizey / this.hidden_nodes;
        const espacioOutputs = sizey / this.output_nodes;
        const espacioWidth = sizex / 2;

        //Codigo para hacer un feedforward y saber cual es el mayor output en cada capa
        let inputs = Matrix.fromArray(arrayInputs);

        //Pintar output input-hidden
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.sigmoid();
        let arrayHidden = hidden.toArray();
        let indiceHiddenMax = arrayHidden.indexOf(max(arrayHidden));
        let indiceInputsMax = arrayInputs.indexOf(max(arrayInputs));
        stroke(0, 255, 0);
        strokeWeight(2);
        line(px, py + (espacioInputs * indiceInputsMax), px + espacioWidth, py + (espacioHidden * indiceHiddenMax));

        //Pintar output hidden-output
        let output = Matrix.multiply(this.weights_ho, hidden);
        output.add(this.bias_o);
        output.sigmoid();
        let arrayOutput = output.toArray();
        let indiceOutputMax = arrayOutput.indexOf(max(arrayOutput));
        stroke(0, 255, 0);
        line(px + espacioWidth, py + (espacioHidden * indiceHiddenMax), px + sizex, py + (espacioOutputs * indiceOutputMax));

        return output.toArray();
    }

    //Sizey debe de estar de acorde con el sizey de pintarRed()
    /**
     * px - pixel x donde empieza a pintarse
     * py - pixel y donde empieza a pintarse
     * sizey - longitud del tamaño vertical donde se va a pintar
     */
    pintarLabel(px, py, sizey, arrayOutput) {
        const espacioInputs = sizey / arrayOutput.length;

        fill(0, 255, 20);
        stroke(255);
        strokeWeight(1);
        let indiceSolucion = arrayOutput.indexOf(max(arrayOutput));
        text(decodificarOneHot(arrayOutput), px, py + (indiceSolucion * espacioInputs));
    }
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

//Ya tenemos calculada la sigmoide, asi es la derivada
function dsigmoid(x) {
    return x * (1 - x);
}

//Normaliza un array a valores 0-1
function normalizarArray(array) {

    let toret = [];
    // let min = min(array);
    let maxarray = max(array);
    let minarray = min(array);

    for (let i = 0; i < array.length; i++) {
        toret[i] = map(array[i], minarray, maxarray, 0, 1);
    }

    return toret;
}