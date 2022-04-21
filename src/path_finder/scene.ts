import { v4 as uuidv4 } from 'uuid';
import Tile from "./tile";
import dijkstra from './algorithms/dijkstra';

export default class Scene {
    tileMap: Map<string, Tile>;
    canvasElement: HTMLElement;
    config: class_sc_config;
    painterBtns: NodeListOf<HTMLElement>;
    activePainter: class_ti_state;
    paint: boolean;
    constructor(target: string) {
        // config
        this.config = {
            resolution: [ 20, 20 ],
            start: {
                finder: [ 2, 2 ],
                target: [ 17, 17 ]
            }
        }
        // canvas container
        this.canvasElement = document.querySelector(target) as HTMLElement;
        this.canvasElement.style.setProperty('--cols', `${this.config.resolution[0]}`);
        // tiles
        this.tileMap = new Map();
        // painter
        this.painterBtns = document.querySelectorAll('[data-painter]') as NodeListOf<HTMLElement>;
        this.activePainter = 0;
        this.__setActivePainter(this.activePainter);

        //
        this.__initiateGrid();
        this.__initiatePainterBtns();
        this.__iniitateAlgorithms();
    }

    // grid
    // * handles all grid start actions
    __initiateGrid() {
        this.__buildGrid();
        this.__gridPaintHandler();
        this.__renderTiles();
    }
    // * builds tiles based on config and stores them in tileMap
    __buildGrid() {
        for(let x = 0; x < this.config.resolution[0]; x++) {
            for(let y = 0; y < this.config.resolution[1]; y++) {
                const id = uuidv4();
                let state = 0;
                if(x === this.config.start.finder[0] && y === this.config.start.finder[1]) state = 2;
                else if(x === this.config.start.target[0] && y === this.config.start.target[1]) state = 3;
                this.tileMap.set(id, new Tile({
                    id: id,
                    x: x,
                    y: y,
                    state: state,
                    weight: 1
                }));
            }
        }
    }
    // * 
    __gridPaintHandler() {
        this.canvasElement.addEventListener('mouseup', () => this.paint = false, { passive: true });
        this.canvasElement.addEventListener('touchend', () => this.paint = false, { passive: true });
        this.canvasElement.addEventListener('touchcancel', () => this.paint = false, { passive: true });
        this.canvasElement.addEventListener('mouseleave', () => this.paint = false, { passive: true });

        const downEvent = (e: Event) => {
            this.paint = true;
            const target = e.target as HTMLElement;
            this.__paintTileHandler(target.getAttribute('data-id'));
        }
        const moveEvent = (e: Event) => {
            if(this.paint) {
                const target = e.target as HTMLElement;
                if(target.classList.contains('canvas__tile')) this.__paintTileHandler(target.getAttribute('data-id'));
            }
        }

        // mouse down
        this.canvasElement.addEventListener('mousedown', downEvent, { passive: true });
        this.canvasElement.addEventListener('touchstart',  downEvent, { passive: true });
        // mouse move
        this.canvasElement.addEventListener('mousemove', moveEvent, { passive: false });
    }
    // * bulds & renders all tiles
    __renderTiles() {
        for(const [id, tile] of this.tileMap) {
            tile.render(this.canvasElement);
        }
    }

    // tiles
    // * handles painting a tile
    __paintTileHandler(id: string) {
        // resets finder and target types so we can only have one at a time
        if(this.activePainter === 2) this.__resetTileTypeToBlank(2);
        else if (this.activePainter === 3) this.__resetTileTypeToBlank(3);

        const Tile = this.tileMap.get(id);
        if(Tile.state !== 2 && Tile.state !== 3) Tile.setTileState(this.activePainter);
    }
    // * resets specified tile type to balnk
    __resetTileTypeToBlank(type: class_ti_state) {
        for(const [id, Tile] of this.tileMap) {
            if(Tile.state === type) Tile.setTileState(0);
        }
    }


    // painter
    // * adds listeners for the painter type buttons
    __initiatePainterBtns() {
        for(let i = 0; i < this.painterBtns.length; i++) {
            this.painterBtns[i].addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const painter = parseInt(target.getAttribute('data-painter'));
                this.__setActivePainter(painter);
            }, { passive: true })
        }
    }
    // * sets the active painter
    __setActivePainter(painter: class_ti_state) {
        this.activePainter = painter;
        for(let i = 0; i < this.painterBtns.length; i++) {
            this.painterBtns[i].classList.remove('active');
        }
        document.querySelector(`[data-painter="${painter}"]`).classList.add('active');
    }

    // * adds listeners for the algorithm start and select section
    // TODO - work on this function - current iteration is just for quick example
    __iniitateAlgorithms() {
        const startBtnEle = document.getElementById('start-algorithm');
        const selectInpEle = document.getElementById('algorithmsInp') as HTMLSelectElement;
        startBtnEle.addEventListener('click', () => {

            let start: Tile;
            let target: Tile;
            for(const [ id, Tile ] of this.tileMap) {
                if(Tile.state === 2) start = Tile;
                if(Tile.state === 3) target = Tile;
            }

            if(selectInpEle.value === 'dijkstra') {
                const result = dijkstra(this.tileMap, start, target);
                for(let i = 0; i < result.order.length; i++) {
                    for(let j = 0; j < result.order[i].length; j++) {
                        ((index, jIndex) => {
                            setTimeout(() => { 
                                let state = result.order[index][jIndex].Tile.state;
                                if(state === 0) {
                                    result.order[index][jIndex].Tile.setTileState(5);
                                }
                                if(index === result.order.length - 1 && jIndex === result.order[index].length - 1) {
                                    // build final path
                                    for(let pi = 0; pi < result.path.length; pi++) {
                                        result.path[pi].setTileState(4);
                                    }
                                }
                            }, i * 10);
                        })(i, j);
                    }
                }
            }

        }, { passive: true });
    }
}