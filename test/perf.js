var maxX = 500,
    maxY = 500,
    minPoints = 10,
    maxPoints = 500000,
    incrementFactor = 2,
    numIterationPerSize = 3,
    distribution = pseudoMultivariateNormalDistribution;

var fs = require('fs');

function uniformDistribution(n) {
    var pts = [];
    for (var i = n; i > 0; i--)
        pts.push([Math.random() * maxX, Math.random() * maxY]);
    return pts;
}

function gridDistribution(n) {
    var pts = [];
    var numOnSide = Math.floor(Math.sqrt(n));
    var remainder = n - numOnSide * numOnSide;
    for (var i = 0; i < numOnSide; i++)
        for (var j = 0; j < numOnSide; j++)
            pts.push([i * maxX / numOnSide, j * maxY / numOnSide]);

    // Remainder
    for (j = 0; j < remainder; j++)
        pts.push([maxX, j * maxY / n]);

    return pts;
}

function pseudoMultivariateNormalDistribution(n) {
    var pts = [];
    for (var i = n; i > 0; i--)
        pts.push([pseudoNormal(maxX), pseudoNormal(maxY / 2)]);
    return pts;
}

/**
 * Generates random points centered around 1
 */
function pseudoNormal(n){
    return Math.min(n / 2 * ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3, n);
}

function contourDistribution(n) {
    var pts = [];
    var numOnSide = Math.floor(n - 2) / 4;
    for (var j = 0; j < numOnSide; j++) {
        pts.push([0, j * maxY / numOnSide]);
        pts.push([maxX, j * maxY / numOnSide]);
        pts.push([j * maxX / numOnSide, 0]);
        pts.push([j * maxX / numOnSide, maxY]);
    }
    return pts;
}

var libraries = {
    "faster-delaunay": {
        algorithm: require("../delaunay.js"),
        execute: function(pts) {
            return new this.algorithm(pts).triangulate();
        }
    },
    "delaunay-fast": {
        algorithm: require("delaunay-fast"),
        execute: function(pts) {
            return this.algorithm.triangulate(pts);
        }
    },
    delaunay: {
        algorithm: require("delaunay"),
        execute: function(pts) {
            return this.algorithm.triangulate(pts);
        }
    },
    "delaunay-triangulate": {
        algorithm: require("delaunay-triangulate"),
        execute: function(pts) {
            return this.algorithm(pts);
        }
    },
    "incremental-delaunay": {
        algorithm: require("incremental-delaunay"),
        execute: function(pts) {
            return this.algorithm(pts);
        }
    }
};

var librariesInOrder = Object.keys(libraries);
console.log("** All times in ms\n");
console.log("Number of points     " + librariesInOrder.join("     "));

for(var i = minPoints; i < maxPoints; i *= incrementFactor) {
    var result = {};
    for(var j = 0; j < numIterationPerSize; j++) {
        var pts = distribution(i);
        for(var library in libraries) {
            if(libraries.hasOwnProperty(library)){
                result[library] = result[library] || 0;
                var start = new Date().getTime();
                libraries[library].execute(pts);
                result[library] += (new Date().getTime() - start) / numIterationPerSize;
            }
        }
        // Stop testing a library if it runs for more than 5s
        for(library in libraries)
            if(libraries.hasOwnProperty(library) && libraries[library] > 5000)
                delete libraries[library];


    }
    var output = i + "";
    for(var k = 0; k < librariesInOrder.length; k++) {
        var padLeft = ("Number of points" + librariesInOrder.slice(0, k).join()).length + (k + 1) * 5;
        while(output.length < padLeft)
            output += " ";
        // The extra '+' drops extra zeros at the end
        output += +result[librariesInOrder[k]].toFixed(4);
    }
    // Output the results
    console.log(output);
}