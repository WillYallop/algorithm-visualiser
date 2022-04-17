

interface class_ti_constructor {
    id: string,
    x: number,
    y: number,
    state: class_ti_state
}

declare enum class_ti_state {
    Blank,
    Wall,
    Finder,
    Target
}