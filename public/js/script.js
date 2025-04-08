document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const tiktokUrlInput = document.getElementById('tiktok-url');
    const clearBtn = document.getElementById('clear-btn');
    const downloadBtn = document.getElementById('download-btn');
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    const accordionItems = document.querySelectorAll('.accordion-item');

    // YouTube元素
    const youtubeUrlInput = document.getElementById('youtube-url');
    const youtubeClearBtn = document.getElementById('youtube-clear-btn');
    const youtubeDownloadBtn = document.getElementById('youtube-download-btn');
    const youtubeLoading = document.getElementById('youtube-loading');
    const youtubeResult = document.getElementById('youtube-result');

    // 初始状态
    loadingElement.style.display = 'none';
    resultElement.style.display = 'none';

    // 初始化YouTube元素
    youtubeLoading.style.display = 'none';
    youtubeResult.style.display = 'none';

    // Clear button event
    clearBtn.addEventListener('click', function() {
        tiktokUrlInput.value = '';
        hideResult();
    });

    // Download button event
    downloadBtn.addEventListener('click', function() {
        const url = tiktokUrlInput.value.trim();
        
        if (!url) {
            alert('Please enter a valid TikTok video link!');
            return;
        }
        
        if (!isValidTikTokUrl(url)) {
            alert('Please enter a valid TikTok video link!');
            return;
        }
        
        processDownload(url);
    });

    // YouTube下载逻辑
    youtubeClearBtn.addEventListener('click', function() {
        youtubeUrlInput.value = '';
        youtubeResult.innerHTML = '';
        youtubeResult.style.display = 'none';
    });

    youtubeDownloadBtn.addEventListener('click', function() {
        processYoutubeDownload();
    });

    // 输入框回车事件
    youtubeUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processYoutubeDownload();
        }
    });

    // Validate TikTok URL
    function isValidTikTokUrl(url) {
        // Basic validation: check if it contains tiktok.com
        return url.includes('tiktok.com') || url.includes('douyin.com');
    }

    // Process download
    function processDownload(url) {
        showLoading();
        hideResult();
        
        // For proxy server, construct the URL with query parameters
        const apiUrl = new URL(API_CONFIG.API_ENDPOINT);
        apiUrl.searchParams.append('url', url);
        
        console.log('Request URL:', apiUrl.toString());
        
        // API Request
        fetch(apiUrl.toString(), {
            method: API_CONFIG.API_METHOD
        })
        .then(response => {
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Error response body:', text);
                    throw new Error(`API error: ${response.status} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            
            console.log('API Response:', data); // For debugging
            
            // Extract download links using the response mapping
            const downloadLinks = {
                noWatermark: getNestedValue(data, API_CONFIG.RESPONSE_MAPPING.noWatermark) || '#',
                withWatermark: getNestedValue(data, API_CONFIG.RESPONSE_MAPPING.withWatermark) || '#',
                audio: getNestedValue(data, API_CONFIG.RESPONSE_MAPPING.audio) || '#'
            };
            
            // Check if we have at least one valid download link
            if (downloadLinks.noWatermark === '#' && 
                downloadLinks.withWatermark === '#' && 
                downloadLinks.audio === '#') {
                throw new Error('No valid download links found in API response');
            }
            
            showResult(downloadLinks);
        })
        .catch(error => {
            hideLoading();
            console.error('Error downloading video:', error);
            
            // Show error message to user
            resultElement.innerHTML = `
                <div class="error-message">
                    <h4>Error</h4>
                    <p>Sorry, we couldn't process your request. Please try again later or check if the URL is correct.</p>
                    <p class="error-details">Details: ${error.message}</p>
                    <p class="error-details">If this error persists, please contact support with the error details.</p>
                </div>
            `;
            resultElement.classList.add('show');
        });
    }
    
    // Helper function to extract video ID from TikTok URL
    function extractVideoId(url) {
        // This is a simple implementation and might need to be adjusted based on actual URL formats
        const match = url.match(/video\/(\d+)/);
        return match ? match[1] : '';
    }

    // Helper function to safely extract nested values from an object
    function getNestedValue(obj, path) {
        if (!path) return undefined;
        
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
            if (result === null || result === undefined) return undefined;
            result = result[key];
        }
        
        return result;
    }

    // Show loading state
    function showLoading() {
        loadingElement.classList.add('show');
    }

    // Hide loading state
    function hideLoading() {
        loadingElement.classList.remove('show');
    }

    // Show result
    function showResult(links) {
        resultElement.innerHTML = `
            <div class="result-item">
                <h4>No Watermark Video</h4>
                <p>High quality version without watermark</p>
                <a href="${links.noWatermark}" target="_blank" download>Download MP4</a>
            </div>
            <div class="result-item">
                <h4>Original Video</h4>
                <p>Original video with TikTok watermark</p>
                <a href="${links.withWatermark}" target="_blank" download>Download MP4</a>
            </div>
            <div class="result-item">
                <h4>Audio Only</h4>
                <p>Extract only the audio from the video</p>
                <a href="${links.audio}" target="_blank" download>Download MP3</a>
            </div>
        `;
        resultElement.classList.add('show');
    }

    // Hide result
    function hideResult() {
        resultElement.classList.remove('show');
        resultElement.innerHTML = '';
    }

    // Accordion component handling
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            accordionItems.forEach(accordionItem => {
                accordionItem.classList.remove('active');
            });
            
            // If the current item wasn't active, activate it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Paste from link input
    tiktokUrlInput.addEventListener('paste', function(e) {
        // Check input value in the next event loop
        setTimeout(() => {
            const url = tiktokUrlInput.value.trim();
            if (isValidTikTokUrl(url)) {
                // Optional: Auto-trigger download (uncomment the line below to enable)
                // processDownload(url);
            }
        }, 100);
    });

    // Provide auto-paste functionality from clipboard (requires user interaction, such as clicking the document)
    document.addEventListener('click', async function() {
        if (tiktokUrlInput.value.trim() === '') {
            try {
                const permission = await navigator.permissions.query({name: 'clipboard-read'});
                if (permission.state === 'granted' || permission.state === 'prompt') {
                    const text = await navigator.clipboard.readText();
                    if (text && isValidTikTokUrl(text)) {
                        tiktokUrlInput.value = text;
                    }
                }
            } catch (err) {
                // Clipboard API not available or permission denied
                console.log('Unable to access clipboard:', err);
            }
        }
    });

    // 处理YouTube下载
    function processYoutubeDownload() {
        const url = youtubeUrlInput.value.trim();
        
        // 验证URL
        if (!url) {
            showYoutubeError('请输入YouTube视频链接');
            return;
        }

        if (!isValidYoutubeUrl(url)) {
            showYoutubeError('请输入有效的YouTube视频链接');
            return;
        }

        // 显示加载状态
        youtubeLoading.style.display = 'block';
        youtubeResult.style.display = 'none';
        youtubeResult.innerHTML = '';

        // 构建API请求URL
        const apiUrl = new URL('/api/youtube', window.location.origin);
        apiUrl.searchParams.append('url', url);

        // 发送请求
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.details || '请求失败');
                    });
                }
                return response.json();
            })
            .then(data => {
                youtubeLoading.style.display = 'none';
                
                if (!data.streamingData || !data.streamingData.formats) {
                    throw new Error('未找到视频下载链接');
                }
                
                displayYoutubeResults(data);
            })
            .catch(error => {
                youtubeLoading.style.display = 'none';
                showYoutubeError(`下载失败: ${error.message}`);
            });
    }

    // 显示YouTube错误
    function showYoutubeError(message) {
        youtubeLoading.style.display = 'none';
        youtubeResult.style.display = 'block';
        youtubeResult.innerHTML = `
            <div class="error-message">
                <h4>错误</h4>
                <p>抱歉，我们无法处理您的请求。请稍后再试或检查URL是否正确。</p>
                <p class="error-details">详情: ${message}</p>
                <p class="error-details">如果此错误持续存在，请联系支持人员并提供错误详情。</p>
            </div>
        `;
    }

    // 显示YouTube结果
    function displayYoutubeResults(data) {
        youtubeResult.style.display = 'block';
        
        // 提取视频信息
        const videoDetails = data.videoDetails || {};
        const formats = data.streamingData?.formats || [];
        const adaptiveFormats = data.streamingData?.adaptiveFormats || [];
        
        // 构建视频信息HTML
        let html = `
            <div class="video-info">
                <h3>${videoDetails.title || '未知标题'}</h3>
                <div class="video-meta">
                    <p>时长: ${formatDuration(videoDetails.lengthSeconds || 0)}</p>
                    <p>作者: ${videoDetails.author || '未知'}</p>
                </div>
                ${videoDetails.thumbnails ? `<img src="${videoDetails.thumbnails[videoDetails.thumbnails.length-1].url}" alt="缩略图">` : ''}
            </div>
            <div class="download-options">
                <h4>视频下载选项:</h4>
                <div class="download-links">
        `;
        
        // 添加常规格式
        if (formats.length > 0) {
            formats.forEach((format, index) => {
                if (format.url) {
                    const quality = format.qualityLabel || `${format.width}x${format.height}`;
                    html += `
                        <div class="download-option">
                            <span>${quality}</span>
                            <a href="${format.url}" target="_blank" rel="noopener noreferrer" class="download-button">下载</a>
                        </div>
                    `;
                }
            });
        }
        
        // 添加自适应格式
        if (adaptiveFormats.length > 0) {
            // 视频格式
            const videoFormats = adaptiveFormats.filter(format => format.mimeType.includes('video/'));
            if (videoFormats.length > 0) {
                html += `<h4>仅视频:</h4>`;
                videoFormats.forEach((format, index) => {
                    if (format.url) {
                        const quality = format.qualityLabel || `${format.width}x${format.height}`;
                        html += `
                            <div class="download-option">
                                <span>${quality}</span>
                                <a href="${format.url}" target="_blank" rel="noopener noreferrer" class="download-button">下载</a>
                            </div>
                        `;
                    }
                });
            }
            
            // 音频格式
            const audioFormats = adaptiveFormats.filter(format => format.mimeType.includes('audio/'));
            if (audioFormats.length > 0) {
                html += `<h4>仅音频:</h4>`;
                audioFormats.forEach((format, index) => {
                    if (format.url) {
                        const quality = `${Math.round(format.bitrate/1000)}kbps`;
                        html += `
                            <div class="download-option">
                                <span>${quality}</span>
                                <a href="${format.url}" target="_blank" rel="noopener noreferrer" class="download-button">下载</a>
                            </div>
                        `;
                    }
                });
            }
        }
        
        html += `
                </div>
            </div>
        `;
        
        youtubeResult.innerHTML = html;
    }

    // 格式化时长
    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // 验证YouTube URL
    function isValidYoutubeUrl(url) {
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
        return pattern.test(url);
    }
}); 