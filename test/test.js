'use strict';

/*eslint key-spacing: 0, comma-spacing: 0, quotes: 0*/

var delaunay = require('../delaunay.js'),
    t = require('tape'),
    fs = require('fs');

t('ccw left turn with left-handed system', function (t) {
    var triangulator = new delaunay();
    t.same(triangulator.ccw([0, 0], [-1, 0], [0, -1]), true);
    t.end();
});

t('ccw left turn with colinear points', function (t) {
    var triangulator = new delaunay();
    t.same(triangulator.ccw([0, 0], [0, 1], [0, 2]), false);
    t.end();
});

t('ccw left turn with right-handed system', function (t) {
    var triangulator = new delaunay();
    t.same(triangulator.ccw([0, 0], [0, 1], [0, 2]), false);
    t.end();
});

t('leftOf function', function (t) {
    var triangulator = new delaunay();
    t.same(triangulator.leftOf([0, 0], {orig: [-1, 0], dest: [0, -1]}), true);
    t.same(triangulator.leftOf([0, 0], {orig: [0, 1], dest: [0, 2]}), false);
    t.end();
});

t('rightOf function', function (t) {
    var triangulator = new delaunay();
    t.same(triangulator.rightOf([0, 0], {orig: [-1, 0], dest: [0, -1]}), false);
    t.same(triangulator.rightOf([0, 0], {orig: [0, 1], dest: [0, 2]}), false); // Colinear
    t.same(triangulator.rightOf([-1, 0], {orig: [0, 1], dest: [0, 2]}), false);
    t.end();
});

t('inCircle infinite circle', function (t) {
    var triangulator = new delaunay();
    t.same(triangulator.inCircle([0, 0], [-1, 0],[1, 0], [1, 1]), false);
    t.end();
});

t('inCircle close point outside', function (t) {
    var triangulator = new delaunay();
    t.same(triangulator.inCircle([455.92018420781744,  248.96081128188553],
        [342.30806318880326,  338.21910826748257],
        [309.54136543023935,  164.19953352250644],
        [334.260775171976,  342.3228053742814]), false);
    t.end();
});

t('inCircle very large circle', function (t) {
    var triangulator = new delaunay();
    t.same(triangulator.inCircle([-999999, 1], [-1, 0],[1, 0], [1, 1]), true);
    t.end();
});

t('inCircle on circle\'s edge', function (t) {
    var triangulator = new delaunay();
    t.same(triangulator.inCircle([0, 1], [-1, 0],[1, 0], [-1, 0]), false);
    t.same(triangulator.inCircle([309.54136543023935, 164.19953352250644],
        [455.92018420781744,  248.96081128188553],
        [334.260775171976,  342.3228053742814],
        [455.92018420781744,  248.96081128188553]), false);
    t.same(triangulator.inCircle([-459519037000000000,86437251528200000],
        [-636579428518000000,187621503144000000],
        [-607069363265000000,170757461208000000],
        [-459519037000000000,86437251528200000]), false);
    t.end();
});

t('inCircle outside the circle', function (t) {
    var triangulator = new delaunay();
    t.same(triangulator.inCircle([0, 1], [-1, 0],[1, 0], [-1, -1]), false);
    t.end();
});

t('Examples data', function (t) {
    ['4', 'dots', 'flag', 'grid', 'ladder', 'spiral', 'tri'].forEach(function(fileName){
        var pts = readPointsFromFile('test/data/' + fileName + '.node');
        var d = new delaunay(pts);
        var faces = d.triangulate();

        // Check all the circumcircles and all the points
        for(var i = 0; i < faces.length; i += 3)
            for(var j = 0; j < pts.length; j++) {
                if(d.inCircle(faces[i], faces[i + 1], faces[i + 2], pts[j]))
                    t.fail('Algorithm fails for file ' + fileName + ': point (' + pts[j] +
                        ') is in the circumcircle delimited by (' + faces[i] + '), (' + faces[i + 1] +
                        '), (' + faces[i + 2] + ').');
            }
    });

    t.end();
});

function sortFaces(a, b){
    if(a[0] === b[0])
        return a[1] - b[1];
    return a[0] - b[0];
}

function readPointsFromFile(filename) {
    var result = [];
    fs.readFileSync(filename).toString().split('\n').slice(1).forEach(function (line) {
        var coordinates = line.split(/\s+/);
        result.push([parseFloat(coordinates[1]), parseFloat(coordinates[2])]);
    });
    return result;
}