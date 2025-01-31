import Level from "./scenes/Level.js";
import Preload from "./scenes/Preload.js";
import Trash from "./scenes/Trash.js";
import Game from "./scenes/Game.js";
import WareHouse from "./scenes/WareHouse.js";

window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 1280,
		height: 720,
		type: Phaser.AUTO,
        backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		dom: {
			createContainer: true // 确保创建 DOM 容器
		}
	});

	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("Trash", Trash);
	game.scene.add("Game", Game);
	game.scene.add("WareHouse", WareHouse);
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {

		this.scene.start("Preload");
	}
}