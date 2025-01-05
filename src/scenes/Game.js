
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Game extends Phaser.Scene {

	constructor() {
		super("Game");
		this.userId=2;
		this.items = [];
		this.isHanging = false;
		this.mapid = null;

		this.scrollSpeed = 20; // 滚动速度
        this.offsetY = 0; // Y轴偏移量

		this.itemsTmp = [
            { name: '物品1', probability: '10%' },
            { name: '物品2', probability: '30%' },
            { name: '物品3', probability: '50%' },
			{ name: '物品1', probability: '10%' },
            { name: '物品2', probability: '30%' },
            { name: '物品3', probability: '50%' },
			{ name: '物品1', probability: '10%' },
            { name: '物品2', probability: '30%' },
            { name: '物品3', probability: '50%' },
			{ name: '物品1', probability: '10%' },
            { name: '物品2', probability: '30%' },
            { name: '物品3', probability: '50%' },
			{ name: '物品1', probability: '10%' },
            { name: '物品2', probability: '30%' },
            { name: '物品3', probability: '50%' },
			{ name: '物品1', probability: '10%' },
            { name: '物品2', probability: '30%' },
            { name: '物品3', probability: '50%' },
			{ name: '物品1', probability: '10%' },
            { name: '物品2', probability: '30%' },
            { name: '物品3', probability: '50%' },
			{ name: '物品1', probability: '10%' },
            { name: '物品2', probability: '30%' },
            { name: '物品3', probability: '50%' },
            // 添加更多物品...
        ];


		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	// 看看如何刷新
	async updateItemDisplay(container_1) {
		container_1.removeAll(true);

		// 刷新左侧物品栏
		const maxContains = 60;
		for (let i = 0; i < maxContains; i++) {
			let x = 44 + (i % 6) * 60;
			let y = 20 + Math.trunc(i / 6) * 50;

			const rectWidth = 40;
            const rectHeight = 45;

			// 贴入背景
			const itemBackground = this.add.image(x, y, '16-装备栏白色装备').setOrigin(0.5).setDisplaySize(rectWidth, rectHeight);
            itemBackground.setInteractive();

	
			const isItem = i < this.items.length; // Use this.items instead of itemList
	
			//const imgName = isItem ? this.items[i].id : '16-装备栏白色装备'; // Ensure ori_img_url is available

			/*const border = this.add.image(x, y, '09-目的地内框未选中');
			border.scaleX = 0.1;
			border.scaleY = 0.2;*/
	
			container_1.add(itemBackground);
			if (isItem) {
				const button = this.add.image(x, y, this.items[i].id);
				button.scaleX = 0.1;
				button.scaleY = 0.1;
				
				// 添加数量
				const itemCountText = this.add.text(x, y + 20, `${this.items[i].count}`, { fontSize: '16px', fill: '#fff' })
				.setOrigin(0.5);
				container_1.add(button);
				container_1.add(itemCountText);
			}

			// 右侧详情，只有时间是需要更新的

			//container_1.add(border);
			//this.buttons.push({ button, border });
		}
	}
	
	startRefreshingItems(container) {
        this.refreshInterval = setInterval(async () => {
            const itemList = await this.getItemList(); // 获取物品列表
            await this.updateItemDisplay(container, itemList); // 更新显示
        }, 5000); // 每5秒刷新一次，您可以根据需要调整时间
    }

    shutdown() {
        // 清理定时器
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }


	async getItemList() {
		try {
			const response = await fetch(`http://127.0.0.1:39998/api/v1/trash/check_bag?uid=${this.userId}`);
			if (!response.ok) {
				//throw new Error('Network response was not ok');
				return;
			}
			const apiItems = await response.json();
	        console.log('API Response:', apiItems);

			// Convert to the required structure
			this.items = apiItems.bag_detail.map(item => ({
				id: item.id,
				name: item.name,
				type: item.type,
				typeName: item.type_name,
				count: item.count,
				property: item.property,
				propertyName: item.property_name,
				description: item.desc,
				price: item.price,
				ori_img_url: item.ori_img_url // Ensure this is included
			}));

			// 停止挂机轮询
			if (apiItems.is_hanging == false) {
				this.shutdown();
			}
	
			//console.log('Item List:', this.items);
		} catch (error) {
			console.error('There has been a problem with your fetch operation:', error);
		}
	}

	/** @returns {void} */
	async editorCreate() {

		this.backgroundImage = this.add.image(0, 0, '挂机背景');

		// 设置原点为 (0, 0) 以便从左上角开始
		this.backgroundImage.setOrigin(0, 0);
	
		// 调整图片大小以适应场景
		this.backgroundImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
	
		// 设置深度，确保背景在最底层
		this.backgroundImage.setDepth(-1);

		// 顶部容器，包含仓库，时间，
		const container_top = this.add.container(0,0);

		// warehouse button
		const warehouse_button = this.add.image(100, 100, '02-仓库').setInteractive();
		warehouse_button.on('pointerdown', () => this.selectWareHouseButton());
		warehouse_button.scaleX = 0.3;
        warehouse_button.scaleY = 0.3;
		container_top.add(warehouse_button);

		this.buttons = [];
		const container_1 = this.add.container(222, 140);
		
		// 设置背景
		const backgroundLeft = this.add.image(200, 250, '左边物品栏大面板');
		backgroundLeft.scaleX = 0.35; // 设置锚点为中心
		backgroundLeft.scaleY = 0.35;
	
		container_1.add(backgroundLeft);
	
		// Fetch item list and update display
		//await this.getItemList(); // Wait for the item list to be fetched
		//await this.updateItemDisplay(container_1); // Then update the display
		// 开始周期性获取物品列表，放到出发按钮的逻辑中去

		// 右边，地图内容展示
		// 创建一个 Container

		// 根据mapid获取整体地图信息，调用服务端接口
		const response = await fetch(`http://127.0.0.1:39998/api/v1/map/info?mapid=${this.mapid}`);
		if (!response.ok) {
			//return;
			throw new Error('Network response was not ok');
		}
		const mapInfo = await response.json();
		console.log('API Response:', mapInfo);

		const container = this.add.container(552, 90); // 中心位置

		// 设置背景
		const background = this.add.image(285, 300, '右边挂机中大面板');
		background.scaleX = 0.35; // 设置锚点为中心
		background.scaleY = 0.35;

		//background.setDisplaySize(200, 150); // 设置背景图片的显示大小
		container.add(background);

		// 主关卡
		const title = this.add.text(280, 100, mapInfo.info.mainLevel, { fontSize: '36px', fill: '#ffffff' });
		title.setOrigin(0.5, 0.5);
		container.add(title);

		// 子关卡
		const label1 = this.add.text(180, 150, mapInfo.info.subLevel, { fontSize: '14px', fill: '#ffffff' });
		const label2 = this.add.text(360, 150, '掉落概率', { fontSize: '14px', fill: '#ffffff' });
		container.add(label1);
		container.add(label2);

		this.containerTmp = this.add.container(730, 308); // 创建容器
		// 添加黑色边框
		const border = this.add.graphics();
		border.lineStyle(2, 0x999999, 1); // 线宽、颜色（黑色）、透明度
		border.strokeRect(0, 0, 200, 300); // 边框位置和尺寸
		this.containerTmp.add(border);
		
        this.createLabels();
		// 多个物品的掉落概率
		/*const label3 = this.add.text(180, 268, '物品1', { fontSize: '14px', fill: '#ffffff' });
		const label4 = this.add.text(360, 268, '10%', { fontSize: '14px', fill: '#ffffff' });
		container.add(label3);
		container.add(label4);

		const label5 = this.add.text(180, 298, '物品2', { fontSize: '14px', fill: '#ffffff' });
		const label6 = this.add.text(360, 298, '30%', { fontSize: '14px', fill: '#ffffff' });
		container.add(label5);
		container.add(label6);*/


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

		// 开始挂机按钮，停止
		const startButton = this.add.image(200, 480, '24-出发按钮')
		.setInteractive()
		.on('pointerdown', () => {
			console.log('按钮 出发 被点击');
			this.btnStartHanging(container_1);
		});

		startButton.scaleX = 0.2;
		startButton.scaleY = 0.2;
		container.add(startButton);


		const stopButton = this.add.image(360, 480, '停止按钮')
		.setInteractive()
		.on('pointerdown', () => {
			console.log('按钮 停止 被点击');
			this.btnStopHanging();
		});


		stopButton.scaleX = 0.2;
		stopButton.scaleY = 0.2;
		container.add(stopButton);

		this.events.emit("scene-awake");

		const closeButton = this.add.text(this.cameras.main.width - 100, 20, '关闭', { fontSize: '24px', fill: '#ff0000' })
		.setInteractive()
		.on('pointerdown', () => {
			container.destroy();
			container_1.destroy();
			container_top.destroy();
			this.backgroundImage.destroy();
			this.scene.start('Trash');
			this.shutdown();
		});
		container_top.add(closeButton);

	}

	/* START-USER-CODE */

	// Write your code here

	init(data) {
        this.selectedButtonIndex = data.selectedButtonIndex; // map id		

    }

	btnStartHanging(container_1) {
		// 调用后端接口开始挂机，先不判断
		this.startHang();

		// 页面开始刷新
		this.startRefreshingItems(container_1);
	}

	btnStopHanging() {
		// 停止刷新
		this.shutdown();
	}


	selectWareHouseButton() {
		// 启动仓库场景
        this.scene.launch('WareHouse');
	}
	
	create(data) {


		// 监听滚轮事件
		this.input.on('wheel', this.handleScroll, this);

		const mapid = data.mapid;
        console.log('Received mapid:', mapid);
		this.mapid = mapid;
		this.editorCreate();
		//this.cameras.main.setBackgroundColor('#3498db'); 
		 // 添加背景图片
		 //this.add.image(0, 0, '挂机背景').setOrigin(0, 0);
		 //this.cameras.main.setBounds(0, 0, this.game.config.width, this.game.config.height);
		 // 添加背景图片
	}

	async startHang() {
		this.userId = 2
		try {
			const response = await fetch(`http://127.0.0.1:39998/api/v1/trash/start_hanging?uid=${this.userId}&mapid=${this.mapid}&tools=1`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
			const result = await response.json();
			console.log('API call successful:', result);
		} catch (error) {
			console.error('Error while calling API:', error);
			throw error; // 抛出错误以便在 submitSelection 中处理
		}
	}

	handleScroll(pointer, gameObjects, deltaX, deltaY) {
		console.log('Scroll event triggered:', deltaY);
		console.log('scrollSpeed:', this.scrollSpeed);

        // 根据滚轮的方向调整偏移量
        this.offsetY += deltaY > 0 ? -this.scrollSpeed : this.scrollSpeed;
		//console.log('offsetY1:', this.containerTmp.height);

        // 限制偏移量范围
        this.offsetY = Phaser.Math.Clamp(this.offsetY, -this.containerTmp.height, 0);

        // 更新标签位置
        this.createLabels();
    }

	createLabels() {
        this.containerTmp.removeAll(true); // 清空容器中的内容

        this.itemsTmp.forEach((item, index) => {
            const label1 = this.add.text(0, index * 30 + this.offsetY, item.name, { fontSize: '14px', fill: '#ffffff' });
            const label2 = this.add.text(180, index * 30 + this.offsetY, item.probability, { fontSize: '14px', fill: '#ffffff' });
            this.containerTmp.add(label1);
            this.containerTmp.add(label2);
        });

		const totalHeight = this.itemsTmp.length * 30; // 每个标签的高度
		console.log('Container height:', totalHeight);
		this.containerTmp.height = totalHeight; // 手动设置容器高度
    }

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
