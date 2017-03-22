window.onload = function()
{
	var audio = new Audio('sounds/musicNew.mp3');
	audio.play();
	var startSound = new Audio('sounds/start.wav');
	var cool = new Audio('sounds/cool.wav');
	var awesome = new Audio('sounds/awesome.wav');
	var wow = new Audio('sounds/wow.wav');
	var whistle = new Audio('sounds/whistle.wav');
	var nice = new Audio('sounds/nice.wav');
	
	var pain = new Audio('sounds/pain.wav');
	var pain2 = new Audio('sounds/pain2.wav');
	var pain3 = new Audio('sounds/pain3.wav');
	var death = new Audio('sounds/death.wav');
	
	var powerupSound = new Audio('sounds/powerup.wav');
	
	var winSound = new Audio('sounds/win.wav');

    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
	
	var finished = false;
	
	var mapHeight = 800;
	var mapWidth = 800;
	
	//Level Data
	enemiesNo = 15;
	enemiesSpeed = 2;
	
	//Scoreboard details
	var score = 0;	
	var lives = 5;
	var heartImg = new Image();
	heartImg.src = "sprites/heart.png";
	var timeLeft = 60;
	var powerUpText = " ";
	var level = "1";

    //Player
    var player = {
        x: 0,
        y: 40,
		movespeed: 5
    };
	var playerImg = new Image();
	playerImg.src = "sprites/playerdown.png";
	var invincible = false;

    //Player Controller
    var left = false;
    var right = false;
    var up = false;
    var down = false;
    window.addEventListener('keyup', function(key) {
        if (key.which == 37) {
            left = false;
        }
        if (key.which == 39) {
            right = false;
        }
        if (key.which == 38) {
            up = false;
        }
        if (key.which == 40) {
            down = false;
        }
    });
    window.addEventListener('keydown', function(key) {
        if (key.which == 37) {
            left = true;
			playerImg.src = "sprites/playerleft.png";
        }
        if (key.which == 39) {
            right = true;
			playerImg.src = "sprites/player.png";
        }
        if (key.which == 38) {
            up = true;
			playerImg.src = "sprites/playerup.png";
        }
        if (key.which == 40) {
            down = true;
			playerImg.src = "sprites/playerdown.png";
        }
    });

	//Enemy Object
	function Enemy(speed) {
		this.movespeed = speed;
		this.x = Math.floor(Math.random() * (mapWidth-25 - 25)+25);
		this.y = Math.floor(Math.random() * (mapHeight-25 - 40)+40);
		this.img = new Image();
		this.enemyDir = Math.floor(Math.random() * (4 - 0));
	}
	var enemies = [];
	
	//Enemy AI
    function EnemyAI(){
        var rnd = Math.floor(Math.random() * (4 - 0));
		this.dir = rnd;
    }
	var ais = [];
	
	//Collectable Object
	function Collectable(value) {
		this.x = Math.floor(Math.random() * (mapWidth-25 - 25)+25);
		this.y = Math.floor(Math.random() * (mapHeight-25 - 40)+40);
  		this.value = value;
	}
	var collectableImg = new Image();
	collectableImg.src = "sprites/star.png";
	var collectableImg2 = new Image();
	collectableImg2.src = "sprites/star2.png";
	
	//List of Collectables
	var collectables = [];
	
	//Powerup Object
	function PowerUp() {
		this.x = Math.floor(Math.random() * (mapWidth-20 - 20)+20);
		this.y = Math.floor(Math.random() * (mapHeight-20 - 40)+40);
	}
	var powerUpImg = new Image();
	powerUpImg.src = "sprites/powerup.png";
	
	var powerUps = [];
	
	


    function Level() {
			if(finished) return;
			requestAnimationFrame(Level);
			
		  
		  //Player Moving + Boundaries
		  if (left) {
			  player.x = player.x - player.movespeed;
			  if (player.x < 0) {
				  player.x = 0;
			  }
		  }
		  if (right) {
			  player.x = player.x + player.movespeed;
			  if (player.x > mapWidth-25) {
				  player.x = mapWidth-25;
			  }
		  }
		  if (up) {
			  player.y = player.y - player.movespeed;
			  if (player.y < 40) {
				  player.y = 40;
			  }
		  }
		  if (down) {
			  player.y = player.y + player.movespeed;
			  if (player.y > mapHeight-25) {
				  player.y = mapHeight-25;
			  }
		  }

		  
		  context.clearRect(0, 0, canvas.width, canvas.height);

		  
		  //Enemy Movement
		  for(var i = 0; i < enemies.length;i++) { 
			  var enemy = enemies[i];
			  var ai = ais[i];
			  enemy.enemyDir = ai.dir;
			  if (enemy.enemyDir == 0) {
				  enemy.x = enemy.x - enemy.movespeed;
				  enemy.img.src = "sprites/enemyleft.png";
				  if (enemy.x < 0) {
					  enemy.x = 0;
				  }
			  } else
			  if (enemy.enemyDir == 1) {
				  enemy.x = enemy.x + enemy.movespeed;
				  enemy.img.src = "sprites/enemyright.png";
				  if (enemy.x > mapWidth-20) {
					  enemy.x = mapWidth-20;
				  }
			  } else 
			  if (enemy.enemyDir == 2) {
				  enemy.y = enemy.y - enemy.movespeed;
				  enemy.img.src = "sprites/enemyup.png";
				  if (enemy.y < 40) {
					  enemy.y = 40;
				  }
			  } else
			  if (enemy.enemyDir == 3) {
				  enemy.y = enemy.y + enemy.movespeed;
				  enemy.img.src = "sprites/enemydown.png";
				  if (enemy.y > mapHeight-20) {
					  enemy.y = mapHeight-20;
				  }
			  }
		  }
		  
		  checkCollision();
		  
		  context.fillStyle = "#f8f3bf";
		  context.fillRect(0,0,800,800);
		  
		  //Draw Player
		  context.drawImage(playerImg, player.x, player.y);
		  
		  //Draw Enemies
		  for(var i =0; i < enemies.length; i++) {
			  var e = enemies[i];
			  var eImage = new Image();
			  context.drawImage(e.img, e.x, e.y);
		  } 
		  
		  //Draw Scoreboard
		  context.fillStyle = "#b5f2f7";
		  context.fillRect(0,0,800,40);
		  
		  context.font = "20px Arial";
		  context.fillStyle = "Red";
		  context.fillText("Score: " + score, 25,25);
		  context.fillText("Lives: ", 590,25);
		  for(var i = 0; i < lives; i++) {
			  context.drawImage(heartImg, 650 + (i*30), 10);
		  }
		  context.fillText("Time: " + timeLeft, 350,25);
		  context.textAlign="center";
		  context.fillText(powerUpText, 400, 65);
		  context.textAlign="left";
		  context.fillText("Level: " + level, 180,25);
		  
		  //Draw Collectables
		  for(var i =0; i<collectables.length; i++) {
			  var col = collectables[i];
			  if(col.value==100){
				  context.drawImage(collectableImg, col.x, col.y);
			  } else {context.drawImage(collectableImg2, col.x, col.y) };
		  }
		  for(var i=0; i < powerUps.length;i++) {
			  var pu = powerUps[i];
			  context.drawImage(powerUpImg, pu.x, pu.y);  
		  }
		  
		  //Game Finshers
		  if(collectables.length == 0) {
			  context.font = "60px Arial";
			  context.fillStyle = "Black";
			  context.textAlign="center";
			  context.fillText("You Win! Onto the Next Level", 400,400);
			  finished = true;
			  winSound.play();
			  setTimeout(NextLevel,2000);
		  }
		  if(timeLeft == 0) {
			  death.play();
			  context.font = "60px Arial";
			  context.fillStyle = "Black";
			  context.textAlign="center";
			  context.fillText("Out of Time! Restarting Level", 400,400);
			  finished = true;
			  setTimeout(function() {
					RestartLevel();
				   },3000);
		  }
		  if(lives == 0){
			  death.play();
			  context.font = "60px Arial";
			  context.fillStyle = "Black";
			  context.textAlign="center";
			  context.fillText("Out of Lives! Restarting Level", 400,400);
			  finished = true;
			  setTimeout(function() {
					RestartLevel();
				   },3000);
			  
		  }

    }
	
	function NextLevel(){
		level++;
		enemiesNo = enemiesNo + 3;
		enemiesSpeed++;
		clearInterval(timer);
		finished = false;
		enemies = [];
		collectables = [];
		powerUps = [];
		ais = [];
		timeLeft = 60;
		lives = 5;
		score = 0;
		createCollectables();
		createEnemies(enemiesNo);
		createPowerups();
		startTimer();
		Level();
	}
	
	function RestartLevel(){
		clearInterval(timer);
		finished = false;
		enemies = [];
		collectables = [];
		powerUps = [];
		ais = [];
		timeLeft = 60;
		lives = 5;
		score = 0;
		createCollectables();
		createEnemies(enemiesNo);
		createPowerups();
		startTimer();
		Level();
		
	}

    function checkCollision(){
		for(var i = 0; i < collectables.length; i++) {
			var col = collectables[i];
			if (player.x > (col.x - 10) && player.x < (col.x + 10) && player.y > (col.y - 10) && player.y < (col.y + 10))
			{
				collectables.splice(i,1);
				score = score + col.value;
				pickupSound();
			}
		}
		if(!invincible){
			for(var i = 0; i < enemies.length; i++) {
				var e = enemies[i];
				if (player.x > (e.x - 10) && player.x < (e.x + 10) && player.y > (e.y - 10) && player.y < (e.y + 10))
				{
					var rnd = Math.floor(Math.random() * (3 - 0));
					switch(rnd) {
						case 0:
							pain.play();
							break;	
						case 1:
							pain2.play();
							break;	
						case 2:
							pain3.play();
							break;	
					}
					player.x = 400;
					player.y = 400;
					if (lives != 0){
						lives --;
					}
					invincible = true;
					setTimeout(function() {
						invincible = false;
					},1500);
				}
			}
		}
		for(var i = 0; i < powerUps.length; i++) {
			var pu = powerUps[i];
			if (player.x > (pu.x - 10) && player.x < (pu.x + 10) && player.y > (pu.y - 10) && player.y < (pu.y + 10))
			{
				powerUps.splice(i,1);
				RandomPowerUp();
			}
		}
    }
	
	function RandomPowerUp(){
		powerupSound.play();
		var rnd = Math.floor(Math.random() * (3 - 0));
		switch(rnd) {
			case 0:
				PowerUpText("Increased Enemy Speed for 10 Seconds!");
				for(var i = 0; i < enemies.length; i++){
					var e = enemies[i];
					e.movespeed = enemiesSpeed + 2;	
					setTimeout(function() {
						for(var i = 0; i < enemies.length; i++){
							var e = enemies[i];
							e.movespeed = enemiesSpeed;	
						}
						}, 10000);
				}
				break;
			case 1:
				PowerUpText("Additional 10 Seconds!");
				timeLeft = timeLeft + 10;
				break;
			case 2:
				PowerUpText("Enemies Frozen for 5 Seconds!");
				for(var i = 0; i < enemies.length; i++){
					var e = enemies[i];
					e.movespeed = 0;	
					setTimeout(function() {
						for(var i = 0; i < enemies.length; i++){
							var e = enemies[i];
							e.movespeed = enemiesSpeed;	
						}
						}, 5000);
				}
				break;
		}
		setTimeout(function() {powerUpText = "";}, 2000);
	}
	
	function PowerUpText(text){
		powerUpText = text;
	}
    
	//Fill list of enemies & AI's
    function createEnemies(n) {
        for(var i = 0; i < n; i++) {
            var e = new Enemy(enemiesSpeed);
			enemies.push(e);
			var ai = new EnemyAI();
			ais.push(ai);
        }
    }
	
	//Fill list of stars
	function createCollectables() {
        for(var i = 0; i < 15; i++) {
			var col = new Collectable(100);
            collectables.push(col);
        }
		for(var i = 0; i < 5; i++) {
			var col = new Collectable(50);
            collectables.push(col);
        }
    }
	
	//Fill list of Power Ups
	function createPowerups() {
        for(var i = 0; i < 3; i++) {
			var pu = new PowerUp();
            powerUps.push(pu);
        }
    }

	createCollectables(15,8);
	createEnemies(20);
	createPowerups(3);

	startTimer();
    
	//Controls AI for all enemies
    setInterval(enemyDirection, 500);
    function enemyDirection() {
        for(var i =0; i< ais.length;i++) {
			var ai = ais[i];
			ai.dir =  Math.floor(Math.random() * (4 - 0));
		}
    }
	
	var timer;
	function startTimer() {
		timer = setInterval(function() {
			timeLeft--;	
		}, 1000);
	}
    
	Level();
	
	function pickupSound(){
		var rnd = Math.floor(Math.random() * (5 - 0));
		switch(rnd) {
			case 0:
				cool.play();
				break;
			case 1:
				awesome.play();
				break;
			case 2:
				wow.play();
				break;
			case 3:
				whistle.play();
				break;
			case 4:
				nice.play();
				break;
				
		}
		
	}
	
	startSound.play();
};






