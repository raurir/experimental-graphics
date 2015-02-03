var radiusOuter = 5, radiusInner = 4.9, angle60 = 2 * Math.PI / 6;

var graphics = dom.svg("svg", {width:600,height:600});
document.body.appendChild(graphics);
var scaler = dom.svg("g");
graphics.appendChild(scaler);

var points = [];
for(var i = 0; i < 6; i++) {
  var angle = i * angle60;
  points[i] = (i === 0 ? "M" : "L") + (radiusInner * Math.cos(angle)) + "," + (radiusInner * Math.sin(angle));
}
points.push("Z");

for(var i = 0; i < 500; i++) {

  var cols = 10;
  var row = Math.floor(i/cols);
  var x = (cols / -2 + i%cols) * radiusOuter * 3;
  if (row % 2 == 0) x += radiusOuter * 3/2
  var y = row * radiusOuter * Math.sin(angle60);

  var group = dom.svg("g");
  group.setAttribute("transform", "translate(" + x + "," + y + ")")
  scaler.appendChild(group);

  var hex = dom.svg("path", {
    "d": points.join(" "),
    "style": { "fill": colours.getRandomColour() }
  });
  group.appendChild(hex);

  var circle = dom.svg("circle", {
    "r": radiusInner * 0.5,
    "style": { "fill": colours.getNextColour() }
  });
  group.appendChild(circle);

}

scaler.setAttribute("transform", "scale(10)");

function render() {
  var scale = 1;
  var rotate = 0;
  scaler.setAttribute("transform", "translate(400,400) rotate(" + rotate + ") scale(" + scale + ")");
  // requestAnimationFrame(render);
}