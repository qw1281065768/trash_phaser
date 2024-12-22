
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class WareHouse extends Phaser.Scene {

	constructor() {
		super("WareHouse");

		// 初始化 UI 组件的属性
        this.title = null;
        this.itemImage = null;
        this.description = null;
        this.sellAmountInput = null;
        this.items = [];
        this.userId=2;

	}



	showWarehouse() {
        // 创建覆盖全屏的背景
        //const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 1).setOrigin(0);
        // 添加背景图片
		 const backgroundImage = this.add.image(0, 0, 'bg-仓库');
		 // 设置原点为 (0, 0) 以便从左上角开始
		 backgroundImage.setOrigin(0, 0);
		 // 调整图片大小以适应场景
		 backgroundImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
		 // 设置深度，确保背景在最底层
		 backgroundImage.setDepth(-1);
        
		// 物品栏
        const itemContainer = this.add.container(200, 100);
        this.createItemGrid(itemContainer);
        

        // 物品详情
        const detailContainer = this.add.container(800, 100);
        // 设置背景
		const backgroundRight = this.add.image(250, 250, '详情面板');
		backgroundRight.scaleX = 0.35; // 设置锚点为中心
		backgroundRight.scaleY = 0.35;
        detailContainer.add(backgroundRight);
        this.createItemDetail(detailContainer);

        // 顶部信息
        const goldBalance = 1000; // 初始金币余额
        const itemCount = this.items.length; // 物品总数
        const coins = this.add.text(20, 20, `金币: ${goldBalance}`, { fontSize: '24px', fill: '#fff' });
        const itemSum = this.add.text(200, 20, `物品总数: ${itemCount}`, { fontSize: '24px', fill: '#fff' });
        
        const closeButton = this.add.text(this.cameras.main.width - 100, 20, '关闭', { fontSize: '24px', fill: '#ff0000' })
            .setInteractive()
            .on('pointerdown', () => {
                backgroundImage.destroy();
                closeButton.destroy();
                categoryIcons.forEach(icon => icon.destroy());
                itemContainer.destroy();
                detailContainer.destroy();
				itemSum.destroy();
				coins.destroy();
            });

        // 物品种类
        const categories = ['全部', '类型1', '类型2', '类型3', '类型4', '类型5'];
        const categoryIcons = [];
        categories.forEach((category, index) => {
            const icon = this.add.text(50, 100 + index * 60, category, { fontSize: '24px', fill: '#fff' })
                .setInteractive()
                .on('pointerdown', () => {
                    this.updateCategoryIcons(categoryIcons, index);
                    this.updateItemDisplay(itemContainer, index); // 更新右侧物品显示
                });
            categoryIcons.push(icon);
        });
        this.updateItemDisplay(itemContainer, 0); // 0 对应“全部”
    }

    updateCategoryIcons(icons, selectedIndex) {
        icons.forEach((icon, index) => {
            const isSelected = index === selectedIndex;
            icon.setTint(isSelected ? 0x00ff00 : 0xffffff);
        });
    }

    async getItemList() {
        try {
            const response = await fetch(`http://127.0.0.1:39998/api/v1/item/user_items?type=1&uid=${this.userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const apiItems = await response.json(); // 从 API 获取的原始数据

            // 转换为所需的结构
            this.items = apiItems.map(item => ({
                id: item.id, // ID
                name: item.name, // 物品名称
                type: item.type, // 物品类型
                typeName: item.type_name, // 类型名称
                count: item.count, // 数量
                property: item.property, // 属性
                propertyName: item.property_name, // 属性名称
                description: item.desc, // 描述
                price: item.price // 价格
            }));

            console.log('Item List:', this.items);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    createItemGrid(container) {
		container.setSize(400, 600); // 设置容器大小
	}

	updateItemDetail(selectedSlot) {
        const index = selectedSlot.getData('index'); // 获取选中槽的索引
        const item = this.items[index]; // 根据索引获取物品信息
		if (!item) {
			console.error(`未找到索引为 ${index} 的物品`);
			return; // 提前返回以避免错误
		}
        // 更新物品详情区域的内容
        this.title.setText(item.name); // 更新标题
        this.itemImage.setTexture(item.id); // 更新物品图片

        this.description.setText(item.description); // 更新描述
        this.sellAmountInput.setText(`售出数量: ${item.quantity}`); // 显示数量
	}

    createItemDetail(container) {

        // 使用类属性定义 UI 组件
        this.title = this.add.text(120, -20, '物品详情', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
        this.itemImage = this.add.image(120, 90, 'placeholderImage').setOrigin(0.5);
        this.itemImage.scaleX = 0.25;
        this.itemImage.scaleY = 0.25;
        this.description = this.add.text(120, 200, '物品描述...', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);
        this.sellAmountInput = this.add.text(120, 240, '售出数量: 0', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);
        const sellButton = this.add.text(360, 500, '出售', { fontSize: '24px', fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => {
                // 处理出售逻辑
                console.log('出售逻辑处理');
            });
        
        container.add([this.title, this.itemImage, this.description, this.sellAmountInput, sellButton]);
    }

    async updateItemDisplay(itemContainer, selectedTypeIndex) {
        const selectedType = [0, 1, 2, 3, 4, 5][selectedTypeIndex];
        let filteredItems;
        await this.getItemList();

        if (selectedType === 0) {
            // 如果选择的是“全部”，则显示所有物品
            filteredItems = this.items;
        } else {
            // 否则根据类型过滤物品
            filteredItems = this.items.filter(item => item.type === selectedType);
        }

        // 清空现有的物品槽
        itemContainer.removeAll(true); // 假设 itemContainer 是物品槽的容器

        filteredItems.forEach((item, index) => {
            const x = (index % 7) * 90; // 计算 x 坐标
            const y = Math.floor(index / 7) * 100; // 计算 y 坐标

            const rectWidth = 80;
            const rectHeight = 95;
    
            // 添加背景图
            const itemBackground = this.add.image(x, y, '大框').setOrigin(0.5).setDisplaySize(rectWidth, rectHeight);
            itemBackground.setInteractive();

            const itemSlot = this.add.sprite(x, y, item.id) // 使用物品的相应图像
                .setOrigin(0.5)
                //.setInteractive();
            itemSlot.scaleX = 0.15;
		    itemSlot.scaleY = 0.15;

            // 添加数量
            const itemCountText = this.add.text(x, y + 40, `${item.count}`, { fontSize: '16px', fill: '#fff' })
            .setOrigin(0.5);

            itemBackground.setData('index', index); // 存储索引数据
            itemBackground.on('pointerdown', () => {
                this.updateItemDetail(itemBackground);
            });


            itemContainer.add(itemBackground);
            itemContainer.add(itemSlot); // 将物品槽添加到容器中
            itemContainer.add(itemCountText);
        });

        // 如果没有物品可显示，可以更新物品详情区域以显示消息
        if (filteredItems.length === 0) {
            this.title.setText('无可用物品');
            //this.itemImage.setTexture('defaultImage'); // 使用默认图像
            this.itemImage.setVisible(false);
            this.description.setText('没有此类型的物品。');
            this.sellAmountInput.setText('售出数量: 0');
        }
    }

	create() {
		 // 展示仓库
		 this.showWarehouse()
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
