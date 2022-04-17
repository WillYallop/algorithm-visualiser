export default class PathFinder {
    canvasElement: HTMLElement;
    config: class_pf_config;
    constructor(target: string) {

        this.config = {
            resolution: [ 20, 20 ]
        }

        this.canvasElement = document.querySelector(target) as HTMLElement;
        this.canvasElement.style.setProperty('--cols', `${this.config.resolution[0]}`);
    }

}