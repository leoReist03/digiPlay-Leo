import Layers from "./layers.js";
import dialogueLines from "./dialogueLines.js";

/*
 * dialogue.js
 * Class for handling dialogue in the game
 * Contains functions to create and run a dialogues between the player and Npc's in the game.
*/
export default class Dialogue {
    background;
    field;
    text;
    isOpen = true;
    options = [];

    constructor (scene, player) {
        this.scene = scene;
        this.player = player; 

        this.createBackground();
        this.createField();
        this.createText();

        this.toggleDialogue();
    }

    // Function to create the background for the dialogue
    createBackground() {
        if (this.background === undefined) {
            this.background = this.scene.add.rectangle(0,0, this.scene.game.canvas.width, this.scene.game.canvas.height, 0x3c3c3c)
                .setAlpha(0.5)
                .setOrigin(0, 0)
                .setScrollFactor(0)
                .setDepth(Layers.DIALOGUE);
        }
    }

    // Function to create the field for the dialogue
    createField() {
        if (this.field === undefined) {
            this.field = this.scene.add.rectangle(this.scene.game.canvas.width / 2, this.scene.game.canvas.height / 5 * 4)
                .setFillStyle(0x000000)
                .setOrigin(0.5, 0.5)
                .setScrollFactor(0)
                .setDepth(Layers.DIALOGUE)
                .setSize(this.scene.game.canvas.width / 12 * 11, this.scene.game.canvas.height / 4);
        }
    }

    // Function to create the text for the dialogue
    createText() {
        if (this.text === undefined) {
            this.text = this.scene.add.text(0, 0, "")
                .setWordWrapWidth(this.field.width / 12 * 11)
                .setScrollFactor(0, 0)
                .setDepth(Layers.DIALOGUE)
                .setOrigin(0.5, 0.5)
                .setMaxLines(3)
                .setPosition(this.field.x, this.field.y - 20)
                .setSize(this.field.width / 12 * 11, this.field.height / 3 * 2);
        }
    }

    // Function to toggle the visibility of the dialogue
    toggleDialogue() {
        this.background.visible = !this.background.visible;
        this.field.visible = !this.field.visible;
        this.text.visible = !this.text.visible;

        this.isOpen = !this.isOpen;
    }

    removeOptions() {
        this.options.forEach(option => option.destroy());
        this.options = [];
    }

    // Function to display a line of dialogue
    displayLine(line) {
        if (line === 0) {
            // Closing dialogue
            this.text.setText("");
            this.player.isInCutscene = false;
            this.toggleDialogue();
            return;
        }

        this.text.setText(dialogueLines.find(l => l.id === line).text);
        this.displayOptions(dialogueLines.find(l => l.id === line).options);
    }

    // Function to display options for the dialogue
    displayOptions(options) {
        options.forEach((option, index) => {
            this.options.push(
                this.scene.add.text(this.field.x, this.field.y + 20 + (index * 20), option.option)
                    .setInteractive()
                    .setOrigin(0.5, 0.5)
                    .setDepth(Layers.DIALOGUE)
                    .setScrollFactor(0)
                    .on('pointerdown', () => {
                        this.removeOptions();
                        this.displayLine(option.nextLine);
                    })
            );
            this.options.forEach(option => {
                option.on('pointerover', () => {
                    option.setColor('#cccccc');
                })
                .on('pointerout', () => {
                    option.setColor('#ffffff');
                });
            });
        });
    }
}