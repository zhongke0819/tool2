document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');

    downloadBtn.addEventListener('click', async () => {
        const videoUrl = videoUrlInput.value.trim();
        
        if (!videoUrl) {
            alert('请输入视频链接！');
            return;
        }

        try {
            // 显示加载状态
            loadingElement.style.display = 'block';
            resultElement.innerHTML = '';
            
            // 调用 Worker API（更新为新的域名）
            const response = await fetch('https://download.tiktoktool.org/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: videoUrl })
            });

            if (!response.ok) {
                throw new Error('下载失败，请稍后重试');
            }

            // 创建下载链接
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            
            // 显示下载按钮
            resultElement.innerHTML = `
                <div class="alert alert-success mt-3">
                    <a href="${downloadUrl}" class="btn btn-success" download="tiktok-video.mp4">
                        点击下载视频
                    </a>
                </div>
            `;
        } catch (error) {
            resultElement.innerHTML = `
                <div class="alert alert-danger mt-3">
                    ${error.message}
                </div>
            `;
        } finally {
            // 隐藏加载状态
            loadingElement.style.display = 'none';
        }
    });
}); 