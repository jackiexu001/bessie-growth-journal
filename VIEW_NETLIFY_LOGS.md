# 查看 Netlify 函数日志 - 详细步骤 📝

## 🔍 为什么需要查看日志？

上传失败（500 错误）是服务器端错误，需要查看 Netlify 函数日志才能知道具体原因。

---

## 📋 查看日志的步骤

### 步骤 1：访问 Netlify

1. **访问**：https://app.netlify.com
2. **登录**你的账号
3. **点击站点** `bessie-growth-journal`

---

### 步骤 2：查看函数日志

#### 方法 A：通过 Functions 标签（推荐）

1. **在站点页面**
2. **点击左侧菜单或顶部菜单中的 "Functions"**（函数）
3. **查看最新的函数执行记录**
   - 你会看到类似这样的列表：
     ```
     /api/upload
     2025-12-16 16:30:15
     Status: Error / Success
     ```
4. **点击最新的执行记录**
5. **查看日志**

#### 方法 B：通过 Deploys 标签

1. **在站点页面**
2. **点击 "Deploys"**（部署）标签
3. **点击最新的部署记录**
4. **点击 "Functions"** 或 **"View function logs"**
5. **查看日志**

---

### 步骤 3：查找错误信息

在日志中查找以下关键词：

- `Upload error:`
- `Cloudinary 配置不完整`
- `使用存储类型:`
- `配置检查:`
- `环境信息:`
- `Error:`
- `Cannot write to file`
- `EACCES`
- `EROFS`
- 任何红色错误信息

---

## 📝 日志示例

### 正常日志示例：

```
开始处理上传请求...
环境信息: {
  isNetlify: true,
  storageType: 'cloudinary',
  hasCloudinaryConfig: true,
  nodeEnv: 'production'
}
使用存储类型: cloudinary
Cloudinary 配置完整，使用 Cloudinary 存储
开始上传文件到 Cloudinary...
Cloudinary 上传成功: https://res.cloudinary.com/...
数据已保存到内存（Netlify 环境，共 1 条记录）
上传完成，记忆ID: ...
```

### 错误日志示例：

```
开始处理上传请求...
环境信息: {
  isNetlify: true,
  storageType: 'cloudinary',
  hasCloudinaryConfig: false,
  nodeEnv: 'production'
}
使用存储类型: cloudinary
Cloudinary 配置不完整，回退到本地存储
配置检查: {
  STORAGE_TYPE: 'cloudinary',
  CLOUDINARY_CLOUD_NAME: '未设置',
  CLOUDINARY_API_KEY: '未设置',
  CLOUDINARY_API_SECRET: '未设置'
}
Error: EROFS: read-only file system, mkdir '/opt/build/repo/data'
```

---

## 🎯 根据日志判断问题

### 问题 1：Cloudinary 配置不完整

**日志显示：**
```
Cloudinary 配置不完整，回退到本地存储
配置检查: {
  CLOUDINARY_CLOUD_NAME: '未设置',
  ...
}
```

**解决：**
1. 检查 Netlify 环境变量
2. 确认所有变量都已配置
3. 确认选择了 "All scopes"
4. 重新部署站点

---

### 问题 2：文件系统错误

**日志显示：**
```
Error: EROFS: read-only file system
Error: EACCES: permission denied
```

**解决：**
- 这是正常的（Netlify 文件系统是只读的）
- 代码应该已经修复，使用内存存储
- 如果仍然出现，说明环境检测有问题

---

### 问题 3：Cloudinary API 错误

**日志显示：**
```
Cloudinary 上传错误: Invalid API key
```

**解决：**
1. 检查 Cloudinary 控制台中的 API 密钥
2. 确认在 Netlify 中配置的密钥正确
3. 重新配置环境变量
4. 重新部署站点

---

## 🚀 现在开始

### 1. 查看 Netlify 函数日志

1. 访问 https://app.netlify.com
2. 进入站点页面
3. 点击 "Functions" 标签
4. 查看最新的执行记录
5. **告诉我日志中显示了什么错误**

**这是最重要的！根据日志中的具体错误，我可以提供精确的修复方案！** 🔍

---

## 📸 如何截图日志

如果你想要截图给我看：

1. **打开日志页面**
2. **按 `Command + Shift + 4`**（Mac）选择区域截图
3. **或者按 `Command + Shift + 3`** 全屏截图
4. **将截图发送给我**

---

**请查看日志后告诉我你看到了什么错误！** 🔍

