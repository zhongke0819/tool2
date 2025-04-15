// Worker 入口点
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// 处理请求的主函数
async function handleRequest(request) {
  // 解析请求 URL
  const url = new URL(request.url)
  
  // 如果是下载请求
  if (url.pathname.startsWith('/download')) {
    return handleDownload(request)
  }
  
  // 其他请求返回 404
  return new Response('Not Found', { status: 404 })
}

// 处理视频下载
async function handleDownload(request) {
  try {
    const data = await request.json()
    const videoUrl = data.url
    
    if (!videoUrl) {
      return new Response('Missing video URL', { status: 400 })
    }

    // 获取视频内容
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    // 检查响应
    if (!response.ok) {
      throw new Error('Failed to fetch video')
    }

    // 返回视频内容
    return new Response(response.body, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="video.mp4"'
      }
    })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
} 