/**
 * TikTokTool API Configuration
 * 
 * This file contains configuration settings for the TikTok downloader API.
 * Replace the placeholder values with your actual API credentials.
 */

// 检测当前环境
const isGitHubPages = window.location.hostname.includes('github.io');
const isCloudflarePages = window.location.hostname.includes('.pages.dev');
const isDevelopment = window.location.hostname === 'localhost';

const API_CONFIG = {
    // 根据环境选择不同的API端点
    API_ENDPOINT: isDevelopment 
        ? 'http://localhost:3000/api/tiktok'
        : isCloudflarePages
            ? `${window.location.origin}/api/tiktok` // Cloudflare Pages环境
            : 'https://api.your-proxy-service.com/api/tiktok', // 其他环境
    
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
    YOUTUBE_ENABLED: isDevelopment || isCloudflarePages // 在Cloudflare Pages和本地开发环境启用YouTube功能
}; 