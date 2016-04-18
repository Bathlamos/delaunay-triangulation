[![Build Status](https://travis-ci.org/Bathlamos/delaunay-triangulation.svg?branch=master)](https://travis-ci.org/Bathlamos/delaunay-triangulation)

A quick Delaunay triangulation library in 2D. The library is based on Guibas & Stolfi's divide-and-conquer algorithm<sup>1</sup>, which guarantees a worst-case runtime of O(nlogn). To my knowledge, other JavaScript libraries out there do no have the same performance guarantee.

The algorithm runs in the browser and on Node.js.

##Demo
http://bathlamos.github.io/delaunay-triangulation/


## Usage
Given a array of 2D points, which are themselves arrays, we can create a Delaunay object.
```
var points = [
                [-1.5, 0],
                [0, 1],
                [0, 10],
                [1.5, 0]
              ];

var delaunay = new Delaunay(points);
```

The triangulation is an array points: every triplet denotes the vertices of a triangle in the Delaunay triangulation.
```
var triangles = delaunay.triangulate();

/* 
 triangles = [[-1.5,0], [1.5,0], [0,1], [0,10], [-1.5,0], [0,1], [1.5,0], [0,10], [0,1]]
 
 In this example, the triangles are 
   #1: [-1.5,0], [1.5,0], [0,1]
   #2: [0,10], [-1.5,0], [0,1]
   #3: [1.5,0], [0,10], [0,1]
*/
```

##Accuracy
Due to all JavaScript numbers being 64-bit floating points, certain mathematical operations may misbehave if the points are too close to one another. If two points are closer than 0.01 on either axis, simply multiply all points by a constant factor.

- Performance against other algorithms
- Node.js link

[1] [L.J. Guibas and J. Stolfi, Primitives for the manipulation of general subdivisions and the
computation of Voronoi diagrams, ACM Trans. Graphics, 4 (1985), 74-123.](http://dl.acm.org/citation.cfm?id=282923)
