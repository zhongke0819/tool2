/**
 * TikTokTool API Configuration
 * 
 * This file contains configuration settings for the TikTok and YouTube downloader API.
 * Replace the placeholder values with your actual API credentials.
 */

// 检测当前环境
const isGitHubPages = window.location.hostname.includes('github.io');
const isCloudflarePages = window.location.hostname.includes('.pages.dev');
const isDevelopment = window.location.hostname === 'localhost';

const API_CONFIG = {
    // TikTok API配置
    API_ENDPOINT: isDevelopment 
        ? 'http://localhost:3000/api/tiktok'
        : `${window.location.origin}/api/tiktok`,
    
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
    YOUTUBE_ENABLED: true, // 启用YouTube功能
    
    // YouTube API配置
    YOUTUBE_API_ENDPOINT: isDevelopment 
        ? 'http://localhost:3000/api/youtube'
        : `${window.location.origin}/api/youtube`,
}; 