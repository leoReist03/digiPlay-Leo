/*
 * inventorySlot.js
 * Class to handle inventoy slots in the game
 * Contains functions to create and handle inventory slots in the game.
*/
export default class InventorySlot {
    #active = false;

    constructor(container) {
        this.container = container;
    }

    // Function to toggle the active state of the slot
    toggleActive() {
        this.#active = !this.#active;
        this.onActiveChange(this.#active);
    }

    // Function to set the active state of the slot
    getActive() {
        return this.#active;
    }

    // Function to handle the change of the active state
    onActiveChange() {
        if (this.#active) {
            this.container.list[0].setTint(0x00ff00);
        } else {
            this.container.list[0].clearTint();
        }
    }
}