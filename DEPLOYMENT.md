# 部署指南 🌐

## 当前状态

✅ **当前项目只能在本地运行**（`http://localhost:3000`）

要部署到云端，让全球任何地方都能访问，需要进行以下工作。

---

## 🚀 部署方案选择

### 方案一：Vercel（推荐 - 最简单）⭐

**优点：**
- Next.js 官方推荐，一键部署
- 免费计划可用
- 自动 HTTPS、CDN 加速
- 全球 CDN，访问速度快

**限制：**
- 免费计划不支持文件系统写入
- 需要集成云存储（如 Cloudinary、AWS S3）

**适合：** 快速部署，希望使用云存储

---

### 方案二：自托管 VPS（最灵活）

**优点：**
- 完全控制
- 可以使用本地文件存储
- 适合大量文件存储

**需要：**
- 购买 VPS（如 DigitalOcean、Linode、阿里云等）
- 配置服务器环境
- 配置域名和 SSL

**适合：** 需要大量存储空间，希望完全控制

---

### 方案三：Railway / Render（平衡方案）

**优点：**
- 简单部署
- 支持文件系统
- 有免费计划

**适合：** 需要文件系统但不想管理服务器

---

## 📋 部署前需要做的工作

### ⚠️ 重要：当前项目的限制

当前项目使用**本地文件系统**存储：
- 文件存储在 `public/uploads/`
- 数据存储在 `data/memories.json`

**问题：**
- 大多数云平台（如 Vercel）不支持文件系统写入
- 即使支持，文件会在服务器重启后丢失（无状态容器）

**解决方案：**
1. **集成云存储**（推荐）
2. **使用 VPS 自托管**（保持当前代码）

---

## 🔧 方案一：Vercel + 云存储（推荐）

### 步骤 1：集成云存储

#### 选项 A：Cloudinary（最简单）

1. **注册 Cloudinary 账号**
   - 访问 https://cloudinary.com
   - 免费计划：25GB 存储，25GB 流量/月

2. **安装 Cloudinary SDK**
   ```bash
   npm install cloudinary
   ```

3. **修改上传 API**
   - 将文件上传到 Cloudinary 而不是本地
   - 获取云存储的 URL

4. **配置环境变量**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

#### 选项 B：AWS S3（更灵活）

1. **创建 AWS 账号和 S3 Bucket**
2. **安装 AWS SDK**
   ```bash
   npm install @aws-sdk/client-s3
   ```
3. **配置环境变量**
   ```env
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   ```

### 步骤 2：迁移数据存储（可选但推荐）

当前使用 JSON 文件，可以迁移到：

#### 选项 A：Supabase（推荐）
- 免费 PostgreSQL 数据库
- 简单易用
- 有免费计划

#### 选项 B：MongoDB Atlas
- 免费 MongoDB 数据库
- 适合文档存储

#### 选项 C：保持 JSON（仅 VPS）
- 如果使用 VPS，可以继续使用 JSON

### 步骤 3：部署到 Vercel

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/bessie-growth.git
   git push -u origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 导入 GitHub 仓库
   - 配置环境变量（云存储密钥等）
   - 点击 "Deploy"

3. **完成！**
   - Vercel 会自动分配域名（如 `bessie-growth.vercel.app`）
   - 可以绑定自定义域名

---

## 🔧 方案二：VPS 自托管（保持当前代码）

### 步骤 1：购买 VPS

推荐服务商：
- **DigitalOcean** - $6/月起
- **Linode** - $5/月起
- **阿里云** - 国内访问快
- **腾讯云** - 国内访问快

### 步骤 2：配置服务器

1. **连接服务器**
   ```bash
   ssh root@your-server-ip
   ```

2. **安装 Node.js**
   ```bash
   # 使用 nvm 安装 Node.js 18+
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

3. **安装 Git**
   ```bash
   apt update
   apt install git -y
   ```

4. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/bessie-growth.git
   cd bessie-growth
   npm install
   ```

5. **构建项目**
   ```bash
   npm run build
   ```

6. **使用 PM2 运行（保持后台运行）**
   ```bash
   npm install -g pm2
   pm2 start npm --name "bessie" -- start
   pm2 save
   pm2 startup
   ```

### 步骤 3：配置 Nginx 反向代理

1. **安装 Nginx**
   ```bash
   apt install nginx -y
   ```

2. **配置 Nginx**
   ```bash
   nano /etc/nginx/sites-available/bessie
   ```

   添加配置：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **启用配置**
   ```bash
   ln -s /etc/nginx/sites-available/bessie /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

### 步骤 4：配置 SSL 证书（HTTPS）

1. **安装 Certbot**
   ```bash
   apt install certbot python3-certbot-nginx -y
   ```

2. **获取 SSL 证书**
   ```bash
   certbot --nginx -d your-domain.com
   ```

3. **自动续期**
   ```bash
   certbot renew --dry-run
   ```

### 步骤 5：配置防火墙

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## 🔐 安全建议

### 1. 添加身份验证（重要！）

当前项目**没有登录功能**，部署到公网后任何人都可以：
- 查看所有照片和视频
- 上传文件
- 删除文件

**建议添加：**
- 简单的密码保护
- 或完整的用户认证系统

### 2. 环境变量

敏感信息（API 密钥等）使用环境变量：
```env
# .env.local
CLOUDINARY_API_SECRET=your_secret
DATABASE_URL=your_database_url
```

### 3. 定期备份

- 定期备份 `public/uploads/` 目录
- 定期备份 `data/memories.json`
- 如果使用云存储，也要定期备份

---

## 📊 方案对比

| 特性 | Vercel + 云存储 | VPS 自托管 |
|------|----------------|-----------|
| **部署难度** | ⭐ 简单 | ⭐⭐⭐ 中等 |
| **维护成本** | ⭐ 低 | ⭐⭐⭐ 高 |
| **存储成本** | 云存储费用 | VPS 存储费用 |
| **访问速度** | ⭐⭐⭐ 全球 CDN | ⭐⭐ 取决于服务器位置 |
| **可扩展性** | ⭐⭐⭐ 自动扩展 | ⭐⭐ 需要手动扩展 |
| **文件系统** | ❌ 不支持 | ✅ 支持 |
| **适合场景** | 快速部署 | 大量存储需求 |

---

## 🎯 推荐方案

### 如果文件不多（< 10GB）：
**推荐：Vercel + Cloudinary**
- 最简单
- 免费计划足够
- 全球 CDN 加速

### 如果文件很多（> 10GB）：
**推荐：VPS 自托管**
- 存储成本更低
- 完全控制
- 适合长期使用

---

## 📝 部署检查清单

### 部署前：
- [ ] 代码已推送到 GitHub
- [ ] 已选择部署方案
- [ ] 已配置云存储（如使用 Vercel）
- [ ] 已配置环境变量
- [ ] 已测试本地构建（`npm run build`）

### 部署后：
- [ ] 网站可以正常访问
- [ ] 可以上传文件
- [ ] 可以查看照片/视频
- [ ] 已配置 HTTPS（SSL 证书）
- [ ] 已添加身份验证（保护隐私）
- [ ] 已设置定期备份

---

## 🆘 常见问题

### Q: Vercel 部署后文件上传失败？
A: Vercel 不支持文件系统写入，需要集成云存储。

### Q: 如何绑定自定义域名？
A: 在 Vercel 项目设置中添加域名，或配置 DNS 指向服务器 IP。

### Q: 如何备份数据？
A: 定期下载 `public/uploads/` 和 `data/memories.json`，或使用云存储的备份功能。

### Q: 访问速度慢怎么办？
A: 使用 CDN（Vercel 自动提供），或选择离用户近的服务器位置。

---

## 📞 需要帮助？

如果遇到部署问题，可以：
1. 查看 Next.js 官方文档
2. 查看 Vercel 部署文档
3. 查看云存储服务文档

---

**祝部署顺利！** 🎉

