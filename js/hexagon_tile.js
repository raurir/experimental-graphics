var size = 100,

  sw = size,
  sh = size,

  angle60 = 2 * Math.PI / 6,
  radiusOuter,
  strokeSize,
  radiusInner,
  smoothSize,
  randomHexes,
  graphics,
  scaler,
  hexagons,
  hexs;

function reset() {

  size = 100 + Math.random() * 1000;

  radiusOuter = 5 + Math.random() * 25;
  strokeSize = Math.random() * Math.random() * Math.random() * radiusOuter;
  radiusInner = radiusOuter - strokeSize + 0.3;
  smoothSize = 1 + Math.random() * 20;



  if (graphics) document.body.removeChild(graphics);

  graphics = dom.svg("svg", {width:sw, height:sh});
  document.body.appendChild(graphics);
  scaler = dom.svg("g");
  graphics.appendChild(scaler);

  var neighbourGroups = dom.svg("g");
  graphics.appendChild(neighbourGroups);

  // colours.setPalette(["#000044", "#000088", "#000033", "#000011", "#5CB9FC", "#ffffff"]);
  // colours.setPalette(["#ff2244", "#ff3322"]);

  document.body.setAttribute("style", "background-color:" + colours.getNextColour());

  var points = [];
  for(var i = 0; i < 6; i++) {
    var angle = i * angle60;
    points[i] = (i === 0 ? "M" : "L") + (radiusInner * Math.cos(angle)) + "," + (radiusInner * Math.sin(angle));
  }
  points.push("Z");

  var minHeight = radiusOuter * Math.sin(angle60); // this is edge to edge, not corner to corner.

  var cols = Math.ceil(size / radiusOuter / 3) + 1;
  var rows = Math.ceil(size / minHeight) + 1;
  // cols -= 3;
  // rows -= 6;
  hexagons = cols * rows;
  // con.log(rows,cols, hexagons);

  hexs = [];

  for(var i = 0; i < hexagons; i++) {

    var row = Math.floor(i / cols);
    var second = (row % 2 == 0);
    var col = (i % cols) + (second ? 0.5 : 0);
    var x = col * radiusOuter * 3;
    var y = row * minHeight;

    // x += 100;
    // y += 100;

    var group = dom.svg("g");
    group.setAttribute("transform", "translate(" + x + "," + y + ")");
    scaler.appendChild(group);


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
    // text.innerHTML = i + "(" + col + "," + row + ")";
    // group.appendChild(text);


    var neighbours = [];
    if (row > 1) neighbours.push(i - 6); // T
    if (second) {
      if (col > 0) {
        if (row > 1) neighbours.push(i - 3); // TL
        if (row < rows - 1) neighbours.push(i + 3); // BL
      }
      if (col < cols - 1) {
        if (row > 1) neighbours.push(i - 2); // TR
        if (row < rows - 1) neighbours.push(i + 4); // BR
      }
    } else {
      if (col > 0) {
        if (row > 0.5) neighbours.push(i - 4); // TL
        if (row < rows - 2) neighbours.push(i + 2); // BL
      }
      if (col < cols) {
        if (row > 0.5) neighbours.push(i - 3); // TR
        if (row < rows - 2) neighbours.push(i + 3); // BR
      }
    }
    if (row < rows - 2) neighbours.push(i + 6); // B

    /*
    group.index = i;
    group.addEventListener("mouseover", function() {
      con.log(this.index, hexs[this.index].neighbours);
      var neighbours = hexs[this.index].neighbours;
      for (var j = 0; j < neighbours.length; j++) {
        var neighbour = hexs[neighbours[j]];
        var circle = dom.svg("circle", {
          "transform": "translate(" + neighbour.x + "," + neighbour.y + ")",
          // x: neighbour.x,
          // y: neighbour.y,
          "r": radiusInner * 1,
          "style": { "fill": "black" }
        });
        neighbourGroups.appendChild(circle);
      };
    });

    group.addEventListener("mouseout", function() {
      var svg = neighbourGroups;
      while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
      }
    });
    */


    hexs[i] = {
      index: i,
      path: hex,
      x: x,
      y: y,
      colour: null,
      rendered: false,
      neighbours: neighbours
    };

  }
  randomHexes = shuffle(hexs.slice());

  render();
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function render() {
  for(var h = 0; h < hexagons; h++) {

    var index = randomHexes[h].index;
    var item = hexs[index];


    // var neighbours = [];
    // for(var i = 0; i < item.neighbours.length; i++) {
    //   var otherItemIndex = item.neighbours[i];
    //   // con.log(otherItemIndex);
    //   var otherItem = hexs[otherItemIndex];
    //   if (otherItem.rendered) {
    //     neighbours.push(otherItem.colour);
    //   }
    // }


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

            if (d < radiusOuter * smoothSize) {
              close.push(otherItem.colour);
            }

        }
      }
    }

    // con.log(neighbours.length,close.length);
    var colour;
    if (close.length > 0 ) {
      colour = colours.mixColours(close);
      // colour = colours.mutateColour(colour, 3);
    } else {
      colour = colours.getNextColour();
    }


    item.path.setAttribute("style", "fill:" + colour);

    hexs[index].rendered = true;
    hexs[index].colour = colour;

  }

  resize();
}

function resize() {
  sw = window.innerWidth;
  sh = window.innerHeight;
  graphics.setSize(sw,sh);

  var largestDimension = sw > sh ? sw : sh;
  var scale = largestDimension / size;
  var x = 0, y = 0;
  if (sw < sh) {
    x = -((scale * size) - sw) / 2;
  } else {
    y = -((scale * size) - sh) / 2;
  }

  scaler.setAttribute("transform", "translate(" + x + "," + y + ") scale(" + scale + ")");

}

document.body.addEventListener("click", reset);
window.addEventListener("resize", resize);
reset();






/*

for(var h = 0; h < hexagons; h++) {
  var item = randomHexes[h];

  var close = [];
  // con.log(item.neighbours);
  for(var i = 0; i < item.neighbours.length; i++) {
    var otherItem = hexs[item.neighbours[i]];
    // con.log(otherItem);
    if (otherItem.rendered) {
      close.push(otherItem.colour);
    }
  }

  con.log(close);

  var colour;
  if (close.length > 0 ) {
    colour = colours.mixColours(close);
    colour = colours.mutateColour(colour, 10);
  } else {
    colour = colours.getNextColour();
  }

  item.path.setAttribute("style", "fill:" + colour);

  randomHexes[h].rendered = true;
  randomHexes[h].colour = colour;
}

*/




