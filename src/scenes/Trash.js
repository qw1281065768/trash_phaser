
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Trash extends Phaser.Scene {

	constructor() {
		super("Trash");

		/* START-USER-CTR-CODE */
        this.selectedButton = null; // 当前选中的按钮
        this.defaultBorder = null; // 默认边框
        this.selectedBorder = null; // 已选择的边框
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		this.selectedButton = null; // 当前选中的按钮
        this.defaultBorder = null; // 默认边框
        this.selectedBorder = null; // 已选择的边框
		this.buttons = []; // 存储按钮和边框
        this.submitButton = this.add.image(652, 646, '25-出发按钮不可按').setInteractive(); // 初始隐藏提交按钮
		this.submitButton.scaleX = 0.35;
		this.submitButton.scaleY = 0.35;

		// 顶部容器，包含仓库，时间，
		const container_top = this.add.container(0,0);

		// warehouse button
		const warehouse_button = this.add.image(100, 100, '02-仓库').setInteractive();
		warehouse_button.on('pointerdown', () => this.selectWareHouseButton());
		warehouse_button.scaleX = 0.3;
        warehouse_button.scaleY = 0.3;
		container_top.add(warehouse_button);
		

		// map选择，读取用户等级，获取是否能解锁，能否解锁直接写在前端代码里，不要后端接口了
		this.mapInfo = [
			{ name: "BM1-1",id: 1001, isLock: false },
			{ name: "BM1-2",id: 1002, isLock: false },
			{ name: "BM1-3",id: 1003, isLock: false },
			{ name: "BM1-4",id: 1004, isLock: false },
			{ name: "BM1-5",id: 1005, isLock: true },
			{ name: "BM1-6",id: 1006, isLock: false }
		];

		const container_1 = this.add.container(172, 170);
		for (let i = 0; i < this.mapInfo.length; i++) {
            let x = 94 + (i % 2) * 190;
            let y = 64 + Math.trunc(i / 2) * 140;
			const { isLock, name } = this.mapInfo[i];

			const buttonImage = isLock ? '11-目的地内框锁定' : name;
			const button = this.add.image(x, y, buttonImage);
			if (!isLock) {
				button.setInteractive();
				button.on('pointerdown', () => this.selectMapButton(button));
			}
            //button.on('pointerdown', () => this.selectMapButton(button));
            button.scaleX = 0.4;
            button.scaleY = 0.5;

            const border = this.add.image(x, y, '09-目的地内框未选中');
            border.scaleX = 0.41;
            border.scaleY = 0.51;

            container_1.add(button);
            container_1.add(border);
            this.buttons.push({ button, border });
        }

        // 初始化提交按钮
        this.submitButton.on('pointerdown', () => this.submitSelection());

		// container
		// 读取 JSON 数据
		/*const buttonData = {
			"buttons": [
				{ "title": "按钮 1", "description": "基础介绍 1", "isUnlocked": true },
				{ "title": "按钮 2", "description": "基础介绍 2", "isUnlocked": false },
				{ "title": "按钮 3", "description": "基础介绍 3", "isUnlocked": true },
				{ "title": "按钮 4", "description": "基础介绍 4", "isUnlocked": false },
				{ "title": "按钮 5", "description": "基础介绍 5", "isUnlocked": true },
				{ "title": "按钮 6", "description": "基础介绍 6", "isUnlocked": false }
			]
		};*/
		this.buttons_2 = [];
		const container_2 = this.add.container(752, 170);
		for (let i = 0; i < 6; i++) {
            let x = 94 + (i % 2) * 130;
            let y = 64 + Math.trunc(i / 2) * 140;
            
            const button = this.add.image(x, y, '15-装备栏未解锁').setInteractive();
            button.on('pointerdown', () => this.selectButton(button));
            button.scaleX = 0.5;
            button.scaleY = 0.5;

            container_2.add(button);
            this.buttons_2.push(button);
        }

		// 装备栏右边出一块介绍栏
		// 创建一个 Container
		const container = this.add.container(852, 20); // 中心位置

		// 设置背景
		const background = this.add.image(285, 270, '21-装备栏物品详情面板');
		background.scaleX = 0.45; // 设置锚点为中心
		background.scaleY = 0.45;

		//background.setDisplaySize(200, 150); // 设置背景图片的显示大小
		container.add(background);

		// 添加标题
		const title = this.add.text(240, 170, '破板车', { fontSize: '18px', fill: '#ffffff' });
		title.setOrigin(0.5, 0.5);
		container.add(title);

		// 添加两个标签
		const label1 = this.add.text(230, 208, '标签 1', { fontSize: '14px', fill: '#ffffff' });
		const label2 = this.add.text(290, 208, '标签 2', { fontSize: '14px', fill: '#ffffff' });
		container.add(label1);
		container.add(label2);

		// 添加文本展示
		const displayText = this.add.text(260, 260, '这是一个可换行的\n文本展示区域。\n可以包含多个行，\n展示更多信息。', {
			fontSize: '14px',
			fill: '#ffffff',
			wordWrap: { width: 300, useAdvancedWrap: true }
		});
		displayText.setOrigin(0.5, 0);
		container.add(displayText);

		// 添加按钮
		const xiexia = this.add.image(240, 360, '23-装备栏物品详情面板卸下')
			.setInteractive()
			.on('pointerdown', () => {
				console.log('按钮 1 被点击');
			});
		xiexia.scaleX = 0.4;
		xiexia.scaleY = 0.4;

		const swap = this.add.image(325, 360, '22-装备栏物品详情面板替换')
			.setInteractive()
			.on('pointerdown', () => {
				console.log('按钮 2 被点击');
			});
		swap.scaleX = 0.4;
		swap.scaleY = 0.4;

		container.add(xiexia);
		container.add(swap);

		// left_map
		const left_map = this.add.image(100, 360, "07-选择目的地箭头左");
		left_map.scaleX = 0.6258903341725988;
		left_map.scaleY = 0.6377554134541104;

		// right_map
		const right_map = this.add.image(611, 365, "08-选择目的地箭头右");
		right_map.scaleX = 0.6258903341725988;
		right_map.scaleY = 0.6377554134541104;

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */
	selectWareHouseButton() {
		// 启动仓库场景
        this.scene.launch('WareHouse');
	}

	
	selectMapButton(selectedButton) {
        // 如果已有选中按钮，恢复其边框为默认
        if (this.selectedButton) {
			console.log(this.buttons);
            const previousBorder = this.buttons.find(b => b.button === this.selectedButton).border;
            previousBorder.setTexture('09-目的地内框未选中'); // 恢复为默认边框
        }

        // 设置当前选中按钮
        this.selectedButton = selectedButton;

        // 更新边框为已选择的状态
        const currentBorder = this.buttons.find(b => b.button === this.selectedButton).border;
        currentBorder.setTexture('10-目的地内框选中'); // 设置为已选择的边框

		this.submitButton.setTexture('24-出发按钮');
    }

	submitSelection() {
        if (this.selectedButton) {
            const selectedIndex = this.buttons.findIndex(b => b.button === this.selectedButton);
            console.log('Selected button index:', selectedIndex); // 记录选中的按钮索引
			const mapid = this.mapInfo[selectedIndex].id

			// 开始挂机，到子页面中去挂机
			//this.startHang(mapid)


            // 跳转到下一个场景，并带上选中按钮的标记
            this.scene.start('Game', { mapid: mapid });
        }
    }



	create() {
		this.editorCreate();
		// add the background
		this.cameras.main.setBackgroundColor('#90ee90'); 
		// 添加背景图片
		const backgroundImage = this.add.image(0, 0, '01-地点图层');

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