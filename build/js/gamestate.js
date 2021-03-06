var gamestate = (function(){

	var stage;
	var gameLayer,
		skyLayer,
		cloudLayer,
		guiLayer;
	var playerHat;
	var deathCalled = false;

	var player,
		metronomeArrow,
		groundObject;

	var gravity = 10,
		speed = 5;

	var metronomeDirection = 1;

	var KEY = {
		A:65,
		F:70,
		T:84,
	};
	
	var changedAnim = false;
	var currentAnim = "good";
	
	var fKeyDown = false;
	var aKeyDown = false;
	var tKeyDown = false;
	
	var badKeyDown = false;
	
	var fKeyInit = false;
	var aKeyInit = false;
	var tKeyInit = false;
	
	var fKeyPressedOnce = false;

	//Game Variables
	var heartRate = 50,
		threshold = 15,
		angle = 176,
		angleMode = "increase";
	
	var maxBPM = 250;
	var angleInc = 1;
	var combo = 0;
    var mySnd;
    
    var missed = true;

	function init(){
		$("#heartAttack").css("opacity", "0");
		deathCalled = false;
		$("#howToPlayButton").css("display", "none");
		mySnd = new buzz.sound("./sounds/runningsong", {
			formats: [ "mp3"]
		});
		gui.setCalories(-1000000000000000000000);
		mySnd.play();
		if(!mySnd.isMuted()){
		    $("#muteButton").removeClass("soundoff")
		} else {
			$("#muteButton").addClass("soundoff")
		}
		$("#startPrompt").css("display", "block");
		
		input.addKeyListeners();
		createStage();
		addBackground();
		addGround();
		addGui();
		addGameElements();
		
		setInterval(function(){
			if(!missed){
				heartRate -= 1;
			}
		},1000)
		
		fKeyPressedOnce = false;
	}

	function addGui(){
		guiLayer = gui.drawGui();
	}
	
	function createGoodText(){
		var container = $("<div>");
		var textContainer = $("#textContainer");
		
		$(container).addClass("goodItem");
		
		if(!deathCalled){
		
			gui.setCalories(50);
			$(textContainer).append(container);
			
			
			setTimeout(function(){
				$(container).css("top", "0");
				$(container).css("opacity", "0");
			}, 200)
		}
	}
	
	function createBonusText(){
		var container = $("<div>");
		var textContainer = $("#textContainer");
		
		$(container).addClass("bonusItem");
		
		gui.setCalories(50);
		//$(textContainer).append(container);
		
		
		setTimeout(function(){
			$(container).css("top", "0");
			$(container).css("opacity", "0");
		}, 200)
	}
	
	function createBadText(){
		var container = $("<div>");
		var textContainer = $("#textContainer");
		
		$(container).addClass("badItem");
		
		if(!deathCalled){
		
			gui.setCalories(-50);
			$(textContainer).append(container);
			setTimeout(function(){
				$(container).css("top", "0");
				$(container).css("opacity", "0");
			}, 200)
		}
	}

	function createStage(){
		stage = new Kinetic.Stage({
			container: 'container',
			width: 1280,
			height: 720,
		});

		gameLayer = new Kinetic.Layer();
		ground.groundLayer = new Kinetic.Layer();

		cloudLayer = new Kinetic.Layer();
		guiLayer = new Kinetic.Layer();

	}

	function addBackground(){

		background.setStage(stage);
		skyLayer = background.drawBackground()[0];
		//console.log(skyLayer);

	}

	function addGround(){

        Path.initialize();
		ground.setStage(stage);
	}

	function addGameElements(){


		var playerImage = new Image();
		playerImage.src = "./images/bill.png";
	    player = new Kinetic.Sprite({
	        x: 239,
	        y: 175,
	        offset: {x:256, y:256},
	        image: playerImage,
	        animation:'walking',
	        animations: playerClass.setupAnimations(),
	        frameRate: 5
	      });
	      player.setScale(-1, 1);

	      //Start Player Animation
	      playerImage.onload= function(){
	      	player.setIndex(10);
	      }

	      player.onGround = false;

		// add metronome.
		var metronomeBackgroundImg = new Image();
		metronomeBackgroundImg.src = "./images/fatmeter.png";
		var metronomeBackground = new Kinetic.Image({
          x: 520,
          y: 0,
          image: metronomeBackgroundImg,
          width: 200,
          height: 200
        });
        
        var metronomeArrowImg = new Image();
        metronomeArrowImg.src = "./images/arrow.png";
        metronomeArrow = new Kinetic.Image({
        	x: 623,
        	y: 199,
        	image: metronomeArrowImg,
        	width: 74,
        	height: 130
        });
        angle = 176;
        metronomeArrow.setRotation(angle * (Math.PI/180));

		guiLayer.add(metronomeBackground);
		guiLayer.add(metronomeArrow);
		
		
		
		
		console.log(playerHat);
		
		
		

	      gameLayer.add(player);
	      
	      if(hatPath){
				var pHatObject = new Image();
				pHatObject.src = hatPath;
				playerHat = new Kinetic.Image({
					x: player.getX() + 0,
					y: player.getY() - 0,
					image: pHatObject,
					width: 198,
					height: 181,
					
				});
				 gameLayer.add(playerHat);
			}
	      
	      
	     
	      stage.add(background.drawBackground()[0]);
	      stage.add(gameLayer);
	      stage.add(ground.groundLayer);
	      ground.groundLayer.setZIndex(0);
	      stage.add(guiLayer);
	      guiLayer.setZIndex(10000);
	}

	function update(){
	    var index = Math.floor(Path.nNumSamples * -((ground.groundLayer.getX()-400) / 30000));
		ground.drawGround(index-6, index+13);
		movePlayer();
		if(playerHat){
			playerHat.setX(player.getX() + 13);
			playerHat.setY(player.getY() - 363);
		}
		
		if (fKeyPressedOnce)
	    {
	    	
		    moveScreen();
		    checkCurrentRequirement();

		    updateVariables();
		}

		stage.draw();
	}
	
	function checkCurrentRequirement(){
		
		
		
		if (angle <= 184 && !fKeyInit){
			fKeyInit = true;
			setTimeout(function(){
			    if (fKeyPressedOnce)
			    {
				    if(fKeyDown == false){
					    heartRate += 5;
					    combo = 0;
					    createBadText()
				    } else {
					    missed = false;
					combo++;
					    createGoodText();
				    }
				}
				fKeyInit = false;
				fKeyDown = false;
			}, 400);
		}
		
		if((angle >= 205) && (angle <= 214) && !aKeyInit){
			aKeyInit = true;
			setTimeout(function(){
				if(aKeyDown == false){
					heartRate += 5;
					combo = 0;
					createBadText()
				} else {
					missed = false;
					combo++;
					createGoodText();
				}
				aKeyInit = false;
				aKeyDown = false;
			}, 400);
		}
		
		if(angle >= 234 && !tKeyInit){
			tKeyInit = true;
			setTimeout(function(){
				if(tKeyDown == false){
					heartRate += 5;
					combo = 0;
					createBadText()
				} else {
					missed = false;
					combo++;
					createGoodText();
				}
				console.log("GG UNINSTALL");
				tKeyInit = false;
				tKeyDown = false;
			}, 400);
		}
		
		if(combo > 5){
			createBonusText();
			combo = 0;
			gui.setCalories(2000);
			addBurger();
		}
	}
	
	function addBurger(){
		var burgerImg = new Image();
		burgerImg.src = "./images/burgerbonus.png";
		var burger = new Kinetic.Image({
			x: player.getX() + 100,
			y: -100,
			image: burgerImg,
			width: 182,
			height: 154,
			offset: {x:91, y:77},
		});
		
		gameLayer.add(burger);
		
		burger.transitionTo({
			y:player.getY(),
			rotation: Math.PI * 2,
			duration:1
		});
		
		setTimeout(function(){
			burger.setOpacity(0);
			//gameLayer.remove(burger);
			addSmiley();
		},1000);
		
		
	}
	
	function addSmiley(){
		var smileyImg = new Image();
		smileyImg.src = "./images/yum.png";
		var smiley = new Kinetic.Image({
			x: player.getX() + 270,
			y: player.getY() - 300,
			image: smileyImg,
			width: 200,
			height: 200,
			offset: {x:100, y:100},
		});
		
		var updateSmile = setInterval(function(){
			smiley.setY(player.getY() - 300);
		},1000/60);
		
		setTimeout(function(){
			smiley.setOpacity(0);
			clearInterval(updateSmile);
		}, 500);
		
		
		gameLayer.add(smiley);
	}

	function updateVariables(){
		//heartRate -= .1;
		if(fKeyPressedOnce)
		{
		    angleInc += .001;
		}
		if(fKeyPressedOnce && angleMode == "increase"){
			angle += angleInc;
			if(angle >= 241){
				angleMode = "decrease";
				metronomeDirection = -1;
			}
		}

		if(fKeyPressedOnce && angleMode == "decrease"){
			angle -= angleInc;
			if(angle <= 175){
				angleMode = "increase";
				metronomeDirection = 1;
			}
		}
		//console.log(angle);

		gui.setHeartRate(heartRate);
		metronomeArrow.setRotation(angle * (Math.PI/180));
		
		
		if(heartRate > maxBPM){
			die();
		}
		if(heartRate < 100){
			heartRate = 100;
		}
		
		if(heartRate < 200 && !changedAnim && currentAnim != "good"){
			gui.setAnim("good");
			currentAnim = "good";
		} 
		
		if(heartRate > 200 && !changedAnim && currentAnim != "bad"){
			gui.setAnim("bad");
			currentAnim = "bad";
		}
		
	}

	function moveScreen(){
		ground.groundLayer.setX(ground.groundLayer.getX() - speed);
		//console.log("GROUND LAYER POSITION: " + ground.groundLayer.getX());
	}

	function movePlayer(){
		if (ground.groundLayer.getX() > -29500)
		{
		    var index = Path.nNumSamples * -((ground.groundLayer.getX()-400) / 30000);
            player.setY(410 - Path.getHeight(Math.floor(index)));
        }
        else
        {
        	
            die();
        }
        
        
	}
	
	
	function die(){
		if(!deathCalled){
			 speed = 0;
			deathCalled = true;
			player.setOpacity(0);
			if(playerHat){
				playerHat.setOpacity(0);
			}
			$("#heartAttack").css("opacity", "1");
			
			var anims = {
				dead: [{
					x:0,
					y:0,
					width:256,
					height:256
				},{
					x:256,
					y:0,
					width:256,
					height:256
				},{
					x:0,
					y:256,
					width:256,
					height:256
				},{
					x:256,
					y:265,
					width:256,
					height:256
				}]
			}
			
			var playerImage = new Image();
			playerImage.src = "./images/poopedhimself.png";
			    var playerDead = new Kinetic.Sprite({
			        x: player.getX(),
			        y: player.getY(),
			        offset: {x:256, y:206},
			        image: playerImage,
			        animation:'dead',
			        animations: anims,
			        frameRate: 6
			      });
			     
				
				guiLayer.add(playerDead);
				 playerDead.start();
			      playerDead.setScale(-1, 1);
			
			stage.draw();
			
			setTimeout(function(){
				playerDead.stop();
			},500)
			
			 setTimeout(function(){
			 	mySnd.stop();
				 heartRate = 00;
				 angleInc = 1;
				 speed = 5;
				 $("#heartAttack").css("opacity", "0");
			 	 stage.remove();
		         currentstate = scorestate;
		         currentstate.init(gui.getCalories());
			 }, 2000)
			 
		 }
		 
	}

	// trigger F when angle is between 175 - 180
	// Trigger A when angle is between 205 - 210
	// trigger T when angle i between 236 - 241
	function setInput(input){
		if(input == KEY.F){
		    if (!fKeyPressedOnce)
		    {
		        player.start();
		    }
		    fKeyPressedOnce = true;
		    $("#startPrompt").css("display", "none");
			//Right Foot
			playerClass.operateMovement("right");
			if (angle <= 190 && !fKeyDown){
				fKeyDown = true;
			}

		} else if(input == KEY.A){
			//Left Foot
			playerClass.operateMovement("left");
			if((angle >= 200) && (angle <= 218) && !aKeyDown){
				aKeyDown = true;
			} 

		} else if(input == KEY.T){
			//Breath
			playerClass.operateBreathing();
			if(angle >= 228 && !tKeyDown){
				tKeyDown = true;
			}
		}
		
		if (input == KEY.F || input == KEY.A || input == KEY.T)
		{
		    if (!badKeyDown && ((angle > 190 && angle < 200) || (angle > 218 && angle < 228))) {
		        heartRate += 5;
			    console.log("BAD");
                badKeyDown = true;
			    createBadText();
                setTimeout(function(){
                    badKeyDown = false;
			    }, 200);
                combo = 0;
	        }
	    }

		if(speed < 1){
			speed = 1;
		}
		
		if(speed > 20){
			speed = 20
		}
	}






	function getStage(){
		return stage;
	}

	function collides(a, b){
		if (a!= undefined && b!= undefined){
			x1 = parseFloat(a.getX());
			x2 = parseFloat(b.getX());
			y1 = parseFloat(a.getY());
			y2 = parseFloat(b.getY());
			w1 = parseFloat(a.getWidth());
			w2 = parseFloat(b.getWidth());
			h1 = parseFloat(a.getHeight());
			h2 = parseFloat(b.getHeight());

			//console.log(x1 + " " + x2);

			return x1 < x2 + w2 &&
					x1 + w1 > x2 &&
					y1 < y2 + h2 &&
					y1 + h1 > y2;
			} else {
				return false;
			}

	}

	function getAngle(){
		return angle;
	}
	
	function mutePressed(){
	    mySnd.toggleMute();
	    if(!mySnd.isMuted()){
		    $("#muteButton").removeClass("soundoff")
		} else {
			$("#muteButton").addClass("soundoff")
		}
	}


	return{
		init:init,
		setInput:setInput,
		update:update,
		mutePressed:mutePressed,
	}



})();