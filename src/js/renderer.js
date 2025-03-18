/**
 * Renderer for the Gas Pipeline System
 */
export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    
    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draw all elements and connections
     */
    render(elements, connections, connectionInProgress, translations, language) {
        this.clear();
        this.drawConnections(connections);
        this.drawElements(elements, translations, language);
        this.drawConnectionInProgress(connectionInProgress);
    }
    
    /**
     * Draw all connections
     */
    drawConnections(connections) {
        for (const connection of connections) {
            connection.draw(this.ctx);
        }
    }
    
    /**
     * Draw all elements
     */
    drawElements(elements, translations, language) {
        for (const element of elements) {
            this.ctx.save();
            if (element.type === 'switch') {
                element.draw(this.ctx, translations, language);
            } else {
                element.draw(this.ctx);
            }
            this.ctx.restore();
        }
    }
    
    /**
     * Draw connection in progress
     */
    drawConnectionInProgress({ isConnecting, connectionStart, mousePos, pipelineConfig }) {
        if (isConnecting && connectionStart && mousePos) {
            const startPoint = connectionStart.getCenterPoint();
            
            this.ctx.save();
            this.ctx.strokeStyle = pipelineConfig.connectionColor;
            this.ctx.lineWidth = pipelineConfig.connectionLineWidth;
            this.ctx.setLineDash([5, 3]);
            
            this.ctx.beginPath();
            this.ctx.moveTo(startPoint.startX, startPoint.startY);
            this.ctx.lineTo(mousePos.x, mousePos.y);
            this.ctx.stroke();
            
            this.ctx.restore();
        }
    }
} 