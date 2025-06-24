import InventorySlot from './inventorySlot.js'
import Layers from './layers.js'

/*
 * inventory.js
 * Class for handling the inventory in the game.
 * Contains all the functions to create and handle the inventory in the game.
*/
export default class Inventory {
	#inventoryOpen = false;

	constructor(scene) {
		this.scene = scene;
		this.inventorySlots = 6;
		this.slotSize = 120;
		this.slotScale = 0.8;
	}

	// Function to create the inventory
	createInventory() {
		// Create container for inventory
		this.inventoryContainer = this.scene.add.container(0, 0);
		this.inventoryContainer.setScrollFactor(0);

		// Create background for inventory
		const background = this.scene.add.image(this.scene.game.canvas.width / 2, this.scene.game.canvas.height / 2, "inventory_open");
		background.setOrigin(0.5);
		background.setScale(0.8);
		this.inventoryContainer.add(background);
		this.inventoryContainer.setDepth(Layers.UI);

		// Create slots array
		this.slots = [];
		for (let i = 0; i < this.inventorySlots; i++) {
			const x = (this.scene.game.canvas.width / 3.7) + ((i % 2) * this.slotSize);
			const y = (this.scene.game.canvas.height / 3.2) + Math.floor(i / 2) * this.slotSize;

			// Create container for individual slot
			const container = this.scene.add.container(x, y);
			const slotBackground = this.scene.add.image(0, 0, "inventory_slot");
			slotBackground.setOrigin(0);
			slotBackground.setScale(this.slotScale);
			container.add(slotBackground);

			// Create individual slot
			const slot = new InventorySlot(container, this.slotSize);

			// Toggle active state of first slot
			if (i === 0) {
				slot.toggleActive();
			}
			
			// Push individual slot to the slots array
			this.slots.push(slot);
		}

		// Add each slot to the inventory container
		this.slots.forEach(slot => this.inventoryContainer.add(slot.container));
		this.inventoryContainer.setVisible(this.inventoryOpen);
		this.createInventoryButton();
	}

	// Function to add an item to the inventory
	addItemToInventory(itemKey) {
		// Find the first empty slot
		const emptySlot = this.slots.findIndex(slot => slot.container.item === undefined);
		
		// Check if there is an empty slot
		if (emptySlot !== -1) {
			const x = this.slotSize / 2;
			const y = this.slotSize / 2;

			// Add the sprite to the empty slot
			const itemSprite = this.scene.add.sprite(x, y, itemKey);
			itemSprite.setOrigin(0.5);
			itemSprite.setScale((100 / itemSprite.width * ((this.slotSize * this.slotScale) * 0.75)) / 100);

			this.slots[emptySlot].container.add(itemSprite);

			// Set the item of the empty slot
			this.slots[emptySlot].container.item = {
				sprite: itemSprite,
				key: itemKey
			}

			return true;
		} else {
			// TODO: Implement logic to handle full inventory
			console.log("Inventory is full!");
			return false;
		}
	}

	// Function to get the inventory open state
	getInventoryOpen() {
		return this.#inventoryOpen;
	}

	// Function to toggle the inventory open state
	toggleInventoryOpen() {
		this.#inventoryOpen = !this.#inventoryOpen;
		this.inventoryContainer.setVisible(this.#inventoryOpen);
		// this.inventoryButton.setVisible(!this.#inventoryOpen)
	}

	// Function to use an item from the inventory
	useItem() {
		const slot = this.inventory.slots[this.inventory.getActiveSlot()];
		if (slot.container.item !== undefined) {
			// Equip glasses
			this.playerContainer.add(slot.container.item.sprite);
			// Flip glasses if player is flipped
			if (this.flipX === true) {
				slot.container.item.sprite.flipX = true;
			}

			// Destroy the item after use
		//	slot.container.item.sprite.destroy();
		//	slot.container.item = undefined;
		}
	}

	// Function to change the active slot to the left
	activeSlotLeft() {
		this.inventory.changeActiveSlot(-1)
	}

	// Function to change the active slot to the right
	activeSlotRight() {
		this.inventory.changeActiveSlot(1)
	}

	// Function to change the active slot
	changeActiveSlot(direction) {
		const activeSlot = this.getActiveSlot();
		this.slots[activeSlot].toggleActive();

		// Logic to handle the slot index
		var slotIndex;
		if (activeSlot === this.slots.length - 1 && direction > 0) {
			slotIndex = 0
		} else if (activeSlot === 0 && direction < 0) {
			slotIndex = this.slots.length -1
		} else {
			slotIndex = activeSlot + direction;
		}

		// Toggle the state of the slot
		this.slots[slotIndex].toggleActive();
	}

	// Function to get the active slot
	getActiveSlot() {
		return this.slots.findIndex(slot => slot.getActive() === true);
	}

	createInventoryButton() {
		this.inventoryButton = this.scene.add.image(0, 0, "journal_closed")
			.setScale(0.15)
			.setOrigin(0.5)
			.setScrollFactor(0)
			.setInteractive()
			.on('pointerover', () => {this.inventoryButton.setTexture("journal_opening")})
			.on('pointerout', () => {this.inventoryButton.setTexture("journal_closed")})
			.on('pointerdown', () => { this.toggleInventoryOpen() });
		this.inventoryButton.setPosition(this.scene.game.canvas.width - (this.inventoryButton.width * 0.15 / 2), (this.inventoryButton.height * 0.15) / 2);
	}
}