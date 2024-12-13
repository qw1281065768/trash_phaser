
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Game extends Phaser.Scene {

	constructor() {
		super("Game");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// text_1
		const text_1 = this.add.text(443, 246, "", {});
		text_1.scaleX = 4.35954909583362;
		text_1.scaleY = 8.410515251512745;
		text_1.text = "Game On\n";
		text_1.setStyle({  });

		this.add.text(100, 100, 'You selected button ' + this.selectedButtonIndex, { fontSize: '32px', fill: '#fff' });

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	init(data) {
        this.selectedButtonIndex = data.selectedButtonIndex; // 获取选中按钮的索引
    }

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
