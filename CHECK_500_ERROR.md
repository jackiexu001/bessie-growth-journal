# 检查 500 错误 🔍

## ⚠️ 问题

上传时出现 **500 Internal Server Error**，这是服务器端错误。

---

## 🔍 立即检查 Netlify 函数日志

### 步骤 1：访问 Netlify

1. **访问**：https://app.netlify.com
2. **登录**
3. **点击站点** `bessie-growth-journal`

### 步骤 2：查看函数日志

#### 方法 A：通过 Functions 标签

1. **点击 "Functions"**（函数）标签
2. **查看最新的函数执行记录**
3. **点击执行记录查看日志**

#### 方法 B：通过 Deploys 标签

1. **点击 "Deploys"**（部署）标签
2. **点击最新的部署记录**
3. **点击 "Functions"** 或 **"View function logs"**
4. **查看日志**

### 步骤 3：查找错误

在日志中查找：
- `Upload error:`
- `Cloudinary 配置不完整`
- `使用存储类型:`
- `配置检查:`
- `Error:`
- 任何红色错误信息

---

## 🔧 常见 500 错误原因

### 原因 1：环境变量未配置

**症状：**
- 日志显示 "Cloudinary 配置不完整"
- 日志显示 "回退到本地存储"

**解决：**
1. 检查 Netlify 环境变量
2. 确认所有变量都已配置
3. 确认选择了 "All scopes"
4. 重新部署站点

---

### 原因 2：Cloudinary API 密钥错误

**症状：**
- 日志显示 Cloudinary API 错误
- 日志显示 "Invalid API key"

**解决：**
1. 检查 Cloudinary 控制台中的 API 密钥
2. 确认在 Netlify 中配置的密钥正确
3. 重新配置环境变量
4. 重新部署站点

---

### 原因 3：文件系统权限问题

**症状：**
- 日志显示文件写入错误
- 日志显示权限错误

**解决：**
- 在 Netlify 上，不能使用本地文件系统
- 必须使用云存储（Cloudinary）

---

### 原因 4：数据文件写入问题

**症状：**
- 日志显示 `memories.json` 写入错误
- 日志显示文件系统错误

**解决：**
- 在 Netlify 上，需要将数据存储在云存储或数据库中
- 当前代码使用本地文件系统，这在 Netlify 上不可用

---

## 🎯 立即操作

### 1. 查看 Netlify 函数日志

1. 访问 https://app.netlify.com
2. 进入站点页面
3. 点击 "Functions" 标签
4. 查看最新的执行记录
5. **告诉我日志中显示了什么错误**

### 2. 检查环境变量

1. 在 Netlify 中检查环境变量
2. 确认以下 4 个变量都存在：
   - `STORAGE_TYPE` = `cloudinary`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. 确认所有变量都选择了 "All scopes"

---

## 📝 告诉我

**请告诉我：**

1. **Netlify 函数日志中显示了什么错误？**
   - Netlify 网站 -> Functions 标签 -> 查看最新执行记录

2. **环境变量是否正确配置？**
   - 在 Netlify 中检查环境变量

**根据这些信息，我可以帮你找到具体问题并解决！** 🔍

