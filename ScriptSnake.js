

window.onload = function(){		
	
	var canvasWidth = 900;
	var canvasHeight = 600;
	var blockSize = 30;
	var ctx;
	var delay = 200;
	var snakee;
	var applee;
	var widthInBlocks = canvasWidth/blockSize;
	var heightInBlocks = canvasHeight/blockSize;
	
	init();
	
	function init(){
		
		var canvas = document.createElement('canvas');  		// Création du Canvas
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.border = "1px solid";
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');						// Création du context pour interagir avec le canvas
		snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");     		// Création du serpent au lancement du programme via la fonction Snake();
		applee = new Apple([10,10]);
		refreshCanvas();
				
	}
	
	function refreshCanvas(){
		
		snakee.advance();									// Appel la fonction advance.
		if(snakee.checkCollision()){
			// GAME OVER
		}else{
			if(snakee.isEatingApple(applee)){					// verifie si on a manger la pomme.
				applee.setNewPosition();
			}
			ctx.clearRect(0, 0, canvasWidth, canvasHeight); 	    // On efface le canvas juste avant de la rafraichir;		
			snakee.draw();										// Appel de la fonction draw()
			applee.draw();
			setTimeout(refreshCanvas, delay);					// Automatise le rafraichissement via la fonction setTimout();
		}
		
	}
	
	function drawBlock(ctx, position){						
		var x = position[0] * blockSize;						// permet de donner les coordonner du block 1 a la (position * la taille du block)
		var y = position[1] * blockSize;						// permet de donner les coordonner du block 2 a la (position * la taille du block)
		ctx.fillRect(x,y, blockSize, blockSize);				// Dessine le block au coordoner renvoyer par x et y.
	}
	
		
	function Snake(body, direction){							// fonction qui permet de cree le serpent
		
		this.body = body;
		this.direction = direction;							// Donne la direction au serpent
		this.draw = function(){								// Fonction qui permet de dessiner le corps du serpent.
			ctx.save();										// Sauvegarde le context du canvas avant de rentrer dans la fonction.
			ctx.fillStyle = "#ff0000";
			for(var i = 0; i < this.body.length; i++){		// Boucle qui permet de parcourir le corp du serpent >>> un array qu'on lui passe en parametre dans la fonction init
				drawBlock(ctx, this.body[i])					// Fonction qui permet de dessiner un bloc
			}
			ctx.restore();	
		};
		this.advance = function(){
			var nextPosition = this.body[0].slice();			// La tete est le premier element du body donc on la copie
			
			switch(this.direction){							// NextPosition se situe par rapport au x/y de la tete.
				case "left":
					nextPosition[0] -= 1;
					break;
				case "right":
					nextPosition[0] += 1;
					break;	
				case "down":
					nextPosition[1] += 1;
					break;	
				case "up":
					nextPosition[1] -= 1;
					break;
				default: 
					throw("invalid direction");
			}
			this.body.unshift(nextPosition);					// Rajout le next position a notre array (a notre serpent);
			this.body.pop();									// supprime le dernier element d'un array;
		};	
			this.setDirection = function (newDirection){						// Fonction qui permet de determiner les direction permise du serpent.
		
			var allowedDirections;
			switch(this.direction){
				case "left":
				case "right":
					allowedDirections = ["up", "down"];
					break;	
				case "down":
				case "up":
					allowedDirections = ["left", "right"];
					break;
				default: 
					throw("invalid direction");
			}
			if(allowedDirections.indexOf(newDirection) > -1){   // indexOf >> si new direction est dans les allowed direction la fonction indexOf retournera 0 ou 1 si cela n'est pas le cas il retournera -1 
				this.direction = newDirection;
			}
			
		};
		
		this.checkCollision = function(){					  //  Verifie si le serpent rentre en collision avec un mur ou avec lui même. 
			var wallCollision = false;
			var snakeCollision = false;
			var head = this.body[0];							  // On met la tete dans une variable
			var rest = this.body.slice(1);					  // ensuite on met le corps dans un autre variable
			var snakeX = head[0];						      // On copie les coordonées x et y de la tête.
			var snakeY = head[1];
			var minX = 0;									  // la tete du serpent doit se trouver entre ces coordonées
			var minY = 0;									  // >>> sinon elle se situe en dehors des limites du Canvas.	
			var maxX = widthInBlocks - 1;
			var maxY = heightInBlocks - 1;
			var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
			var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
			
			if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
				wallCollision = true;
			}
			
			for(var i = 0; i < rest.length; i++){			   // Vérifie que la tête n'est pas passer sur le reste du corps.
				if(snakeX === rest[i][0] && snakeY === rest[i][1]){		// On parcours tout les i[0]"x" et tout les i[1]"y"
					snakeCollision = true;
				}
		
			}
			
			return wallCollision || snakeCollision;
			
		};	
		
		this.isEatingApple = function (appleToEat){						   // Verifie si on mange la pomme.
		
			var head = this.body[0];
			if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){ // verifie la position de la tete du serpent par rapport a la pomme
				return true;
			}else{
				return false;
			}
		};
		
	}	
	
	function Apple(position){								   		// Donne la position a la pomme.
		this.position = position;
		this.draw = function(){
			ctx.save();
			ctx.fillStyle = "#33cc33";
			ctx.beginPath();									   		// La méthode beginPath () commence un chemin ou réinitialise le chemin actuel. 		
			var radius = blockSize / 2;						   		// Le rayon de la pomme
			var x = this.position[0]*blockSize + radius;			  	 // Permet d'arriver au centre
			var y = this.position[1]*blockSize + radius;			   	// Permet d'arriver au centre
			ctx.arc(x, y, radius, 0, Math.PI*2, true);		   		// fonction qui permet d'obtenir un cercle
			ctx.fill();										   		// Le remplis de la couleur choisi.
			ctx.restore();
		};
		this.setNewPosition = function(){							// Donne une position aleatoire a la pomme apres l'avoir manger.
			var newX = Math.round(Math.random() * (widthInBlocks - 1));
			var newY = Math.round(Math.random() * (heightInBlocks - 1));
			this.position = [newX, newY];
		};
	}
	
	document.onkeydown = function handleKeyDown(e){			// fonction qui s'attache au document qui permet de reagir quand on utilise le clavier
		var key = e.keyCode;									// Donne le code de la touche qui a été appuyé.
		var newDirection;									// Donne la nouvelle direction.
		switch(key){
			case 37:
				newDirection = "left";
				break;
			case 38:
				newDirection = "up";
				break;
			case 39:
				newDirection = "right";
				break;
			case 40:
				newDirection = "down";
				break;
			default: 
				return;
		}
		snakee.setDirection(newDirection);                    // Appel de la methode setDirection qui permet de verifier la valider de la direction prise.
	}		
	
}