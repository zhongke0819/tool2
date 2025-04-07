/**
 * TikTokTool API Configuration
 * 
 * This file contains configuration settings for the TikTok downloader API.
 * Replace the placeholder values with your actual API credentials.
 */

const API_CONFIG = {
    // The API endpoint URL provided by your API service
    API_ENDPOINT: 'https://rapidapi.com/tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index', // Updated RapidAPI endpoint
    
    // Your API key - leave empty if not required
    API_KEY: 'e0446dfc14msh25c8592ef0dee92p112e88jsnf6b483c4549d',
    
    // API request method - usually POST, but check your API documentation
    API_METHOD: 'GET', // Using GET method for this endpoint
    
    // Whether the API requires authentication
    REQUIRES_AUTH: true,
    
    // How the API expects to receive authentication (e.g., 'Bearer', 'Key', etc.)
    AUTH_TYPE: 'X-RapidAPI-Key', // RapidAPI uses this header for authentication
    
    // RapidAPI Host header
    RAPID_API_HOST: 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com',
    
    // Application name
    APP_NAME: 'default-application_10441938',
    
    // Response mapping - maps the API response fields to our expected format
    // This is based on typical RapidAPI TikTok downloader response structure
    // You may need to adjust these based on actual API response
    RESPONSE_MAPPING: {
        noWatermark: 'video.noWatermark', // Common path for no watermark URL
        withWatermark: 'video.watermark', // Common path for watermark URL
        audio: 'music.play' // Common path for audio URL
    },
    
    // Additional parameters that might be required by the API
    ADDITIONAL_PARAMS: {
        // Add any additional parameters required by the API
        // For example: 'format': 'mp4'
    }
}; 