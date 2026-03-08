// ===================================
// GOOGLE ANALYTICS MODULE
// ===================================

const Analytics = {
    /**
     * Dynamically loads Google Analytics 4 (gtag.js) into the document head
     * @param {string} trackingId - Your GA4 Measurement ID (e.g., 'G-R8WH8Z7KHL')
     * @param {Object} options - Optional configuration options
     * @param {boolean} options.debug - Enable debug mode (default: false)
     * @param {Object} options.config - Additional config parameters for gtag
     * @returns {boolean} - Returns true if loaded successfully, false if already loaded
     */
    loadGoogleAnalytics: function(trackingId, options = {}) {
        // Check if gtag is already loaded
        if (window.gtag && typeof window.gtag === 'function') {
            console.warn('Google Analytics is already loaded');
            return false;
        }

        // Default options
        const { debug = false, config = {} } = options;

        // Create and append the Google Tag Manager script
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        
        // Add error handling
        gtagScript.onerror = () => {
            console.error('Failed to load Google Analytics script');
        };

        // Create and append the initialization script
        const initScript = document.createElement('script');
        initScript.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${trackingId}'${Object.keys(config).length > 0 ? ', ' + JSON.stringify(config) : ''});
            ${debug ? "gtag('config', '" + trackingId + "', { 'debug_mode': true });" : ''}
        `;

        // Append scripts to head
        document.head.appendChild(gtagScript);
        document.head.appendChild(initScript);

        if (debug) {
            console.log(`Google Analytics loaded with ID: ${trackingId}`);
        }

        return true;
    },

    /**
     * Generic event tracking method
     * @param {string} eventName - The name of the event
     * @param {Object} parameters - Event parameters
     * @param {string} parameters.category - Event category (default: 'engagement')
     * @param {string} parameters.label - Event label
     * @param {number} parameters.value - Optional numeric value
     * @param {Object} parameters.custom - Any custom parameters
     */
    trackEvent: function(eventName, parameters = {}) {
        if (typeof window.gtag === 'undefined') {
            console.warn('Google Analytics not loaded. Call loadGoogleAnalytics first.');
            return;
        }

        const {
            category = 'My-Website',
            label = 'Default',
            value,
            ...custom
        } = parameters;

        const eventParams = {
            'event_category': category,
            'event_label': label,
            ...custom
        };
        
        if (value !== undefined && value !== null) {
            eventParams.value = value;
        }
        
        window.gtag('event', eventName, eventParams);
    },

    /**
     * Track page views manually (useful for SPAs)
     * @param {string} pagePath - The page path to track
     * @param {string} pageTitle - The page title
     */
    trackPageView: function(pagePath, pageTitle) {
        if (typeof window.gtag === 'undefined') {
            console.warn('Google Analytics not loaded. Call loadGoogleAnalytics first.');
            return;
        }

        window.gtag('event', 'page_view', {
            page_path: pagePath,
            page_title: pageTitle,
            page_location: window.location.origin + pagePath
        });
    },

    /**
     * Track custom user timing (performance metrics)
     * @param {string} timingCategory - Category (e.g., 'JS Dependencies')
     * @param {string} timingVar - Variable name (e.g., 'load')
     * @param {number} timingValue - Time in milliseconds
     * @param {string} timingLabel - Optional label
     */
    trackTiming: function(timingCategory, timingVar, timingValue, timingLabel) {
        if (typeof window.gtag === 'undefined') {
            console.warn('Google Analytics not loaded. Call loadGoogleAnalytics first.');
            return;
        }

        window.gtag('event', 'timing_complete', {
            name: timingVar,
            value: timingValue,
            event_category: timingCategory,
            event_label: timingLabel
        });
    },

    /**
     * Track exceptions/errors
     * @param {string} description - Error description
     * @param {boolean} fatal - Whether the error was fatal
     */
    trackException: function(description, fatal = false) {
        if (typeof window.gtag === 'undefined') {
            console.warn('Google Analytics not loaded. Call loadGoogleAnalytics first.');
            return;
        }

        window.gtag('event', 'exception', {
            description: description,
            fatal: fatal
        });
    }
};

// Expose Analytics to global scope
window.Analytics = Analytics;

// ===================================
// USAGE EXAMPLES
// ===================================

// Basic initialization:
// Analytics.loadGoogleAnalytics('G-R8WH8Z7KHL');

// With configuration:
// Analytics.loadGoogleAnalytics('G-R8WH8Z7KHL', {
//     debug: true,
//     config: {
//         page_title: 'My Custom Page',
//         send_page_view: true
//     }
// });

// Track events:
// Analytics.trackEvent('click', { label: 'header-cta', value: 1 });
// Analytics.trackEvent('form_submit', { 
//     category: 'form',
//     label: 'contact-form',
//     form_name: 'contact'
// });

// Track page views (for SPAs):
// Analytics.trackPageView('/about', 'About Us');

// Track performance:
// Analytics.trackTiming('API', 'user_data_fetch', 1234);

// Track errors:
// window.addEventListener('error', function(e) {
//     Analytics.trackException(e.message, false);
// });

// Auto-initialize on DOM ready (uncomment to enable):
// document.addEventListener('DOMContentLoaded', function() {
//     Analytics.loadGoogleAnalytics('G-R8WH8Z7KHL');
// });