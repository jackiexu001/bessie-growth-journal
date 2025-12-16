# Netlify 部署步骤（GitHub 已连接）🚀

## ✅ 已完成

- ✅ GitHub 账号已解除标记
- ✅ Netlify 已连接 GitHub 仓库
- ✅ 仓库：`bessie-growth-journal`

---

## 📋 接下来的步骤

### 第一步：配置环境变量（重要！）

#### 1.1 访问 Netlify 站点设置

1. 访问 https://app.netlify.com
2. 找到你的站点 `bessie-growth-journal`
3. 点击站点名称进入站点页面

#### 1.2 添加环境变量

1. 点击 **"Site configuration"** → **"Environment variables"**
2. 点击 **"Add a variable"**，添加以下 4 个变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `STORAGE_TYPE` | `cloudinary` | 存储类型 |
| `CLOUDINARY_CLOUD_NAME` | 你的 Cloud name | 从 Cloudinary 获取 |
| `CLOUDINARY_API_KEY` | 你的 API Key | 从 Cloudinary 获取 |
| `CLOUDINARY_API_SECRET` | 你的 API Secret | 从 Cloudinary 获取 |

**添加步骤：**
1. 点击 **"Add a variable"**
2. 输入变量名：`STORAGE_TYPE`
3. 输入值：`cloudinary`
4. **重要：** 选择环境：**Production, Preview, Development**（全部勾选）
5. 点击 **"Save"**
6. 重复以上步骤，添加其他三个变量

**重要提示：**
- 确保变量名完全正确（区分大小写）
- 确保值没有多余的空格
- 确保所有变量都已添加
- 确保选择了所有环境（Production, Preview, Development）

---

### 第二步：安装 Next.js 插件（重要！）

#### 2.1 安装插件

1. 在站点页面，点击 **"Plugins"** 或 **"Site configuration"** → **"Plugins"**
2. 搜索 "Next.js"
3. 找到 "@netlify/plugin-nextjs"
4. 点击 **"Install"**
5. 确认安装

**这个插件是 Netlify 支持 Next.js 的关键！**

---

### 第三步：配置构建设置

#### 3.1 检查构建设置

1. 在站点页面，点击 **"Site configuration"** → **"Build & deploy"**
2. 找到 **"Build settings"**
3. 确认以下设置：

**Build command:**
```
npm run build
```

**Publish directory:**
```
.next
```

**Base directory:**
```
./
```

**如果设置不正确，点击 "Edit settings" 修改。**

---

### 第四步：触发部署

#### 4.1 方法一：推送代码到 GitHub（推荐）

在终端中运行：

```bash
cd /Users/xulangliyuemanhua/Documents/Bessie

# 添加任何新文件（如果有）
git add .

# 提交更改
git commit -m "Configure for Netlify deployment"

# 推送到 GitHub
git push
```

**Netlify 会自动检测到代码更新，并自动部署！**

#### 4.2 方法二：在 Netlify 中手动触发

1. 在 Netlify 站点页面
2. 点击 **"Deploys"** 标签
3. 点击 **"Trigger deploy"** → **"Deploy site"**

---

### 第五步：等待部署完成

#### 5.1 查看部署状态

1. 在 Netlify 站点页面
2. 点击 **"Deploys"** 标签
3. 可以看到部署进度和日志

**部署时间：** 通常 2-5 分钟

#### 5.2 检查部署日志

如果部署失败：
1. 点击部署记录
2. 查看 **"Build log"**
3. 检查错误信息

**常见问题：**
- 环境变量未配置 → 检查环境变量
- 构建失败 → 查看构建日志
- 插件未安装 → 安装 Next.js 插件

---

### 第六步：访问网站

#### 6.1 获取网站地址

部署完成后，Netlify 会显示网站地址：
```
https://bessie-growth-journal.netlify.app
```
或
```
https://your-custom-name.netlify.app
```

#### 6.2 测试功能

1. ✅ 访问首页，查看是否正常显示
2. ✅ 点击"上传"按钮，测试上传功能
3. ✅ 上传一张测试图片
4. ✅ 检查图片是否正常显示（应该从 Cloudinary 加载）
5. ✅ 测试删除功能

---

## 📋 检查清单

### 配置检查：

- [ ] 环境变量已配置（4 个变量）
- [ ] 环境变量选择了所有环境（Production, Preview, Development）
- [ ] Next.js 插件已安装
- [ ] 构建设置已配置

### 部署检查：

- [ ] 代码已推送到 GitHub
- [ ] Netlify 已开始部署
- [ ] 部署已完成（没有错误）
- [ ] 网站可以正常访问

### 功能测试：

- [ ] 网站可以正常访问
- [ ] 可以上传图片
- [ ] 图片可以正常显示（从 Cloudinary 加载）
- [ ] 可以上传视频
- [ ] 视频可以正常播放
- [ ] 可以删除文件

---

## ⚠️ 常见问题

### Q1: 部署失败怎么办？

**检查：**
1. 环境变量是否正确配置
2. Next.js 插件是否已安装
3. 查看构建日志中的错误信息

---

### Q2: 上传文件失败？

**检查：**
1. Cloudinary 环境变量是否正确
2. Cloudinary 账号是否正常
3. 文件大小是否超过限制（1024MB）

---

### Q3: 图片/视频无法显示？

**检查：**
1. Cloudinary 存储是否正常
2. 文件 URL 是否正确
3. 网络连接是否正常

---

## 🎯 现在开始

### 第一步：配置环境变量

1. 访问 https://app.netlify.com
2. 找到你的站点
3. 点击 **"Site configuration"** → **"Environment variables"**
4. 添加 4 个 Cloudinary 变量

### 第二步：安装 Next.js 插件

1. 点击 **"Plugins"**
2. 搜索 "Next.js"
3. 安装 "@netlify/plugin-nextjs"

### 第三步：触发部署

推送代码到 GitHub 或手动触发部署。

---

**完成这些步骤后告诉我，我可以帮你检查部署状态！** 🚀

