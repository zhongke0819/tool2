/**
 * TikTokTool API Configuration
 * 
 * This file contains configuration settings for the TikTok downloader API.
 */

const API_CONFIG = {
    // The API endpoint URL provided by your API service
    API_ENDPOINT: 'https://tiktok-video-no-watermark2.p.rapidapi.com/video/data', // Updated endpoint from documentation
    
    // Your API key
    API_KEY: 'e0446dfc14msh25c8592ef0dee92p112e88jsnf6b483c4549d',
    
    // API request method
    API_METHOD: 'GET',
    
    // RapidAPI Host header
    RAPID_API_HOST: 'tiktok-video-no-watermark2.p.rapidapi.com',
    
    // Response mapping - maps the API response fields to our expected format
    RESPONSE_MAPPING: {
        noWatermark: 'data.play', // Updated based on API response format
        withWatermark: 'data.origin_cover', // Updated based on API response format
        audio: 'data.music' // Updated based on API response format
    }
}; 