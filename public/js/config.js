/**
 * TikTokTool API Configuration
 * 
 * This file contains configuration settings for the TikTok downloader API.
 * Replace the placeholder values with your actual API credentials.
 */

const API_CONFIG = {
    // The API endpoint URL provided by your API service
    API_ENDPOINT: 'http://localhost:3000/api/tiktok', // Local proxy server endpoint
    
    // API request method
    API_METHOD: 'GET',
    
    // Whether the API requires authentication
    REQUIRES_AUTH: false, // Authentication is handled by the proxy server
    
    // Response mapping - maps the API response fields to our expected format
    RESPONSE_MAPPING: {
        noWatermark: 'data.video.playAddr',
        withWatermark: 'data.video.cover',
        audio: 'data.music.playAddr'
    }
}; 