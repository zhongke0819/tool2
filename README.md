# TikTok Video Downloader

一个简单的 TikTok 视频下载工具，使用 Flask 作为后端，纯 HTML、CSS 和 JavaScript 作为前端。

## 功能

- 支持下载 TikTok/抖音视频
- 简洁易用的用户界面
- 响应式设计，适配移动设备

## 安装与使用

### 环境要求

- Python 3.6+
- Flask 2.0.1+
- Requests 2.26.0+

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/your-username/tiktok-downloader.git
cd tiktok-downloader
```

2. 安装依赖

```bash
pip install -r requirements.txt
```

3. 运行应用

```bash
python run.py
```

4. 在浏览器中访问 http://localhost:5000

## 项目结构

```
tiktok-downloader/
│
├── app/
│   ├── __init__.py      # Flask 应用初始化
│   ├── routes.py        # 路由定义
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css  # 样式文件
│   │   └── js/
│   │       └── main.js    # JavaScript 脚本
│   └── templates/
│       └── index.html     # HTML 模板
│
├── run.py               # 应用入口点
└── requirements.txt     # 项目依赖
```

## 注意事项

- 本项目仅用于学习和研究目的
- 请尊重版权，不要下载未经授权的内容
- 不要将此工具用于任何违反 TikTok/抖音服务条款的行为

## 贡献指南

1. Fork 该仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

MIT License - 详情请查看 [LICENSE](LICENSE) 文件