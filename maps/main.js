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
var SLICE_COUNT_Y =  40;
var SLICE_COUNT_X =  40;
var TOTAL_COUNT = SLICE_COUNT_X * SLICE_COUNT_Y; 
var inputs = [];
var slices = [];
var inputContainer = document.querySelector('#element-container');

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
    // console.warn('_reset_');
    this.setActive(false);
    window.clearTimeout(this.timer);
    this.el.classList.add('hidden');
    this.timer = null;
  }.bind(this);

  if (this.active) {
    return this.el.classList.remove('hidden');
  }
  this.timer = window.setTimeout(reset, 1000);
  this.setActive(true);
  return this;
};

for(var i = 0; i < TOTAL_COUNT; i ++) {
  var el = document.createElement('span');
  el.classList.add('pin');
  inputContainer.appendChild(el);
  slices.push(new Slice(el));
}


var diffy = Diffy.create({
  resolution: { x: SLICE_COUNT_X, y: SLICE_COUNT_Y },
  sensitivity: .2,
  threshold: 10,
  debug: true,
  containerClassName: 'my-diffy-container',
  sourceDimensions: { w: 130, h: 100 },
  onFrame: function (matrix) {
    var slice;
    var index;
    for(var i = 0; i < matrix.length; i++) {
      var row = matrix[i];
      var input;
      for(var j = 0; j < row.length; j ++) {
        index = SLICE_COUNT_Y * j + i;
        slice = slices[index];
        if(matrix[i][j] < 180) {
          slice.react();
        }
      }
    }
  }
});

