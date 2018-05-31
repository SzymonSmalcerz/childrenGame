let game = new Phaser.Game(640,360, Phaser.AUTO);

let GameState = {

  preload : function(){



    this.load.image("background", "assets/background.png");

    this.load.image("arrow", "assets/arrow.png");

    // this.load.image("chicken", "assets/animals/chicken.png");
    // this.load.image("elephant", "assets/animals/elephant.png");
    // this.load.image("frog", "assets/animals/frog.png");
    // this.load.image("monkey", "assets/animals/monkey.png");
    // this.load.image("moose", "assets/animals/moose.png");
    // this.load.image("pingeon", "assets/animals/pingeon.png");
    // this.load.image("snake", "assets/animals/snake.png");

    this.load.spritesheet("chicken", "assets/animals/chicken_spritesheet.png",280,180,3);
    this.load.spritesheet("elephant", "assets/animals/elephant_spritesheet.png",280,180,3);
    this.load.spritesheet("frog", "assets/animals/frog_spritesheet.png",280,180,3);
    this.load.spritesheet("monkey", "assets/animals/monkey_spritesheet.png",280,180,3);
    this.load.spritesheet("moose", "assets/animals/moose_spritesheet.png",280,180,3);
    this.load.spritesheet("pingeon", "assets/animals/pingeon_spritesheet.png",280,180,3);
    this.load.spritesheet("snake", "assets/animals/snake_spritesheet.png",280,180,3);

    this.load.audio("chickenSound", "assets/animalsSounds/chicken.mp3");
    this.load.audio("elephantSound", "assets/animalsSounds/elephant.mp3");
    this.load.audio("frogSound", "assets/animalsSounds/frog.mp3");
    this.load.audio("monkeySound", "assets/animalsSounds/monkey.mp3");
    this.load.audio("mooseSound", "assets/animalsSounds/moose.mp3");
    this.load.audio("pingeonSound", "assets/animalsSounds/pigeon.mp3");
    this.load.audio("snakeSound", "assets/animalsSounds/snake.mp3");

  },
  create : function(){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    // this.scale.setScreenSize(true);


    this.background = this.game.add.sprite(-80,-220,"background");

    let animalData = [
      /*
        chicken music : https://freesound.org/people/Rudmer_Rotteveel/sounds/316920/
        author : Rudmer_Rotteveel
      */
      { spriteName : "chicken" , audio : "chickenSound"},
      // elephant music :
      // https://freesound.org/people/vataaa/sounds/148873/
      // author : vataaa
      { spriteName : "elephant" , audio : "elephantSound" },
      // frog music :
      // https://freesound.org/people/BiancaBothaPure/sounds/365671/
      // author : BiancaBothaPure
      { spriteName : "frog" , audio : "frogSound" },
      // monkey music :
      // https://freesound.org/people/Archeos/sounds/325549/
      // author : Archeos
      { spriteName : "monkey" , audio : "monkeySound" },
      /*
        moose music : https://freesound.org/people/Joan%20Barnett/sounds/51060/
        author : Joan Barnett
      */
      { spriteName : "moose" , audio : "mooseSound" },

      /*
        pigeon music : https://freesound.org/people/mcmalonzo/sounds/342094/
        author : mcmalonzo
      */
      { spriteName : "pingeon" , audio : "pingeonSound" },
      /*
        snake music : https://freesound.org/people/ModdingTR/sounds/234269/
        author : ModdingTR
      */
      { spriteName : "snake" , audio : "snakeSound" }
    ];

    this.animals = this.game.add.group();

    animalData.forEach(animal => {
      let currAnimal = this.animals.create(-200, this.game.world.centerY, animal.spriteName, 1);
      currAnimal.customParams = { name : animal.spriteName , sound : this.game.add.audio(animal.audio)};
      currAnimal.anchor.setTo(0.5);

      currAnimal.inputEnabled = true;
      currAnimal.input.pixelPerfectClick = true;
      currAnimal.events.onInputDown.add(this.animateAnimal, this);

      currAnimal.animations.add("animate",[1,0,1,2,1],3,false);
    });

    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);
    this.showText(this.currentAnimal);


    this.arrowRight = this.game.add.sprite(555,this.game.world.centerY, "arrow");
    this.arrowRight.anchor.setTo(0.5);
    this.arrowRight.customParams = {direction : "right"};
    this.arrowRight.inputEnabled = true;
    this.arrowRight.pixelPerfectClick = true;
    this.arrowRight.events.onInputDown.add(this.switchAnimal, this);

    this.arrowLeft = this.game.add.sprite(85,this.game.world.centerY, "arrow");
    this.arrowLeft.scale.set(-1,1);
    this.arrowLeft.anchor.setTo(0.5);
    this.arrowLeft.customParams = {direction : "left"};
    this.arrowLeft.inputEnabled = true;
    this.arrowLeft.pixelPerfectClick = true;
    this.arrowLeft.events.onInputDown.add(this.switchAnimal, this);
  },
  update : function(){
    // this.chicken.angle += 0.19;
    // this.chicken.scale.x += 0.2;
    // this.chicken.scale.y += 0.15;
  },
  switchAnimal : function(clickedArrow, event) {

    if(this.isMoving){
      return;
    }
    this.animalText.visible = false;
    this.isMoving = true;


    let newAnimal;
    let oldAnimal = this.currentAnimal;
    let oldAnimalEndX;

    if(clickedArrow.customParams.direction == "right"){
      newAnimal = this.animals.next();
      newAnimal.x = -newAnimal.width/2;
      oldAnimalEndX = oldAnimal.width/2 + 640;
    } else {
      newAnimal = this.animals.previous();
      newAnimal.x = 640 + newAnimal.width/2;
      oldAnimalEndX = -oldAnimal.width/2;
    };

    let newAnimalMovement = this.game.add.tween(newAnimal);
    newAnimalMovement.to({x : this.game.world.centerX}, 1000);

    let oldAnimalMovement = this.game.add.tween(oldAnimal);
    oldAnimalMovement.to({x : oldAnimalEndX}, 1000);

    newAnimalMovement.start();
    oldAnimalMovement.start();

    newAnimalMovement.onComplete.add(function(){
      this.isMoving = false;
      this.showText(newAnimal);
    }, this);

    this.currentAnimal = newAnimal;
  },
  animateAnimal : function(clickedAnimal, event) {
    clickedAnimal.play("animate");
    clickedAnimal.customParams.sound.play();
    setTimeout(() => {clickedAnimal.customParams.sound.stop();}, 2000);
  },
  showText : function (animal) {
    if(!this.animalText){
      let textStyle = {
        font : "35pt bold",
        // fill : "#44FF2F",
        align : "center"
      };
      this.animalText = this.game.add.text(this.game.width/2, this.game.height * 0.9, "", textStyle);
      this.animalText.anchor.setTo(0.5);
    };

    this.animalText.setText(animal.customParams.name);
    this.animalText.visible = true;
  }
};

game.state.add("GameState", GameState);
game.state.start("GameState");
