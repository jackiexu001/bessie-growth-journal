# 修复 npm 权限错误 🔧

## ⚠️ 错误说明

你遇到的是权限错误（EACCES），这是因为安装全局 npm 包需要管理员权限。

---

## ✅ 解决方案

### 方案一：使用 sudo（最简单）⭐

在终端中运行：

```bash
sudo npm install -g netlify-cli
```

**然后输入你的 Mac 密码**（输入时不会显示字符，这是正常的）

---

### 方案二：使用 npx（不需要全局安装）⭐

如果不想使用 sudo，可以使用 npx：

```bash
npx netlify-cli login
npx netlify-cli init
npx netlify-cli deploy --prod
```

**优点：**
- ✅ 不需要 sudo
- ✅ 不需要全局安装

**缺点：**
- ⚠️ 每次都需要输入 `npx netlify-cli`

---

### 方案三：修复 npm 权限（长期方案）

如果你经常安装全局包，可以修复 npm 权限：

#### 1. 创建全局包目录

```bash
mkdir ~/.npm-global
```

#### 2. 配置 npm 使用新目录

```bash
npm config set prefix '~/.npm-global'
```

#### 3. 添加到 PATH

编辑 `~/.zshrc` 文件：

```bash
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
```

#### 4. 重新加载配置

```bash
source ~/.zshrc
```

#### 5. 现在可以不用 sudo 安装

```bash
npm install -g netlify-cli
```

**注意：** 这个方案比较复杂，如果只是安装 Netlify CLI，推荐使用方案一或方案二。

---

## 🎯 推荐方案

### 方案一：使用 sudo（最简单）

**步骤：**

1. 在终端中运行：
   ```bash
   sudo npm install -g netlify-cli
   ```

2. 输入你的 Mac 密码（输入时不会显示字符，这是正常的）

3. 按回车

4. 等待安装完成

5. 确认安装：
   ```bash
   netlify --version
   ```

---

## 📋 完整安装步骤

### 在终端中运行：

```bash
# 1. 进入项目目录
cd /Users/xulangliyuemanhua/Documents/Bessie

# 2. 使用 sudo 安装 Netlify CLI
sudo npm install -g netlify-cli

# 3. 输入你的 Mac 密码（不会显示字符，这是正常的）
# 4. 按回车

# 5. 等待安装完成

# 6. 确认安装
netlify --version
```

---

## ✅ 如果安装成功

如果看到版本号，说明安装成功！

**下一步：**
1. 运行 `netlify login` 登录
2. 运行 `netlify init` 初始化项目

---

## ❓ 常见问题

### Q: 为什么需要 sudo？

**A:** 
- 全局 npm 包安装在系统目录（`/usr/local/lib/node_modules`）
- 需要管理员权限才能写入
- 使用 `sudo` 可以临时获得管理员权限

---

### Q: 输入密码时看不到字符？

**A:** 
- 这是正常的安全机制
- 直接输入密码，然后按回车
- 即使看不到字符，密码也在输入

---

### Q: 可以使用 npx 代替吗？

**A:** 
- 可以！使用 `npx netlify-cli` 代替 `netlify`
- 不需要全局安装
- 不需要 sudo

---

## 🚀 现在开始

**在终端中运行：**

```bash
sudo npm install -g netlify-cli
```

**然后：**
1. 输入你的 Mac 密码（不会显示字符）
2. 按回车
3. 等待安装完成
4. 运行 `netlify --version` 确认安装

---

**告诉我安装结果，我可以继续指导你下一步！** 🚀

