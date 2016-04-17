var maxX = 500,
    maxY = 500,
    minPoints = 10,
    maxPoints = 2560,
    incrementFactor = 2,
    numIterationPerSize = 15;

var fs = require('fs');
var pts = readPointsFromFile('test/data/box.node');
var solution = require("delaunay-fast").triangulate(pts).map(function(value){
    return pts[value];
});
console.log(JSON.stringify(solution));

function readPointsFromFile(filename) {
    var result = [];
    fs.readFileSync(filename).toString().split('\n').slice(1).forEach(function (line) {
        var coordinates = line.split(/\s+/);
        result.push([parseFloat(coordinates[1]), parseFloat(coordinates[2])]);
    });
    return result;
}

function uniformDistribution(n) {
    var pts = [];
    for (var i = n; i >= 0; i--)
        pts.push([Math.random() * maxX, Math.random() * maxY]);
    return pts;
}

var libraries = {
    guibas: {
        algorithm: require("../delaunay.js"),
        execute: function(pts) {
            return new this.algorithm(pts).triangulate();
        }
    },
    delaunayFast: {
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
    delaunayTriangulate: {
        algorithm: require("delaunay-triangulate"),
        execute: function(pts) {
            return this.algorithm(pts);
        }
    },
    incrementalDelaunay: {
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
        var pts = uniformDistribution(i);
        for(var library in libraries) {
            if(libraries.hasOwnProperty(library)){
                result[library] = result[library] || 0;
                var start = new Date().getTime();
                libraries[library].execute(pts);
                result[library] += (new Date().getTime() - start) / numIterationPerSize;
            }
        }
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