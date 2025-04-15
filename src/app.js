document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('videoUrl');
    const downloadBtn = document.getElementById('downloadBtn');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    downloadBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) {
            showError('请输入 TikTok 视频链接');
            return;
        }

        try {
            // 显示加载状态
            loadingDiv.style.display = 'block';
            
            // 使用RapidAPI的TikTok Video No Watermark API
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'e0446dfc14msh25c8592ef0dee92p112e88jsnf6b483c4549d',
                    'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
                }
            };
            
            // 构建API URL (使用encodeURIComponent确保URL安全传输)
            const apiUrl = `https://tiktok-video-no-watermark2.p.rapidapi.com/info?url=${encodeURIComponent(url)}`;
            
            const response = await fetch(apiUrl, options);
            
            // 隐藏加载状态
            loadingDiv.style.display = 'none';
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
            }
            
            const responseData = await response.json();
            
            // 检查API响应
            if (!responseData.success) {
                throw new Error(responseData.message || '获取视频信息失败');
            }
            
            const data = responseData.data;
            
            // 显示视频信息和下载按钮
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="card mt-4">
                        <img src="${data.cover}" class="card-img-top" alt="视频缩略图" style="max-height: 300px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">@${data.author.nickname}</h5>
                            <p class="card-text">${data.title || '无标题'}</p>
                            <div class="d-flex justify-content-center gap-3">
                                <a href="${data.play}" class="btn btn-primary" download>下载原视频</a>
                                <a href="${data.play_nwm}" class="btn btn-success" download>下载无水印视频</a>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                console.error('未找到result元素');
            }
        } catch (error) {
            // 隐藏加载状态
            loadingDiv.style.display = 'none';
            console.error('下载错误:', error);
            showError(error.message || '下载视频时发生错误');
        }
    });

    function showError(message) {
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="alert alert-danger mt-4" role="alert">
                    ${message}
                </div>
            `;
        } else {
            console.error('未找到result元素，无法显示错误:', message);
        }
    }
});