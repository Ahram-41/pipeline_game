/**
 * Configuration for the Gas Pipeline System
 */
export const CONFIG = {
    ELEMENTS: {
        GAS_SOURCE: {
            width: 40,
            height: 40,
            color: '#3498db',
            spacing: 60
        },
        SWITCH: {
            radius: 20,
            colorOff: '#2c3e50',
            colorOn: '#27ae60',
            spacing: 60
        },
        CONNECTOR: {
            size: 30,
            color: '#95a5a6',
            colorActive: '#27ae60',
            spacing: 60
        }
    },
    PIPELINE: {
        width: 3,
        color: '#34495e',
        activeColor: '#2ecc71',
        hitDistance: 10,
        connectionLineWidth: 2,
        connectionColor: '#e74c3c',
        flowAnimationSpeed: 100
    },
    GRID: {
        elementsPerRow: 5
    },
    INITIAL_POSITIONS: {
        GAS_SOURCE: { x: 100, y: 100 },
        SWITCH: { x: 200, y: 100 },
        CONNECTOR: { x: 300, y: 100 }
    }
}; 