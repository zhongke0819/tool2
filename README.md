# TikTok视频下载器

这是一个无水印TikTok视频下载工具，支持从TikTok和YouTube下载视频。

## 功能特点

- 无水印下载TikTok视频
- 下载原始TikTok视频
- 提取并下载视频中的音频
- 下载YouTube视频（在Cloudflare Pages和本地环境可用）

## 部署说明

### 推荐部署方式：GitHub + Cloudflare Pages

1. **GitHub仓库设置**
   - 将代码推送到GitHub仓库
   - 确保仓库结构正确，所有前端文件在`public`目录下

2. **Cloudflare Pages设置**
   - 在Cloudflare Pages中创建新项目
   - 连接GitHub仓库
   - 设置构建配置：
     - 构建命令：`npm install && npm run build`（如果需要）
     - 输出目录：`public`
     - Node.js版本：选择合适的版本（推荐16.x或更高）
   - 环境变量设置（如果需要）：
     ```
     NODE_ENV=production
     API_KEY=your_api_key
     ```

3. **域名设置**
   - 可以使用Cloudflare提供的`.pages.dev`域名
   - 或配置自定义域名

### 本地开发环境设置

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/tiktok-downloader.git
cd tiktok-downloader
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
```

4. 打开浏览器访问：
```
http://localhost:3000
```

## 技术栈

- 前端：HTML, CSS, JavaScript
- 后端：Node.js, Express
- 部署：Cloudflare Pages
- API：TikTok无水印API, YouTube下载API

## 项目结构

```
tiktoktool/
├── public/              # 静态文件目录（前端文件）
│   ├── index.html      # 主页
│   ├── css/            # 样式文件
│   ├── js/             # JavaScript文件
│   └── images/         # 图片资源
├── server.js           # Node.js服务器文件
├── package.json        # 项目配置文件
└── README.md           # 项目说明文档
```

## 环境说明

项目支持三种运行环境：

1. **本地开发环境**
   - 完整功能支持（TikTok和YouTube下载）
   - API端点：`http://localhost:3000`

2. **Cloudflare Pages环境**
   - 完整功能支持
   - API端点：自动使用当前域名
   - 支持后端API功能

3. **其他环境（如GitHub Pages）**
   - 仅支持TikTok下载功能
   - 需要配置外部API服务

## 注意事项

- 确保在推送到GitHub之前已经正确配置了所有环境变量
- 在Cloudflare Pages中可以设置不同的环境变量用于开发和生产环境
- 建议定期备份数据和配置
- 遵守相关服务条款和版权规定

## 许可证

MIT

## Project Structure

```
tiktoktool.org/
├── index.html            # Homepage
├── privacy.html          # Privacy Policy page
├── terms.html            # Terms of Service page
├── contact.html          # Contact Us page
├── css/
│   └── style.css         # Style file
├── js/
│   └── script.js         # JavaScript script
└── images/
    ├── logo.png          # Website Logo
    └── favicon.ico       # Website Icon
```

## Deployment Instructions

### Frontend Deployment

1. Upload all files to your web host
2. Ensure the domain (tiktoktool.org) is correctly configured to point to your host
3. Configure HTTPS certificate to ensure secure connections

### Backend API Deployment (Optional)

To implement the actual TikTok video download functionality, you need to develop and deploy a backend API. Recommended technology stack:

- Node.js/Express or Python/Flask
- Use youtube-dl or similar tools to process video downloads
- Configure appropriate caching mechanisms to improve performance
- Set up rate limiting to prevent abuse

Example API endpoint:
```
POST /api/download
Body: { "url": "https://www.tiktok.com/@username/video/1234567890123456789" }
```

Response:
```json
{
  "success": true,
  "data": {
    "noWatermark": "https://tiktoktool.org/download/nowm_1234567890123456789.mp4",
    "withWatermark": "https://tiktoktool.org/download/wm_1234567890123456789.mp4",
    "audio": "https://tiktoktool.org/download/audio_1234567890123456789.mp3"
  }
}
```

## Frontend Development Guide

If you need to modify the frontend, please follow these steps:

1. Modify HTML/CSS/JS files
2. Test the display effect on different devices and browsers
3. Optimize resources, compress CSS and JavaScript files
4. Optimize images to improve loading speed

## Notes

- This project is for personal and educational purposes only
- Respect TikTok's terms of service and the rights of copyright owners
- There is no guarantee that the API will always be available, as TikTok may change its platform

## License

[MIT](LICENSE)

## Contact

If you have any questions or suggestions, please contact:
- Email: info@tiktoktool.org 