import Layers from './layers.js'

/*
 * npc.js
 * Class for handling npc's in the game.
 * Contains functions to create and handle npc's in the game.
*/
export default class Npc extends Phaser.Physics.Arcade.Sprite {
    #name = "";

    constructor(scene, name, x, y, texture, frame) {
        super(scene, x ?? 500, y ?? 300, texture || "14_human_sprite_base", frame ?? 0);
        this.#name = name;
        this.setDepth(Layers.ENVIRONMENT);
    }

    getName() {
        return this.#name;
    }

    setName(name) {
        this.#name = name;
    }

    // Shorthand function to add npc to scene and create a body and collider with player
    addToScene() {
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.immovable = true;
        this.scene.physics.add.collider(this.scene.player.playerContainer, this);
    }

    // Shorthand function to set the body
    setBody(width, height, offsetX, offsetY) {
        this.body.setSize(width, height);
        this.body.setOffset(offsetX, offsetY);
    }

    // Function to add a body that allows the handling of interactions
    addInteractionBody() {
        // Get the distance from origin to left and top edge of the body
        const npcRadiusX = (this.body.width * this.scaleX) * this.originX;
        const npcRadiusY = (this.body.height * this.scaleY) * this.originY;

        // Create the interaction body
        this.interactionBody = this.scene.add.rectangle(this.x - npcRadiusX, this.y - npcRadiusY);
        this.interactionBody.setOrigin(0, 0);

        // Set the size of the interaction body
        this.interactionBody.height = this.body.height * this.scaleY / 3 * 1.5;
        this.interactionBody.width = this.body.width * this.scaleX * 1.5;

        // Adjust the placement of the interaction body to the new size
        this.interactionBody.y += this.body.height * this.scale / 3 * 2;
        this.interactionBody.x -= npcRadiusX / 2;

        // Add interaction body to scene
        this.scene.physics.add.existing(this.interactionBody);
    }

}