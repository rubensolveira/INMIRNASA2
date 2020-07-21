class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];

        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    add(n) {
        if (n instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] = this.data[i][j] + n.data[i][j];
                }
            }
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] = this.data[i][j] + n;
                }
            }
        }
    }

    //Multiplicacion de 2 matrices
    static multiply(m1, m2) {
        if (m1.cols != m2.rows) {
            console.log('Columnas no coinciden con filas');
            return undefined;
        } else {
            let result = new Matrix(m1.rows, m2.cols);
            for (let i = 0; i < result.rows; i++) {
                for (let j = 0; j < result.cols; j++) {
                    let suma = 0;
                    for (let k = 0; k < m1.cols; k++) {
                        suma += m1.data[i][k] * m2.data[k][j];
                    }
                    result.data[i][j] = suma;
                }
            }
            return result;
        }
    }

    multiply(n) {
        if (n instanceof Matrix) {
            //Multiplicacion elemental
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] = this.data[i][j] * n.data[i][j];
                }
            }
        } else {

            //Multiplicacion de una matriz por un escalar
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] = this.data[i][j] * n;
                }
            }
        }
    }

    //Crear matriz array.lengh filas y 1 columna dada un array
    static fromArray(array) {
        let m = new Matrix(array.length, 1);
        for (let i = 0; i < array.length; i++) {
            m.data[i][0] = array[i];
        }
        return m;
    }

    //Crear matriz f filas y c columnas dada un array
    //Hay que ser cuidadoso al introducir estos parametros
    static fromArray2(array, f, c) {
        console.log(arguments);
        let m = new Matrix(f, c);
        let i = 0;
        for (let fil = 0; fil < f; fil++) {
            for (let col = 0; col < c; col++) {
                m.data[fil][col] = array[i];
                i++;
            }
        }
        return m;
    }

    toArray() {
        let array = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                array.push(this.data[i][j]);
            }
        }
        return array;
    }

    static transpose(m1) {
        let result = new Matrix(m1.cols, m1.rows);
        for (let i = 0; i < m1.rows; i++) {
            for (let j = 0; j < m1.cols; j++) {
                result.data[j][i] = m1.data[i][j];
            }
        }
        return result;
    }

    static subtract(m1, m2) {
        let result = new Matrix(m1.rows, m1.cols);
        for (let i = 0; i < m1.rows; i++) {
            for (let j = 0; j < m1.cols; j++) {
                result.data[i][j] = m1.data[i][j] - m2.data[i][j];
            }
        }
        return result;
    }

    sigmoid() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = sigmoid(this.data[i][j]); //Funcion en NN
            }
        }
    }

    dsigmoid() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = dsigmoid(this.data[i][j]); //Funcion en NN
            }
        }
    }

    copy() {
        let toret = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                toret.data[i][j] = this.data[i][j];
            }
        }
        return toret;
    }

    static dsigmoid(m1) {
        let result = new Matrix(m1.rows, m1.cols);
        for (let i = 0; i < m1.rows; i++) {
            for (let j = 0; j < m1.cols; j++) {
                result.data[i][j] = dsigmoid(m1.data[i][j]);
            }
        }
        return result;
    }

    print() {
        console.table(this.data);
    }
}