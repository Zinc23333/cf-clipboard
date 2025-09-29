# CF Clipboard

基于 Cloudflare Workers 的网络文本共享服务，提供简单易用的文本存储和共享功能。

> ⚠️ 本项目绝大部分代码由AI生成。

## 功能特性

- 🚀 **高性能**: 基于 Cloudflare Workers，全球边缘节点部署
- 💾 **持久化存储**: 使用 D1 数据库存储文本内容
- ⏰ **自动过期**: 支持设置有效时间，过期自动删除
- 🔐 **可选授权**: 支持 TOKEN 验证保护数据安全
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🌍 **多语言支持**: 支持中文、英文、日文和俄文界面
- 🎨 **现代化界面**: 美观的渐变设计和流畅动画
- 🔒 **密码保护**: 支持为内容设置密码保护，增强安全性
- 🌙 **深色模式**: 支持深色/浅色主题切换

## 部署说明

### 前置要求

- Node.js (推荐 v18+)
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare 账户

### 部署步骤

1. 克隆项目:
   ```bash
   git clone <repository-url>
   cd cf-clipboard
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

3. 登录 Cloudflare:
   ```bash
   wrangler login
   ```

4. 创建 D1 数据库:
   ```bash
   npm run db:create
   ```
   记录输出中的 `database_id`。

5. 更新 `wrangler.jsonc` 配置文件:
   - 将上一步中的 `database_id` 填入 `d1_databases` 配置中

6. (可选)初始化数据库表结构:
   项目在运行时会自动初始化数据库表结构，可以不手动创建
   ```bash
   # 生产环境
   npm run db:migrate
   
   # 本地开发环境
   npm run db:migrate:local
   ```

7. (可选)本地开发:
   ```bash
   wrangler dev
   ```

8. 部署到 Cloudflare:
   ```bash
   wrangler deploy
   ```

### 环境变量配置

如需启用 TOKEN 验证，在 `wrangler.jsonc` 中取消注释并设置 `TOKEN` 变量:
```json
"vars": { 
  "TOKEN": "your-secret-token-here"
}
```

或者使用更安全的方法：
``` bash
wranger secret put TOKEN
```

## API 接口

### 1. 读取内容

#### 公开内容读取
```
GET /api/read/<key>
```
- 成功：返回文本内容（200），响应头包含 `X-Expires-At`
- 失败：返回 404（键不存在或已过期）或 401（未授权）

#### 密码保护内容读取
```
POST /api/read/<key>
Content-Type: application/json

{
  "password": "your-password"
}
```
- 成功：返回文本内容（200），响应头包含 `X-Expires-At`
- 失败：返回 404（键不存在或已过期）或 401（密码错误）

### 2. 写入内容
```
POST /api/write/<key>
Content-Type: application/json

{
  "content": "文本内容",
  "password": "可选密码",
  "expires": "过期时间"
}
```

**过期时间参数 (`expires`)**:
- `1h`: 1小时后过期
- `12h`: 12小时后过期
- `1d`: 1天后过期
- `3d`: 3天后过期（默认）
- `7d`: 7天后过期

**响应格式**:
```json
{
  "message": "OK",
  "expires_at": "2025-09-22T11:38:08.925Z"
}
```

### 3. 删除内容
```
DELETE /api/delete/<key>
Content-Type: application/json

{
  "password": "可选密码（如果内容有密码保护）"
}
```
- 成功：返回 "OK"（200）
- 失败：返回 404（键不存在）或 401（未授权/密码错误）

### 4. 列出所有键
```
GET /api/list
```
返回所有有效（未过期）的键的元数据信息。

**响应格式**:
```json
{
  "total": 2,
  "items": [
    {
      "key": "my-note",
      "created_at": "2025-09-21T11:38:08.925Z",
      "updated_at": "2025-09-21T11:38:08.925Z",
      "expires_at": "2025-09-22T11:38:08.925Z",
      "password_protected": false,
      "content_length": 0
    }
  ]
}
```

### 授权验证

如果设置了环境变量 `TOKEN`，需要在请求头中添加：
```
Authorization: Bearer <your-token>
```

## 页面功能

### 主页 `/`
- 输入键名和文本内容
- 选择有效时间（1小时-7天）
- 支持读取、写入、删除操作
- 显示过期时间和剩余时间
- 提供快速操作：随机键名生成、链接复制等
- 键盘快捷键：Ctrl+S 保存，Ctrl+R 读取
- 暗色/亮色主题切换
- 多语言支持

## 定时任务

系统配置了定时任务，每3天执行一次过期内容清理：
```
0 0 */3 * *
```

## 技术架构

- **前端**: 原生 HTML/CSS/JavaScript（无框架）
- **后端**: Cloudflare Workers + TypeScript
- **数据库**: Cloudflare D1 (SQLite)
- **构建工具**: Wrangler CLI
- **语言**: TypeScript

## 安全特性

1. **可选 TOKEN 验证**: 通过环境变量配置访问令牌
2. **密码保护**: 支持为单个内容设置密码保护
3. **HTTPS**: 通过 Cloudflare 自动启用 HTTPS
4. **CORS 控制**: 限制跨域请求
5. **输入验证**: 严格的键名和内容验证

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 支持

如果您觉得这个项目有用，请给它一个 ⭐ 星标！