# 使用 Supabase 实现数据持久化 📊

## ⚠️ 当前问题

**Netlify 内存存储的问题**：
- 数据只在函数执行期间存在
- 函数重启后数据丢失
- 无法持久化保存回忆

## ✅ 解决方案：使用 Supabase

**Supabase** 是开源的 Firebase 替代品，提供：
- ✅ **免费额度**：500MB 数据库，50MB 文件存储
- ✅ **PostgreSQL 数据库**：功能强大，关系型数据库
- ✅ **简单易用**：REST API 和实时订阅
- ✅ **安全**：内置认证和权限控制

---

## 📋 实施步骤

### 步骤 1：注册 Supabase 账号

1. **访问网站**：https://supabase.com
2. **点击 "Start your project"**
3. **选择免费计划**
4. **填写邮箱和密码**
5. **验证邮箱**

---

### 步骤 2：创建项目

1. **登录 Supabase**
2. **点击 "New project"**
3. **填写项目信息**：
   - **Name**: `bessie-growth-journal`
   - **Database Password**: 设置一个安全密码
   - **Region**: 选择最近的地区（如 `Northeast Asia (Tokyo)`）
4. **点击 "Create new project"**
5. **等待项目创建完成**（需要 2-3 分钟）

---

### 步骤 3：创建数据库表

1. **在项目页面**
2. **点击左侧 "Table Editor"**
3. **点击 "New table"**

#### 表结构设计

**表名**: `memories`

**字段**:

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `id` | `text` | - | 主键，回忆ID |
| `title` | `text` | - | 回忆标题 |
| `description` | `text` | null | 回忆描述 |
| `date` | `date` | - | 回忆日期 |
| `location` | `text` | null | 地点 |
| `url` | `text` | - | Cloudinary 文件URL |
| `thumbnail` | `text` | null | 缩略图URL |
| `type` | `text` | - | 文件类型 ('image' 或 'video') |
| `created_at` | `timestamptz` | `now()` | 创建时间 |

**创建步骤**:

1. **表名**: `memories`
2. **添加字段**:
   ```
   id - text (primary key)
   title - text
   description - text (nullable)
   date - date
   location - text (nullable)
   url - text
   thumbnail - text (nullable)
   type - text
   created_at - timestamptz (default: now())
   ```
3. **点击 "Save"**

---

### 步骤 4：获取 API 密钥

1. **在项目页面**
2. **点击左侧 "Settings"** → **"API"**
3. **复制以下信息**:
   - **URL**: `https://your-project-id.supabase.co`
   - **anon public**: `你的匿名密钥`
   - **service_role**: `你的服务密钥`

---

### 步骤 5：修改代码使用 Supabase

#### 5.1 安装 Supabase 客户端

```bash
npm install @supabase/supabase-js
```

#### 5.2 创建 Supabase 客户端

**新建文件**: `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### 5.3 修改数据层

**修改文件**: `lib/data.ts`

```typescript
import { supabase } from './supabase'
import type { Memory } from './types'

// 读取所有回忆
export async function getMemories(): Promise<Memory[]> {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('获取回忆失败:', error)
    return []
  }

  return data || []
}

// 根据ID获取回忆
export async function getMemoryById(id: string): Promise<Memory | null> {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('获取回忆失败:', error)
    return null
  }

  return data
}

// 添加新回忆
export async function addMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
  const { data, error } = await supabase
    .from('memories')
    .insert([memory])
    .select()
    .single()

  if (error) {
    console.error('添加回忆失败:', error)
    throw error
  }

  return data
}

// 删除回忆
export async function deleteMemory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('删除回忆失败:', error)
    return false
  }

  return true
}
```

#### 5.4 添加环境变量

**在 Netlify 中添加环境变量**:

| 变量名 | 值 |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的匿名密钥 |

---

### 步骤 6：修改上传 API

**修改文件**: `app/api/upload/route.ts`

```typescript
// 修改导入
import { addMemory } from '@/lib/data'

// ... 其他代码保持不变 ...

// 修改数据保存部分
const memory = await addMemory({
  title: (formData.get('title') as string) || file.name || '未命名文件',
  description: (formData.get('description') as string) || undefined,
  date: dateValue,
  location: (formData.get('location') as string) || undefined,
  url,
  thumbnail,
  type: isImage ? 'image' : 'video',
})
```

---

## 🎯 优势

### Supabase 的优势：

1. **免费额度充足**：
   - 500MB 数据库存储
   - 每月 50MB 文件存储
   - 每月 500MB 带宽

2. **功能丰富**：
   - 实时订阅（数据变化自动更新）
   - 内置认证
   - 文件存储
   - Edge Functions

3. **开发友好**：
   - 完整的 TypeScript 支持
   - 直观的仪表板
   - 详细的文档

4. **生产就绪**：
   - 自动备份
   - 高可用性
   - 企业级安全

---

## 📝 下一步

**如果你同意使用 Supabase，我会帮你：**

1. ✅ 指导你注册和创建项目
2. ✅ 创建数据库表
3. ✅ 修改代码使用 Supabase
4. ✅ 测试数据持久化

**你觉得这个方案怎么样？** 🚀

