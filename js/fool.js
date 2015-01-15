var sw = window.innerWidth, sh = window.innerHeight;

var container = dom.element("div",{className:"container", style:{width:sw+"px",height:sh+"px"}})
var nav = dom.element("div",{innerHTML:"Hello World!", className:"nav open"});
var navTab = dom.element("div",{className:"tab"});
var navIcon = dom.element("ul",{className:"icon", innerHTML:["first","second","third"].map(function(a,i) { return "<li class='" + a + "'></li>"; }).join("") });
var space = dom.element("div",{innerHTML:"Hello World!", className:"space"});

container.appendChild(nav);
nav.appendChild(navTab);
navTab.appendChild(navIcon);
container.appendChild(space);
document.body.appendChild(container);

var navOpen = false;
nav.addEventListener("click", function() {
  navOpen = !navOpen;
  nav.className = navOpen? "nav open" : "nav";
})


// hamburger: http://codepen.io/trvr/pen/wFzkv?editors=110