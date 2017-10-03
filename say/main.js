function createOnceLog() {
  var counter = 0;
  return function() {
    var args = arguments;
    if (counter > 0) { return; }
    console.log.apply(console, args);
    return counter ++;
  }
}

var logger = createOnceLog();
var logger2 = createOnceLog();

var THRESHOLD = 100;
var SLICE_COUNT_Y =  25;
var SLICE_COUNT_X =  32
var TOTAL_COUNT = SLICE_COUNT_X * SLICE_COUNT_Y; 
var bubbles = window.bubbles = [];
var container = document.querySelector('#element-container');

function Slice(el) {
  this.timer = null;
  this.active = false;
  this.el = el;
}

Slice.prototype.setActive = function(isActive) {
  this.active = isActive;
  return this;
}


Slice.prototype.react = function() {
  var reset = function() {
    this.setActive(false);
    window.clearTimeout(this.timer);
    this.el.classList.remove('animating');
    this.timer = null;
  }.bind(this);

  if (!this.active) {
    this.setActive(true);
    this.el.classList.add('animating');
    this.timer = window.setTimeout(reset, 500);
  }
  return this;
};

for(var i = 0; i < TOTAL_COUNT; i ++) {
  var el = document.createElement('div');
  el.classList.add('bubble-wrap', 'hidden');
  el.innerHTML = "<svg version=\"1.1\" class=\"bubble\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"-49.5 -1.8 129 84.5\" style=\"enable-background:new -49.5 -1.8 129 84.5;\" xml:space=\"preserve\">\n<path style=\"fill:#CCC;\" d=\"M42.4,73.3H-0.4c-18.1,0-33-14.8-33-33v-4.7c0-18.1,14.9-33,33-33h42.8c18.2,0,33,14.9,33,33v4.7\n\tC75.4,58.5,60.5,73.3,42.4,73.3z\"/>\n<circle style=\"fill:#999;\" cx=\"1\" cy=\"38\" r=\"9\"/>\n<circle style=\"fill:#999;\" cx=\"21\" cy=\"38\" r=\"9\"/>\n<circle style=\"fill:#999;\" cx=\"41\" cy=\"38\" r=\"9\"/>\n<circle style=\"fill:#CCC;\" cx=\"-25.2\" cy=\"62.6\" r=\"10.8\"/>\n<circle style=\"fill:#CCC;\" cx=\"-41\" cy=\"74.8\" r=\"5\"/>\n</svg>";
  // var count = document.createElement('span');
  // count.innerText = i;
  // el.appendChild(count);
  container.appendChild(el);
  bubbles.push(new Slice(el));
}

var diffy = Diffy.create({
  resolution: { x: SLICE_COUNT_X, y: SLICE_COUNT_Y },
  sensitivity: .2,
  threshold: 20,
  debug: true,
  containerClassName: 'my-diffy-container',
  sourceDimensions: { w: 130, h: 100 },
  onFrame: function (matrix) {
    // debugger
    var slice;
    var index;
    for(var i = 0; i < matrix.length; i++) {
      var column = matrix[i];
      var input;
      for(var j = 0; j < column.length; j ++) {
        index = SLICE_COUNT_X * j + i;
        slice = bubbles[index];
        if(matrix[i][j] < 180) {
          slice.react();
        }
      }
    }
  }
});

