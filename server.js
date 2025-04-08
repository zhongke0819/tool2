const express = require('express');
const https = require('https');
const cors = require('cors');
const qs = require('querystring');
const app = express();

// 启用CORS
app.use(cors());

// 静态文件服务
app.use(express.static('public'));

// 从TikTok URL中提取视频ID
function extractVideoId(url) {
    const match = url.match(/video\/(\d+)/);
    return match ? match[1] : null;
}

// 从YouTube URL中提取视频ID
function extractYoutubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

// 代理TikTok API请求
app.get('/api/tiktok', (req, res) => {
    const videoUrl = req.query.url;
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
        return res.status(400).json({
            error: 'Invalid TikTok URL. Could not extract video ID.'
        });
    }

    const options = {
        method: 'GET',
        hostname: 'tiktok-video-no-watermark2.p.rapidapi.com',
        port: null,
        path: `/video/data?video_id=${videoId}`,
        headers: {
            'X-RapidAPI-Key': 'e0446dfc14msh25c8592ef0dee92p112e88jsnf6b483c4549d',
            'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
        }
    };

    const apiReq = https.request(options, function (apiRes) {
        const chunks = [];

        apiRes.on('data', function (chunk) {
            chunks.push(chunk);
        });

        apiRes.on('end', function () {
            const body = Buffer.concat(chunks);
            try {
                const data = JSON.parse(body.toString());
                
                // 检查API响应中的错误
                if (data.code !== 0) {
                    throw new Error(data.msg || 'API returned an error');
                }
                
                res.json(data);
            } catch (error) {
                console.error('Error parsing response:', error);
                res.status(500).json({
                    error: 'Failed to process API response',
                    details: error.message
                });
            }
        });
    });

    apiReq.on('error', function (error) {
        console.error('Error making request:', error);
        res.status(500).json({
            error: 'Failed to fetch video data',
            details: error.message
        });
    });

    apiReq.end();
});

// 使用新的RapidAPI接口的YouTube API请求
app.get('/api/youtube', (req, res) => {
    const videoUrl = req.query.url;
    const videoId = extractYoutubeId(videoUrl);

    if (!videoId) {
        return res.status(400).json({
            error: 'Invalid YouTube URL. Could not extract video ID.'
        });
    }

    // 创建新的请求选项
    const options = {
        method: 'POST',
        hostname: 'youtube-media-downloader.p.rapidapi.com',
        port: null,
        path: '/v2/video/details',
        headers: {
            'X-RapidAPI-Key': 'e0446dfc14msh25c8592ef0dee92p112e88jsnf6b483c4549d',
            'X-RapidAPI-Host': 'youtube-media-downloader.p.rapidapi.com',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const apiReq = https.request(options, function (apiRes) {
        const chunks = [];

        apiRes.on('data', function (chunk) {
            chunks.push(chunk);
        });

        apiRes.on('end', function () {
            const body = Buffer.concat(chunks);
            try {
                const data = JSON.parse(body.toString());
                
                // 检查API响应中的错误
                if (data.status !== 'ok') {
                    throw new Error(data.message || 'API returned an error');
                }
                
                res.json(data);
            } catch (error) {
                console.error('Error parsing response:', error);
                res.status(500).json({
                    error: 'Failed to process API response',
                    details: error.message
                });
            }
        });
    });

    apiReq.on('error', function (error) {
        console.error('Error making request:', error);
        res.status(500).json({
            error: 'Failed to fetch video data',
            details: error.message
        });
    });

    // 设置POST请求数据
    const postData = qs.stringify({
        videoId: videoId
    });
    
    apiReq.write(postData);
    apiReq.end();
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 