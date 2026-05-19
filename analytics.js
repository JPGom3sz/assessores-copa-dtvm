/**
 * Vercel Web Analytics Integration
 * 
 * This module initializes Vercel Web Analytics for the Copa BRB Investimentos project.
 * For vanilla JavaScript projects, we use the inject method from @vercel/analytics.
 */

import { inject } from './node_modules/@vercel/analytics/dist/index.mjs';

// Initialize Vercel Analytics
inject({
  mode: 'production', // Use 'production' for deployment, 'development' for local testing
  debug: false // Set to true to see analytics events in the console during development
});

console.log('Vercel Analytics initialized');
