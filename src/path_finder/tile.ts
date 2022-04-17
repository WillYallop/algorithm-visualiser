export default class Tile {
    element: HTMLElement;
    state: class_ti_constructor;
    constructor(state: class_ti_constructor) {
        
        this.state = state;
    }

    render(container: HTMLElement) {
        this.element = document.createElement('div');
        this.element.classList.add(`canvas__tile`);
        this.setTileState(this.state.state);

        this.element.setAttribute('data-x', this.state.x.toString());
        this.element.setAttribute('data-y', this.state.y.toString());

        container.append(this.element);
    }

    setTileState(state: class_ti_state) {
        this.element.classList.remove(`canvas__tile--${this.state.state}`);
        this.state.state = state;
        this.element.classList.add(`canvas__tile--${this.state.state}`);
    }
}