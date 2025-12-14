# 视频播放问题排查指南

## 问题：视频只能听到声音，看不到画面

### 诊断结果
如果控制台显示：
```
videoWidth: 0, videoHeight: 0
duration: 有值（如 1369.411078）
```

这说明：
- ✅ 视频文件可以加载
- ✅ 音频轨道正常
- ❌ 视频轨道无法解码或不存在

### 常见原因

1. **视频编码格式不支持**
   - MP4 文件可能使用 HEVC/H.265 编码
   - 很多浏览器（特别是 Chrome、Firefox）不支持 HEVC 解码
   - 需要转换为 H.264 编码

2. **视频文件损坏**
   - 上传过程中文件可能损坏
   - 视频轨道数据不完整

3. **视频文件只有音频**
   - 某些情况下视频文件可能只包含音频轨道

## 解决方案

### 方案 1：使用 HandBrake 转换（推荐，最简单）

1. **下载 HandBrake**
   - 访问：https://handbrake.fr/
   - 下载并安装

2. **转换视频**
   - 打开 HandBrake
   - 点击"打开源"选择视频文件
   - 选择预设："Fast 1080p30" 或 "Fast 720p30"
   - **重要**：确保"视频编码器"选择 "H.264 (x264)"
   - 点击"开始编码"

3. **重新上传转换后的视频**

### 方案 2：使用 FFmpeg 转换（命令行）

如果已安装 FFmpeg：

```bash
# 转换为 H.264 编码的 MP4
ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output.mp4

# 检查视频编码格式
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 input.mp4
```

### 方案 3：使用在线转换工具

1. **CloudConvert**
   - 访问：https://cloudconvert.com/
   - 上传视频
   - 选择输出格式：MP4
   - 选择视频编码：H.264
   - 转换并下载

2. **Online-Convert**
   - 访问：https://www.online-convert.com/
   - 选择视频转换
   - 转换为 MP4 (H.264)

## 推荐的视频格式

为了确保最佳兼容性，建议使用：

- **容器格式**：MP4
- **视频编码**：H.264 (AVC)
- **音频编码**：AAC
- **分辨率**：1080p 或更低
- **帧率**：30fps

## 检查视频编码格式

### Mac 系统

```bash
# 使用 ffprobe（需要安装 ffmpeg）
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,codec_long_name -of default=noprint_wrappers=1 input.mp4

# 查看完整视频信息
ffprobe -v error -show_format -show_streams input.mp4
```

### 使用 QuickTime Player

1. 用 QuickTime Player 打开视频
2. 按 Cmd+I 查看信息
3. 查看"格式"信息

## 预防措施

1. **上传前检查**
   - 在浏览器中测试视频是否能正常播放
   - 使用 VLC 等播放器检查视频格式

2. **使用推荐的录制设置**
   - iPhone：设置 > 相机 > 格式 > 选择"高效"改为"兼容性最好"
   - Android：使用相机应用的"兼容模式"

3. **批量转换**
   - 如果有多个视频，可以批量转换
   - 使用 HandBrake 的队列功能

## 技术说明

### 为什么会出现这个问题？

- **HEVC/H.265** 是较新的编码格式，压缩效率高但兼容性差
- 大多数浏览器只支持 **H.264** 编码
- MP4 只是容器格式，内部编码可能是 HEVC
- 浏览器无法解码 HEVC，所以只能播放音频

### 如何确认视频编码？

如果控制台显示 `videoWidth: 0, videoHeight: 0` 但 `duration` 有值，基本可以确定是编码格式问题。

