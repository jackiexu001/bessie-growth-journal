# 多存储支持使用指南 📚

## 🎉 功能说明

现在项目支持多种云存储提供商，可以通过环境变量轻松切换：

- ✅ **本地存储**（默认）- 文件存在本地服务器
- ✅ **Cloudinary** - 自动优化图片/视频
- ✅ **Cloudflare R2** - 流量免费，全球快
- ✅ **腾讯云 COS** - 国内快，价格便宜

---

## 🚀 快速开始

### 第一步：选择存储类型

根据你的需求选择存储类型：

1. **本地存储**（默认）- 适合本地开发
2. **Cloudinary** - 想要自动优化
3. **Cloudflare R2** - 访问量大，想要流量免费
4. **腾讯云 COS** - 主要在国内使用

---

### 第二步：配置环境变量

#### 方式一：使用本地存储（默认，无需配置）

不需要任何配置，直接使用即可。

---

#### 方式二：使用 Cloudinary

1. **注册 Cloudinary 账号**
   - 访问 https://cloudinary.com
   - 注册账号（免费）

2. **获取 API 密钥**
   - 登录控制台
   - 找到 "Settings" → "Security"
   - 记录：Cloud name、API Key、API Secret

3. **配置环境变量**
   
   创建 `.env.local` 文件：
   ```env
   STORAGE_TYPE=cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

#### 方式三：使用 Cloudflare R2

1. **注册 Cloudflare 账号**
   - 访问 https://dash.cloudflare.com
   - 注册账号（免费）

2. **创建 R2 存储桶**
   - 登录控制台
   - 找到 "R2" 服务
   - 创建存储桶
   - 记录存储桶名称

3. **获取访问密钥**
   - 在 R2 页面，找到 "Manage R2 API Tokens"
   - 创建 API Token
   - 记录：Account ID、Access Key ID、Secret Access Key

4. **配置环境变量**
   
   创建 `.env.local` 文件：
   ```env
   STORAGE_TYPE=r2
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_BUCKET_NAME=your_bucket_name
   R2_PUBLIC_URL=https://your-bucket.r2.dev
   ```

---

#### 方式四：使用腾讯云 COS

1. **注册腾讯云账号**
   - 访问 https://cloud.tencent.com
   - 注册账号（需要实名认证）

2. **创建 COS 存储桶**
   - 登录控制台
   - 找到 "对象存储 COS"
   - 创建存储桶
   - 记录：存储桶名称、地域

3. **获取访问密钥**
   - 在控制台找到 "访问管理"
   - 创建 API 密钥
   - 记录：SecretId、SecretKey

4. **配置环境变量**
   
   创建 `.env.local` 文件：
   ```env
   STORAGE_TYPE=cos
   COS_SECRET_ID=your_secret_id
   COS_SECRET_KEY=your_secret_key
   COS_BUCKET_NAME=your_bucket_name
   COS_REGION=ap-guangzhou
   COS_PUBLIC_URL=https://your-bucket.cos.ap-guangzhou.myqcloud.com
   ```

---

## 🔄 如何切换存储类型

### 方法：修改环境变量

只需要修改 `.env.local` 文件中的 `STORAGE_TYPE`：

```env
# 切换到 Cloudinary
STORAGE_TYPE=cloudinary

# 切换到 Cloudflare R2
STORAGE_TYPE=r2

# 切换到腾讯云 COS
STORAGE_TYPE=cos

# 切换回本地存储
STORAGE_TYPE=local
```

**重启开发服务器后生效：**
```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
npm run dev
```

---

## 📋 环境变量说明

### 通用配置

| 变量名 | 说明 | 可选值 | 默认值 |
|--------|------|--------|--------|
| `STORAGE_TYPE` | 存储类型 | local, cloudinary, r2, cos | local |

### Cloudinary 配置

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `CLOUDINARY_CLOUD_NAME` | Cloud name | ✅ |
| `CLOUDINARY_API_KEY` | API Key | ✅ |
| `CLOUDINARY_API_SECRET` | API Secret | ✅ |

### Cloudflare R2 配置

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `R2_ACCOUNT_ID` | Account ID | ✅ |
| `R2_ACCESS_KEY_ID` | Access Key ID | ✅ |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key | ✅ |
| `R2_BUCKET_NAME` | 存储桶名称 | ✅ |
| `R2_PUBLIC_URL` | 公开访问 URL | ⚠️ 可选 |

### 腾讯云 COS 配置

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `COS_SECRET_ID` | Secret ID | ✅ |
| `COS_SECRET_KEY` | Secret Key | ✅ |
| `COS_BUCKET_NAME` | 存储桶名称 | ✅ |
| `COS_REGION` | 地域 | ⚠️ 可选（默认：ap-guangzhou） |
| `COS_PUBLIC_URL` | 公开访问 URL | ⚠️ 可选 |

---

## ⚠️ 注意事项

### 1. 环境变量文件

- 创建 `.env.local` 文件（不要提交到 Git）
- 参考 `.env.example` 文件
- 确保配置正确

### 2. 配置不完整时

- 如果配置不完整，会自动回退到本地存储
- 控制台会显示警告信息

### 3. 切换存储类型

- 切换存储类型后，**新上传的文件**会存到新的存储
- **旧文件**仍然在原来的存储中（可以继续访问）
- 可以逐步迁移旧文件

### 4. 文件 URL 格式

不同存储类型的 URL 格式不同：
- **本地存储**：`/uploads/filename.jpg`
- **Cloudinary**：`https://res.cloudinary.com/...`
- **Cloudflare R2**：`https://your-bucket.r2.dev/filename.jpg`
- **腾讯云 COS**：`https://your-bucket.cos.region.myqcloud.com/filename.jpg`

但代码会自动处理，不需要手动修改。

---

## 🔧 迁移示例

### 从本地存储迁移到 Cloudflare R2

1. **配置 Cloudflare R2**
   ```env
   STORAGE_TYPE=r2
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_BUCKET_NAME=your_bucket_name
   ```

2. **重启服务器**
   ```bash
   npm run dev
   ```

3. **新上传的文件会自动存到 Cloudflare R2**
   - 旧文件仍然在本地（可以继续访问）
   - 可以逐步迁移旧文件

---

## 📝 使用示例

### 当前使用本地存储

不需要任何配置，直接使用。

---

### 切换到 Cloudinary

1. 创建 `.env.local`：
   ```env
   STORAGE_TYPE=cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

2. 重启服务器

3. 新上传的文件会自动存到 Cloudinary

---

### 切换到 Cloudflare R2

1. 创建 `.env.local`：
   ```env
   STORAGE_TYPE=r2
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_BUCKET_NAME=your_bucket_name
   ```

2. 重启服务器

3. 新上传的文件会自动存到 Cloudflare R2

---

### 切换到腾讯云 COS

1. 创建 `.env.local`：
   ```env
   STORAGE_TYPE=cos
   COS_SECRET_ID=your_secret_id
   COS_SECRET_KEY=your_secret_key
   COS_BUCKET_NAME=your_bucket_name
   COS_REGION=ap-guangzhou
   ```

2. 重启服务器

3. 新上传的文件会自动存到腾讯云 COS

---

## ❓ 常见问题

### Q: 如何知道当前使用哪个存储？
A: 查看服务器启动日志，会显示 "使用存储类型: xxx"

### Q: 切换存储后，旧文件还能访问吗？
A: 可以！旧文件仍然在原来的存储中，可以继续访问。

### Q: 如何迁移旧文件？
A: 可以写迁移脚本，或者手动迁移。我可以帮你写迁移脚本。

### Q: 可以同时使用多个存储吗？
A: 目前不支持同时使用，但可以平滑迁移（新文件存新存储，旧文件保留）。

### Q: 配置错误怎么办？
A: 如果配置不完整或错误，会自动回退到本地存储，并显示警告信息。

---

## 🎯 总结

**现在你的项目支持：**
- ✅ 多种云存储（本地、Cloudinary、R2、COS）
- ✅ 通过环境变量轻松切换
- ✅ 平滑迁移（不影响旧文件）
- ✅ 自动回退（配置错误时）

**使用步骤：**
1. 选择存储类型
2. 配置环境变量
3. 重启服务器
4. 开始使用

---

**需要我帮你配置哪个存储？我可以一步一步指导你！** 🚀

