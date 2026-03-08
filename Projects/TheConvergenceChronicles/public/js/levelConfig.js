/**
 * Level Configuration System
 * Provides a central registry for level-specific configurations
 * Each level can register its blocks, simulation mode, and success criteria
 */

class LevelConfig {
    static configs = {};

    /**
     * Register a level configuration
     * @param {string} levelId - Unique level identifier (e.g., 'ch1l1')
     * @param {object} config - Level configuration object
     * @param {string} config.id - Level ID
     * @param {number} config.chapter - Chapter number
     * @param {number} config.level - Level number within chapter
     * @param {string} config.title - Level title
     * @param {string} config.simulationMode - 'dynamic' | 'instantaneous'
     * @param {string[]} config.toolboxBlocks - Block types available in toolbox
     * @param {object[]} config.defaultBlocks - Pre-placed blocks on canvas
     * @param {function} config.processFunction - Custom process function for this level
     * @param {Array} config.criteria - Success criteria array of criterion objects
     *   Each criterion: { type: 'closeTo'|'gte'|'lte'|'gt'|'lt', metric: string, target: number, tolerance?: number }
     *   Or inline: { check: (metrics) => boolean, label: string }
     */
    static register(levelId, config) {
        this.configs[levelId] = {
            id: levelId,
            simulationMode: 'dynamic',
            toolboxBlocks: [],
            defaultBlocks: [],
            criteria: [],
            ...config
        };
        console.log(`Level registered: ${levelId}`);
    }

    /**
     * Get a level configuration
     * @param {string} levelId - Level identifier
     * @returns {object|null} Level configuration or null
     */
    static get(levelId) {
        return this.configs[levelId] || null;
    }

    /**
     * Get block types available for a level's toolbox
     * @param {string} levelId - Level identifier
     * @returns {string[]} Array of block type identifiers
     */
    static getBlockTypes(levelId) {
        const config = this.configs[levelId];
        return config?.toolboxBlocks || [];
    }

    /**
     * Get simulation mode for a level
     * @param {string} levelId - Level identifier
     * @returns {string} Simulation mode ('dynamic' or 'instantaneous')
     */
    static getSimulationMode(levelId) {
        const config = this.configs[levelId];
        return config?.simulationMode || 'dynamic';
    }

    /**
     * Get default blocks for a level
     * @param {string} levelId - Level identifier
     * @returns {object[]} Array of default block configurations
     */
    static getDefaultBlocks(levelId) {
        const config = this.configs[levelId];
        return config?.defaultBlocks || [];
    }

    /**
     * Get success criteria for a level
     * @param {string} levelId - Level identifier
     * @returns {object} Success criteria object
     */
    static getCriteria(levelId) {
        const config = this.configs[levelId];
        return config?.criteria || [];
    }

    /**
     * Get all registered level IDs
     * @returns {string[]} Array of level IDs
     */
    static getAllLevelIds() {
        return Object.keys(this.configs);
    }

    /**
     * Check if a level is registered
     * @param {string} levelId - Level identifier
     * @returns {boolean}
     */
    static has(levelId) {
        return levelId in this.configs;
    }
}

// Export for use in other modules
window.LevelConfig = LevelConfig;
