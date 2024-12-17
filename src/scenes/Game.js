
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


		// 顶部容器，包含仓库，时间，
		const container_top = this.add.container(0,0);

		// warehouse button
		const warehouse_button = this.add.image(100, 100, '02-仓库').setInteractive();
		warehouse_button.on('pointerdown', () => this.selectWareHouseButton());
		warehouse_button.scaleX = 0.3;
        warehouse_button.scaleY = 0.3;
		container_top.add(warehouse_button);


		// text_1
		/*const text_1 = this.add.text(443, 246, "", {});
		text_1.scaleX = 4.35954909583362;
		text_1.scaleY = 8.410515251512745;
		text_1.text = "Game On\n";
		text_1.setStyle({  });

		this.add.text(100, 100, 'You selected button ' + this.selectedButtonIndex, { fontSize: '32px', fill: '#fff' });*/


		// 左边，背包大小10*6，包含已收集的物品列表
		const maxContains = 60;
		//const itemList = []; // 通过接口获取
		const itemList = [
			{
				"id": 1005003,
				"name": "蓝色钩子",
				
				"type": 1,
				"type_name": "生产工具",
				"desc": "捡垃圾捡垃圾捡垃圾捡垃圾捡垃圾捡垃圾",
				"ori_img_url": "4001001",
				"price": 99,
				"Probability": 0
			},
			{
				"id": 1005003,
				"name": "蓝色钩子",
				"type": 1,
				"type_name": "生产工具",
				"desc": "捡垃圾捡垃圾捡垃圾捡垃圾捡垃圾捡垃圾",
				"ori_img_url": "4001001",
				"price": 99,
				"Probability": 0
			}
		];
		
		//console.log(items);
		this.buttons = [];
		const container_1 = this.add.container(222, 140);
		// 设置背景
		const backgroundLeft = this.add.image(200, 250, '左边物品栏大面板');
		backgroundLeft.scaleX = 0.35; // 设置锚点为中心
		backgroundLeft.scaleY = 0.35;

		//background.setDisplaySize(200, 150); // 设置背景图片的显示大小
		container_1.add(backgroundLeft);

		for (let i = 0; i < maxContains; i++) {
            let x = 44 + (i % 6) * 60;
            let y = 20 + Math.trunc(i / 6) * 50;
            
			const isItem = i < itemList.length;

			const imgName = isItem ? itemList[i].ori_img_url : '16-装备栏白色装备';
			const button = this.add.image(x, y, imgName);
			if (isItem) {
				// 该物品框放置物品，否则为空
				button.setInteractive();
            	button.on('pointerdown', () => this.selectMapButton(button));
				button.scaleX = 0.1;
				button.scaleY = 0.1;
			} else {
				button.scaleX = 0.2;
				button.scaleY = 0.2;
			}


            const border = this.add.image(x, y, '09-目的地内框未选中');
            border.scaleX = 0.1;
            border.scaleY = 0.2;

            container_1.add(button);
            container_1.add(border);
            this.buttons.push({ button, border });
        }


		// 右边，地图内容展示
		// 创建一个 Container
		const container = this.add.container(552, 90); // 中心位置

		// 设置背景
		const background = this.add.image(285, 300, '右边挂机中大面板');
		background.scaleX = 0.35; // 设置锚点为中心
		background.scaleY = 0.35;

		//background.setDisplaySize(200, 150); // 设置背景图片的显示大小
		container.add(background);

		// 添加标题
		const title = this.add.text(280, 100, '主关卡名称', { fontSize: '36px', fill: '#ffffff' });
		title.setOrigin(0.5, 0.5);
		container.add(title);

		// 添加两个标签
		const label1 = this.add.text(180, 238, '子关卡名称', { fontSize: '14px', fill: '#ffffff' });
		const label2 = this.add.text(360, 238, '掉落概率', { fontSize: '14px', fill: '#ffffff' });
		container.add(label1);
		container.add(label2);

		const label3 = this.add.text(180, 268, '物品1', { fontSize: '14px', fill: '#ffffff' });
		const label4 = this.add.text(360, 268, '10%', { fontSize: '14px', fill: '#ffffff' });
		container.add(label3);
		container.add(label4);


		const label5 = this.add.text(180, 298, '物品2', { fontSize: '14px', fill: '#ffffff' });
		const label6 = this.add.text(360, 298, '30%', { fontSize: '14px', fill: '#ffffff' });
		container.add(label5);
		container.add(label6);

		const label7 = this.add.text(250, 328, '持续时间：10秒', { fontSize: '14px', fill: '#ffffff' });
		container.add(label7);

		// 添加文本展示
		/*const displayText = this.add.text(260, 260, '这是一个可换行的\n文本展示区域。\n可以包含多个行，\n展示更多信息。', {
			fontSize: '14px',
			fill: '#ffffff',
			wordWrap: { width: 300, useAdvancedWrap: true }
		});
		displayText.setOrigin(0.5, 0);
		container.add(displayText);*/

		// 添加按钮
		const xiexia = this.add.image(300, 380, '停止按钮')
			.setInteractive()
			.on('pointerdown', () => {
				console.log('按钮 1 被点击');
			});
		xiexia.scaleX = 0.4;
		xiexia.scaleY = 0.4;

		/*const swap = this.add.image(325, 360, '22-装备栏物品详情面板替换')
			.setInteractive()
			.on('pointerdown', () => {
				console.log('按钮 2 被点击');
			});
		swap.scaleX = 0.4;
		swap.scaleY = 0.4;*/

		container.add(xiexia);
		//container.add(swap);


		this.events.emit("scene-awake");


	}

	/* START-USER-CODE */

	// Write your code here

	init(data) {
        this.selectedButtonIndex = data.selectedButtonIndex; // map id

    }

	create() {

		this.editorCreate();
		//this.cameras.main.setBackgroundColor('#3498db'); 
		 // 添加背景图片
		 //this.add.image(0, 0, '挂机背景').setOrigin(0, 0);
		 //this.cameras.main.setBounds(0, 0, this.game.config.width, this.game.config.height);
		 // 添加背景图片
		 const backgroundImage = this.add.image(0, 0, '挂机背景');

		 // 设置原点为 (0, 0) 以便从左上角开始
		 backgroundImage.setOrigin(0, 0);
	 
		 // 调整图片大小以适应场景
		 backgroundImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
	 
		 // 设置深度，确保背景在最底层
		 backgroundImage.setDepth(-1);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
