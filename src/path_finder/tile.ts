export default class Tile {
    element: HTMLElement;
    tileState: class_ti_constructor;
    constructor(state: class_ti_constructor) {
        
        this.tileState = state;
        this.__build();
    }
    __build() {
        this.element = document.createElement('div');
        this.element.classList.add(`canvas__tile`);
        this.setTileState(this.tileState.state);

        this.element.setAttribute('data-x', this.tileState.x.toString());
        this.element.setAttribute('data-y', this.tileState.y.toString());
        this.element.setAttribute('data-id', this.tileState.id);
    }
    render(container: HTMLElement) {
        container.append(this.element);
    }
    setTileState(state: class_ti_state) {
        this.element.classList.remove(`canvas__tile--${this.tileState.state}`);
        this.tileState.state = state;
        this.element.classList.add(`canvas__tile--${this.tileState.state}`);
    }


    get id() {
        return this.tileState.id;
    }
    get state() {
        return this.tileState.state;
    }
    get ele() {
        return this.element;
    }
    get dijkstraConfig() {
        return {
            id: this.tileState.id,
            state: this.tileState.state,
            weight: this.tileState.weight,
            x: this.tileState.x,
            y: this.tileState.y
        }
    }

}