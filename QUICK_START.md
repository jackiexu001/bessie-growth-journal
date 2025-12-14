# 快速开始部署指南 🚀

## 📋 第一步：准备代码（5分钟）

### 1.1 初始化 Git（如果还没有）

在项目目录下运行：

```bash
cd /Users/xulangliyuemanhua/Documents/Bessie

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Bessie growth journal"
```

### 1.2 创建 GitHub 仓库

1. 访问 **https://github.com**
2. 登录你的 GitHub 账号
3. 点击右上角的 **"+"** → **"New repository"**
4. 填写信息：
   - **Repository name**: `bessie-growth-journal`
   - **Visibility**: 选择 **Private**（建议）
5. 点击 **"Create repository"**

### 1.3 推送代码到 GitHub

在项目目录下运行（替换 `YOUR_USERNAME` 为你的 GitHub 用户名）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/bessie-growth-journal.git

# 设置主分支
git branch -M main

# 推送代码
git push -u origin main
```

**如果提示输入用户名和密码：**
- 用户名：你的 GitHub 用户名
- 密码：使用 **Personal Access Token**（不是 GitHub 密码）

**如何创建 Personal Access Token：**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token"
3. 勾选 `repo` 权限
4. 生成并复制 token
5. 使用 token 作为密码

---

## 📋 第二步：注册 Cloudinary（5分钟）

### 2.1 访问 Cloudinary

打开浏览器，访问：**https://cloudinary.com**

### 2.2 注册账号

1. 点击 **"Sign Up"** 或 **"免费注册"**
2. 填写信息：
   - 邮箱
   - 密码
   - 用户名
3. 验证邮箱

### 2.3 获取 API 密钥

登录后，在控制台首页找到：

- **Cloud name**（云名称）
- **API Key**（API 密钥）
- **API Secret**（API 密钥）

**把这些信息保存好，稍后会用到！**

---

## 📋 第三步：部署到 Vercel（10分钟）

### 3.1 访问 Vercel

打开浏览器，访问：**https://vercel.com**

### 3.2 登录

1. 点击 **"Sign Up"**
2. 选择 **"Continue with GitHub"**
3. 授权 Vercel 访问 GitHub

### 3.3 导入项目

1. 点击 **"Add New..."** → **"Project"**
2. 找到你的仓库 `bessie-growth-journal`
3. 点击 **"Import"**

### 3.4 配置环境变量

**在点击 "Deploy" 之前，先配置环境变量！**

1. 找到 **"Environment Variables"** 部分
2. 点击 **"Add"**，添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `STORAGE_TYPE` | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | 你的 Cloud name |
| `CLOUDINARY_API_KEY` | 你的 API Key |
| `CLOUDINARY_API_SECRET` | 你的 API Secret |

**重要：** 每个变量都要选择 **Production, Preview, Development**（全部勾选）

### 3.5 开始部署

1. 确认所有环境变量都已添加
2. 点击 **"Deploy"** 按钮
3. 等待 2-5 分钟

---

## 📋 第四步：测试（5分钟）

### 4.1 访问网站

部署完成后，Vercel 会显示网站地址：
```
https://your-project-name.vercel.app
```

### 4.2 测试功能

1. ✅ 访问首页
2. ✅ 点击"上传"按钮
3. ✅ 上传一张测试图片
4. ✅ 检查图片是否正常显示
5. ✅ 测试删除功能

---

## 🎉 完成！

现在你的网站已经部署到 Vercel，文件会自动存到 Cloudinary！

---

## ❓ 遇到问题？

### 问题 1：Git 推送失败

**解决方案：**
- 检查 GitHub 用户名是否正确
- 使用 Personal Access Token 而不是密码
- 确保仓库已创建

### 问题 2：部署失败

**检查：**
- 环境变量是否正确配置
- Cloudinary API 密钥是否正确
- 查看 Vercel 构建日志

### 问题 3：上传失败

**检查：**
- Cloudinary 环境变量是否正确
- 文件大小是否超过 1024MB
- 查看浏览器控制台错误

---

## 📚 详细文档

查看完整指南：`VERCEL_CLOUDINARY_DEPLOY.md`

---

**准备好了吗？让我们开始第一步！** 🚀

