# Netlify + Cloudinary 部署完整指南 🚀

## 📋 部署前准备

### 需要准备的东西：
1. ✅ GitHub 账号（如果没有，需要注册）
2. ✅ 邮箱（用于注册 Netlify 和 Cloudinary）
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

**截图提示：** 你可以截图保存这些信息，或者复制到文本文件中。

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
2. 登录你的 GitHub 账号（如果没有，先注册）
3. 点击右上角的 **"+"** → **"New repository"**
4. 填写仓库信息：
   - **Repository name**: `bessie-growth-journal`（或你喜欢的名字）
   - **Description**: "A beautiful website to record baby's growth journey"
   - **Visibility**: 选择 **Private**（建议，保护隐私）
   - **不要**勾选 "Initialize this repository with a README"
5. 点击 **"Create repository"**

### 2.4 推送代码到 GitHub

GitHub 会显示推送命令，在项目目录下运行（替换 `YOUR_USERNAME` 为你的 GitHub 用户名）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/bessie-growth-journal.git

# 设置主分支
git branch -M main

# 推送代码
git push -u origin main
```

**示例：**
```bash
git remote add origin https://github.com/yourusername/bessie-growth-journal.git
git branch -M main
git push -u origin main
```

**如果提示输入用户名和密码：**
- 用户名：你的 GitHub 用户名
- 密码：使用 **Personal Access Token**（不是 GitHub 密码）

**如何创建 Personal Access Token：**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 填写名称（如：Netlify Deploy）
4. 勾选 `repo` 权限
5. 点击 "Generate token"
6. **复制 token**（只显示一次，务必保存）
7. 使用 token 作为密码

---

## 第三步：部署到 Netlify

### 3.1 访问 Netlify 官网

打开浏览器，访问：**https://www.netlify.com**

### 3.2 注册/登录 Netlify

1. 点击右上角的 **"Sign up"** 或 **"登录"**
2. 选择 **"Continue with GitHub"**（使用 GitHub 账号登录，最简单）
3. 授权 Netlify 访问你的 GitHub 账号

### 3.3 导入项目

1. 登录后，点击 **"Add new site"** → **"Import an existing project"**
2. 选择 **"Deploy with GitHub"**
3. 授权 Netlify 访问你的 GitHub 仓库（如果还没授权）
4. 在项目列表中，找到你刚才创建的仓库（`bessie-growth-journal`）
5. 点击仓库名称

### 3.4 配置项目

Netlify 会自动检测到这是一个 Next.js 项目，配置如下：

**Build command**: `npm run build`（自动检测）

**Publish directory**: `.next`（自动检测）

**Base directory**: `./`（默认）

**点击 "Deploy" 之前，先不要部署！** 我们需要先配置环境变量。

---

## 第四步：配置环境变量

### 4.1 在 Netlify 中配置环境变量

在 Netlify 项目配置页面：

1. 找到 **"Environment variables"**（环境变量）部分
2. 点击 **"Add a variable"** 或 **"添加变量"**

### 4.2 添加 Cloudinary 环境变量

添加以下环境变量（使用你在第一步获取的 Cloudinary 信息）：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `STORAGE_TYPE` | `cloudinary` | 存储类型 |
| `CLOUDINARY_CLOUD_NAME` | 你的 Cloud name | 从 Cloudinary 控制台获取 |
| `CLOUDINARY_API_KEY` | 你的 API Key | 从 Cloudinary 控制台获取 |
| `CLOUDINARY_API_SECRET` | 你的 API Secret | 从 Cloudinary 控制台获取 |

**添加步骤：**
1. 点击 **"Add a variable"**
2. 输入变量名：`STORAGE_TYPE`
3. 输入值：`cloudinary`
4. 点击 **"Save"**
5. 重复以上步骤，添加其他三个变量

**示例：**
```
STORAGE_TYPE = cloudinary
CLOUDINARY_CLOUD_NAME = abc123
CLOUDINARY_API_KEY = 123456789012345
CLOUDINARY_API_SECRET = abcdefghijklmnopqrstuvwxyz
```

**重要提示：**
- 确保变量名完全正确（区分大小写）
- 确保值没有多余的空格
- 确保所有变量都已添加

### 4.3 确认环境变量

确保所有环境变量都已添加：
- ✅ `STORAGE_TYPE`
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`

---

## 第五步：配置构建设置（重要）

### 5.1 修改构建命令

在 Netlify 项目配置页面：

1. 找到 **"Build settings"**（构建设置）部分
2. 点击 **"Edit settings"**（编辑设置）

### 5.2 配置构建命令

**Build command**: 
```
npm run build
```

**Publish directory**: 
```
.next
```

**Base directory**: 
```
./
```

### 5.3 配置 Node.js 版本（可选）

如果需要，可以设置 Node.js 版本：

1. 在环境变量中添加：
   - 变量名：`NODE_VERSION`
   - 值：`18` 或 `20`（推荐）

---

## 第六步：开始部署

### 6.1 点击部署按钮

在 Netlify 项目配置页面：
1. 确认所有环境变量都已添加
2. 确认构建设置已配置
3. 点击 **"Deploy site"** 按钮

### 6.2 等待部署完成

Netlify 会自动：
1. 安装依赖（`npm install`）
2. 构建项目（`npm run build`）
3. 部署到全球 CDN

**部署时间：** 通常 2-5 分钟

### 6.3 查看部署状态

部署过程中，你可以看到：
- 构建日志（实时显示）
- 部署进度
- 任何错误信息

**如果看到错误：**
- 检查环境变量是否正确
- 检查代码是否有语法错误
- 查看构建日志中的错误信息

---

## 第七步：访问你的网站

### 7.1 获取网站地址

部署完成后，Netlify 会显示：
- **Site URL**: `https://your-project-name.netlify.app`
- **Deployment URL**: `https://your-project-name-xxx.netlify.app`

### 7.2 访问网站

1. 点击 **"Open production deploy"** 按钮，或
2. 在浏览器中打开 Site URL

**示例：**
```
https://bessie-growth-journal.netlify.app
```

### 7.3 测试功能

测试以下功能：
1. ✅ 访问首页，查看是否正常显示
2. ✅ 点击"上传"按钮，测试上传功能
3. ✅ 上传一张测试图片
4. ✅ 查看图片是否正常显示（应该从 Cloudinary 加载）
5. ✅ 测试删除功能

---

## 第八步：配置自定义域名（可选）

### 8.1 添加自定义域名

如果你有自己的域名（如 `bessie.com`）：

1. 在 Netlify 项目页面，点击 **"Domain settings"** → **"Add custom domain"**
2. 输入你的域名（如 `bessie.com`）
3. 点击 **"Verify"**
4. 按照提示配置 DNS 记录

### 8.2 配置 DNS

Netlify 会显示需要配置的 DNS 记录：
- **Type**: `A` 或 `CNAME`
- **Name**: `@` 或 `www`
- **Value**: Netlify 提供的 IP 地址或域名

在你的域名注册商（如阿里云、腾讯云）配置 DNS 记录。

---

## 🎉 部署完成！

### 现在你可以：

1. ✅ **访问网站**：通过 Netlify 提供的 URL
2. ✅ **上传照片/视频**：文件会自动存到 Cloudinary
3. ✅ **全球访问**：Netlify 的 CDN 让全球用户都能快速访问
4. ✅ **自动部署**：每次推送代码到 GitHub，Netlify 会自动重新部署

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
3. Netlify 会自动检测到代码更新，并自动重新部署

### 查看部署历史

在 Netlify 项目页面，可以查看：
- 所有部署历史
- 每次部署的日志
- 回滚到之前的版本

### 监控和日志

在 Netlify 项目页面：
- **Analytics**：查看访问统计
- **Functions**：查看 Serverless Functions 执行情况
- **Logs**：查看运行日志

---

## ⚠️ 常见问题

### Q1: 部署失败怎么办？

**检查：**
1. 环境变量是否正确配置
2. Cloudinary 的 API 密钥是否正确
3. 代码是否有语法错误
4. 查看 Netlify 构建日志中的错误信息

**常见错误：**
- `Environment variable not found` - 环境变量未配置
- `Build failed` - 构建失败，查看日志
- `Module not found` - 依赖包未安装

---

### Q2: 上传文件失败？

**检查：**
1. Cloudinary 环境变量是否正确
2. Cloudinary 账号是否正常
3. 文件大小是否超过限制（1024MB）
4. 查看浏览器控制台的错误信息

**常见错误：**
- `Cloudinary API error` - Cloudinary 配置错误
- `File too large` - 文件超过 1024MB 限制
- `Network error` - 网络问题

---

### Q3: 图片/视频无法显示？

**检查：**
1. Cloudinary 存储是否正常
2. 文件 URL 是否正确
3. 网络连接是否正常
4. Cloudinary 的公开访问设置

**常见错误：**
- `403 Forbidden` - Cloudinary 访问权限问题
- `404 Not Found` - 文件不存在
- `CORS error` - 跨域问题

---

### Q4: 如何查看日志？

在 Netlify 项目页面：
1. 点击 **"Deploys"**
2. 选择最新的部署
3. 点击 **"View build log"** 或 **"View function logs"**

---

### Q5: 如何回滚到之前的版本？

在 Netlify 项目页面：
1. 点击 **"Deploys"**
2. 找到之前的部署
3. 点击 **"..."** → **"Publish deploy"**

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
4. 检查图片是否正常显示（应该从 Cloudinary 加载）

---

## 📚 相关文档

- **Netlify 文档**: https://docs.netlify.com
- **Cloudinary 文档**: https://cloudinary.com/documentation
- **Next.js 文档**: https://nextjs.org/docs

---

## 🎯 总结

**部署步骤：**
1. ✅ 注册 Cloudinary 账号，获取 API 密钥
2. ✅ 创建 GitHub 仓库，推送代码
3. ✅ 在 Netlify 导入项目
4. ✅ 配置 Cloudinary 环境变量
5. ✅ 配置构建设置
6. ✅ 点击部署
7. ✅ 访问网站，测试功能

**预计时间：** 15-30 分钟

---

## ✅ 检查清单

部署前检查：
- [ ] Cloudinary 账号已注册
- [ ] Cloudinary API 密钥已获取
- [ ] GitHub 仓库已创建
- [ ] 代码已推送到 GitHub
- [ ] Netlify 账号已注册
- [ ] 项目已导入 Netlify
- [ ] 环境变量已配置
- [ ] 构建设置已配置

部署后检查：
- [ ] 网站可以正常访问
- [ ] 可以上传图片
- [ ] 图片可以正常显示（从 Cloudinary 加载）
- [ ] 可以上传视频
- [ ] 视频可以正常播放
- [ ] 可以删除文件

---

**准备好了吗？让我们开始第一步：注册 Cloudinary 账号！** 🚀

