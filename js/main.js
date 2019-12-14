//https://github.com/kittykatattack/learningPixi/blob/master/examples/12_keyboardMovement.html
"use strict";

        let fences = [];

        let collectedFoods = [];
        //Aliases
        let Application = PIXI.Application,
            Container = PIXI.Container,
            loader = PIXI.loader,
            resources = PIXI.loader.resources,
            TextureCache = PIXI.utils.TextureCache,
            Sprite = PIXI.Sprite;
        //Create a Pixi Application
        let app = new Application({
            width: 500,
            height: 500,
            antialiasing: true,
            transparent: false,
            resolution: 1
        });
        let jump = false;
        let foods = [];

        let song; 
        //Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(app.view);
        loader
            .add("images/cow.png")
            .add("images/tempfence.jpg")
            .add("images/move.png")
            .load(setup);
        //Define any variables that are used in more than one function
        let cow, state;

        function setup() {
            for (let i = 0; i < 4; i++) {
                foods.push(new Food());
                foods[i].spawnRandom();
                console.log(foods[i].y);
                app.stage.addChild(foods[i]);

            }
            for (let i = 0; i < 20; i++) {
                fences.push(new Fence());
                fences[i].x = i * 30;
                fences[i].y = Math.floor(Math.random() * 10) + 400;
                app.stage.addChild(fences[i]);

            }
            cow = new Cow(); 
            cow.y = 350;
            cow.x = 10;
      
            app.stage.addChild(cow);
            console.log(cow.getBounds());

            //Capture the keyboard arrow keys
            let up = keyboard(38),
                right = keyboard(39),
                jump = keyboard(32),
                music = keyboard(73), // test purposes
                down = keyboard(40);

            //Up
            up.press = () => {
                cow.vy = -5;
                cow.vx = 0;

            };
            up.release = () => {
                if (/*!down.isDown && */cow.vx === 0) {
                    cow.vy = 0;
                }
            };
            //Right
            right.press = () => {
                cow.reflectX(); // eventually I'll change this to a state system so it doesnt switch on every key press.
                cow.vx = 5;
                cow.vy = 0;

            };
            right.release = () => {
                if (cow.vy === 0) {
                    cow.vx = 0;
                }
            };
            music.press = () => {
               // song.play();
            };
            music.release = () => {

            };
            jump.press = () => {
                // console.log("tut");
                cow.vy -= 10;
                jump = true;
                if (jump) {
                    for (let i = 1; i < 10; i++) {
                        cow.vy += 1 / i;
                    }
                    jump = false;

                }

            };
            jump.release = () => {
                //   console.log("test")
                cow.y = 10;
                cow.vy = 10;
                jump = false;


            };
            //Down FOR DEBUGGING ONLY
            down.press = () => {
                cow.vy = 5;
                cow.vx = 0;
            };
            down.release = () => {
                if (!up.isDown && cow.vx === 0) {
                    cow.vy = 0;
                }
            };

            //Set the game state
            state = mooove;

            app.ticker.add(delta => gameLoop(delta));
        
        }

        function gameLoop(delta) {
            //Update the current game state:
            for (let c of fences) {
                if (rectsIntersect(cow, c)) {
                    cow.stick = true;
                    cow.y = c.getBounds().top -25;
                    cow.OnPlat = true;
                    //  }
                }

            }
            for (let c of foods) {
                if (rectsIntersect(cow, c)) {
                    collectedFoods.push(c);
                    c.interactve = false;
                }
            }
            if (cow.x > 500) {
                for (let c of fences) {
                    c.UpdateHeight();

                }

                cow.x = 0;

                for (let c of foods) {
                    c.spawnRandom();

                }
            }

            if (cow.x <= 0) {

                cow.x = 20;
            }

            state(delta);
        }

        function mooove(delta) {
            cow.x += cow.vx;
            cow.y += cow.vy
        }
        //The `keyboard` helper function
        function keyboard(keyCode) {
            var key = {};
            key.code = keyCode;
            key.isDown = false;
            key.isUp = true;

            key.press = undefined;
            key.release = undefined;
            //The `downHandler`
            key.downHandler = event => {
                if (event.keyCode === key.code) {
                    if (key.isUp && key.press) key.press();
                    key.isDown = true;
                    key.isUp = false;
                }
                event.preventDefault();
            };
            key.upHandler = event => {
                if (event.keyCode === key.code) {
                    if (key.isDown && key.release) key.release();
                    key.isDown = false;
                    key.isUp = true;
                }
                event.preventDefault();
            };

            //Attach event listeners
            window.addEventListener(
                "keydown", key.downHandler.bind(key), false
            );

            window.addEventListener(
                "keyup", key.upHandler.bind(key), false
            );
            return key;
        }
