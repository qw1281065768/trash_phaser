
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// dino
		const dino = this.add.image(339, 310, "dino");
		dino.setInteractive(new Phaser.Geom.Rectangle(0, 0, 250, 250), Phaser.Geom.Rectangle.Contains);
		dino.setOrigin(0.5108508567336999, 0.5108508567336997);

		// welcome
		const welcome = this.add.text(664, 285, "", {});
		welcome.setOrigin(0.5, 0.5);
		welcome.text = "Phaser 3 + Phaser Editor v4";
		welcome.setStyle({ "fontFamily": "Arial", "fontSize": "30px" });

		this.dino = dino;
		this.welcome = welcome;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	dino;
	/** @type {Phaser.GameObjects.Text} */
	welcome;

	/* START-USER-CODE */

	// Write more your code here

	create() {
		this.scene.start("Trash");
		/*this.editorCreate();
		this.dino.on("pointerdown", () => {
			this.welcome.text = "Hello, World!";
		});*/
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
