# Netlify 新版界面环境变量配置指南 🆕

## 🎯 新版界面说明

Netlify 确实改版了！新界面更清晰，但配置方式略有不同。

---

## ✅ 配置步骤（新版界面）

### 配置第一个变量：STORAGE_TYPE

#### 步骤：

1. **点击 "New environment variable"**（新建环境变量）

2. **填写 Key（变量名）**
   - 输入：`STORAGE_TYPE`

3. **填写 Values（值）**
   - 选择：**"Same value for all deploy contexts"**（所有部署环境使用相同值）
   - 在输入框中输入：`cloudinary`

4. **Scopes（作用域）**
   - 选择：**"All scopes"**（所有作用域）
   - 或者选择：**"Specific scopes"** → 勾选所有选项

5. **Secret（是否包含秘密值）**
   - **不要勾选**（这个不是秘密值）

6. **点击 "Add variable"**（添加变量）或 **"Save"**（保存）

---

### 配置第二个变量：CLOUDINARY_CLOUD_NAME

#### 步骤：

1. **点击 "New environment variable"**

2. **填写 Key**
   - 输入：`CLOUDINARY_CLOUD_NAME`

3. **填写 Values**
   - 选择：**"Same value for all deploy contexts"**
   - 在输入框中输入：你的 Cloud name（从 Cloudinary 获取）

4. **Scopes**
   - 选择：**"All scopes"**

5. **Secret**
   - **不要勾选**

6. **点击 "Add variable"** 或 **"Save"**

---

### 配置第三个变量：CLOUDINARY_API_KEY

#### 步骤：

1. **点击 "New environment variable"**

2. **填写 Key**
   - 输入：`CLOUDINARY_API_KEY`

3. **填写 Values**
   - 选择：**"Same value for all deploy contexts"**
   - 在输入框中输入：你的 API Key（从 Cloudinary 获取）

4. **Scopes**
   - 选择：**"All scopes"**

5. **Secret**
   - **可以勾选**（API Key 可以设为秘密值，更安全）

6. **点击 "Add variable"** 或 **"Save"**

---

### 配置第四个变量：CLOUDINARY_API_SECRET

#### 步骤：

1. **点击 "New environment variable"**

2. **填写 Key**
   - 输入：`CLOUDINARY_API_SECRET`

3. **填写 Values**
   - 选择：**"Same value for all deploy contexts"**
   - 在输入框中输入：你的 API Secret（从 Cloudinary 获取）

4. **Scopes**
   - 选择：**"All scopes"**

5. **Secret**
   - **强烈建议勾选**（这是秘密值，应该隐藏）

6. **点击 "Add variable"** 或 **"Save"**

---

## 📋 配置总结

### 四个变量配置：

| 变量名 | 值 | Secret | Scopes |
|--------|-----|--------|--------|
| `STORAGE_TYPE` | `cloudinary` | ❌ 不勾选 | All scopes |
| `CLOUDINARY_CLOUD_NAME` | 你的 Cloud name | ❌ 不勾选 | All scopes |
| `CLOUDINARY_API_KEY` | 你的 API Key | ⚠️ 可选勾选 | All scopes |
| `CLOUDINARY_API_SECRET` | 你的 API Secret | ✅ 强烈建议勾选 | All scopes |

---

## 🎯 详细配置步骤

### 变量 1：STORAGE_TYPE

1. 点击 **"New environment variable"**
2. **Key**: `STORAGE_TYPE`
3. **Values**: 选择 **"Same value for all deploy contexts"**，输入 `cloudinary`
4. **Scopes**: 选择 **"All scopes"**
5. **Secret**: 不勾选
6. 点击 **"Add variable"**

---

### 变量 2：CLOUDINARY_CLOUD_NAME

1. 点击 **"New environment variable"**
2. **Key**: `CLOUDINARY_CLOUD_NAME`
3. **Values**: 选择 **"Same value for all deploy contexts"**，输入你的 Cloud name
4. **Scopes**: 选择 **"All scopes"**
5. **Secret**: 不勾选
6. 点击 **"Add variable"**

---

### 变量 3：CLOUDINARY_API_KEY

1. 点击 **"New environment variable"**
2. **Key**: `CLOUDINARY_API_KEY`
3. **Values**: 选择 **"Same value for all deploy contexts"**，输入你的 API Key
4. **Scopes**: 选择 **"All scopes"**
5. **Secret**: 可以勾选（更安全）
6. 点击 **"Add variable"**

---

### 变量 4：CLOUDINARY_API_SECRET

1. 点击 **"New environment variable"**
2. **Key**: `CLOUDINARY_API_SECRET`
3. **Values**: 选择 **"Same value for all deploy contexts"**，输入你的 API Secret
4. **Scopes**: 选择 **"All scopes"**
5. **Secret**: **强烈建议勾选**（这是秘密值）
6. 点击 **"Add variable"**

---

## ✅ 配置完成后

### 检查清单：

- [ ] `STORAGE_TYPE` = `cloudinary`
- [ ] `CLOUDINARY_CLOUD_NAME` = 你的 Cloud name
- [ ] `CLOUDINARY_API_KEY` = 你的 API Key
- [ ] `CLOUDINARY_API_SECRET` = 你的 API Secret

### 下一步：

1. 安装 Next.js 插件
2. 触发部署
3. 测试功能

---

## 🚀 现在开始

**按照上面的步骤，逐个添加 4 个环境变量：**

1. `STORAGE_TYPE` = `cloudinary`
2. `CLOUDINARY_CLOUD_NAME` = 你的 Cloud name
3. `CLOUDINARY_API_KEY` = 你的 API Key
4. `CLOUDINARY_API_SECRET` = 你的 API Secret

**每个变量都要：**
- 选择 **"Same value for all deploy contexts"**
- 选择 **"All scopes"**
- API_SECRET 建议勾选 Secret

**配置完成后告诉我，我可以继续指导你下一步！** 🚀

