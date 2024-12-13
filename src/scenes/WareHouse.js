
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class WareHouse extends Phaser.Scene {

	constructor() {
		super("WareHouse");

		// 定义物品数据
        /*this.items = [
            { name: '物品1', image: 'item1', description: '这是物品1的描述',type: '类型1', quantity: 10 },
            { name: '物品2', image: 'item2', description: '这是物品2的描述',type: '类型1', quantity: 5 },
            { name: '物品3', image: 'item3', description: '这是物品3的描述',type: '类型1', quantity: 3 },
            { name: '物品4', image: 'item4', description: '这是物品4的描述',type: '类型1', quantity: 8 },
            { name: '物品5', image: 'item5', description: '这是物品5的描述',type: '类型2', quantity: 2 },
			{ name: '物品6', image: 'item6', description: '这是物品6的描述',type: '类型2', quantity: 10 },
            { name: '物品7', image: 'item7', description: '这是物品7的描述',type: '类型2', quantity: 5 },
            { name: '物品8', image: 'item8', description: '这是物品8的描述',type: '类型3', quantity: 3 },
            { name: '物品9', image: 'item9', description: '这是物品9的描述',type: '类型3', quantity: 8 },
            { name: '物品10', image: 'item10', description: '这是物品10的描述',type: '类型4', quantity: 2 }
        ];*/

		// 初始化 UI 组件的属性
        this.title = null;
        this.itemImage = null;
        this.description = null;
        this.sellAmountInput = null;
        this.items = [];
        this.userId=1;

	}



	showWarehouse() {
        // 创建覆盖全屏的背景
        const background = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 1).setOrigin(0);
        
		// 物品栏
        const itemContainer = this.add.container(200, 100);
        this.createItemGrid(itemContainer);

        // 物品详情
        const detailContainer = this.add.container(800, 100);
        this.createItemDetail(detailContainer);

        // 顶部信息
        const goldBalance = 1000; // 初始金币余额
        const itemCount = this.items.length; // 物品总数
        const coins = this.add.text(20, 20, `金币: ${goldBalance}`, { fontSize: '24px', fill: '#fff' });
        const itemSum = this.add.text(200, 20, `物品总数: ${itemCount}`, { fontSize: '24px', fill: '#fff' });
        
        const closeButton = this.add.text(this.cameras.main.width - 100, 20, '关闭', { fontSize: '24px', fill: '#ff0000' })
            .setInteractive()
            .on('pointerdown', () => {
                background.destroy();
                closeButton.destroy();
                categoryIcons.forEach(icon => icon.destroy());
                itemContainer.destroy();
                detailContainer.destroy();
				itemSum.destroy();
				coins.destroy();
            });

        // 物品种类
        const categories = ['全部', '类型1', '类型2', '类型3', '类型4'];
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
            const response = await fetch(`http://127.0.0.1:8999/api/v1/item/user_items?type=1&uid=${this.userId}`);
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
                property: item.property, // 属性
                propertyName: item.property_name, // 属性名称
                duringTime: item.during_time, // 持续时间
                description: item.desc, // 描述
                oriImgUrl: item.ori_img_url, // 原始图像 URL
                tinyImgUrl: item.tiny_img_url, // 小图像 URL
                source: item.source, // 来源
                level: item.level, // 等级
                material: item.material, // 材料
                weight: item.weight, // 重量
                exp: item.exp, // 经验
                price: item.price, // 价格
                probability: item.Probability // 概率
            }));

            console.log('Item List:', this.items);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    createItemGrid(container) {
		const itemSlots = [];
		const slotWidth = 60;  // 每个槽的宽度
		const slotHeight = 60; // 每个槽的高度
		const cols = 6; // 每行的槽数
		for (let i = 0; i < this.items.length; i++) { // 使用 items 数组的长度
			const x = (i % cols) * slotWidth; // 根据列数计算 x 坐标
			const y = Math.floor(i / cols) * slotHeight; // 根据行数计算 y 坐标

			const itemSlot = this.add.sprite(x, y, 'item1') // 使用物品图像
				.setOrigin(0.5)
				.setInteractive();

			itemSlot.setData('index', i); // 存储索引数据
			itemSlot.on('pointerdown', () => {
				itemSlots.forEach(slot => slot.clearTint()); // 清除其他选中状态
				itemSlot.setTint(0xffff00); // 选中边框颜色
				this.updateItemDetail(itemSlot);
			});

			itemSlots.push(itemSlot);
			container.add(itemSlot);
		}
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
        this.itemImage.setTexture(item.image); // 更新物品图片
        this.description.setText(item.description); // 更新描述
        this.sellAmountInput.setText(`售出数量: ${item.quantity}`); // 显示数量
	}

    createItemDetail(container) {
        // 使用类属性定义 UI 组件
        this.title = this.add.text(0, 0, '物品详情', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.itemImage = this.add.image(0, 40, 'item1').setOrigin(0.5);
        this.description = this.add.text(0, 100, '物品描述...', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);
        this.sellAmountInput = this.add.text(0, 140, '售出数量: 0', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);
        const sellButton = this.add.text(0, 180, '出售', { fontSize: '24px', fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => {
                // 处理出售逻辑
                console.log('出售逻辑处理');
            });
        
        container.add([this.title, this.itemImage, this.description, this.sellAmountInput, sellButton]);
    }

    async updateItemDisplay(itemContainer, selectedTypeIndex) {
        const selectedType = ['全部', '类型1', '类型2', '类型3', '类型4'][selectedTypeIndex];
        let filteredItems;
        await this.getItemList();

        if (selectedType === '全部') {
            // 如果选择的是“全部”，则显示所有物品
            filteredItems = this.items;
        } else {
            // 否则根据类型过滤物品
            filteredItems = this.items.filter(item => item.type === selectedType);
        }

        // 清空现有的物品槽
        itemContainer.removeAll(true); // 假设 itemContainer 是物品槽的容器

        filteredItems.forEach((item, index) => {
            const x = (index % 6) * 60; // 计算 x 坐标
            const y = Math.floor(index / 6) * 60; // 计算 y 坐标

            const itemSlot = this.add.sprite(x, y, item.oriImgUrl) // 使用物品的相应图像
                .setOrigin(0.5)
                .setInteractive();
            itemSlot.scaleX = 0.2;
		    itemSlot.scaleY = 0.2;

            itemSlot.setData('index', index); // 存储索引数据
            itemSlot.on('pointerdown', () => {
                this.updateItemDetail(itemSlot);
            });

            itemContainer.add(itemSlot); // 将物品槽添加到容器中
        });

        // 如果没有物品可显示，可以更新物品详情区域以显示消息
        if (filteredItems.length === 0) {
            this.title.setText('无可用物品');
            this.itemImage.setTexture('defaultImage'); // 使用默认图像
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
