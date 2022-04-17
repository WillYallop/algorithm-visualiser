import { v4 as uuidv4 } from 'uuid';
import PathFinder from ".";
import Tile from "./tile";

export default class Scene extends PathFinder {
    tileMap: Map<string, Tile>;
    constructor(target: string) {
        super(target);
        this.tileMap = new Map();
        this.__build();
    }
    __build() {
        for(let x = 0; x < this.config.resolution[0]; x++) {
            for(let y = 0; y < this.config.resolution[1]; y++) {
                const id = uuidv4();
            
                this.tileMap.set(id, new Tile({
                    id: id,
                    x: x,
                    y: y,
                    state: 0
                }));
            }
        }
    }
    renderTiles() {
        for(const [id, tile] of this.tileMap) {
            tile.render(this.canvasElement);
        }
    }
}