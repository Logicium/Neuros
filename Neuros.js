var Neuros = function () {
    var x = -2, y = 3;

    var rls = new RandomLocalSearch(x,y);
    console.log('Random Local Search: '+rls.bestOut);

    var ng = new NumericalGradient(x,y);
    console.log('Numerical Gradient: '+ng.outNew);

    var ag = new AnalyticGradient(x,y);
    console.log('Analytic Gradient: '+ag.outNew);

    var x = -2, y = 5, z = -4;
    var f = forwardCircuit(x, y, z);

    var bp = new BackPropagation(x,y,z);
    console.log('Back Propagation: '+bp.final);

    var ngc = new NumericalGradientCheck(x,y,z);

};

Neuros.prototype = {

};

var forwardMultiplyGate = function(x, y) {
    return x * y;
};

var forwardAddGate = function(a, b) {
    return a + b;
};

var forwardCircuit = function(x,y,z) {
    var q = forwardAddGate(x, y);
    var f = forwardMultiplyGate(q, z);
    return f;
};

var RandomLocalSearch = function(x,y) {

    var tweak_amount = 0.01;
    var best_out = -Infinity;
    var best_x = x, best_y = y;
    for(var k = 0; k < 100; k++) {
        var x_try = x + tweak_amount * (Math.random() * 2 - 1); // tweak x a bit
        var y_try = y + tweak_amount * (Math.random() * 2 - 1); // tweak y a bit
        var out = forwardMultiplyGate(x_try, y_try);
        if(out > best_out) {
            // best improvement yet! Keep track of the x and y
            best_out = out;
            best_x = x_try, best_y = y_try;
        }
    };
    this.bestOut = best_out;
};

var NumericalGradient = function(x,y){
    var out = forwardMultiplyGate(x, y); // -6
    var h = 0.0001;

// compute derivative with respect to x
    var xph = x + h; // -1.9999
    var out2 = forwardMultiplyGate(xph, y); // -5.9997
    var x_derivative = (out2 - out) / h; // 3.0

// compute derivative with respect to y
    var yph = y + h; // 3.0001
    var out3 = forwardMultiplyGate(x, yph); // -6.0002
    var y_derivative = (out3 - out) / h; // -2.0

    var step_size = 0.01;
    var out = forwardMultiplyGate(x, y); // before: -6
    x = x + step_size * x_derivative; // x becomes -1.97
    y = y + step_size * y_derivative; // y becomes 2.98
    var out_new = forwardMultiplyGate(x, y); // -5.87! exciting.
    this.outNew = out_new;
};

var AnalyticGradient = function(x,y){
    var out = forwardMultiplyGate(x, y); // before: -6
    var x_gradient = y; // by our complex mathematical derivation above
    var y_gradient = x;

    var step_size = 0.01;
    x += step_size * x_gradient; // -1.97
    y += step_size * y_gradient; // 2.98
    var out_new = forwardMultiplyGate(x, y); // -5.87. Higher output! Nice.
    this.outNew = out_new;
};

var BackPropagation = function(x,y,z){
    var q = forwardAddGate(x, y); // q is 3
    var f = forwardMultiplyGate(q, z); // output is -12

// gradient of the MULTIPLY gate with respect to its inputs
// wrt is short for "with respect to"
    var derivative_f_wrt_z = q; // 3
    var derivative_f_wrt_q = z; // -4

// derivative of the ADD gate with respect to its inputs
    var derivative_q_wrt_x = 1.0;
    var derivative_q_wrt_y = 1.0;

// chain rule
    var derivative_f_wrt_x = derivative_q_wrt_x * derivative_f_wrt_q; // -4
    var derivative_f_wrt_y = derivative_q_wrt_y * derivative_f_wrt_q; // -4

// final gradient, from above: [-4, -4, 3]
    var gradient_f_wrt_xyz = [derivative_f_wrt_x, derivative_f_wrt_y, derivative_f_wrt_z]

// let the inputs respond to the force/tug:
    var step_size = 0.01;
    x = x + step_size * derivative_f_wrt_x; // -2.04
    y = y + step_size * derivative_f_wrt_y; // 4.96
    z = z + step_size * derivative_f_wrt_z; // -3.97

// Our circuit now better give higher output:
    var q = forwardAddGate(x, y); // q becomes 2.92
    var f = forwardMultiplyGate(q, z); // output is -11.59, up from -12! Nice!

    this.final = f;

};

var NumericalGradientCheck = function(x,y,z){
    var h = 0.0001;
    var x_derivative = (forwardCircuit(x+h,y,z) - forwardCircuit(x,y,z)) / h; // -4
    var y_derivative = (forwardCircuit(x,y+h,z) - forwardCircuit(x,y,z)) / h; // -4
    var z_derivative = (forwardCircuit(x,y,z+h) - forwardCircuit(x,y,z)) / h; // 3
};