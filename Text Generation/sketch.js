/*
Data and machine learning for artistic practice
Week 8

Stateful generation CharRNN
*/

let charRNN,
    textInput,
    tempSlider,
    startBtn,
    resetBtn,
    singleBtn,
    generating = false,
    generated_text = "";

function setup() {
  createCanvas(800, 500);
  
  // Create the LSTM Generator passing it the model directory
  charRNN = ml5.charRNN('./models/shakespeare/', modelReady);
  
  // Grab the DOM elements
  textInput = select('#textInput');
  tempSlider = select('#tempSlider');
  startBtn = select('#start');
  resetBtn = select('#reset');
  singleBtn = select('#single');

  // DOM element events
  startBtn.mousePressed(generate);
  resetBtn.mousePressed(resetModel);
  singleBtn.mousePressed(predict);
  tempSlider.input(updateSliders);
}

function draw() {
  background(0);
  fill(255);
  noStroke(0);
  text(generated_text, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, canvasHeight);
}

// Update the slider values
function updateSliders() {
  select('#temperature').html(tempSlider.value());
}

async function modelReady() {
  select('#status').html('Model Loaded');
  resetModel();
}

function resetModel() {
  charRNN.reset();
  const seed = select('#textInput').value();
  charRNN.feed(seed);
  generated_text = seed;
}

function generate() {
  if (generating) {
    generating = false;
    startBtn.html('Start');
  } else {
    generating = true;
    startBtn.html('Pause');
    loopRNN();
  }
}

async function loopRNN() {
  while (generating) {
    await predict();
  }
}

async function predict() {
  let temperature = tempSlider.value();
  let next = await charRNN.predict(temperature);
  await charRNN.feed(next.sample);
  generated_text += next.sample;
}
