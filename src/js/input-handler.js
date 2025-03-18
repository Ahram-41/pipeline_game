import { Connection } from './elements.js';

/**
 * Input handler for processing mouse and keyboard events
 */
export class InputHandler {
    constructor(canvas, elements, connections) {
        this.canvas = canvas;
        this.elements = elements;
        this.connections = connections;
        
        // Interaction state
        this.selectedElement = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.isConnecting = false;
        this.connectionStart = null;
        this.currentMousePos = null;
        
        this.initializeEventListeners();
    }
    
    /**
     * Initialize event listeners for canvas
     */
    initializeEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleContextMenu(e);
        });
    }
    
    /**
     * Toggle connection mode
     */
    setConnectionMode(mode) {
        this.isConnecting = mode;
    }
    
    /**
     * Get mouse position relative to canvas
     */
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    /**
     * Handle mouse down event
     */
    handleMouseDown(e) {
        if (e.button === 0) { // Left click
            const pos = this.getMousePos(e);
            
            if (this.isConnecting) {
                this.handleConnectionStart(pos);
            } else {
                this.handleElementSelection(pos);
            }
        }
    }
    
    /**
     * Handle connection start on mouse down in connection mode
     */
    handleConnectionStart(pos) {
        const element = this.findElementAt(pos.x, pos.y);
        if (element) {
            this.connectionStart = element;
        }
    }
    
    /**
     * Handle element selection on mouse down in normal mode
     */
    handleElementSelection(pos) {
        this.selectedElement = this.findElementAt(pos.x, pos.y);
        if (this.selectedElement) {
            this.isDragging = true;
            this.offsetX = pos.x - this.selectedElement.x;
            this.offsetY = pos.y - this.selectedElement.y;
            
            // Check if clicked on a switch to toggle it
            if (this.selectedElement.type === 'switch') {
                this.selectedElement.toggle();
            }
        }
    }
    
    /**
     * Handle mouse move event
     */
    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        // Store the current mouse position for drawing the connection in progress
        this.currentMousePos = pos;
        
        if (this.isDragging && this.selectedElement) {
            this.selectedElement.x = pos.x - this.offsetX;
            this.selectedElement.y = pos.y - this.offsetY;
        }
    }
    
    /**
     * Handle mouse up event
     */
    handleMouseUp(e) {
        if (this.isConnecting && this.connectionStart) {
            this.finalizeConnection(e);
        }
        
        this.isDragging = false;
        this.selectedElement = null;
    }
    
    /**
     * Finalize a connection on mouse up
     */
    finalizeConnection(e) {
        const pos = this.getMousePos(e);
        const endElement = this.findElementAt(pos.x, pos.y);
        
        if (endElement && endElement !== this.connectionStart) {
            this.connections.push(new Connection(this.connectionStart, endElement));
        }
        this.connectionStart = null;
    }
    
    /**
     * Handle context menu (right click) for deletion
     */
    handleContextMenu(e) {
        const pos = this.getMousePos(e);
        
        // First check if we clicked on an element
        const element = this.findElementAt(pos.x, pos.y);
        
        if (element) {
            this.deleteElement(element);
            return;
        }
        
        // If no element was clicked, check if we clicked on a pipe/connection
        const connection = this.findConnectionAt(pos.x, pos.y);
        
        if (connection) {
            this.deleteConnection(connection);
        }
    }
    
    /**
     * Delete an element and its connections
     */
    deleteElement(element) {
        const index = this.elements.indexOf(element);
        if (index !== -1) {
            this.elements.splice(index, 1);
            
            // Remove all connections to this element
            for (let i = this.connections.length - 1; i >= 0; i--) {
                const connection = this.connections[i];
                if (connection.isConnectedTo(element)) {
                    this.connections.splice(i, 1);
                }
            }
        }
    }
    
    /**
     * Delete a connection
     */
    deleteConnection(connection) {
        const index = this.connections.indexOf(connection);
        if (index !== -1) {
            this.connections.splice(index, 1);
        }
    }
    
    /**
     * Find element at given position
     */
    findElementAt(x, y) {
        for (let i = this.elements.length - 1; i >= 0; i--) {
            const element = this.elements[i];
            if (element.isPointInside(x, y)) {
                return element;
            }
        }
        return null;
    }
    
    /**
     * Find connection at given position
     */
    findConnectionAt(x, y) {
        for (const connection of this.connections) {
            if (connection.isPointNear(x, y)) {
                return connection;
            }
        }
        return null;
    }
    
    /**
     * Get connection in progress data
     */
    getConnectionInProgress() {
        return {
            isConnecting: this.isConnecting,
            connectionStart: this.connectionStart,
            mousePos: this.currentMousePos
        };
    }
} 