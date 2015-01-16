var sw = window.innerWidth, sh = window.innerHeight;

var container = dom.element("div",{className:"container", style:{width:sw+"px",height:sh+"px"}});
var nav = dom.element("div",{className:"nav"});
var navMenu = dom.element("div",{className:"menu"});
var navTab = dom.element("div",{className:"tab"});
var navIcon = dom.element("ul",{className:"icon", innerHTML:["first","second","third"].map(function(a,i) { return "<li class='" + a + "'></li>"; }).join("") });
var space = dom.element("div",{innerHTML:"Hello World!", className:"space"});

container.appendChild(nav);
nav.appendChild(navTab);
nav.appendChild(navMenu);
navTab.appendChild(navIcon);
container.appendChild(space);
document.body.appendChild(container);

var navOpen = false;
nav.addEventListener("click", function() {
  navOpen = !navOpen;
  nav.className = "nav" + (navOpen ? " open" : "");
});

var options = [
  {label:"Hello"},
  {label:"World"}
];

for (var i = 0; i < options.length; i++) {
  var option = options[i];
  var button = dom.element("div", {className:"option", innerHTML:option.label});
  navMenu.appendChild(button);
};

window.addEventListener("resize", function() {
  sw = window.innerWidth;
  sh = window.innerHeight;
  // render();
  container.setSize(sw,sh)
});



// hamburger: http://codepen.io/trvr/pen/wFzkv?editors=110