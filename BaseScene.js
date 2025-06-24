import PlayerPrefab from "../prefabs/PlayerPrefab.js";
import DebuggingContainer from "../prefabs/DebuggingContainer.js";
import Layers from "../components/layers.js";

/*
 * baseScene.js
 * Base class for all scenes in the game.
 * Contains basic scene setup, updates and interactions.
*/
export default class BaseScene extends Phaser.Scene {
	player;
	debuggingContainer;
	currentOverlappingItem;
	sceneScale;
	keys = {
		essentialKeys: {},
		movementKeys: {},
		gameplayKeys: {}
	};

	constructor(sceneName, sceneScale) {
		super(sceneName);
		this.sceneScale = sceneScale;
	}

	// Function to setup the scene
	setupScene(data) {
		this.createBasicInputs();
		this.createPlayer(data);
		this.createAssets();
	}

	// Function to create the player
	createPlayer(data) {
		const player = new PlayerPrefab(this, 0, 0);
		this.add.existing(player);
		this.player = player;

		// Add player to player container
		this.player.playerContainer.add([this.player, this.player.empathyMeter.background, this.player.empathyMeter.bar]);
		if (data.playerX != undefined && data.playerY != undefined) {
			this.player.playerContainer.x = data.playerX;
			this.player.playerContainer.y = data.playerY;
		}

		this.player.playerContainer.setDepth(Layers.PLAYER);
		
		// Update player inventory if there has been one passed
		if (data.inventory) {
			this.player.updateInventory(data.inventory);
		}

		// Update empathy amount
		if (data.empathyAmount) {
			this.player.empathyAmount = data.empathyAmount;
			this.player.updateEmpathyMeter();
		}

		// Update scale of player to scene scale
		if (this.sceneScale) {
			this.player.setScale(this.player.scale * this.sceneScale);	
		}
	}

	// Function to create inputs that are the same across all scenes
	createBasicInputs() {
		// Create key inputs for movement
		this.keys.movementKeys.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.keys.movementKeys.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.keys.movementKeys.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.keys.movementKeys.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.keys.movementKeys.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

		// Create key inputs that are always enabled
		this.keys.essentialKeys.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', this.close, this);
		this.keys.essentialKeys.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).on('down', this.interact, this);
	}

	// Function to create assets that are the same across all scenes
	createAssets() {
		// TODO: If there are any assets (like a gui) that should be the same across all scenes, create them here.
		this.createDebuggingContainer();
		
	}

	// Function to create the debugging container
	createDebuggingContainer() {
		const debuggingContainer = new DebuggingContainer(this, 0, 0);
		this.add.existing(debuggingContainer);
		
		this.debuggingContainer = debuggingContainer;
	}

	// Function to handle the updates that occur in all scenes
	basicUpdates() {
		this.player.handleMovement(this);

		this.debuggingContainer.updateDebugging(
			this.player.x,
			this.player.y, 
			this.player.playerContainer.body.velocity.x,
			this.player.playerContainer.body.velocity.y,
			this.player.playerContainer.x,
			this.player.playerContainer.y,
			this.player.headOffsetX,
			this.player.headOffsetY,
			this.player.anims.currentFrame
		);
		
		// Check if player is overlapping with item
		this.checkOverlapping();
	}

	// Function to handle basic interactions that occur in all scenes
	basicInteractions() {
		if (this.currentOverlappingItem) {
			this.player.inventory.addItemToInventory(this.currentOverlappingItem.texture.key)

			this.currentOverlappingItem.destroy();
			this.currentOverlappingItem = null;
		}
	}

	// Function to check if Player is overlapping with Object
	checkOverlapping() {
		let isOverlapping = false;
		if (this.currentOverlappingItem && this.currentOverlappingItem.active) {
			this.physics.overlap(this.player.playerContainer, this.currentOverlappingItem, () => { isOverlapping = true; });

			if (!isOverlapping) {
				this.currentOverlappingItem.setScale(0.3, 0.3);
				this.currentOverlappingItem = null;
			} else {
				this.currentOverlappingItem.setScale(0.4, 0.4);
			}

		}
	}

	// Function to handle ESC key being pressed
	close() {
		if (this.dialogue.isOpen !== undefined & this.dialogue.isOpen === true) {
			this.dialogue.removeOptions();
			this.dialogue.toggleDialogue();
			this.enableKeyInputs();
		}
	}

	// Function to disableKeyInputs
	disableKeyInputs() {
		Object.keys(this.keys.movementKeys).forEach(key => {
			this.keys.movementKeys[key].enabled = false;
		});

		Object.keys(this.keys.gameplayKeys).forEach(key => {
			this.keys.gameplayKeys[key].enabled = false;
		});
	}

	// Function to enableKeyInputs
	enableKeyInputs() {
		Object.keys(this.keys.movementKeys).forEach(key => {
			this.keys.movementKeys[key].enabled = true;
		});

		Object.keys(this.keys.gameplayKeys).forEach(key => {
			this.keys.gameplayKeys[key].enabled = true;
		});
	}

	// Function to pass player data to a new scene
	getPlayerData(x, y) {
		return {
			playerX: x,
			playerY: y,
			inventory: this.player.inventory,
			empathyAmount: this.player.empathyAmount
		}
	}
}