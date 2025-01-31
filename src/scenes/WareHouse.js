
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
import { IP_ADDRESS } from '../const.js';

export default class WareHouse extends Phaser.Scene {

	constructor() {
		super("WareHouse");

		// 初始化 UI 组件的属性
        this.title = null;
        this.itemImage = null;
        this.description = null;
        this.sellAmountInput = null;
        this.items = [];
        this.coinsText = null;
        this.userId=2;
        this.itemIndex = 0;
        this.itemIndex = 0;

        // 容器
        this.itemContainer = null;

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
        this.itemContainer = this.add.container(200, 100);
        this.createItemGrid(this.itemContainer);

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
        this.coinsText = this.add.text(20, 20, `金币: ${0}`, { fontSize: '24px', fill: '#fff' });
        const itemSum = this.add.text(200, 20, `物品总数: ${itemCount}`, { fontSize: '24px', fill: '#fff' });
        
        const closeButton = this.add.text(this.cameras.main.width - 100, 20, '关闭', { fontSize: '24px', fill: '#ff0000' })
            .setInteractive()
            .on('pointerdown', () => {
                backgroundImage.destroy();
                closeButton.destroy();
                categoryIcons.forEach(icon => icon.destroy());
                this.itemContainer.destroy();
                detailContainer.destroy();
				itemSum.destroy();
				this.coinsText.destroy();
                //this.inputElement.destroy();
                document.body.removeChild(this.inputElement); // 从 DOM 中移除输入框
                this.inputElement = null; // 清除引用
            });

        // 物品种类
        const categories = ['全部', '类型1', '类型2', '类型3', '类型4', '类型5'];
        const categoryIcons = [];
        categories.forEach((category, index) => {
            const icon = this.add.text(50, 100 + index * 60, category, { fontSize: '24px', fill: '#fff' })
                .setInteractive()
                .on('pointerdown', () => {
                    this.updateCategoryIcons(categoryIcons, index);
                    this.updateItemDisplay(index); // 更新右侧物品显示
                });
            categoryIcons.push(icon);
        });
        this.updateItemDisplay(0); // 0 对应“全部”
    }

    updateCategoryIcons(icons, selectedIndex) {
        icons.forEach((icon, index) => {
            const isSelected = index === selectedIndex;
            icon.setTint(isSelected ? 0x00ff00 : 0xffffff);
        });
    }

    async getItemList() {
        try {
            console.log("getItemList");
            const response = await fetch(`${IP_ADDRESS}/api/v1/item/user_items?type=1&uid=${this.userId}`);
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

            console.log(this.items);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    async getUserInfo() {
        try {
            const response = await fetch(`${IP_ADDRESS}/api/v1/user/info?uid=${this.userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const info = await response.json(); // 从 API 获取的原始数据
            this.coins = info.money;
            } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
    createItemGrid(container) {
		container.setSize(400, 600); // 设置容器大小
	}

	async updateItemDetail(itemId) {
        // 根据 itemId 查找物品
        console.log(itemId);
        const item = this.items.find(i => i.id === itemId);
		if (!item) {
			console.error(`未找到索引为 ${index} 的物品`);
			return; // 提前返回以避免错误
		}
        // 更新物品详情区域的内容
        this.title.setText(item.name); // 更新标题
        this.itemImage.setTexture(item.id); // 更新物品图片

        // updateItemDetail
        console.log("updateItemDetail !");
        //console.log(item);
        this.description.setText(item.description); // 更新描述
        this.sellAmountInput.setText(`数量: ${item.count}`); // 显示数量
        this.itemPrice = item.price;
        this.itemQuantity = item.count;
        this.itemId = item.id;
	}

    createItemDetail(container) {

        // 使用类属性定义 UI 组件
        this.title = this.add.text(80, -30, '物品详情', { fontSize: '20px', fill: '#fff' }).setOrigin(0,0);
        this.itemImage = this.add.image(120, 90, 'placeholderImage').setOrigin(0.5);
        this.itemImage.scaleX = 0.25;
        this.itemImage.scaleY = 0.25;
        this.description = this.add.text(80, 200, '物品描述...', { fontSize: '16px', fill: '#fff' }).setOrigin(0);
        this.sellAmountInput = this.add.text(80, 240, '数量: 0', { fontSize: '16px', fill: '#fff' }).setOrigin(0);
        const sellButton = this.add.image(360, 515, '出售')
            .setInteractive()
            .on('pointerdown', () => {
                // 处理出售逻辑
                console.log('出售逻辑处理');
                this.sellItem();
            });
        sellButton.scaleX = 0.35;
        sellButton.scaleY = 0.35;

        // 创建显示可售价格的文本
        this.priceText = this.add.text(380, 460, '0', { fontSize: '24px', fill: '#fff' });

        // 创建输入框
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'number';
        this.inputElement.style.position = 'absolute';
        this.inputElement.style.width = '70px';
        this.inputElement.style.fontSize = '20px';
        this.inputElement.style.zIndex = '1000';
        document.body.appendChild(this.inputElement);

        // 更新可售价格
        this.inputElement.addEventListener('input', () => {
            const quantity = parseInt(this.inputElement.value) || 0;
            console.log(quantity,this.itemPrice);
            if (quantity <= this.itemQuantity) {
                const totalPrice = quantity * this.itemPrice;
                this.priceText.setText(`${totalPrice}`);
            } else {
                this.priceText.setText('0');
            }
        });

        
        container.add([this.title, this.itemImage, this.description, this.sellAmountInput, this.priceText, sellButton]);

        this.updateInputPosition(sellButton.getBounds().x, sellButton.getBounds().y);
    }

    // 更新左边仓库详情
    async updateItemDisplay(selectedTypeIndex) {
        const selectedType = [0, 1, 2, 3, 4, 5][selectedTypeIndex];
        let filteredItems;
        await this.getItemList();
        await this.getUserInfo();
        if (selectedType === 0) {
            // 如果选择的是“全部”，则显示所有物品
            filteredItems = this.items;
        } else {
            // 否则根据类型过滤物品
            filteredItems = this.items.filter(item => item.type === selectedType);
        }

        // 清空现有的物品槽
        this.itemContainer.removeAll(true); // 假设 itemContainer 是物品槽的容器

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

            //itemBackground.setData('index', index); // 存储索引数据
            itemBackground.on('pointerdown', () => {
                this.itemIndex = itemBackground;
                this.updateItemDetail(item.id);
            });


            this.itemContainer.add(itemBackground);
            this.itemContainer.add(itemSlot); // 将物品槽添加到容器中
            this.itemContainer.add(itemCountText);
        });

        // 如果没有物品可显示，可以更新物品详情区域以显示消息
        if (filteredItems.length === 0) {
            this.title.setText('无可用物品');
            //this.itemImage.setTexture('defaultImage'); // 使用默认图像
            this.itemImage.setVisible(false);
            this.description.setText('没有此类型的物品。');
            this.sellAmountInput.setText('数量: 0');
        }

        // 更新总金币
        this.coinsText.setText(`金币: ${this.coins}`);

    }


    openInput() {
        this.inputElement.style.display = 'block';
        this.inputElement.focus();
    }

    async sellItem() {
        const quantity = parseInt(this.inputElement.value) || 0;

        if (quantity > this.itemQuantity) {
            alert('数量超过可售数量！');
            return;
        }

        // 调用后端接口售卖，传入 itemId 和数量
        const success = await this.sellToBackend(quantity); // 传入 itemId 和数量

        /*if (success) {
            alert('售卖成功！');
        } else {
            alert('售卖失败！');
        }*/

        // 清空输入框和价格
        this.inputElement.value = '';
        this.priceText.setText('0');
        //this.inputElement.style.display = 'none'; // 隐藏输入框
        console.log("update page!");

        // 更新页面
        await this.updateItemDisplay(0);
        this.updateItemDetail(this.itemId);
    }


    async sellToBackend(quantity) {

        //console.log(this.itemId, quantity);
        //return;
        const response = await fetch(`${IP_ADDRESS}/api/v1/item/sell?uid=${this.userId}&item_id=${this.itemId}&count=${quantity}`);
        if (!response.ok) {
            //throw new Error('Network response was not ok');
        }
        //const result = await response.json();
        //console.log('API call successful:', result);
        return;
    }


    // 方法用于根据其他元素的位置更新输入框位置
    updateInputPosition(x,y) {
        console.log(x,y);
        // 获取容器的世界坐标
        this.inputElement.style.left = x ; // 从左侧占据 10% 的宽度
        this.inputElement.style.top = y; // 从顶部占据 50% 的高度
    }

	create() {
		 // 展示仓库
		 this.showWarehouse()
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
