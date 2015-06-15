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

    Demo.init = function() {
        // var container = document.getElementById('canvas-container');
        var container = document.createElement('div');
        container.style.position = "absolute";
        container.style.left = "800px";
        container.style.top = "0";
        document.body.appendChild(container);

        // some example engine options
        var options = {
            positionIterations: 6,
            velocityIterations: 4,
            enableSleeping: false,

            // width: 100,height:100
            render: {
                options: {
                   bounds: {
                        min: {x:0,y:0},
                        max: {x:200,y:600},
                    },
                    width: 200,
                    height: 600
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

        var poly = Bodies.polygon(40, 20, 5, Common.random(25, 50));
        World.add(_world, poly);

        var groupId = Matter.Body.nextGroupId();

        var ropeA = Matter.Composites.stack(100, 100, 5, 1, 10, 10, function(x, y, column, row) {
            return Bodies.rectangle(x, y, 50, 20, { groupId: groupId });
        });

        Matter.Composites.chain(ropeA, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2 });
        Matter.Composite.add(ropeA, Matter.Constraint.create({
            bodyB: ropeA.bodies[0],
            pointB: { x: -25, y: 0 },
            pointA: { x: 100, y: 100 },
            stiffness: 1
        }));

        World.add(_world, ropeA);


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

        // clear all scene events
        for (var i = 0; i < _sceneEvents.length; i++)
            Events.off(_engine, _sceneEvents[i]);
        _sceneEvents = [];

        // reset id pool
        Common._nextId = 0;

        // reset mouse offset and scale (only required for Demo.views)
        Mouse.setScale(_engine.input.mouse, { x: 1, y: 1 });
        Mouse.setOffset(_engine.input.mouse, { x: 0, y: 0 });

        _engine.enableSleeping = false;
        _engine.world.gravity.y = 1;
        _engine.world.gravity.x = 0;
        _engine.timing.timeScale = 1;

        var offset = 5;
        World.add(_world, [
            // Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
            Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
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