/**
 * Cache Manager for Control Loop Editor
 * Handles saving and loading node schemes to/from browser localStorage
 */

class CacheManager {
    constructor() {
        this.cachePrefix = 'controlLoop_';
        this.checkCacheAvailability();
    }

    /**
     * Check if localStorage is available
     */
    checkCacheAvailability() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage is not available:', e);
            return false;
        }
    }

    /**
     * Save node scheme to cache for a specific level
     * @param {string} levelId - Unique identifier for the level (e.g., 'ch1l1')
     * @param {object} nodeScheme - The node scheme data from processModel
     * @returns {boolean} - Success status
     */
    saveNodeScheme(levelId, nodeScheme) {
        try {
            if (!levelId || !nodeScheme) {
                console.error('Invalid levelId or nodeScheme');
                return false;
            }

            const cacheKey = this.cachePrefix + levelId;
            const cacheData = {
                levelId: levelId,
                timestamp: new Date().toISOString(),
                version: '1.0',
                nodeScheme: nodeScheme
            };

            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            console.log(`Node scheme saved for level: ${levelId}`);
            return true;

        } catch (error) {
            console.error('Error saving node scheme:', error);
            return false;
        }
    }

    /**
     * Load node scheme from cache for a specific level
     * @param {string} levelId - Unique identifier for the level
     * @returns {object|null} - The cached node scheme or null if not found/error
     */
    loadNodeScheme(levelId) {
        try {
            if (!levelId) {
                console.error('Invalid levelId');
                return null;
            }

            const cacheKey = this.cachePrefix + levelId;
            const cachedData = localStorage.getItem(cacheKey);

            if (!cachedData) {
                console.log(`No cached data found for level: ${levelId}`);
                return null;
            }

            const parsedData = JSON.parse(cachedData);
            
            // Validate the cached data structure
            if (!parsedData.nodeScheme || !parsedData.levelId) {
                console.error('Invalid cached data structure');
                return null;
            }

            console.log(`Node scheme loaded for level: ${levelId} (saved: ${parsedData.timestamp})`);
            return parsedData.nodeScheme;

        } catch (error) {
            console.error('Error loading node scheme:', error);
            return null;
        }
    }

    /**
     * Clear cached node scheme for a specific level
     * @param {string} levelId - Unique identifier for the level
     * @returns {boolean} - Success status
     */
    clearNodeScheme(levelId) {
        try {
            const cacheKey = this.cachePrefix + levelId;
            localStorage.removeItem(cacheKey);
            console.log(`Cache cleared for level: ${levelId}`);
            return true;
        } catch (error) {
            console.error('Error clearing cache:', error);
            return false;
        }
    }

    /**
     * Get all cached levels
     * @returns {array} - Array of level IDs that have cached data
     */
    getCachedLevels() {
        const cachedLevels = [];
        
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.cachePrefix)) {
                    const levelId = key.replace(this.cachePrefix, '');
                    cachedLevels.push(levelId);
                }
            }
        } catch (error) {
            console.error('Error getting cached levels:', error);
        }

        return cachedLevels;
    }

    /**
     * Clear all cached node schemes
     * @returns {boolean} - Success status
     */
    clearAllCache() {
        try {
            const keysToRemove = [];
            
            // Collect all keys with our prefix
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.cachePrefix)) {
                    keysToRemove.push(key);
                }
            }

            // Remove all collected keys
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            console.log(`Cleared ${keysToRemove.length} cached levels`);
            return true;
        } catch (error) {
            console.error('Error clearing all cache:', error);
            return false;
        }
    }

    /**
     * Save level completion status
     * @param {string} levelId - Unique identifier for the level
     * @param {object} completionData - Data about the completion (score, time, etc.)
     * @returns {boolean} - Success status
     */
    saveLevelCompletion(levelId, completionData) {
        try {
            const key = `${this.cachePrefix}completion_${levelId}`;
            const data = {
                levelId: levelId,
                timestamp: new Date().toISOString(),
                ...completionData
            };
            
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving level completion:', error);
            return false;
        }
    }

    /**
     * Get level completion status
     * @param {string} levelId - Unique identifier for the level
     * @returns {object|null} - Completion data or null
     */
    getLevelCompletion(levelId) {
        try {
            const key = `${this.cachePrefix}completion_${levelId}`;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting level completion:', error);
            return null;
        }
    }
}

// Create global instance
const cacheManager = new CacheManager();