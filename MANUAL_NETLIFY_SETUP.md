# Netlify 手动配置指南（GitHub 授权失败）🔧

## 🎯 方案概述

如果 GitHub 授权失败，你可以：
1. **使用邮箱注册 Netlify**
2. **使用 Netlify CLI 手动部署**（推荐）
3. **使用拖拽部署**（临时方案）

---

## 方案一：使用 Netlify CLI 部署（推荐）⭐

### 优点：
- ✅ 不需要 GitHub 授权
- ✅ 可以自动部署
- ✅ 可以配置环境变量
- ✅ 功能完整

### 步骤：

#### 1. 安装 Netlify CLI

在终端中运行：

```bash
npm install -g netlify-cli
```

**如果提示权限错误，使用：**
```bash
sudo npm install -g netlify-cli
```

#### 2. 登录 Netlify

```bash
netlify login
```

这会打开浏览器，让你登录 Netlify（使用邮箱注册的账号）。

#### 3. 初始化项目

```bash
cd /Users/xulangliyuemanhua/Documents/Bessie
netlify init
```

**按照提示操作：**
- 选择 "Create & configure a new site"
- 输入站点名称（或直接按回车使用默认名称）
- 选择团队（如果有）
- 构建命令：`npm run build`（直接按回车使用默认）
- 发布目录：`.next`（直接按回车使用默认）

#### 4. 配置环境变量

在 Netlify 网站中配置：

1. 登录 Netlify：https://app.netlify.com
2. 找到你的站点
3. 点击 **"Site configuration"** → **"Environment variables"**
4. 添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `STORAGE_TYPE` | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | 你的 Cloud name |
| `CLOUDINARY_API_KEY` | 你的 API Key |
| `CLOUDINARY_API_SECRET` | 你的 API Secret |

#### 5. 安装 Next.js 插件

1. 在 Netlify 网站中
2. 找到你的站点
3. 点击 **"Plugins"**
4. 搜索 "Next.js"
5. 安装 "@netlify/plugin-nextjs"

#### 6. 部署

```bash
netlify deploy --prod
```

**或者只部署到预览环境：**
```bash
netlify deploy
```

---

## 方案二：使用邮箱注册 + 手动连接（如果 CLI 不行）

### 步骤：

#### 1. 使用邮箱注册 Netlify

1. 访问 https://www.netlify.com
2. 点击 **"Sign up"**
3. 选择 **"Sign up with email"**（不要选择 GitHub）
4. 填写信息：
   - 邮箱地址
   - 密码
5. 点击 **"Sign up"**
6. 验证邮箱

#### 2. 创建新站点

1. 登录 Netlify
2. 点击 **"Add new site"** → **"Deploy manually"**
3. 或者使用 **"Drag and drop"**

#### 3. 构建项目

在终端中运行：

```bash
cd /Users/xulangliyuemanhua/Documents/Bessie

# 安装依赖（如果还没安装）
npm install

# 构建项目
npm run build
```

#### 4. 部署

**方法 A：使用 Netlify CLI**

```bash
# 登录
netlify login

# 部署
netlify deploy --prod --dir=.next
```

**方法 B：在 Netlify 网站中拖拽**

1. 登录 Netlify
2. 点击 **"Add new site"** → **"Deploy manually"**
3. 拖拽 `.next` 文件夹到页面

**注意：** 手动部署每次都需要重新构建和上传，不推荐长期使用。

---

## 方案三：使用 GitHub Actions（高级方案）

如果 GitHub 授权失败，但你可以推送代码到 GitHub，可以使用 GitHub Actions 自动部署到 Netlify。

### 步骤：

#### 1. 获取 Netlify Site ID 和 API Token

1. 登录 Netlify
2. 点击 **"User settings"** → **"Applications"**
3. 点击 **"New access token"**
4. 创建 token 并保存

#### 2. 在 GitHub 中添加 Secrets

1. 访问 https://github.com/jackiexu001/bessie-growth-journal
2. 点击 **"Settings"** → **"Secrets and variables"** → **"Actions"**
3. 添加以下 Secrets：
   - `NETLIFY_AUTH_TOKEN`：你的 Netlify API Token
   - `NETLIFY_SITE_ID`：你的 Netlify Site ID

#### 3. 创建 GitHub Actions 工作流

在项目中创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Netlify

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          STORAGE_TYPE: cloudinary
          CLOUDINARY_CLOUD_NAME: ${{ secrets.CLOUDINARY_CLOUD_NAME }}
          CLOUDINARY_API_KEY: ${{ secrets.CLOUDINARY_API_KEY }}
          CLOUDINARY_API_SECRET: ${{ secrets.CLOUDINARY_API_SECRET }}
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=.next
```

**注意：** 这种方式比较复杂，需要配置 GitHub Actions。

---

## 🎯 推荐方案

### 方案一：使用 Netlify CLI（最简单）

**优点：**
- ✅ 不需要 GitHub 授权
- ✅ 可以自动部署
- ✅ 可以配置环境变量
- ✅ 功能完整

**步骤：**
1. 安装 Netlify CLI
2. 登录 Netlify
3. 初始化项目
4. 配置环境变量
5. 部署

---

## 📋 详细步骤（方案一：Netlify CLI）

### 步骤 1：安装 Netlify CLI

在终端中运行：

```bash
npm install -g netlify-cli
```

**如果提示权限错误：**
```bash
sudo npm install -g netlify-cli
```

### 步骤 2：登录 Netlify

```bash
netlify login
```

这会打开浏览器，让你登录 Netlify。

**如果还没有 Netlify 账号：**
1. 在浏览器中选择 "Sign up with email"
2. 使用邮箱注册
3. 完成注册后，CLI 会自动登录

### 步骤 3：初始化项目

```bash
cd /Users/xulangliyuemanhua/Documents/Bessie
netlify init
```

**按照提示操作：**
- 选择 "Create & configure a new site"
- 输入站点名称（或直接按回车）
- 构建命令：`npm run build`（直接按回车）
- 发布目录：`.next`（直接按回车）

### 步骤 4：配置环境变量

在 Netlify 网站中配置：

1. 访问 https://app.netlify.com
2. 找到你的站点
3. 点击 **"Site configuration"** → **"Environment variables"**
4. 添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `STORAGE_TYPE` | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | 你的 Cloud name |
| `CLOUDINARY_API_KEY` | 你的 API Key |
| `CLOUDINARY_API_SECRET` | 你的 API Secret |

### 步骤 5：安装 Next.js 插件

1. 在 Netlify 网站中
2. 找到你的站点
3. 点击 **"Plugins"**
4. 搜索 "Next.js"
5. 安装 "@netlify/plugin-nextjs"

### 步骤 6：部署

```bash
netlify deploy --prod
```

**或者先部署到预览环境测试：**
```bash
netlify deploy
```

---

## 🔧 常见问题

### Q: Netlify CLI 安装失败？

**A:** 
- 检查 Node.js 是否已安装：`node --version`
- 如果提示权限错误，使用 `sudo`
- 或者使用 `npx netlify-cli` 代替全局安装

---

### Q: 登录失败？

**A:**
- 确保在浏览器中完成了 Netlify 注册
- 检查网络连接
- 尝试重新运行 `netlify login`

---

### Q: 部署失败？

**A:**
- 检查环境变量是否配置正确
- 检查构建命令是否正确
- 查看 Netlify 网站中的构建日志

---

## 📝 总结

**如果 GitHub 授权失败，推荐使用 Netlify CLI：**

1. ✅ 安装 Netlify CLI
2. ✅ 登录 Netlify（使用邮箱注册）
3. ✅ 初始化项目
4. ✅ 配置环境变量
5. ✅ 安装 Next.js 插件
6. ✅ 部署

**这样就不需要 GitHub 授权了！**

---

**需要我帮你执行这些步骤吗？告诉我你想使用哪个方案！** 🚀

