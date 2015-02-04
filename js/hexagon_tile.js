var sw = 600, sh = 600;
var radiusOuter = 35, radiusInner = 35, angle60 = 2 * Math.PI / 6;

var graphics = dom.svg("svg", {width:sw, height:sh});
document.body.appendChild(graphics);
var scaler = dom.svg("g");
graphics.appendChild(scaler);

var points = [];
for(var i = 0; i < 6; i++) {
  var angle = i * angle60;
  points[i] = (i === 0 ? "M" : "L") + (radiusInner * Math.cos(angle)) + "," + (radiusInner * Math.sin(angle));
}
points.push("Z");

var minHeight = radiusOuter * Math.sin(angle60); // this is edge to edge, not corner to corner.

var cols = Math.ceil(sw / radiusOuter / 3) + 1;
var rows = Math.ceil(sh / minHeight) + 1;

cols -= 4;
rows -= 4

con.log(rows,cols)

var hexagons = cols * rows;

var hexs = [];

for(var i = 0; i < hexagons; i++) {

  var row = Math.floor(i / cols);
  var col = (i % cols);
  var x = col * radiusOuter * 3;
  if (row % 2 == 0) x += radiusOuter * 3 / 2;
  var y = row * minHeight;

  x += 100;
  y += 100;

  var group = dom.svg("g");
  group.setAttribute("transform", "translate(" + x + "," + y + ")")
  scaler.appendChild(group);


  var something = cols * 2;

  var colour;
  if (row < 2) {
    colour = colours.getRandomColour();
  } else {

    var siblings = [];
    if (col != 1) {
      siblings.push(hexs[i - cols]);
    }
    if (col < cols - 1) {
      siblings.push(hexs[i - (cols-1)]);
    }
    siblings.push(hexs[i - something]);

    colour = colours.mixColours(siblings);
    colour = colours.mutateColour(colour, 20);

    // colour = colours.mutateColour(hexs[i - something], 50);
  }



  var hex = dom.svg("path", {
    "d": points.join(" "),
    "style": { "fill": colour }
  });
  group.appendChild(hex);

  // var circle = dom.svg("circle", {
  //   "r": radiusInner * 0.5,
  //   "style": { "fill": colours.getNextColour() }
  // });
  // group.appendChild(circle);


  var text = dom.svg("text", {
    "text-anchor": "middle",
    y: 5
  });
  text.innerHTML = [i,row,col].join(":");
  group.appendChild(text);

  hexs[i] = colour;

}

function render() {
  var scale = 1;
  var rotate = 0;
  // scaler.setAttribute("transform", "translate(400,400) rotate(" + rotate + ") scale(" + scale + ")");
  // scaler.setAttribute("transform", "translate(400,400) rotate(" + rotate + ") scale(" + scale + ")");
  // requestAnimationFrame(render);
}
render();