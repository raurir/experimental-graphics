var running_man_physics = function() {

    // Matter aliases
    var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Composites = Matter.Composites,
        Common = Matter.Common,
        Events = Matter.Events,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse;

    var Demo = {};

    var _engine,
        _mouseConstraint,
        _sceneEvents = []

    // initialise the demo

    var sw = 300, sh = 400;
    var output;

    Demo.init = function() {
        // var container = document.getElementById('canvas-container');
        var container = document.createElement('div');
        container.style.position = "absolute";
        container.style.left = "500px";
        container.style.top = "0";
        document.body.appendChild(container);
        output = document.createElement('div');
        output.style.position = "absolute";
        output.style.left = "500px";
        output.style.top = "0";
        output.style.color = "white";
        document.body.appendChild(output);

        // some example engine options
        var options = {
            positionIterations: 6,
            velocityIterations: 4,
            enableSleeping: false,

            // width: 100,height:100
            render: {
                options: {
                   bounds: {
                        min: {x: 0, y: 0},
                        max: {x: sw, y: sh},
                    },
                    width: sw,
                    height: sh
                }
            }
        };

        // create a Matter engine
        // NOTE: this is actually Matter.Engine.create(), see the aliases at top of this file
        _engine = Engine.create(container, options);

        // add a mouse controlled constraint
        _mouseConstraint = MouseConstraint.create(_engine);
        World.add(_engine.world, _mouseConstraint);

        // run the engine
        Engine.run(_engine);

        // set up a scene with bodies
        Demo.mixed();

    };

    // each demo scene is set up in its own function, see below

    Demo.mixed = function() {
        var _world = _engine.world;

        Demo.reset();

        // var stack = Composites.stack(20, 20, 15, 4, 0, 0, function(x, y, column, row) {
        //     var sides = Math.round(Common.random(1, 8));

        //     // round the edges of some bodies
        //     var chamfer = null;
        //     if (sides > 2 && Math.random() > 0.7) {
        //         chamfer = {
        //             radius: 10
        //         };
        //     }

        //     switch (Math.round(Common.random(0, 1))) {
        //     case 0:
        //         if (Math.random() < 0.8) {
        //             return Bodies.rectangle(x, y, Common.random(25, 50), Common.random(25, 50), { chamfer: chamfer });
        //         } else {
        //             return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(25, 30), { chamfer: chamfer });
        //         }
        //         break;
        //     case 1:
        //         return Bodies.polygon(x, y, sides, Common.random(25, 50), { chamfer: chamfer });
        //     }
        // });

        // World.add(_world, stack);

        // var poly = Bodies.polygon(40, 20, 5, Common.random(25, 50));
        // World.add(_world, poly);


        var groupId = Matter.Body.nextGroupId();

        // var ropeA = Matter.Composites.stack(sw / 2, 100, 3, 1, 0, 0, function(x, y, column, row) {
        //     return Bodies.rectangle(x, y, 50, 20, { groupId: groupId });
        // });

        /*
        var ship = Body.create({
         position: {
           x: 400,
           y: 300
         },
         vertices: [
           {x: 0, y: shipHeight},
           {x: shipWidth / 2, y: 0},
           {x: shipWidth, y: shipHeight}
         ]
        });
        */


        var hips = Matter.Composite.create();

        Matter.Body.translate(hips, {x:20,y:10});


        var torso = Bodies.rectangle(sw / 2, 50, 20, 20, {inertia: 0});


        var legleft = Matter.Composite.create();
        var thighleft = Bodies.rectangle(sw / 2, 100, 50, 5, {inertia: Infinity});
        var calfleft = Bodies.rectangle(sw / 2 + 50, 100, 50, 5, {inertia: Infinity});

        var legright = Matter.Composite.create();
        var thighright = Bodies.rectangle(sw / 2, 100, 50, 5, {inertia: Infinity});
        var calfright = Bodies.rectangle(sw / 2 + 50, 100, 50, 5, {inertia: Infinity});


        Matter.Composite.add(hips, torso);
        Matter.Composite.add(hips, legleft);
        Matter.Composite.add(hips, legright);

        Matter.Composite.add(legleft, thighleft);
        Matter.Composite.add(legleft, calfleft);

        Matter.Composite.add(legright, thighright);
        Matter.Composite.add(legright, calfright);

        Matter.Composites.chain(legleft, 0.5, 0, -0.5, 0, { stiffness: 0.1, length: 1});
        Matter.Composites.chain(legright, 0.5, 0, -0.5, 0, { stiffness: 0.1, length: 1});

        // Matter.Composite.add(hips, Matter.Constraint.create({
        //     bodyB: hips.bodies[0],
        //     // pointB: { x: -25, y: 0 },
        //     // pointA: { x: sw / 2, y: 100 },
        //     stiffness: 1
        // }));

        Matter.Composite.add(hips, Matter.Constraint.create({
            bodyA: torso,
            bodyB: thighleft,
            // pointB: { x: -25, y: 0 },
            // pointA: { x: sw / 2, y: 100 },
            stiffness: 1
        }));

        Matter.Composite.add(hips, Matter.Constraint.create({
            bodyA: torso,
            bodyB: thighright,
            // pointB: { x: -25, y: 0 },
            // pointA: { x: sw / 2, y: 100 },
            stiffness: 1
        }));



        World.add(_world, hips);





        // World.add(_world, legright);

        // groupId = Matter.Body.nextGroupId();

        // var leg = Bodies.rectangle(sw / 2, 0, 50, 10, { groupId: groupId });
        // World.add(_world, leg);


        // setInterval(function() {
        //     Matter.Body.applyForce(leg, {x: sw / 2, y: sh}, {x: 0, y: -0.01})
        // }, 1000);

        /*
        var t = 0;
        setInterval(function() {
            t++;
            Matter.Body.rotate(thighleft, Math.sin(t / 10) * 0.05);
            Matter.Body.rotate(calfleft, Math.sin(Math.PI + t / 10) * 0.05);

            Matter.Body.rotate(thighright, Math.sin(t / 10) * 0.05);
            Matter.Body.rotate(calfright, Math.sin(Math.PI + t / 10) * 0.05);

            output.innerHTML = Math.sin(t / 10) * 0.05
        }, 40);
        */


        var renderOptions = _engine.render.options;
    };

    Demo.reset = function() {
        var _world = _engine.world;


        World.clear(_world);
        Engine.clear(_engine);

        // clear scene graph (if defined in controller)
        var renderController = _engine.render.controller;
        if (renderController.clear)
            renderController.clear(_engine.render);

        // reset id pool
        Common._nextId = 0;

        // reset mouse offset and scale (only required for Demo.views)
        Mouse.setScale(_engine.input.mouse, { x: 1, y: 1 });
        Mouse.setOffset(_engine.input.mouse, { x: 0, y: 0 });

        _engine.enableSleeping = false;
        _engine.world.gravity.y = 0;//1;
        _engine.world.gravity.x = 0;
        _engine.timing.timeScale = 1;

        var offset = 5;
        World.add(_world, [
            // Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
            Bodies.rectangle(sw/2, sh + offset, sw + 0.5 + 2 * offset, 50.5, { isStatic: true }),
            // Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true }),
            // Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true })
        ]);

        _mouseConstraint = MouseConstraint.create(_engine);
        World.add(_world, _mouseConstraint);

        con.log("renderOptions", _engine.render.options)

        var renderOptions = _engine.render.options;
        renderOptions.wireframes = true;
        renderOptions.hasBounds = false;
        renderOptions.showDebug = false;
        renderOptions.showBroadphase = false;
        renderOptions.showBounds = false;
        renderOptions.showVelocity = false;
        renderOptions.showCollisions = false;
        renderOptions.showAxes = false;
        renderOptions.showPositions = false;
        renderOptions.showAngleIndicator = true;
        renderOptions.showIds = false;
        renderOptions.showShadows = false;
        renderOptions.background = '#fff';

    };

    return {
        init: Demo.init
    }

};