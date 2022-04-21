

interface class_ti_constructor {
    id: string,
    x: number,
    y: number,
    state: class_ti_state

    weight: number

    // distance: number
    // visited: boolean
    // parent_id?: class_ti_constructor["id"]
}

declare enum class_ti_state {
    Blank,
    Wall,
    Finder,
    Target,
    Path,
    Visited
}