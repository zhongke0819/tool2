/**
 * TikTokTool API Configuration
 * 
 * This file contains configuration settings for the TikTok and YouTube downloader API.
 */

const API_CONFIG = {
    // TikTok API配置
    API_ENDPOINT: '/api/tiktok',
    
    // API request method
    API_METHOD: 'GET',
    
    // Whether the API requires authentication
    REQUIRES_AUTH: false,
    
    // Response mapping - maps the API response fields to our expected format
    RESPONSE_MAPPING: {
        noWatermark: 'data.video.playAddr',
        withWatermark: 'data.video.cover',
        audio: 'data.music.playAddr'
    },

    // YouTube功能配置
    YOUTUBE_ENABLED: true,
    
    // YouTube API配置
    YOUTUBE_API_ENDPOINT: '/api/youtube'
};