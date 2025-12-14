# Vercel + Cloudinary 部署完整指南 🚀

## 📋 部署前准备

### 需要准备的东西：
1. ✅ GitHub 账号（如果没有，需要注册）
2. ✅ 邮箱（用于注册 Vercel 和 Cloudinary）
3. ✅ 项目代码（已经在本地了）

---

## 第一步：注册 Cloudinary 账号

### 1.1 访问 Cloudinary 官网

打开浏览器，访问：**https://cloudinary.com**

### 1.2 注册账号

1. 点击右上角的 **"Sign Up"** 或 **"免费注册"**
2. 填写注册信息：
   - 邮箱地址
   - 密码
   - 用户名
3. 点击 **"Create Account"** 或 **"创建账号"**
4. 验证邮箱（检查邮箱，点击验证链接）

### 1.3 获取 API 密钥

1. 登录 Cloudinary 控制台
2. 在控制台首页，你会看到 **Dashboard**（仪表板）
3. 找到以下信息（通常在页面顶部或左侧菜单）：
   - **Cloud name**（云名称）
   - **API Key**（API 密钥）
   - **API Secret**（API 密钥）

**重要：** 把这些信息**复制并保存**到安全的地方，稍后会用到！

**示例位置：**
```
Dashboard
├── Cloud name: abc123
├── API Key: 123456789012345
└── API Secret: abcdefghijklmnopqrstuvwxyz
```

---

## 第二步：准备 GitHub 仓库

### 2.1 检查 Git 状态

在项目目录下运行：

```bash
cd /Users/xulangliyuemanhua/Documents/Bessie
git status
```

### 2.2 如果没有 Git 仓库，初始化一个

```bash
# 如果还没有初始化 Git
git init
git add .
git commit -m "Initial commit: Bessie growth journal"
```

### 2.3 创建 GitHub 仓库

1. 访问 **https://github.com**
2. 登录你的 GitHub 账号
3. 点击右上角的 **"+"** → **"New repository"**
4. 填写仓库信息：
   - **Repository name**: `bessie-growth-journal`（或你喜欢的名字）
   - **Description**: "A beautiful website to record baby's growth journey"
   - **Visibility**: 选择 **Public** 或 **Private**（建议 Private）
   - **不要**勾选 "Initialize this repository with a README"
5. 点击 **"Create repository"**

### 2.4 推送代码到 GitHub

GitHub 会显示推送命令，在项目目录下运行：

```bash
# 替换 YOUR_USERNAME 和 YOUR_REPO_NAME 为你的实际信息
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**示例：**
```bash
git remote add origin https://github.com/yourusername/bessie-growth-journal.git
git branch -M main
git push -u origin main
```

---

## 第三步：部署到 Vercel

### 3.1 访问 Vercel 官网

打开浏览器，访问：**https://vercel.com**

### 3.2 注册/登录 Vercel

1. 点击右上角的 **"Sign Up"** 或 **"登录"**
2. 选择 **"Continue with GitHub"**（使用 GitHub 账号登录，最简单）
3. 授权 Vercel 访问你的 GitHub 账号

### 3.3 导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在项目列表中，找到你刚才创建的 GitHub 仓库（`bessie-growth-journal`）
3. 点击 **"Import"**

### 3.4 配置项目

Vercel 会自动检测到这是一个 Next.js 项目，配置如下：

**Framework Preset**: Next.js（自动检测）

**Root Directory**: `./`（默认）

**Build Command**: `npm run build`（默认）

**Output Directory**: `.next`（默认）

**Install Command**: `npm install`（默认）

**点击 "Deploy" 之前，先不要部署！** 我们需要先配置环境变量。

---

## 第四步：配置环境变量

### 4.1 在 Vercel 中配置环境变量

在 Vercel 项目配置页面：

1. 找到 **"Environment Variables"**（环境变量）部分
2. 点击 **"Add"** 或 **"添加"**

### 4.2 添加 Cloudinary 环境变量

添加以下环境变量（使用你在第一步获取的 Cloudinary 信息）：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `STORAGE_TYPE` | `cloudinary` | 存储类型 |
| `CLOUDINARY_CLOUD_NAME` | 你的 Cloud name | 从 Cloudinary 控制台获取 |
| `CLOUDINARY_API_KEY` | 你的 API Key | 从 Cloudinary 控制台获取 |
| `CLOUDINARY_API_SECRET` | 你的 API Secret | 从 Cloudinary 控制台获取 |

**添加步骤：**
1. 点击 **"Add"**
2. 输入变量名：`STORAGE_TYPE`
3. 输入值：`cloudinary`
4. 选择环境：**Production, Preview, Development**（全部勾选）
5. 点击 **"Save"**
6. 重复以上步骤，添加其他三个变量

**示例：**
```
STORAGE_TYPE = cloudinary
CLOUDINARY_CLOUD_NAME = abc123
CLOUDINARY_API_KEY = 123456789012345
CLOUDINARY_API_SECRET = abcdefghijklmnopqrstuvwxyz
```

### 4.3 确认环境变量

确保所有环境变量都已添加：
- ✅ `STORAGE_TYPE`
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`

---

## 第五步：开始部署

### 5.1 点击部署按钮

在 Vercel 项目配置页面：
1. 确认所有环境变量都已添加
2. 点击 **"Deploy"** 按钮

### 5.2 等待部署完成

Vercel 会自动：
1. 安装依赖（`npm install`）
2. 构建项目（`npm run build`）
3. 部署到全球 CDN

**部署时间：** 通常 2-5 分钟

### 5.3 查看部署状态

部署过程中，你可以看到：
- 构建日志（实时显示）
- 部署进度
- 任何错误信息

**如果看到错误：**
- 检查环境变量是否正确
- 检查代码是否有语法错误
- 查看构建日志中的错误信息

---

## 第六步：访问你的网站

### 6.1 获取网站地址

部署完成后，Vercel 会显示：
- **Production URL**: `https://your-project-name.vercel.app`
- **Deployment URL**: `https://your-project-name-xxx.vercel.app`

### 6.2 访问网站

1. 点击 **"Visit"** 按钮，或
2. 在浏览器中打开 Production URL

**示例：**
```
https://bessie-growth-journal.vercel.app
```

### 6.3 测试功能

测试以下功能：
1. ✅ 访问首页，查看是否正常显示
2. ✅ 点击"上传"按钮，测试上传功能
3. ✅ 上传一张测试图片
4. ✅ 查看图片是否正常显示
5. ✅ 测试删除功能

---

## 第七步：配置自定义域名（可选）

### 7.1 添加自定义域名

如果你有自己的域名（如 `bessie.com`）：

1. 在 Vercel 项目页面，点击 **"Settings"** → **"Domains"**
2. 输入你的域名（如 `bessie.com`）
3. 点击 **"Add"**
4. 按照提示配置 DNS 记录

### 7.2 配置 DNS

Vercel 会显示需要配置的 DNS 记录：
- **Type**: `CNAME`
- **Name**: `@` 或 `www`
- **Value**: `cname.vercel-dns.com`

在你的域名注册商（如阿里云、腾讯云）配置 DNS 记录。

---

## 🎉 部署完成！

### 现在你可以：

1. ✅ **访问网站**：通过 Vercel 提供的 URL
2. ✅ **上传照片/视频**：文件会自动存到 Cloudinary
3. ✅ **全球访问**：Vercel 的 CDN 让全球用户都能快速访问
4. ✅ **自动部署**：每次推送代码到 GitHub，Vercel 会自动重新部署

---

## 📝 后续操作

### 更新代码

1. 在本地修改代码
2. 提交到 Git：
   ```bash
   git add .
   git commit -m "Update: 描述你的修改"
   git push
   ```
3. Vercel 会自动检测到代码更新，并自动重新部署

### 查看部署历史

在 Vercel 项目页面，可以查看：
- 所有部署历史
- 每次部署的日志
- 回滚到之前的版本

### 监控和日志

在 Vercel 项目页面：
- **Analytics**：查看访问统计
- **Logs**：查看运行日志
- **Functions**：查看 API 函数执行情况

---

## ⚠️ 常见问题

### Q1: 部署失败怎么办？

**检查：**
1. 环境变量是否正确配置
2. Cloudinary 的 API 密钥是否正确
3. 代码是否有语法错误
4. 查看 Vercel 构建日志中的错误信息

### Q2: 上传文件失败？

**检查：**
1. Cloudinary 环境变量是否正确
2. Cloudinary 账号是否正常
3. 文件大小是否超过限制（1024MB）
4. 查看浏览器控制台的错误信息

### Q3: 图片/视频无法显示？

**检查：**
1. Cloudinary 存储是否正常
2. 文件 URL 是否正确
3. 网络连接是否正常

### Q4: 如何查看日志？

在 Vercel 项目页面：
1. 点击 **"Deployments"**
2. 选择最新的部署
3. 点击 **"View Function Logs"**

### Q5: 如何回滚到之前的版本？

在 Vercel 项目页面：
1. 点击 **"Deployments"**
2. 找到之前的部署
3. 点击 **"..."** → **"Promote to Production"**

---

## 🔧 本地测试 Cloudinary

在部署之前，你可以在本地测试 Cloudinary 配置：

### 1. 创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件：

```env
STORAGE_TYPE=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. 重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
npm run dev
```

### 3. 测试上传

1. 访问 `http://localhost:3000`
2. 点击"上传"按钮
3. 上传一张测试图片
4. 检查图片是否正常显示

---

## 📚 相关文档

- **Vercel 文档**: https://vercel.com/docs
- **Cloudinary 文档**: https://cloudinary.com/documentation
- **Next.js 文档**: https://nextjs.org/docs

---

## 🎯 总结

**部署步骤：**
1. ✅ 注册 Cloudinary 账号，获取 API 密钥
2. ✅ 创建 GitHub 仓库，推送代码
3. ✅ 在 Vercel 导入项目
4. ✅ 配置 Cloudinary 环境变量
5. ✅ 点击部署
6. ✅ 访问网站，测试功能

**预计时间：** 15-30 分钟

---

**准备好了吗？让我们开始第一步：注册 Cloudinary 账号！** 🚀

