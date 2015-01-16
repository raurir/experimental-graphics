var sw = window.innerWidth, sh = window.innerHeight;

var container = dom.element("div",{className:"container", style:{width:sw+"px",height:sh+"px"}});
var nav = dom.element("div",{className:"nav"});
var navMenu = dom.element("div",{className:"menu"});
var navTab = dom.element("div",{className:"tab"});
var navIcon = dom.element("ul",{className:"icon", innerHTML:["first","second","third"].map(function(a,i) { return "<li class='" + a + "'></li>"; }).join("") });
var space = dom.element("div",{innerHTML:"Hello World!", className:"space"});

container.appendChild(nav);
nav.appendChild(navMenu);
nav.appendChild(navTab);
navTab.appendChild(navIcon);
container.appendChild(space);
document.body.appendChild(container);

var navOpen = false;
navTab.addEventListener("click", function() {
  navOpen = !navOpen;
  nav.className = "nav" + (navOpen ? " open" : "");
});

var options = [
  {
    label:"Hello",
    items: [
      {
        label:"A"
      },{
        label:"B"
      }
    ]
  },
  {
    label:"World"
  },{
    label:"There",
    items: [
      {
        label:"May or"
      },{
        label:"May not"
      },{
        label:"Exist"
      },{
        label:"A"
      },{
        label:"Situation"
      }
    ]
  },{
    label:"Is",
    items: [
      {
        label:"A Computer"
      },{
        label:"Behind you"
      }
    ]
  },
];

function createOption(option) {
  var main = dom.element("div", {className:"main"});
  var button = dom.element("div", {className:"option", innerHTML:option.label});
  navMenu.appendChild(main);
  main.appendChild(button);
  if (option.items) {
    var suboptions = dom.element("div", {className:"sub-options"});
    main.appendChild(suboptions);
    for (var j = 0; j < option.items.length; j++) {
      var suboption = option.items[j];
      var sub = dom.element("div", {className:"sub-option", innerHTML:suboption.label});
      suboptions.appendChild(sub);
    }
    button.addEventListener("click", function(e) {
      if (lastSub) lastSub.style.height = 0;
      suboptions.style.height = option.items.length * 20 + "px";
      lastSub = suboptions;

      navMenu.style.marginTop = (option.items.length + options.length) / 2 * -20 + "px";

    });
  } else {
    button.addEventListener("click", function(e) {

      navMenu.style.marginTop = (options.length) / 2 * -20 + "px";

      if (lastSub) {
        lastSub.style.height = 0;
        lastSub = null;
      }
      // con.log("ok")
    });
  }
}

var lastSub = null;
for (var i = 0; i < options.length; i++) {
  createOption(options[i]);
};

window.addEventListener("resize", function() {
  sw = window.innerWidth;
  sh = window.innerHeight;
  // render();
  container.setSize(sw,sh)
});



// hamburger: http://codepen.io/trvr/pen/wFzkv?editors=110