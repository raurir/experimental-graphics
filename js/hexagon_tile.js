var sw = 1000, sh = 1000;
var radiusOuter = 35, radiusInner = 36, angle60 = 2 * Math.PI / 6;

var graphics = dom.svg("svg", {width:sw, height:sh});
document.body.appendChild(graphics);
var scaler = dom.svg("g");
graphics.appendChild(scaler);

colours.setPalette(["#000044", "#000088", "#000033", "#000011", "#5CB9FC", "#ffffff"]);

var points = [];
for(var i = 0; i < 6; i++) {
  var angle = i * angle60;
  points[i] = (i === 0 ? "M" : "L") + (radiusInner * Math.cos(angle)) + "," + (radiusInner * Math.sin(angle));
}
points.push("Z");

var minHeight = radiusOuter * Math.sin(angle60); // this is edge to edge, not corner to corner.

var cols = Math.ceil(sw / radiusOuter / 3) + 1;
var rows = Math.ceil(sh / minHeight) + 1;

// cols -= 4;
// rows -= 4


var hexagons = cols * rows;
con.log(rows,cols, hexagons);

var hexs = [];

for(var i = 0; i < hexagons; i++) {

  var row = Math.floor(i / cols);
  var col = (i % cols);
  var x = col * radiusOuter * 3;
  if (row % 2 == 0) x += radiusOuter * 3 / 2;
  var y = row * minHeight;

  // x += 100;
  // y += 100;

  var group = dom.svg("g");
  group.setAttribute("transform", "translate(" + x + "," + y + ")")
  scaler.appendChild(group);


  // var something = cols * 2;

  // var colour;
  // if (row < 2) {
  //   colour = colours.getRandomColour();
  // } else {

  //   var siblings = [];
  //   if (col != 1) {
  //     siblings.push(hexs[i - cols]);
  //   }
  //   if (col < cols - 1) {
  //     siblings.push(hexs[i - (cols-1)]);
  //   }
  //   siblings.push(hexs[i - something]);

  //   colour = colours.mixColours(siblings);
  //   colour = colours.mutateColour(colour, 20);

  //   // colour = colours.mutateColour(hexs[i - something], 50);
  // }



  var hex = dom.svg("path", {
    "d": points.join(" ")
    // "style": { "fill": colour }
  });
  group.appendChild(hex);

  // var circle = dom.svg("circle", {
  //   "r": radiusInner * 0.5,
  //   "style": { "fill": colours.getNextColour() }
  // });
  // group.appendChild(circle);


  // var text = dom.svg("text", {
  //   "text-anchor": "middle",
  //   y: 5
  // });
  // text.innerHTML = [i,row,col].join(":");
  // group.appendChild(text);


  hexs[i] = {
    path: hex,
    x: x,
    y: y,
    colour: null,
    rendered: false
  };

}


function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

var randomHexes = shuffle(hexs.slice())//.sort(function(){ Math.random() > 0.5 ? -1 : 1});

var h = 0;
function render() {
  // var scale = 1;
  // var rotate = 0;
  // scaler.setAttribute("transform", "translate(400,400) rotate(" + rotate + ") scale(" + scale + ")");
  // scaler.setAttribute("transform", "translate(400,400) rotate(" + rotate + ") scale(" + scale + ")");
  //


  // for(var i = 0; i < randomHexes.length; i++) {
    // var item = randomHexes[i];
    // item.path.setAttribute("style", "fill:" + colours.getNextColour());
  // }

  if (h < hexagons) {
    var item = randomHexes[h];

    var close = [];
    for(var i = 0; i < hexagons; i++) {
      if (i != h) {
        var otherItem = randomHexes[i];
        // con.log(otherItem)
        if (otherItem.rendered) {

          var dx = item.x - otherItem.x,
            dy = item.y - otherItem.y,
            d = Math.sqrt(dx * dx + dy * dy);

            // con.log(item.x, otherItem.x)

            if (d < radiusOuter * 2) {
              close.push(otherItem.colour);
            }

        }
      }
    }



    var colour;
    if (close.length > 0 ) {
      // colour = colours.getNextColour();

      con.log("close", close.length)

      colour = colours.mixColours(close);
      colour = colours.mutateColour(colour, 30);

    } else {
      colour = colours.getNextColour();
    }



    item.path.setAttribute("style", "fill:" + colour);

    randomHexes[h].rendered = true;
    randomHexes[h].colour = colour;

    h++;
    requestAnimationFrame(render);
  }


}
render();