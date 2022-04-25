/// <reference path="../../types/index.d.ts"/>

import { v4 as uuidv4 } from 'uuid';
import Tile from "./tile";
import dijkstra from './algorithms/dijkstra';

export default class PathFinderScene {
    tileMap: Map<string, Tile>;
    canvasElement: HTMLElement;
    config: class_sc_config;
    painterBtns: NodeListOf<HTMLElement>;
    activePainter: class_ti_state;
    paint: boolean;
    locked: boolean;
    algorithmTilesPainted: boolean;
    constructor(target: string) {
        // config
        this.config = {
            resolution: [ 20, 20 ],
            start: {
                finder: [ 2, 2 ],
                target: [ 17, 17 ]
            }
        }
        // 
        this.locked = false;
        this.algorithmTilesPainted = false;
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
        if(!this.locked) {
            // resets finder and target types so we can only have one at a time
            if(this.activePainter === 2) this.__resetTileTypeToBlank(2);
            else if (this.activePainter === 3) this.__resetTileTypeToBlank(3);

            const Tile = this.tileMap.get(id);
            if(Tile.state !== 2 && Tile.state !== 3) Tile.setTileState(this.activePainter);

            if(this.algorithmTilesPainted) this.__resetAlgorithmTileState();
        }
    }
    // * resets specified tile type to balnk
    __resetTileTypeToBlank(type: class_ti_state) {
        for(const [id, Tile] of this.tileMap) {
            if(Tile.state === type) Tile.setTileState(0);
        }
    }
    // * reset tile algorithm states
    __resetAlgorithmTileState() {
        for(const [id, Tile] of this.tileMap) {
            if(Tile.state === 4 || Tile.state === 5 || Tile.state === 6) Tile.setTileState(0);
        }
        this.algorithmTilesPainted = false;
    } 
    // * animate tiles
   __animateTiles(order: Array<class_ti_animateOrder>) {
        this.algorithmTilesPainted = true;
        const animate = (index: number, Tile: Tile, state: class_ti_state) => {
            setTimeout(() => { 
                Tile.setTileState(state);
                if(index === order.length - 1) this.locked = false;
            }, index * 10);
        }
        for(let i = 0; i < order.length; i++) {
            const Tile = this.tileMap.get(order[i].id);
            if(Tile.state === 0 || Tile.state === 5 || Tile.state === 6) animate(i, Tile, order[i].state);
            else continue;
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
    __iniitateAlgorithms() {
        const startBtnEle = document.getElementById('start-algorithm');
        
        startBtnEle.addEventListener('click', () => this.__startAlgorithm(), { passive: true });
    }
    __startAlgorithm() {
        const selectInpEle = document.getElementById('algorithmsInp') as HTMLSelectElement;
        if(!this.locked) {
            this.locked = true;
            this.__resetAlgorithmTileState();

            let order: Array<class_ti_animateOrder>;

            if(selectInpEle.value === 'dijkstra') {
                order = dijkstra(this.tileMap);
                this.__animateTiles(order);
            }
            
            if(order.length === 1) this.__algorithmFailed();

        }
    }
    // * handle failed case for algorithms
    __algorithmFailed() {
        this.locked = false;
    }
}