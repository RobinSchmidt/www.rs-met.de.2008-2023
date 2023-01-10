tEnd = 0; // a global variable for the endpoint of our curve
// can be tweaked to "fast-forward" at 50, something interesting happens

function rsLines(points)
{
	for(var i = 0; i < points.length-1; i++)
    line(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
}

function rsCurve(f, a, b, n = 200)
{
	rsLines([...Array(n+1).keys()].map(k => f(a + (b-a) * k/n)));
}

function rsLissajous(n, m, numLines, a, b)
{
	s = 1;  // scaler
  rsCurve(t => [s*sin(n*t), s*cos(m*t)], a, b, numLines);
  rsCurve(t => [s*cos(m*t), s*sin(n*t)], a, b, numLines);
  //s = -3;
  rsCurve(t => [s*sin(-n*t), s*cos(-m*t)], a, b, numLines);
  rsCurve(t => [s*cos(-m*t), s*sin(-n*t)], a, b, numLines);
}

function rsAliassajous()
{
	// maybe factor out into rsSetupPlot:
	translate(width/2, height/2);             // puts origin at the center of the canvas
	let scaleFactor = min(width,height)/3;    // number of pixels for a unit distance
	scale(scaleFactor, -scaleFactor)          // the minus for the y-axis let's the y-axis go upward
	rotate(PI / 4.0);

  // user parameters:
  var period = 16; // period of repitition in seconds
                   // maybe change to "initialSpeed"
  var n = 2; 
  var m = 3;
  var numLines = 75;
  // todo: make them adjustable via dat.gui.js, see here:
  // https://www.youtube.com/watch?v=x2izqg3fmX4&list=PLb0zKSynM2PBMF67Fo_18vshTDgGf4oyc&index=5


	background(0)  

	strokeWeight(12/scaleFactor)
	stroke(255, 75, 200, 30);
	rsLissajous(n, m, numLines, 0, 2*PI*tEnd)

  strokeWeight(6/scaleFactor)
	stroke(200, 75, 255, 60);
	rsLissajous(n, m, numLines, 0, 2*PI*tEnd)

	strokeWeight(1/scaleFactor)
	stroke(255, 255, 255, 120);
	rsLissajous(n, m, numLines, 0, 2*PI*tEnd)

  // factor out the 3 calls into 1


  // compute time increment based on frame rate and desired periodicty:
  dt =  1 / (period * frameRate());
  if(!isFinite(dt)) // sanity check necessary - it seems, frameRate may sometimes return 0
  	dt = 0.01;

  dt *= 1 / (1+tEnd/period); // slow down over time to counteract vertex acceleration
  // seems like 1 / (1+tEnd/period) is a good choice

  // update counter with wrap around:
  tEnd = tEnd + dt;
  //tEnd %= 30;
}

// todo: 
// -let the speed depend on time - the later, the slower - or maybe that's to simple - maybe some
//  more interesting speed vs time function is required
// -in general, the speed of the movement of the vertices grows ever faster over time - maybe some 
//  sort factor dt *= 1 / (1+tEnd) would be appropriate
// -to figure out an appropriate function, tweak the start-value of tEnd - try values 0, 50, 100
//  and try to find a function that works well for all 3 values - maybe it should be something 
//  like: dt = a / (b + c*tEnd + d*tEnd^2)...so maybe something like
//  dt = a / (b + c*sqrt(tEnd) + d*tEnd) would be more appropriate -> needs experimentation
//  ...i think, asymptotically, it should behave like k/tEnd some k
// -can we have the glow/decay behavior of the oscilloscope?
// -mix in sinusoids of higher frequency


//--------------------------------------------------------------------------------------------------
// implementation of p5.js callbacks:

function setup() 
{
	createCanvas(windowWidth, windowHeight);
	// todo: figure out brwoser window size and use the available space
}

function draw() 
{
	rsAliassajous();
}