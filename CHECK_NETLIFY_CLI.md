# 如何确认 Netlify CLI 已成功安装 ✅

## 🔍 检查方法

### 方法一：检查版本（最简单）

在终端中运行：

```bash
netlify --version
```

**如果已安装，会显示版本号：**
```
netlify-cli/x.x.x
```

**如果没有安装，会显示：**
```
command not found: netlify
```

---

### 方法二：检查命令位置

在终端中运行：

```bash
which netlify
```

**如果已安装，会显示路径：**
```
/usr/local/bin/netlify
```

**如果没有安装，不会显示任何内容。**

---

### 方法三：运行帮助命令

在终端中运行：

```bash
netlify --help
```

**如果已安装，会显示帮助信息：**
```
Netlify command line tool

Usage:
  netlify [command]

Commands:
  init      Configure continuous deployment for a new or existing site
  deploy    Deploy to netlify
  ...
```

**如果没有安装，会显示错误。**

---

## ✅ 如果已安装

如果看到版本号或帮助信息，说明 Netlify CLI 已成功安装！

**下一步：**
1. 运行 `netlify login` 登录
2. 运行 `netlify init` 初始化项目

---

## ❌ 如果没有安装

### 安装步骤：

#### 1. 安装 Netlify CLI

在终端中运行：

```bash
npm install -g netlify-cli
```

**如果提示权限错误，使用：**
```bash
sudo npm install -g netlify-cli
```

#### 2. 确认安装

运行：

```bash
netlify --version
```

应该显示版本号。

---

## 📋 完整检查流程

### 步骤 1：检查是否已安装

```bash
netlify --version
```

### 步骤 2：如果已安装

- ✅ 看到版本号 → 已安装成功
- ✅ 可以继续下一步：`netlify login`

### 步骤 3：如果没有安装

- ❌ 看到 "command not found" → 需要安装
- ❌ 运行 `npm install -g netlify-cli`
- ❌ 再次检查版本

---

## 🎯 现在检查

**在终端中运行：**

```bash
netlify --version
```

**告诉我你看到了什么，我可以帮你判断是否已安装！** 🔍

