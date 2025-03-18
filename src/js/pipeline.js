import { CONFIG } from './config.js';
import { TRANSLATIONS } from './i18n.js';
import { ElementFactory } from './elements.js';
import { Renderer } from './renderer.js';
import { FlowSimulation } from './simulation.js';
import { UIManager } from './ui-manager.js';
import { InputHandler } from './input-handler.js';

/**
 * Gas Pipeline System
 * A 2D interactive system for visualizing gas pipeline networks
 */
class GasPipelineSystem {
    /**
     * Constructor
     */
    constructor() {
        this.initialize();
    }
    
    /**
     * Initialize all subsystems
     */
    initialize() {
        // Initialize state
        this.initializeState();
        
        // Initialize canvas
        this.canvas = document.getElementById('pipeline-canvas');
        
        // Initialize subsystems
        this.renderer = new Renderer(this.canvas);
        this.simulation = new FlowSimulation(this.elements, this.connections);
        this.uiManager = new UIManager();
        this.inputHandler = new InputHandler(this.canvas, this.elements, this.connections);
        
        // Initialize UI
        this.initializeUIHandlers();
        this.uiManager.updateUIText();
        
        // Start animation loop
        this.startAnimationLoop();
    }
    
    /**
     * Initialize state variables
     */
    initializeState() {
        // Element collections
        this.elements = [];
        this.connections = [];
        
        // Element counters for positioning
        this.elementCounts = {
            gas_source: 0,
            switch: 0,
            connector: 0
        };
    }
    
    /**
     * Initialize UI event handlers
     */
    initializeUIHandlers() {
        const handlers = {
            onAddGasSource: () => this.addGasSource(),
            onAddSwitch: () => this.addSwitch(),
            onAddConnector: () => this.addConnector(),
            onTogglePipeline: () => this.togglePipelineMode(),
            onUpdateFlow: () => this.updatePipelineColors(),
            onToggleLanguage: () => this.toggleLanguage()
        };
        
        this.uiManager.initializeEventListeners(handlers);
    }
    
    /**
     * Add a gas source element
     */
    addGasSource() {
        const gasSource = ElementFactory.createGasSource(this.elementCounts.gas_source);
        this.elements.push(gasSource);
        this.elementCounts.gas_source++;
    }
    
    /**
     * Add a switch element
     */
    addSwitch() {
        const switchElement = ElementFactory.createSwitch(this.elementCounts.switch);
        this.elements.push(switchElement);
        this.elementCounts.switch++;
    }
    
    /**
     * Add a connector element
     */
    addConnector() {
        const connector = ElementFactory.createConnector(this.elementCounts.connector);
        this.elements.push(connector);
        this.elementCounts.connector++;
    }
    
    /**
     * Toggle pipeline creation mode
     */
    togglePipelineMode() {
        const isConnecting = this.uiManager.togglePipelineMode();
        this.inputHandler.setConnectionMode(isConnecting);
    }
    
    /**
     * Update pipeline colors based on gas flow
     */
    updatePipelineColors() {
        this.simulation.simulate();
    }
    
    /**
     * Toggle language
     */
    toggleLanguage() {
        return this.uiManager.toggleLanguage();
    }
    
    /**
     * Start the animation loop
     */
    startAnimationLoop() {
        this.animate();
    }
    
    /**
     * Animation loop
     */
    animate() {
        // Get connection in progress data
        const connectionInProgress = {
            ...this.inputHandler.getConnectionInProgress(),
            pipelineConfig: CONFIG.PIPELINE
        };
        
        // Render the scene
        this.renderer.render(
            this.elements, 
            this.connections,

            connectionInProgress,
            this.uiManager.translations,
            this.uiManager.currentLanguage
        );
        
        // Request next frame
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new GasPipelineSystem();
}); 