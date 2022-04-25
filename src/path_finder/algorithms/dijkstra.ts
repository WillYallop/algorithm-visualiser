import Tile from "../tile";

interface node {
    x: number
    y: number
    weight: number
    id: string
    state: class_ti_state
    distance: number
    parent_id: string
}

export default (grid: Map<string, Tile>) => {
    // set all nodes to infinite distance, apart from the start node
    let nodes = getNodesList(grid);
    // set the current node
    let targetFound = false;

    let checkNodes = [nodes.find( x => x.state === 2 )];

    let visitedNodesInOrder: Array<class_ti_animateOrder> = [];
    
    // while we have neighbours
    while (!targetFound) {
        let currentNode = checkNodes[0];

        if(currentNode !== undefined) {
            visitedNodesInOrder.push({
                id: currentNode.id,
                state: 6 // visited
            });
      
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
                    visitedNodesInOrder.push({
                        id: neighbours[i].id,
                        state: 5 // completre
                    });
                }
    
                // - if the current node is the target. end the loop.
                if(neighbours[i].state === 3) {
                    targetFound = true;
                    visitedNodesInOrder = visitedNodesInOrder.concat(generatePath(nodes, neighbours[i]));
                    break;
                }
            }
    
            // remove first item
            checkNodes.shift();
        }
        else {
            break;
        }
    }

    return visitedNodesInOrder;
}

// create an array of all nodes.
const getNodesList = (grid: Map<string, Tile>) => {
    const nodes: Array<node> = [];
    for(const [ id, Tile ] of grid) {
        nodes.push({
            x: Tile.x,
            y: Tile.y,
            weight: Tile.weight,
            state: Tile.state,
            id: Tile.id,
            distance: Tile.state === 2 ? 0 : Infinity,
            parent_id: undefined
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
    const path: Array<class_ti_animateOrder> = [];
    while(!traversed) {
        if(current.state === 2) {
            traversed = true;
            continue;
        }
        if(current.state !== 3) path.push({
            id: current.id,
            state: 4
        });
        current = nodes.find( x => x.id === current.parent_id );
    }
    return path;
}