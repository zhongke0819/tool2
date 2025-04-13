document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('tiktok-url');
    const downloadBtn = document.getElementById('download-btn');
    const resultDiv = document.getElementById('result');

    downloadBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) {
            showError('请输入 TikTok 视频链接');
            return;
        }

        try {
            // 这里使用 Cloudflare Workers API 端点
            const response = await fetch('https://dry-leaf-76a6.zhongke0819.workers.dev/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('获取视频信息失败');
            }

            const data = await response.json();

            // 显示视频信息和下载按钮
            resultDiv.innerHTML = `
                <div class="card mt-4">
                    <img src="${data.thumbnailUrl}" class="card-img-top" alt="视频缩略图" style="max-height: 300px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">@${data.username}</h5>
                        <p class="card-text">上传时间：${data.uploadTime}</p>
                        <div class="d-flex justify-content-center gap-3">
                            <a href="${data.videoUrl}" class="btn btn-primary" download>下载原视频</a>
                            <a href="${data.watermarkFreeUrl}" class="btn btn-success" download>下载无水印视频</a>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            showError(error.message);
        }
    });

    function showError(message) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger mt-4" role="alert">
                ${message}
            </div>
        `;
    }
});