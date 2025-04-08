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

// 处理TikTok API请求
async function handleTikTokRequest(request, env) {
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get('url');
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
        return new Response(JSON.stringify({
            error: 'Invalid TikTok URL. Could not extract video ID.'
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    try {
        const response = await fetch(`https://${env.TIKTOK_API_HOST}/video/data?video_id=${videoId}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': env.TIKTOK_API_HOST
            }
        });

        const data = await response.json();

        if (data.code !== 0) {
            throw new Error(data.msg || 'API returned an error');
        }

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch video data',
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// 处理YouTube API请求
async function handleYouTubeRequest(request, env) {
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get('url');
    const videoId = extractYoutubeId(videoUrl);

    if (!videoId) {
        return new Response(JSON.stringify({
            error: 'Invalid YouTube URL. Could not extract video ID.'
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    try {
        const response = await fetch(`https://${env.YOUTUBE_API_HOST}/v2/video/details`, {
            method: 'POST',
            headers: {
                'X-RapidAPI-Key': env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': env.YOUTUBE_API_HOST,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `videoId=${videoId}`
        });

        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error(data.message || 'API returned an error');
        }

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to fetch video data',
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// 处理静态文件请求
async function handleStaticRequest(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // 如果路径是根路径或没有扩展名，返回 index.html
    if (path === '/' || !path.includes('.')) {
        path = '/index.html';
    }

    try {
        const response = await fetch(`https://your-cloudflare-pages-domain.pages.dev${path}`);
        return response;
    } catch (error) {
        return new Response('Not Found', { status: 404 });
    }
}

// 主处理函数
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // 处理 CORS 预检请求
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        // 根据路径分发请求
        if (path === '/api/tiktok') {
            return handleTikTokRequest(request, env);
        } else if (path === '/api/youtube') {
            return handleYouTubeRequest(request, env);
        } else {
            return handleStaticRequest(request);
        }
    }
}; 