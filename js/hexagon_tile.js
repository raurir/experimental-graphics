(function() {
var size = 1,

  sw = size,
  sh = size,

  angle60 = 2 * Math.PI / 6,
  radiusOuter,
  strokeSize,
  radiusInner,
  smoothSize,
  randomHexes,
  stage,
  inner,
  hexagons,
  hexs,

  batchSize = 1000, 
  batches, 
  currentBatch = 0;

var stage = dom.svg("svg", {width:sw, height:sh});
var inner = dom.svg("g");
stage.appendChild(inner);

function reset() {
  document.body.removeEventListener("click", reset);
  con.log("click reset");

  dispatchEvent(new Event("render:start"));

  // size = 0.1 + Math.random();

  radiusOuter = (5 + Math.random() * 25) / 1000;
  strokeSize = (Math.random() * Math.random() * Math.random() * radiusOuter);
  radiusInner = (radiusOuter - strokeSize + (strokeSize * 0.01));
  smoothSize = (0.01 + Math.random() * 10);

  while (inner.firstChild) inner.removeChild(inner.firstChild);

  // var neighbourGroups = dom.svg("g");
  // stage.appendChild(neighbourGroups);

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

  var cols = Math.ceil(1 / radiusOuter / 3) + 1;
  var rows = Math.ceil(1 / minHeight) + 1;
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
    inner.appendChild(group);


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







function batch() {
  var loopStart = currentBatch * batchSize,
    loopEnd = loopStart + batchSize;
  if (loopEnd > hexagons) loopEnd = hexagons;
  for(var h = loopStart; h < loopEnd; h++) {

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
  // con.log("doing batch", currentBatch, batches);

  currentBatch++;
  if (currentBatch == batches) {
    dispatchEvent(new Event("render:complete"));
    document.body.addEventListener("click", reset);
    resize();
  } else {
    dispatchEvent(new CustomEvent("render:progress", {"detail": currentBatch / batches}));
    resize();
    // requestAnimationFrame(batch);
    setTimeout(batch,200);
  }

}

function render() {
  batches = Math.ceil(hexagons / batchSize);
  currentBatch = 0;
  batch();
  
}

function resize(sw,sh) {
  con.log("resize! hex");
  // if (!sw || !sh) return;
  sw = window.innerWidth;
  sh = window.innerHeight; 
  stage.setSize(sw,sh);

  var largestDimension = sw > sh ? sw : sh;
  var scale = largestDimension / size;
  var x = 0, y = 0;
  if (sw < sh) {
    x = -((scale * size) - sw) / 2;
  } else {
    y = -((scale * size) - sh) / 2;
  }

  inner.setAttribute("transform", "translate(" + x + "," + y + ") scale(" + scale + ")");

}
window.addEventListener("resize", resize);




var hexagon_tile = {
  stage: stage,
  inner: inner,
  resize: resize,
  init: reset,
  kill: function() {}
}

// dispatchEvent(new CustomEvent("render:progress", {"detail": 0.4}));

dispatchEvent(new CustomEvent("load:complete", {detail:hexagon_tile}));





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


})();


