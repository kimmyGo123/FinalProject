//https://github.com/kittykatattack/learningPixi/blob/master/examples/12_keyboardMovement.html
"use strict";

//const u = require('umbrellajs');
//const axios = require('axios').default;

let songData = null;
let dataCount = null;
let pointCount = 0;
let instructions;
// ALEXIA SAYS GET GITIGNORE
u(document.getElementById('playlist')).on('click', function(){
    let a = axios.create({baseURL : 'https://api.spotify.com',
                            headers: {
                                Authorization: 'Bearer ' + document.cookie.split('=')[1]
                                
                            }
                           })
    
    //GET https://api.spotify.com/v1/playlists/{playlist_id}

    //NOTE: looking for GET https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}? Read the blog post.

    //console.log(document.cookie.split('='));
    a.get('/v1/me').then(function (response){
        let userID = response.data.id;
        let playlistID = null;
        let songID = null;
        let song = null;
        a.get("/v1/users/" + userID + "/playlists").then(function(response){
           // console.log(response.data.items[0]);
             playlistID = response.data.items[0].id;
            // console.log(playlistID);
          
          
            document.getElementById('spotifyThing').src = "https://open.spotify.com/embed/playlist/" +playlistID;

            a.get('/v1/playlists/' + playlistID + "/tracks").then(function(response){
                 var randomNumber =Math.floor(Math.random() * response.data.items.length)
                //console.log(response.data.items);
                 //console.log(randomNumber);

                  song = response.data.items[randomNumber];
                 // console.log(song);

                 songID = song.track.id;
                 let songName = song.track.name;
                //console.log(response.data.items[randomNumber].track.id);
                document.getElementById('p1').innerHTML = `You're dancing to: ${songName}`;
          
            
               
                a.get('/v1/audio-analysis/' + songID).then(function(response){
                //   songData = response.data.beats;
                songData = response.data.segments;
                  //  dataCount = songData.length;
                  dataCount = songData.length;
                  console.log(songData);
                  console.log(dataCount);
               //   console.log(dataCount);

                })
            })
          
            //https://api.spotify.com/v1/audio-features/{id}
          

        })
      
        
        //https://api.spotify.com/v1/playlists/{playlist_id}/tracks
        
    })
   
 });


        let fences = [];

        let collectedFoods = 0;
        //Aliases
        let Application = PIXI.Application,
        
            Container = PIXI.Container,
            loader = PIXI.loader,
            resources = PIXI.loader.resources,
            TextureCache = PIXI.utils.TextureCache,
            Sprite = PIXI.Sprite;
            backgroundColor :0x061639;

        //Create a Pixi Application
        let app = new Application({
            width: 700,
            height: 500,
            antialiasing: true,
            transparent: false,
            resolution: 1

        });
        Application.backgroundColor=0x061639;

        let jump = false;
        let foods = [];
        let song; 
        //Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(app.view);
        loader
            .add("media/cow.png")
            .add("media/Unknown.png")
            .add("media/spotcow.png")
            .load(setup);
        //Define any variables that are used in more than one function
        let cow, state;
function createLabelsAndButtons(){
    let textStyle = new PIXI.TextStyle({
        fill: 0XFFFFFF, 
        fontSize:18, 
        fontFamily: "Futura", 
        stroke: 0xFF0000,
        strokeThickness:4
        
    });
    pointCount = new PIXI.Text();
    pointCount.style = textStyle;
    pointCount.x = 5;
    pointCount.y = 5;
    app.stage.addChild(pointCount);

    instructions = new PIXI.Text();
    instructions. style = textStyle;
    instructions.x = 5;
    pointCount.y = 20;
    app.stage.addChild(instructions);
    instructions.text = "hit the space bar and right arrow key to watch him zoom!";
}
        function setup() {
            createLabelsAndButtons();
            for (let i = 0; i < 4; i++) {
                foods.push(new Food());
                foods[i].spawnRandom();
                app.stage.addChild(foods[i]);

            }
            for (let i = 0; i < 24; i++) {
                fences.push(new Fence());
                fences[i].x = i * 30;
                fences[i].y = Math.floor(Math.random() * 10) + 400;
                app.stage.addChild(fences[i]);

            }
            cow = new Cow(); 
            cow.y = 350;
            cow.x = 10;
      
            app.stage.addChild(cow);
         //   console.log(cow.getBounds());

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
               // cow.reflectX(); // eventually I'll change this to a state system so it doesnt switch on every key press.
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
                  let test = c.getBounds().top;
                 // console.log(cow.getBounds());
                    cow.y = test-25;
                    cow.OnPlat = true;
                    //  }
                }

            }
            for (let c of foods) {
                if (rectsIntersect(cow, c)) {
                    if(!c.isCollided){
                        collectedFoods++;
                        console.log(collectedFoods);
                        let value = c;
                        c.isCollided = true;
                        console.log(cow.getBounds());
                        foods = foods.filter(item => item !== value)
                        app.stage.removeChild(c);


                    }
               
                }
            }
            pointCount.text = collectedFoods;


            if (cow.x > 700) {
                for(let i = 0; i < 8; i++){
                    foods.push(new Food());
                    foods[i].spawnRandom();
                    console.log(foods.length);
                    app.stage.addChild(foods[i]);
                }
                for (let c of fences) {

                   // console.log(Math.floor(Math.random() * dataCount));

                  //  c.UpdateHeight([Math.floor(Math.random() * songData[dataCount]) + 1]);
                  let testinggg = songData[Math.floor(Math.random() * dataCount)].pitches.length;
                //  console.log(testinggg);
                    c.UpdateHeight(songData[Math.floor(Math.random() * dataCount)].pitches[Math.floor(Math.random() * testinggg)] * 200);
             //      console.log(songData[Math.floor(Math.random() * dataCount -1)] + 2);
                }

                cow.x = 0;
                
               
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
        document.querySelector(".content").appendChild(app.view);
