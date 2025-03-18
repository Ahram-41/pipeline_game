import { CONFIG } from './config.js';

/**
 * Simulation engine for gas flow
 */
export class FlowSimulation {
    constructor(elements, connections) {
        this.elements = elements;
        this.connections = connections;
    }
    
    /**
     * Run the simulation
     */
    simulate() {
        this.resetGasState();
        this.propagateGasFromSources();
    }
    
    /**
     * Reset gas state for all elements and connections
     */
    resetGasState() {
        for (const element of this.elements) {
            if (element.type !== 'gas_source') {
                element.hasGas = false;
            }
        }
        
        for (const connection of this.connections) {
            connection.hasGas = false;
            connection.color = CONFIG.PIPELINE.color;
        }
    }
    
    /**
     * Propagate gas from all gas sources
     */
    propagateGasFromSources() {
        for (const element of this.elements) {
            if (element.type === 'gas_source') {
                this.propagateGas(element);
            }
        }
    }
    
    /**
     * Propagate gas through the system starting from an element
     */
    propagateGas(element) {
        const visited = new Set();
        const stack = [element];
        
        while (stack.length > 0) {
            const current = stack.pop();
            
            if (visited.has(current)) continue;
            visited.add(current);
            
            if (current.type !== 'gas_source') {
                current.hasGas = true;
            }
            
            this.propagateGasThroughConnections(current, visited, stack);
        }
    }
    
    /**
     * Propagate gas through connections from an element
     */
    propagateGasThroughConnections(element, visited, stack) {
        for (const connection of this.connections) {
            if (connection.isConnectedTo(element)) {
                // If element is a switch and OFF, do not propagate
                if (element.type === 'switch' && !element.isOn) {
                    continue;
                }
                
                connection.hasGas = true;
                connection.color = CONFIG.PIPELINE.activeColor;
                
                const nextElement = connection.start === element ? connection.end : connection.start;
                if (!visited.has(nextElement)) {
                    stack.push(nextElement);
                }
            }
        }
    }
} 