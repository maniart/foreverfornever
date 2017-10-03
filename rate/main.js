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
var SLICE_COUNT_X =  32;
var TOTAL_COUNT = SLICE_COUNT_X * SLICE_COUNT_Y; 
var stars = [];
var starContainer = document.querySelector('#element-container');

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
    this.el.classList.remove('active');
    this.timer = null;
  }.bind(this);

  if (!this.active) {
    this.setActive(true);
    this.el.classList('checked', true);
    this.timer = window.setTimeout(reset, 500);
  }
  return this;
};

for(var i = 0; i < TOTAL_COUNT; i ++) {
  var star = document.createElement('span');
  star.innerText = '☆'; 
  starContainer.appendChild(star);
  stars.push(new Slice(star));
}


var diffy = Diffy.create({
  resolution: { x: SLICE_COUNT_X, y: SLICE_COUNT_Y },
  sensitivity: .2,
  threshold: 20,
  debug: false,
  containerClassName: 'my-diffy-container',
  sourceDimensions: { w: 130, h: 100 },
  onFrame: function (matrix) {
    var slice;
    var index;
    for(var i = 0; i < matrix.length; i++) {
      var column = matrix[i];
      var input;
      for(var j = 0; j < column.length; j ++) {
        index = SLICE_COUNT_X * j + i;
        slice = stars[index];
        if(matrix[i][j] < 180) {
          slice.react();
        }
      }
    }
  }
});

