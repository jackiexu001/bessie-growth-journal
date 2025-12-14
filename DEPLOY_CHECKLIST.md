# 部署检查清单 ✅

## 📋 部署前检查

### 1. 代码准备
- [ ] 代码已提交到 Git
- [ ] 已推送到 GitHub
- [ ] 没有未提交的更改

### 2. Cloudinary 账号
- [ ] 已注册 Cloudinary 账号
- [ ] 已获取 Cloud name
- [ ] 已获取 API Key
- [ ] 已获取 API Secret

### 3. GitHub 仓库
- [ ] 已创建 GitHub 仓库
- [ ] 代码已推送到 GitHub
- [ ] 仓库是 Public 或已授权 Vercel 访问

### 4. Vercel 账号
- [ ] 已注册 Vercel 账号
- [ ] 已连接 GitHub 账号

### 5. 环境变量
- [ ] `STORAGE_TYPE=cloudinary`
- [ ] `CLOUDINARY_CLOUD_NAME=你的值`
- [ ] `CLOUDINARY_API_KEY=你的值`
- [ ] `CLOUDINARY_API_SECRET=你的值`

### 6. 部署后测试
- [ ] 网站可以正常访问
- [ ] 可以上传图片
- [ ] 图片可以正常显示
- [ ] 可以上传视频
- [ ] 视频可以正常播放
- [ ] 可以删除文件

---

## 🚀 快速部署步骤

### 第一步：注册 Cloudinary（5分钟）
1. 访问 https://cloudinary.com
2. 注册账号
3. 获取 API 密钥

### 第二步：准备 GitHub（5分钟）
1. 创建 GitHub 仓库
2. 推送代码

### 第三步：部署到 Vercel（10分钟）
1. 访问 https://vercel.com
2. 导入 GitHub 项目
3. 配置环境变量
4. 点击部署

### 第四步：测试（5分钟）
1. 访问网站
2. 测试上传功能
3. 测试显示功能

**总时间：约 25 分钟**

---

## 📝 环境变量模板

在 Vercel 中配置以下环境变量：

```
STORAGE_TYPE=cloudinary
CLOUDINARY_CLOUD_NAME=你的cloud_name
CLOUDINARY_API_KEY=你的api_key
CLOUDINARY_API_SECRET=你的api_secret
```

---

## ❓ 遇到问题？

查看详细指南：`VERCEL_CLOUDINARY_DEPLOY.md`

