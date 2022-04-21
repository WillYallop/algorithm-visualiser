import Tile from "../tile";

interface node {
    x: number
    y: number
    weight: number
    id: string
    state: class_ti_state
    distance: number
    parent_id: string
    Tile: Tile
}

export default (grid: Map<string, Tile>, startTile: Tile, targetTitle: Tile) => {
    
    // set all nodes to infinite distance, apart from the start node
    let nodes = getNodesList(grid, startTile.id);
    // set the current node
    let targetFound = false;

    let checkNodes = [nodes.find( x => x.id === startTile.id )];

    let path: Array<Tile> = [];
    let visitedNodesInOrder: Array<Array<node>> = [];
    
    // while we have neighbours
     while (!targetFound) {
        let currentNode = checkNodes[0];

        // - add its neighbours to the array
        const neighbours = getNeighbours(nodes, currentNode);

        for(let i = 0; i < neighbours.length; i++) {

            // If its a wall
            if(neighbours[i].state === 1) continue;

            // - set the distance varaible as the current nodes, plus its weight
            const distance = currentNode.distance + neighbours[i].weight;
            // - if the nodes distance is infinite or less than the current, update it and set the parent_id value
            if(neighbours[i].distance === Infinity || distance < neighbours[i].distance) {
                neighbours[i].distance = distance;
                neighbours[i].parent_id = currentNode.id;
                checkNodes.push(neighbours[i]);
                
            }

            visitedNodesInOrder.push(neighbours);

            // - if the current node is the target. end the loop.
            if(neighbours[i].state === 3) {
                targetFound = true;
                path = generatePath(nodes, neighbours[i]);
            }
            
        }

        // remove first item
        checkNodes.shift();

    }

    return {
        path: path,
        order: visitedNodesInOrder
    }
    // // work out the path, backwards from the target.
    // for(let i = 0; i < path.length; i++) {
    //     path[i].setTileState(4);
    // }
}

// create an array of all nodes.
const getNodesList = (grid: Map<string, Tile>, startID: string) => {
    const nodes: Array<node> = [];
    for(const [ id, Tile ] of grid) {
        const state = Tile.dijkstraConfig;
        nodes.push({
            x: state.x,
            y: state.y,
            weight: state.weight,
            state: state.state,
            id: state.id,
            distance: state.id === startID ? 0 : Infinity,
            parent_id: undefined,
            Tile: Tile
        });
    }
    return nodes;
}

// get nodes for cardinal directions
const getNeighbours = (nodes: Array<node>, node: node) => {
    const neighbours: Array<node> = [];

    const top = nodes.find( x => x.x === node.x && x.y === node.y - 1 );
    const right = nodes.find( x => x.x === node.x + 1 && x.y === node.y );
    const bottom = nodes.find( x => x.x === node.x && x.y === node.y + 1 );
    const left = nodes.find( x => x.x === node.x - 1 && x.y === node.y );

    if(top !== undefined) neighbours.push(top);
    if(right !== undefined) neighbours.push(right);
    if(bottom !== undefined) neighbours.push(bottom);
    if(left !== undefined) neighbours.push(left);

    return neighbours;
}

// 
const generatePath = (nodes: Array<node>, target: node) => {
    let traversed = false;
    let current = target;
    const path = [];
    while(!traversed) {
        if(current.state === 2) {
            traversed = true;
            continue;
        }
        if(current.state !== 3) path.push(current.Tile);
        current = nodes.find( x => x.id === current.parent_id );
    }
    return path;
}