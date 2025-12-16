# Netlify 新版界面说明 🆕

## ✅ 是的，新版界面已经取消了直接选择环境的选项

### 旧版本：
- 直接选择：Production, Preview, Development

### 新版本：
- 通过 **"Scopes"** 控制作用域
- 通过 **"Values"** 控制环境值

---

## 🎯 新版本如何实现相同效果

### 方法：选择 "All scopes" + "Same value for all deploy contexts"

#### 1. Scopes（作用域）

选择 **"All scopes"**（所有作用域）

**这相当于：**
- ✅ Production（生产环境）
- ✅ Preview（预览环境）
- ✅ Development（开发环境）
- ✅ 所有其他作用域

#### 2. Values（值）

选择 **"Same value for all deploy contexts"**（所有部署环境使用相同值）

**这相当于：**
- ✅ Production 使用这个值
- ✅ Preview 使用这个值
- ✅ Development 使用这个值
- ✅ 所有环境使用相同值

---

## 📋 配置步骤（新版本）

### 对于每个环境变量：

1. **Key**: 输入变量名

2. **Values**: 
   - 选择 **"Same value for all deploy contexts"**
   - 输入值

3. **Scopes**:
   - 选择 **"All scopes"**

4. **Secret**:
   - `STORAGE_TYPE` 和 `CLOUDINARY_CLOUD_NAME`: 不勾选
   - `CLOUDINARY_API_KEY`: 可选勾选
   - `CLOUDINARY_API_SECRET`: 强烈建议勾选

5. 点击 **"Add variable"**

---

## ✅ 配置总结

### 四个变量配置：

| 变量名 | Values | Scopes | Secret |
|--------|--------|--------|--------|
| `STORAGE_TYPE` | Same value for all deploy contexts = `cloudinary` | All scopes | ❌ |
| `CLOUDINARY_CLOUD_NAME` | Same value for all deploy contexts = 你的 Cloud name | All scopes | ❌ |
| `CLOUDINARY_API_KEY` | Same value for all deploy contexts = 你的 API Key | All scopes | ⚠️ 可选 |
| `CLOUDINARY_API_SECRET` | Same value for all deploy contexts = 你的 API Secret | All scopes | ✅ 建议 |

---

## 🎯 关键点

### 新版本对应关系：

**旧版本：**
- 选择 Production, Preview, Development

**新版本：**
- **Scopes**: 选择 "All scopes" = 所有环境
- **Values**: 选择 "Same value for all deploy contexts" = 所有环境使用相同值

**效果是一样的！**

---

## 📝 配置示例

### 变量 1：STORAGE_TYPE

```
Key: STORAGE_TYPE
Values: Same value for all deploy contexts = cloudinary
Scopes: All scopes
Secret: 不勾选
```

### 变量 2：CLOUDINARY_CLOUD_NAME

```
Key: CLOUDINARY_CLOUD_NAME
Values: Same value for all deploy contexts = 你的cloud_name
Scopes: All scopes
Secret: 不勾选
```

### 变量 3：CLOUDINARY_API_KEY

```
Key: CLOUDINARY_API_KEY
Values: Same value for all deploy contexts = 你的api_key
Scopes: All scopes
Secret: 可选勾选
```

### 变量 4：CLOUDINARY_API_SECRET

```
Key: CLOUDINARY_API_SECRET
Values: Same value for all deploy contexts = 你的api_secret
Scopes: All scopes
Secret: 强烈建议勾选
```

---

## ✅ 确认配置

配置完成后，你应该看到 4 个环境变量：

1. `STORAGE_TYPE`
2. `CLOUDINARY_CLOUD_NAME`
3. `CLOUDINARY_API_KEY`
4. `CLOUDINARY_API_SECRET`

每个变量都应该：
- Scopes: All scopes
- Values: Same value for all deploy contexts

---

## 🚀 现在开始

**按照上面的步骤配置 4 个环境变量：**

1. 选择 **"Same value for all deploy contexts"**
2. 选择 **"All scopes"**
3. 输入对应的值
4. 点击 **"Add variable"**

**这样配置的效果和旧版本的 "Production, Preview, Development（全部勾选）" 是一样的！**

---

**配置完成后告诉我，我可以继续指导你下一步！** 🚀

