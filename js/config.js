/**
 * TikTokTool API Configuration
 * 
 * This file contains configuration settings for the TikTok downloader API.
 * Replace the placeholder values with your actual API credentials.
 */

const API_CONFIG = {
    // The API endpoint URL provided by your API service
    API_ENDPOINT: 'https://tiktok-video-no-watermark2.p.rapidapi.com/video/data', // Updated based on cURL example
    
    // Your API key - leave empty if not required
    API_KEY: 'e0446dfc14msh25c8592ef0dee92p112e88jsnf6b483c4549d',
    
    // API request method - usually POST, but check your API documentation
    API_METHOD: 'GET', // Using GET method as shown in cURL example
    
    // Whether the API requires authentication
    REQUIRES_AUTH: true,
    
    // How the API expects to receive authentication (e.g., 'Bearer', 'Key', etc.)
    AUTH_TYPE: 'X-RapidAPI-Key', // RapidAPI uses this header for authentication
    
    // RapidAPI Host header
    RAPID_API_HOST: 'tiktok-video-no-watermark2.p.rapidapi.com', // Updated based on cURL example
    
    // Application name
    APP_NAME: 'default-application_10441938',
    
    // Response mapping - maps the API response fields to our expected format
    // This is based on typical RapidAPI TikTok downloader response structure
    // You may need to adjust these based on actual API response
    RESPONSE_MAPPING: {
        noWatermark: 'data.video.playAddr', // Updated path based on new API
        withWatermark: 'data.video.cover', // Updated path based on new API
        audio: 'data.music.playAddr' // Updated path based on new API
    },
    
    // Additional parameters that might be required by the API
    ADDITIONAL_PARAMS: {
        // Add any additional parameters required by the API
        // For example: 'format': 'mp4'
    }
}; 