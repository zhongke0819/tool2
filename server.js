const express = require('express');
const https = require('https');
const cors = require('cors');
const app = express();

// 启用CORS
app.use(cors());

// 静态文件服务
app.use(express.static('public'));

// 代理API请求
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
            'x-rapidapi-key': 'e0446dfc14msh25c8592ef0dee92p112e88jsnf6b483c4549d',
            'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com'
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
                res.json(data);
            } catch (error) {
                console.error('Error parsing response:', error);
                res.status(500).json({
                    error: 'Failed to parse API response'
                });
            }
        });
    });

    apiReq.on('error', function (error) {
        console.error('Error making request:', error);
        res.status(500).json({
            error: 'Failed to fetch video data'
        });
    });

    apiReq.end();
});

// 辅助函数：从URL中提取视频ID
function extractVideoId(url) {
    if (!url) return null;
    const match = url.match(/video\/(\d+)/);
    return match ? match[1] : null;
}

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 