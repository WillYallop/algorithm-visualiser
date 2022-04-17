export default class Tile {
    element: HTMLElement;
    state: class_ti_constructor;
    constructor(state: class_ti_constructor) {
        
        this.state = state;
    }

    render(container: HTMLElement) {
        this.element = document.createElement('div');
        this.element.classList.add('canvas__tile');

        this.element.innerHTML = `<div class="canvas__tile__inner">${this.state.x}, ${this.state.y}</div>`;

        container.append(this.element);
    }
}