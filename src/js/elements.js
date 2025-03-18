import { CONFIG } from './config.js';

/**
 * Base class for all pipeline elements
 */
class Element {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Check if point is inside this element
     */
    isPointInside(x, y) {
        return false;
    }
    
    /**
     * Get center point of the element
     */
    getCenterPoint() {
        return { startX: this.x, startY: this.y };
    }
}

/**
 * Gas source element
 */
export class GasSource extends Element {
    constructor(x, y) {
        super(x, y);
        this.type = 'gas_source';
        this.width = CONFIG.ELEMENTS.GAS_SOURCE.width;
        this.height = CONFIG.ELEMENTS.GAS_SOURCE.height;
        this.color = CONFIG.ELEMENTS.GAS_SOURCE.color;
        this.hasGas = true;
    }
    
    isPointInside(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }
    
    getCenterPoint() {
        return { 
            startX: this.x + this.width / 2, 
            startY: this.y + this.height / 2 
        };
    }
    
    draw(ctx, language) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw gas symbol
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('G', this.x + this.width / 2, this.y + this.height / 2);
    }
}

/**
 * Switch element
 */
export class Switch extends Element {
    constructor(x, y) {
        super(x, y);
        this.type = 'switch';
        this.radius = CONFIG.ELEMENTS.SWITCH.radius;
        this.color = CONFIG.ELEMENTS.SWITCH.colorOff;
        this.isOn = false;
    }
    
    isPointInside(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
    
    toggle() {
        this.isOn = !this.isOn;
        this.color = this.isOn ? 
            CONFIG.ELEMENTS.SWITCH.colorOn : 
            CONFIG.ELEMENTS.SWITCH.colorOff;
    }
    
    draw(ctx, translations, language) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw switch state indicator with translation
        const t = translations[language];
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.isOn ? t.switchOn : t.switchOff, this.x, this.y);
    }
}

/**
 * Connector element
 */
export class Connector extends Element {
    constructor(x, y) {
        super(x, y);
        this.type = 'connector';
        this.size = CONFIG.ELEMENTS.CONNECTOR.size;
        this.color = CONFIG.ELEMENTS.CONNECTOR.color;
        this.hasGas = false;
    }
    
    isPointInside(x, y) {
        const halfSize = this.size / 2;
        return x >= this.x - halfSize && x <= this.x + halfSize &&
               y >= this.y - halfSize && y <= this.y + halfSize;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.hasGas ? 
            CONFIG.ELEMENTS.CONNECTOR.colorActive : 
            this.color;
        
        const halfSize = this.size / 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - halfSize);
        ctx.lineTo(this.x + halfSize, this.y);
        ctx.lineTo(this.x, this.y + halfSize);
        ctx.lineTo(this.x - halfSize, this.y);
        ctx.closePath();
        ctx.fill();
    }
}

/**
 * Connection between elements
 */
export class Connection {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.hasGas = false;
        this.color = CONFIG.PIPELINE.color;
    }
    
    /**
     * Check if connection is connected to the element
     */
    isConnectedTo(element) {
        return this.start === element || this.end === element;
    }
    
    /**
     * Draw the connection
     */
    draw(ctx) {
        const startPoint = this.start.getCenterPoint();
        const endPoint = this.end.getCenterPoint();
        
        const startX = startPoint.startX;
        const startY = startPoint.startY;
        const endX = endPoint.startX;
        const endY = endPoint.startY;
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = CONFIG.PIPELINE.width;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Draw gas flow animation if the connection has gas
        if (this.hasGas) {
            this.drawGasFlow(ctx, startX, startY, endX, endY);
        }
    }
    
    /**
     * Draw gas flow animation
     */
    drawGasFlow(ctx, startX, startY, endX, endY) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineDashOffset = -performance.now() / CONFIG.PIPELINE.flowAnimationSpeed;
        ctx.setLineDash([5, 10]);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    /**
     * Check if a point is near this connection
     */
    isPointNear(x, y) {
        const startPoint = this.start.getCenterPoint();
        const endPoint = this.end.getCenterPoint();
        
        const startX = startPoint.startX;
        const startY = startPoint.startY;
        const endX = endPoint.startX;
        const endY = endPoint.startY;
        
        const hitDistance = CONFIG.PIPELINE.hitDistance;
        
        // Calculate distance from point to line
        const lineLength = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        if (lineLength === 0) return false;
        
        // Calculate the distance from point to line using vector projection
        const t = ((x - startX) * (endX - startX) + (y - startY) * (endY - startY)) / (lineLength ** 2);
        
        // If t is outside [0,1], point is closest to an endpoint
        if (t < 0) {
            const dist = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
            return dist <= hitDistance;
        } else if (t > 1) {
            const dist = Math.sqrt((x - endX) ** 2 + (y - endY) ** 2);
            return dist <= hitDistance;
        } else {
            // Calculate closest point on line
            const closestX = startX + t * (endX - startX);
            const closestY = startY + t * (endY - startY);
            
            // Calculate distance to closest point
            const dist = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
            return dist <= hitDistance;
        }
    }
}

/**
 * Element factory for creating pipeline elements
 */
export class ElementFactory {
    static createGasSource(count) {
        const config = CONFIG.ELEMENTS.GAS_SOURCE;
        const basePos = CONFIG.INITIAL_POSITIONS.GAS_SOURCE;
        const xOffset = (count % CONFIG.GRID.elementsPerRow) * config.spacing;
        const yOffset = Math.floor(count / CONFIG.GRID.elementsPerRow) * config.spacing;
        
        return new GasSource(basePos.x + xOffset, basePos.y + yOffset);
    }
    
    static createSwitch(count) {
        const config = CONFIG.ELEMENTS.SWITCH;
        const basePos = CONFIG.INITIAL_POSITIONS.SWITCH;
        const xOffset = (count % CONFIG.GRID.elementsPerRow) * config.spacing;
        const yOffset = Math.floor(count / CONFIG.GRID.elementsPerRow) * config.spacing;
        
        return new Switch(basePos.x + xOffset, basePos.y + yOffset);
    }
    
    static createConnector(count) {
        const config = CONFIG.ELEMENTS.CONNECTOR;
        const basePos = CONFIG.INITIAL_POSITIONS.CONNECTOR;
        const xOffset = (count % CONFIG.GRID.elementsPerRow) * config.spacing;
        const yOffset = Math.floor(count / CONFIG.GRID.elementsPerRow) * config.spacing;
        
        return new Connector(basePos.x + xOffset, basePos.y + yOffset);
    }
} 