#!/bin/bash

# 安装必要的软件
apt-get update
apt-get install -y nginx docker.io

# 复制Nginx配置
cp nginx.conf /etc/nginx/nginx.conf
systemctl restart nginx

# 启动Docker容器
docker pull evil0ctal/douyin_tiktok_download_api:latest
docker run -d --name tiktoktool \
    -p 80:80 \
    -v $(pwd)/config.yaml:/app/config.yaml \
    -v $(pwd)/download:/app/download \
    --restart always \
    evil0ctal/douyin_tiktok_download_api:latest

echo "TikTokTool 部署完成！"
echo "请在Cloudflare中配置域名 tiktoktool.org 后访问网站。"
