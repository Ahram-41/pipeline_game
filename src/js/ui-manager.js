import { TRANSLATIONS, DEFAULT_LANGUAGE } from './i18n.js';

/**
 * UI Manager for handling user interface elements
 */
export class UIManager {
    constructor() {
        this.translations = TRANSLATIONS;
        this.currentLanguage = DEFAULT_LANGUAGE;
        this.isConnecting = false;
    }
    
    /**
     * Initialize event listeners for UI elements
     */
    initializeEventListeners(handlers) {
        // Add event listeners for buttons
        document.getElementById('add-gas-source').addEventListener('click', handlers.onAddGasSource);
        document.getElementById('add-switch').addEventListener('click', handlers.onAddSwitch);
        document.getElementById('add-connector').addEventListener('click', handlers.onAddConnector);
        document.getElementById('add-pipeline').addEventListener('click', handlers.onTogglePipeline);
        document.getElementById('update-colors').addEventListener('click', handlers.onUpdateFlow);
        document.getElementById('language-toggle').addEventListener('click', handlers.onToggleLanguage);
    }
    
    /**
     * Toggle pipeline creation mode
     */
    togglePipelineMode() {
        this.isConnecting = !this.isConnecting;
        const pipelineButton = document.getElementById('add-pipeline');
        const t = this.translations[this.currentLanguage];
        
        pipelineButton.textContent = this.isConnecting ? t.cancelPipeline : t.addPipeline;
        return this.isConnecting;
    }
    
    /**
     * Toggle language between English and Chinese
     */
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'zh' : 'en';
        this.updateUIText();
        return this.currentLanguage;
    }
    
    /**
     * Update all UI text based on current language
     */
    updateUIText() {
        const t = this.translations[this.currentLanguage];
        
        // Update title and subtitle
        document.getElementById('title').textContent = t.title;
        document.getElementById('subtitle').textContent = t.subtitle;
        
        // Update buttons
        document.getElementById('add-gas-source').textContent = t.addGasSource;
        document.getElementById('add-switch').textContent = t.addSwitch;
        document.getElementById('add-connector').textContent = t.addConnector;
        document.getElementById('add-pipeline').textContent = this.isConnecting ? t.cancelPipeline : t.addPipeline;
        document.getElementById('update-colors').textContent = t.updateFlow;
        document.getElementById('language-toggle').textContent = t.language;
        
        // Update instructions
        document.getElementById('instructions-title').textContent = t.instructions;
        document.getElementById('instr-click').textContent = t.leftClick;
        document.getElementById('instr-click-desc').textContent = t.leftClickDesc;
        document.getElementById('instr-right').textContent = t.rightClick;
        document.getElementById('instr-right-desc').textContent = t.rightClickDesc;
        document.getElementById('instr-pipeline').textContent = t.pipelineButton;
        document.getElementById('instr-pipeline-desc').textContent = t.pipelineDesc;
        document.getElementById('instr-update').textContent = t.updateButton;
        document.getElementById('instr-update-desc').textContent = t.updateDesc;
    }
} 