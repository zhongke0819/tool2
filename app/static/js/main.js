/**
 * TikTok Video Downloader JavaScript
 * 处理用户输入和下载功能
 */

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const urlInput = document.getElementById('url-input');
    const downloadBtn = document.getElementById('download-btn');
    const resultDiv = document.getElementById('result');
    
    // 下载按钮点击事件
    downloadBtn.addEventListener('click', handleDownload);
    
    // 允许用户按回车键提交
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleDownload();
        }
    });
    
    /**
     * 处理下载请求
     */
    function handleDownload() {
        const url = urlInput.value.trim();
        
        // 验证URL
        if (!url) {
            showMessage('请输入有效的TikTok视频链接', 'error');
            return;
        }
        
        // 验证是否为TikTok链接
        if (!isTikTokUrl(url)) {
            showMessage('请确保输入的是TikTok视频链接', 'error');
            return;
        }
        
        // 显示加载状态
        showLoading();
        
        // 在实际应用中，这里会发送请求到后端
        // 示例代码 - 在实际使用时取消下面的注释，并实现后端接口
        /*
        fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // 创建下载链接
                const downloadLink = document.createElement('a');
                downloadLink.href = data.downloadUrl;
                downloadLink.className = 'download-link';
                downloadLink.textContent = '点击下载视频';
                downloadLink.download = 'tiktok_video.mp4';
                
                showMessage('视频处理成功!', 'success');
                resultDiv.appendChild(downloadLink);
            } else {
                showMessage('下载失败: ' + data.message, 'error');
            }
        })
        .catch(error => {
            showMessage('发生错误: ' + error.message, 'error');
        })
        .finally(() => {
            hideLoading();
        });
        */
        
        // 演示用 - 在实际使用时删除这段代码
        setTimeout(() => {
            showMessage('正在处理链接: ' + url + '<br>请注意，这只是一个演示。实际的下载功能需要后端实现。', 'info');
            hideLoading();
        }, 1500);
    }
    
    /**
     * 验证URL是否为TikTok链接
     * @param {string} url - 要验证的URL
     * @return {boolean} 是否为有效的TikTok链接
     */
    function isTikTokUrl(url) {
        // 简单验证，实际应用中可能需要更复杂的验证
        return url.includes('tiktok.com') || 
               url.includes('douyin.com') || 
               url.includes('抖音');
    }
    
    /**
     * 显示消息
     * @param {string} message - 要显示的消息
     * @param {string} type - 消息类型 (success, error, info)
     */
    function showMessage(message, type = 'info') {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = message;
        
        // 根据消息类型添加样式
        resultDiv.className = '';
        if (type === 'success') {
            resultDiv.classList.add('success-message');
        } else if (type === 'error') {
            resultDiv.classList.add('error-message');
        }
    }
    
    /**
     * 显示加载动画
     */
    function showLoading() {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="loading"></span>处理中...';
    }
    
    /**
     * 隐藏加载动画
     */
    function hideLoading() {
        downloadBtn.disabled = false;
        downloadBtn.textContent = '下载视频';
    }
});