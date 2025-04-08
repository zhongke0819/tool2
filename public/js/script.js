document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const tiktokUrlInput = document.getElementById('tiktok-url');
    const clearBtn = document.getElementById('clear-btn');
    const downloadBtn = document.getElementById('download-btn');
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    const accordionItems = document.querySelectorAll('.accordion-item');

    // YouTube元素
    const youtubeSection = document.querySelector('.youtube-section');
    const youtubeUrlInput = document.getElementById('youtube-url');
    const youtubeClearBtn = document.getElementById('youtube-clear-btn');
    const youtubeDownloadBtn = document.getElementById('youtube-download-btn');
    const youtubeLoading = document.getElementById('youtube-loading');
    const youtubeResult = document.getElementById('youtube-result');

    // 确保YouTube部分显示
    if (youtubeSection) {
        youtubeSection.style.display = 'block';
    }

    // 初始状态
    loadingElement.style.display = 'none';
    resultElement.style.display = 'none';

    // 初始化YouTube元素
    if (youtubeLoading && youtubeResult) {
        youtubeLoading.style.display = 'none';
        youtubeResult.style.display = 'none';
    }

    // Clear button event
    clearBtn.addEventListener('click', function() {
        tiktokUrlInput.value = '';
        hideResult();
    });

    // YouTube clear button event
    if (youtubeClearBtn) {
        youtubeClearBtn.addEventListener('click', function() {
            youtubeUrlInput.value = '';
            if (youtubeResult) {
                youtubeResult.style.display = 'none';
                youtubeResult.innerHTML = '';
            }
        });
    }

    // Download button event
    downloadBtn.addEventListener('click', function() {
        const url = tiktokUrlInput.value.trim();
        
        if (!url) {
            alert('请输入有效的 TikTok 视频链接！');
            return;
        }
        
        if (!isValidTikTokUrl(url)) {
            alert('请输入有效的 TikTok 视频链接！');
            return;
        }
        
        processDownload(url);
    });

    // YouTube download button event
    if (youtubeDownloadBtn) {
        youtubeDownloadBtn.addEventListener('click', function() {
            const url = youtubeUrlInput.value.trim();
            
            if (!url) {
                alert('请输入有效的 YouTube 视频链接！');
                return;
            }
            
            if (!isValidYoutubeUrl(url)) {
                alert('请输入有效的 YouTube 视频链接！');
                return;
            }
            
            processYoutubeDownload(url);
        });
    }

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

    // Process YouTube download
    function processYoutubeDownload(url) {
        youtubeLoading.style.display = 'block';
        youtubeResult.style.display = 'none';
        youtubeResult.innerHTML = '';

        // 构建API请求URL
        const apiUrl = '/api/youtube?url=' + encodeURIComponent(url);

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                youtubeLoading.style.display = 'none';
                if (data.error) {
                    showYoutubeError(data.error);
                    return;
                }
                displayYoutubeResults(data);
            })
            .catch(error => {
                youtubeLoading.style.display = 'none';
                showYoutubeError('下载失败，请稍后重试。');
                console.error('Error:', error);
            });
    }

    // Show YouTube error message
    function showYoutubeError(message) {
        youtubeResult.innerHTML = `
            <div class="error-message">
                <h4>错误</h4>
                <p>${message}</p>
            </div>
        `;
        youtubeResult.style.display = 'block';
    }

    // Display YouTube results
    function displayYoutubeResults(data) {
        const videoInfo = data.data;
        const formats = videoInfo.formats || [];
        
        let html = `
            <div class="video-info">
                <img src="${videoInfo.thumbnail}" alt="${videoInfo.title}">
                <h3>${videoInfo.title}</h3>
                <div class="video-meta">
                    <span>时长: ${formatDuration(videoInfo.duration)}</span>
                </div>
            </div>
            <div class="download-options">
        `;

        // 添加视频下载选项
        formats.forEach(format => {
            if (format.url) {
                html += `
                    <div class="download-option">
                        <span class="format-info">${format.quality || '未知质量'} - ${format.ext}</span>
                        <a href="${format.url}" class="download-button" target="_blank" download>
                            下载 ${format.ext.toUpperCase()}
                        </a>
                    </div>
                `;
            }
        });

        html += '</div>';
        youtubeResult.innerHTML = html;
        youtubeResult.style.display = 'block';
    }

    // Format duration from seconds to HH:MM:SS
    function formatDuration(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // Validate YouTube URL
    function isValidYoutubeUrl(url) {
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return pattern.test(url);
    }
}); 