document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const tiktokUrlInput = document.getElementById('tiktok-url');
    const clearBtn = document.getElementById('clear-btn');
    const downloadBtn = document.getElementById('download-btn');
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    const accordionItems = document.querySelectorAll('.accordion-item');

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

    // Validate TikTok URL
    function isValidTikTokUrl(url) {
        // Basic validation: check if it contains tiktok.com
        return url.includes('tiktok.com') || url.includes('douyin.com');
    }

    // Process download
    function processDownload(url) {
        showLoading();
        hideResult();
        
        // Extract video ID from URL
        const videoId = extractVideoId(url);
        
        if (!videoId) {
            hideLoading();
            resultElement.innerHTML = `
                <div class="error-message">
                    <h4>Error</h4>
                    <p>Could not extract video ID from the provided URL. Please make sure it's a valid TikTok video URL.</p>
                </div>
            `;
            resultElement.classList.add('show');
            return;
        }
        
        // For RapidAPI, construct the URL with query parameters
        const apiUrl = new URL(API_CONFIG.API_ENDPOINT);
        apiUrl.searchParams.append('video_id', videoId);
        
        // Add any additional parameters required by the API
        if (API_CONFIG.ADDITIONAL_PARAMS) {
            Object.entries(API_CONFIG.ADDITIONAL_PARAMS).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    apiUrl.searchParams.append(key, value);
                }
            });
        }
        
        // Prepare headers for API request
        const headers = {
            // RapidAPI requires these specific headers
            'X-RapidAPI-Key': API_CONFIG.API_KEY,
            'X-RapidAPI-Host': API_CONFIG.RAPID_API_HOST
        };
        
        console.log('Request URL:', apiUrl.toString());
        console.log('Request Headers:', headers);
        
        // API Request
        fetch(apiUrl.toString(), {
            method: API_CONFIG.API_METHOD,
            headers: headers
        })
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);
            
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
}); 