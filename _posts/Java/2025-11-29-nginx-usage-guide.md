---
title: Nginx全面使用指南：从基础配置到高级优化
date: 2025-11-29 10:45:00 +0800
categories: [Java]
tags: [Nginx, 反向代理, 负载均衡, 性能优化, Web服务器]
---

## 引言

Nginx作为一款高性能的HTTP和反向代理服务器，已经成为现代Web架构中不可或缺的组件。它以其高并发、低资源消耗、稳定性强等特点，广泛应用于网站加速、负载均衡、反向代理、动静分离等场景。本文将从基础概念入手，逐步深入介绍Nginx的各种使用技巧和最佳实践。

## Nginx基础概念

### 什么是Nginx

Nginx（发音为"engine-x"）是一款轻量级的Web服务器/反向代理服务器，由俄罗斯程序员Igor Sysoev开发。与传统的Apache相比，Nginx采用了异步事件驱动的架构，能够处理大量的并发连接而不会消耗过多的系统资源。

### Nginx的主要功能

1. **HTTP服务器**：提供静态内容服务
2. **反向代理**：代理请求到后端服务器
3. **负载均衡**：分发请求到多个后端服务器
4. **动静分离**：将静态资源和动态请求分开处理
5. **SSL/TLS终端**：处理HTTPS加密解密
6. **压缩传输**：减少网络传输数据量

## Nginx安装与配置

### 安装Nginx

#### Ubuntu/Debian系统

```bash
# 更新包索引
sudo apt update

# 安装Nginx
sudo apt install nginx

# 启动Nginx
sudo systemctl start nginx

# 设置开机自启
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx
```

#### CentOS/RHEL系统

```bash
# 安装EPEL仓库
sudo yum install epel-release

# 安装Nginx
sudo yum install nginx

# 启动Nginx
sudo systemctl start nginx

# 设置开机自启
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx
```

#### 从源码编译安装

```bash
# 安装依赖
sudo apt install build-essential libpcre3-dev libssl-dev zlib1g-dev

# 下载Nginx源码
wget http://nginx.org/download/nginx-1.24.0.tar.gz
tar -zxvf nginx-1.24.0.tar.gz
cd nginx-1.24.0

# 配置编译选项
./configure \
    --prefix=/etc/nginx \
    --sbin-path=/usr/sbin/nginx \
    --conf-path=/etc/nginx/nginx.conf \
    --error-log-path=/var/log/nginx/error.log \
    --http-log-path=/var/log/nginx/access.log \
    --pid-path=/var/run/nginx.pid \
    --lock-path=/var/run/nginx.lock \
    --with-http_ssl_module \
    --with-http_v2_module \
    --with-http_gzip_static_module

# 编译和安装
make && sudo make install
```

### Nginx配置文件结构

Nginx的主要配置文件通常位于`/etc/nginx/nginx.conf`，其结构如下：

```nginx
# 全局块 - 影响整个Nginx服务器
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# events块 - 影响Nginx服务器与用户的网络连接
events {
    worker_connections 1024;
}

# http块 - 配置代理、缓存、日志定义等绝大多数功能和第三方模块的配置
http {
    # http全局块
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # server块 - 虚拟主机配置
    server {
        listen 80;
        server_name localhost;
        
        # location块 - 配置请求路由和页面处理
        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
        }
        
        # 错误页面
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
```

## 核心配置详解

### 全局配置

```nginx
# 用户和组
user nginx nginx;

# 工作进程数，通常设置为CPU核心数
worker_processes auto;

# 错误日志
error_log /var/log/nginx/error.log warn;

# PID文件
pid /var/run/nginx.pid;

# 工作模式和连接数上限
events {
    # 单个工作进程的最大连接数
    worker_connections 1024;
    
    # 多个工作进程接收连接的方法
    use epoll;
    
    # 允许接收的连接数
    multi_accept on;
}
```

### HTTP配置

```nginx
http {
    # 文件扩展名与文件类型映射表
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    # 启用sendfile方式传输文件
    sendfile on;
    
    # TCP_NOPUSH选项
    tcp_nopush on;
    
    # TCP_NODELAY选项
    tcp_nodelay on;
    
    # 连接超时时间
    keepalive_timeout 65;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

## 虚拟主机配置

### 基于域名的虚拟主机

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

server {
    listen 80;
    server_name blog.example.com;
    
    root /var/www/blog.example.com;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 基于端口的虚拟主机

```nginx
server {
    listen 80;
    server_name example.com;
    
    root /var/www/site1;
    index index.html;
}

server {
    listen 8080;
    server_name example.com;
    
    root /var/www/site2;
    index index.html;
}
```

### 基于IP的虚拟主机

```nginx
server {
    listen 192.168.1.100:80;
    server_name example.com;
    
    root /var/www/site1;
    index index.html;
}

server {
    listen 192.168.1.101:80;
    server_name example.com;
    
    root /var/www/site2;
    index index.html;
}
```

## 反向代理配置

### 基础反向代理

```nginx
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://backend_server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

upstream backend_server {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

### 负载均衡配置

```nginx
upstream backend {
    # 轮询（默认）
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
    
    # 加权轮询
    # server 192.168.1.10:8080 weight=3;
    # server 192.168.1.11:8080 weight=2;
    # server 192.168.1.12:8080 weight=1;
    
    # IP哈希
    # ip_hash;
    
    # 最少连接
    # least_conn;
    
    # 响应时间最短
    # fair;
    
    # URL哈希
    # hash $request_uri consistent;
}

server {
    listen 80;
    server_name app.example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
```

## HTTPS配置与SSL证书

### 申请SSL证书

#### 使用Let's Encrypt免费证书

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d example.com -d www.example.com

# 自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 手动配置SSL证书

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    # SSL证书配置
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    
    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    
    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    root /var/www/example.com;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# HTTP重定向到HTTPS
server {
    listen 80;
    server_name example.com;
    
    return 301 https://$server_name$request_uri;
}
```

### SSL优化配置

```nginx
# SSL会话缓存
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# Diffie-Hellman参数
ssl_dhparam /etc/nginx/dhparam.pem;

# 安全头
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## 性能优化配置

### 缓存配置

```nginx
# 浏览器缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# 静态文件缓存
location ~* ^.+\.(css|js|txt|xml|swf|wav)$ {
    access_log off;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# 动态内容缓存
location /api/ {
    proxy_cache my_cache;
    proxy_cache_valid 200 302 10m;
    proxy_cache_valid 404 1m;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_lock on;
    
    proxy_pass http://backend;
}

# 缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g 
                 inactive=60m use_temp_path=off;
```

### 压缩配置

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/atom+xml
    image/svg+xml;
```

### 连接优化

```nginx
# 工作进程数
worker_processes auto;

# 单个工作进程的最大连接数
events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

# 客户端缓冲区
http {
    client_body_buffer_size 128k;
    client_max_body_size 10m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    output_buffers 1 32k;
    postpone_output 1460;
    
    # 超时设置
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 15;
    send_timeout 10;
}
```

## 安全配置

### 访问控制

```nginx
# IP访问控制
location /admin/ {
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
}

# 基于用户名密码认证
location /secure/ {
    auth_basic "Restricted Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}

# 防止恶意爬虫
location ~* \.(sql|bak|config|ini)$ {
    deny all;
}

# 限制请求频率
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

location /login/ {
    limit_req zone=login burst=5 nodelay;
}
```

### 防盗链配置

```nginx
location ~* \.(gif|jpg|jpeg|png|bmp|swf)$ {
    valid_referers none blocked *.example.com example.com;
    if ($invalid_referer) {
        return 403;
    }
}
```

## 日志管理

### 自定义日志格式

```nginx
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';

log_format detailed '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    '$request_time $upstream_response_time';

access_log /var/log/nginx/access.log main;
```

### 日志分割

```bash
# 创建日志分割脚本
cat > /etc/cron.daily/nginx-logrotate << 'EOF'
#!/bin/bash
LOGS_PATH=/var/log/nginx
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)

mv ${LOGS_PATH}/access.log ${LOGS_PATH}/access_${YESTERDAY}.log
mv ${LOGS_PATH}/error.log ${LOGS_PATH}/error_${YESTERDAY}.log

# 通知Nginx重新打开日志文件
kill -USR1 $(cat /var/run/nginx.pid)
EOF

chmod +x /etc/cron.daily/nginx-logrotate
```

## 故障排查与监控

### 常用调试命令

```bash
# 检查配置文件语法
nginx -t

# 重新加载配置
nginx -s reload

# 查看Nginx进程
ps aux | grep nginx

# 查看监听端口
netstat -tlnp | grep nginx

# 实时查看访问日志
tail -f /var/log/nginx/access.log

# 实时查看错误日志
tail -f /var/log/nginx/error.log
```

### 性能监控

```nginx
# Stub Status模块配置
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
}
```

访问`http://your-server/nginx_status`可以看到类似以下的输出：

```
Active connections: 291 
server accepts handled requests
 16630948 16630948 31070465 
Reading: 6 Writing: 179 Waiting: 106 
```

## 最佳实践总结

### 1. 配置管理

- 使用模块化的配置文件组织方式
- 为不同的功能创建独立的配置文件
- 定期备份配置文件

### 2. 性能优化

- 合理设置worker_processes和worker_connections
- 启用Gzip压缩减少传输数据量
- 配置适当的缓存策略
- 使用CDN加速静态资源

### 3. 安全防护

- 及时更新Nginx版本
- 配置SSL/TLS加密传输
- 限制访问权限和请求频率
- 隐藏敏感信息

### 4. 监控维护

- 配置详细的日志记录
- 设置监控告警机制
- 定期检查配置和性能
- 制定应急处理预案

## 结语

Nginx作为现代Web架构的重要组成部分，掌握其配置和优化技巧对于提升系统性能和稳定性具有重要意义。通过本文的介绍，相信您已经对Nginx的核心功能和使用方法有了全面的了解。在实际应用中，需要根据具体的业务需求和系统环境进行针对性的配置和优化，不断积累经验，才能充分发挥Nginx的强大能力。

随着技术的发展，Nginx也在不断演进，新增了许多实用的功能和模块。建议持续关注官方文档和社区动态，及时学习和应用新的技术和最佳实践。