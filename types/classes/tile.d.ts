// key: class_ti_

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
    // core states
    Blank,
    Wall,
    Finder,
    Target,
    // algorithm states
    Path,
    Visited,
    Complete
}

interface class_ti_animateOrder {
    id: class_ti_constructor["id"]
    state: class_ti_state
}