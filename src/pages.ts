// src/pages.ts
import { Env } from './types';

// 生成主页HTML
export const generateHomePage = (env: Env) => {
  const requireAuth = !!(env as any).TOKEN;
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CF Clipboard - 网络文本共享</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .header h1 {
      color: #2d3748;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .header p {
      color: #718096;
      font-size: 1.1rem;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #2d3748;
      font-weight: 600;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: white;
    }
    
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    select {
      cursor: pointer;
    }
    
    textarea {
      min-height: 200px;
      resize: vertical;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    }
    
    .button-group {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    
    button {
      flex: 1;
      min-width: 120px;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
    }
    
    .btn-secondary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(72, 187, 120, 0.3);
    }
    
    .btn-danger {
      background: linear-gradient(135deg, #f56565, #e53e3e);
      color: white;
    }
    
    .btn-danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(245, 101, 101, 0.3);
    }
    
    .status {
      margin-top: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 500;
      display: none;
    }
    
    .status.success {
      background: #f0fff4;
      color: #22543d;
      border: 1px solid #9ae6b4;
    }
    
    .status.error {
      background: #fed7d7;
      color: #742a2a;
      border: 1px solid #feb2b2;
    }
    
    .expiry-info {
      margin-top: 15px;
      padding: 10px 16px;
      background: #e6fffa;
      border: 1px solid #81e6d9;
      border-radius: 6px;
      font-size: 14px;
      color: #234e52;
    }
    
    .expiry-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .expiry-status::before {
      content: '⏰';
    }
    
    .quick-actions {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 2px solid #e2e8f0;
    }
    
    .quick-actions h3 {
      color: #2d3748;
      margin-bottom: 15px;
    }
    
    .quick-link {
      display: inline-block;
      padding: 8px 16px;
      background: #edf2f7;
      color: #4a5568;
      text-decoration: none;
      border-radius: 20px;
      margin-right: 10px;
      margin-bottom: 10px;
      transition: all 0.3s ease;
      font-size: 14px;
    }
    
    .quick-link:hover {
      background: #667eea;
      color: white;
      transform: translateY(-1px);
    }
    
    /* 新增的密码输入框样式 */
    .form-row {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .form-col {
      flex: 1;
    }
    
    @media (max-width: 768px) {
      .container {
        margin: 10px;
        padding: 20px;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .button-group {
        flex-direction: column;
      }
      
      button {
        flex: none;
      }
      
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 CF Clipboard</h1>
      <p>基于 Cloudflare Workers 的网络文本共享服务</p>
    </div>
    
    ${requireAuth ? `
    <div class="form-group">
      <label for="token">🔐 授权令牌</label>
      <input type="password" id="token" placeholder="请输入访问令牌">
    </div>
    ` : ''}
    
    <div class="form-group">
      <label for="key">🔑 存储键名</label>
      <input type="text" id="key" placeholder="请输入键名，例如：my-note">
      <div id="key-error" style="color: #e53e3e; font-size: 14px; margin-top: 5px; display: none;"></div>
    </div>
    
    <div class="form-row">
      <div class="form-col">
        <label for="expires">⏰ 有效时间</label>
        <select id="expires">
          <option value="1h">1小时</option>
          <option value="12h">12小时</option>
          <option value="1d">1天</option>
          <option value="3d" selected>3天</option>
          <option value="7d">7天</option>
        </select>
      </div>
      
      <div class="form-col">
        <label for="password">🔒 密码 (可选)</label>
        <input type="password" id="password" placeholder="无密码">
      </div>
    </div>
    
    <div class="form-group">
      <label for="content">📝 文本内容</label>
      <textarea id="content" placeholder="在此输入或粘贴您的文本内容..."></textarea>
    </div>
    
    <div class="button-group">
      <button class="btn-primary" onclick="readContent()" id="read-btn">📖 读取</button>
      <button class="btn-secondary" onclick="writeContent()" id="write-btn">💾 写入</button>
      <button class="btn-danger" onclick="deleteContent()" id="delete-btn">🗑️ 删除</button>
    </div>
    
    <div class="status" id="status"></div>
    
    <div class="expiry-info" id="expiry-info" style="display: none;">
      <div class="expiry-status">
        <span id="expiry-text"></span>
      </div>
    </div>
    
    <div class="quick-actions">
      <h3>🚀 快速操作</h3>
      <a href="javascript:copyCurrentUrl()" class="quick-link" id="copy-link">复制链接</a>
      <a href="javascript:generateRandomKey()" class="quick-link">随机键名</a>
    </div>
  </div>

  <script>
    const requireAuth = ${requireAuth};
    
    // 验证键名格式（只允许字母、数字、连字符和下划线）
    function isValidKey(key) {
      if (!key) {
        return false;
      }
      
      const keyRegex = /^[a-zA-Z0-9_-]+$/;
      return keyRegex.test(key);
    }
    
    // 更新按钮状态
    function updateButtonStates() {
      const key = document.getElementById('key').value.trim();
      const content = document.getElementById('content').value.trim();
      const isValid = isValidKey(key);
      const readBtn = document.getElementById('read-btn');
      const writeBtn = document.getElementById('write-btn');
      const deleteBtn = document.getElementById('delete-btn');
      const copyLink = document.getElementById('copy-link');
      
      // 键名相关按钮的状态控制
      if (key === '' || !isValid) {
        // 如果键名为空或无效，禁用相关按钮
        readBtn.disabled = true;
        writeBtn.disabled = true;
        deleteBtn.disabled = true;
        copyLink.style.pointerEvents = 'none';
        copyLink.style.opacity = '0.6';
      } else {
        // 如果键名有效，启用相关按钮
        readBtn.disabled = false;
        writeBtn.disabled = content === ''; // 内容为空时禁用写入按钮
        deleteBtn.disabled = false;
        copyLink.style.pointerEvents = 'auto';
        copyLink.style.opacity = '1';
      }
    }
    
    // 实时验证键名输入
    function validateKeyInput() {
      const keyInput = document.getElementById('key');
      const errorDiv = document.getElementById('key-error');
      const key = keyInput.value.trim();
      
      if (key === '') {
        errorDiv.style.display = 'none';
        return true;
      }
      
      if (!isValidKey(key)) {
        errorDiv.textContent = '键名只能包含字母、数字、连字符(-)和下划线(_)';
        errorDiv.style.display = 'block';
        return false;
      } else {
        errorDiv.style.display = 'none';
        return true;
      }
    }
    
    // 监听键名输入
    document.getElementById('key').addEventListener('input', function() {
      validateKeyInput();
      updateButtonStates();
      // 清除过期时间提示
      hideExpiryInfo();
    });
    
    // 监听内容输入
    document.getElementById('content').addEventListener('input', function() {
      updateButtonStates();
    });
    
    function getHeaders() {
      const headers = { 'Content-Type': 'application/json' };
      if (requireAuth) {
        const token = document.getElementById('token').value.trim();
        if (token) {
          headers['Authorization'] = 'Bearer ' + token;
        }
      }
      return headers;
    }
    
    function showStatus(message, type) {
      const status = document.getElementById('status');
      status.textContent = message;
      status.className = 'status ' + type;
      status.style.display = 'block';
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    }
    
    function showPasswordStatus(message, type) {
      const status = document.getElementById('password-status');
      status.textContent = message;
      status.className = 'status ' + type;
      status.style.display = 'block';
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    }
    
    function showError(message) {
      const errorDiv = document.getElementById('key-error');
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 3000);
    }
    
    async function readContent() {
      const key = document.getElementById('key').value.trim();
      const password = document.getElementById('password').value || '';
      
      // 验证键名
      if (!key) {
        showError('请输入键名');
        return;
      }
      
      if (!isValidKey(key)) {
        showError('键名只能包含字母、数字、连字符(-)和下划线(_)');
        return;
      }
      
      try {
        // 如果提供了密码，则使用POST方式请求（需要密码验证）
        if (password) {
          const requestData = {
            password: password
          };
          
          const response = await fetch(\`/api/read/\${encodeURIComponent(key)}\`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(requestData)
          });
          
          if (response.ok) {
            const content = await response.text();
            document.getElementById('content').value = content;
            updateButtonStates(); // 更新按钮状态
            
            // 显示过期时间信息
            const expiresAt = response.headers.get('X-Expires-At');
            const isPasswordProtected = response.headers.get('X-Password-Protected') === 'true';
            showExpiryInfo(expiresAt, key, isPasswordProtected);
            
            showStatus('读取成功', 'success');
          } else if (response.status === 401) {
            showStatus('密码错误', 'error');
          } else if (response.status === 404) {
            showStatus('键名不存在或已过期', 'error');
            hideExpiryInfo();
          } else if (response.status === 400) {
            const errorMessage = await response.text();
            showError(errorMessage);
          } else {
            showStatus('读取失败', 'error');
          }
        } else {
          // 如果没有提供密码，则使用GET方式请求（不需要密码验证）
          const response = await fetch(\`/api/read/\${encodeURIComponent(key)}\`, {
            method: 'GET',
            headers: getHeaders()
          });
          
          if (response.ok) {
            const content = await response.text();
            document.getElementById('content').value = content;
            updateButtonStates(); // 更新按钮状态
            
            // 显示过期时间信息
            const expiresAt = response.headers.get('X-Expires-At');
            const isPasswordProtected = response.headers.get('X-Password-Protected') === 'true';
            showExpiryInfo(expiresAt, key, isPasswordProtected);
            
            showStatus('读取成功', 'success');
          } else if (response.status === 401) {
            showStatus('此内容受密码保护，请输入密码', 'error');
          } else if (response.status === 404) {
            showStatus('键名不存在或已过期', 'error');
            hideExpiryInfo();
          } else if (response.status === 400) {
            const errorMessage = await response.text();
            showError(errorMessage);
          } else {
            showStatus('读取失败', 'error');
          }
        }
      } catch (error) {
        showStatus('网络错误', 'error');
      }
    }
    
    async function writeContent() {
      const key = document.getElementById('key').value.trim();
      const content = document.getElementById('content').value;
      const expires = document.getElementById('expires').value;
      const password = document.getElementById('password').value || '';
      
      // 验证键名
      if (!key) {
        showError('请输入键名');
        return;
      }
      
      if (!isValidKey(key)) {
        showError('键名只能包含字母、数字、连字符(-)和下划线(_)');
        return;
      }
      
      // 检查内容是否为空
      if (content.trim() === '') {
        showError('内容不能为空');
        return;
      }
      
      try {
        const requestData = {
          password: password,
          expires: expires,
          content: content
        };
        
        const response = await fetch(\`/api/write/\${encodeURIComponent(key)}\`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
          const result = await response.json();
          showStatus('写入成功', 'success');
          showExpiryInfo(result.expires_at, key, password !== '');
        } else if (response.status === 400) {
          const errorMessage = await response.text();
          showError(errorMessage);
        } else if (response.status === 401) {
          showStatus('密码错误或需要密码', 'error');
        } else {
          showStatus('写入失败', 'error');
        }
      } catch (error) {
        showStatus('网络错误', 'error');
      }
    }
    
    function showExpiryInfo(expiresAt, key, isPasswordProtected) {
      const expiryInfo = document.getElementById('expiry-info');
      const expiryText = document.getElementById('expiry-text');
      
      if (expiresAt && key) {
        const expiry = new Date(expiresAt);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          let timeLeft = '';
          if (days > 0) timeLeft += \`\${days}天 \`;
          if (hours > 0) timeLeft += \`\${hours}小时 \`;
          if (minutes > 0 && days === 0) timeLeft += \`\${minutes}分钟\`;
          
          const passwordText = isPasswordProtected ? ' (密码保护)' : '';
          expiryText.textContent = \`键名 "\${key}"\${passwordText} 将在 \${timeLeft.trim()} 后过期 (\${expiry.toLocaleString()})\`;
        } else {
          const passwordText = isPasswordProtected ? ' (密码保护)' : '';
          expiryText.textContent = \`键名 "\${key}"\${passwordText} 已过期\`;
        }
        expiryInfo.style.display = 'block';
      }
    }
    
    function hideExpiryInfo() {
      document.getElementById('expiry-info').style.display = 'none';
    }
    
    async function deleteContent() {
      const key = document.getElementById('key').value.trim();
      const password = document.getElementById('password').value || '';
      
      // 验证键名
      if (!key) {
        showError('请输入键名');
        return;
      }
      
      if (!isValidKey(key)) {
        showError('键名只能包含字母、数字、连字符(-)和下划线(_)');
        return;
      }
      
      if (!confirm('确定要删除这个键的内容吗？')) {
        return;
      }
      
      try {
        const requestData = {
          password: password
        };
        
        const response = await fetch(\`/api/delete/\${encodeURIComponent(key)}\`, {
          method: 'DELETE',
          headers: getHeaders(),
          body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
          document.getElementById('content').value = '';
          hideExpiryInfo();
          updateButtonStates(); // 更新按钮状态
          showStatus('删除成功', 'success');
        } else if (response.status === 404) {
          showStatus('键名不存在', 'error');
        } else if (response.status === 401) {
          showStatus('密码错误或需要密码', 'error');
        } else if (response.status === 400) {
          const errorMessage = await response.text();
          showError(errorMessage);
        } else {
          showStatus('删除失败', 'error');
        }
      } catch (error) {
        showStatus('网络错误', 'error');
      }
    }
    
    function copyCurrentUrl() {
      const key = document.getElementById('key').value.trim();
      
      // 验证键名
      if (!key) {
        showError('请输入键名');
        return;
      }
      
      if (!isValidKey(key)) {
        showError('键名只能包含字母、数字、连字符(-)和下划线(_)');
        return;
      }
      
      const url = window.location.origin + '/detail/' + encodeURIComponent(key);
      navigator.clipboard.writeText(url).then(() => {
        showStatus('链接已复制到剪贴板', 'success');
      });
    }
    
    function generateRandomKey() {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      document.getElementById('key').value = result;
      // 触发验证和按钮更新
      validateKeyInput();
      updateButtonStates();
      // 清除过期时间提示
      hideExpiryInfo();
    }
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          const key = document.getElementById('key').value.trim();
          const content = document.getElementById('content').value.trim();
          if (key && isValidKey(key) && content !== '') {
            writeContent();
          }
        } else if (e.key === 'r') {
          e.preventDefault();
          const key = document.getElementById('key').value.trim();
          if (key && isValidKey(key)) {
            readContent();
          }
        }
      }
    });
    
    // 初始化按钮状态
    document.addEventListener('DOMContentLoaded', function() {
      updateButtonStates();
    });
  </script>
</body>
</html>`;
};

// 生成详细页面HTML
export const generateDetailPage = (key: string, env: Env) => {
  const requireAuth = !!(env as any).TOKEN;
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CF Clipboard - ${key}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .title {
      color: #2d3748;
    }
    
    .title h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 5px;
    }
    
    .title .key-name {
      color: #667eea;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      background: #f7fafc;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    
    .nav-buttons {
      display: flex;
      gap: 10px;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }
    
    .btn-outline {
      background: transparent;
      color: #4a5568;
      border: 2px solid #e2e8f0;
    }
    
    .btn-outline:hover {
      background: #f7fafc;
      border-color: #cbd5e0;
    }
    
    ${requireAuth ? `
    .auth-section {
      margin-bottom: 20px;
    }
    
    .auth-section input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 16px;
      margin-bottom: 10px;
    }
    ` : ''}
    
    .editor-header {
      margin-bottom: 15px;
      padding: 15px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .editor-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .editor-controls label {
      font-weight: 600;
      color: #4a5568;
      white-space: nowrap;
    }
    
    .editor-controls select {
      flex: 1;
      max-width: 200px;
      padding: 8px 12px;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      font-size: 14px;
    }
    
    .expiry-display {
      font-size: 14px;
      color: #2d3748;
      padding: 8px 12px;
      background: #e6fffa;
      border: 1px solid #81e6d9;
      border-radius: 6px;
    }
    
    .expiry-display::before {
      content: '⏰ ';
    }
    
    .editor {
      position: relative;
    }
    
    .editor textarea {
      width: 100%;
      min-height: 400px;
      padding: 20px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 16px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      line-height: 1.6;
      resize: vertical;
      background: #fafafa;
    }
    
    .editor textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .editor-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .action-buttons {
      display: flex;
      gap: 12px;
    }
    
    button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
    }
    
    .btn-secondary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    
    .btn-danger {
      background: linear-gradient(135deg, #f56565, #e53e3e);
      color: white;
    }
    
    .btn-danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    
    .editor-info {
      color: #718096;
      font-size: 14px;
    }
    
    .status {
      margin-top: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 500;
      display: none;
    }
    
    .status.success {
      background: #f0fff4;
      color: #22543d;
      border: 1px solid #9ae6b4;
    }
    
    .status.error {
      background: #fed7d7;
      color: #742a2a;
      border: 1px solid #feb2b2;
    }
    
    .loading {
      text-align: center;
      color: #718096;
      font-style: italic;
    }
    
    /* 密码输入区域样式 */
    .password-section {
      text-align: center;
      padding: 40px 20px;
    }
    
    .password-section h3 {
      color: #2d3748;
      margin-bottom: 15px;
    }
    
    .password-section p {
      color: #718096;
      margin-bottom: 20px;
    }
    
    .password-section input {
      width: 100%;
      max-width: 300px;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 16px;
      margin-bottom: 20px;
    }
    
    .password-section input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    /* 确保密码区域状态提示的可见性 */
    .password-section .status {
      display: none;
      margin: 10px auto;
      max-width: 300px;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 500;
    }
    
    .password-section .status.error,
    .password-section .status.success {
      display: block;
    }
    
    .password-section .status.error {
      background: #fed7d7;
      color: #742a2a;
      border: 1px solid #feb2b2;
    }
    
    .password-section .status.success {
      background: #f0fff4;
      color: #22543d;
      border: 1px solid #9ae6b4;
    }
    
    @media (max-width: 768px) {
      .container {
        margin: 10px;
        padding: 20px;
      }
      
      .header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .nav-buttons {
        justify-content: center;
      }
      
      .editor-actions {
        flex-direction: column;
      }
      
      .action-buttons {
        width: 100%;
        justify-content: center;
      }
      
      .password-section input {
        margin: 10px 0;
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">
        <h1>📋 文档编辑</h1>
        <div class="key-name">${key}</div>
      </div>
      <div class="nav-buttons">
        <a href="/" class="btn btn-outline">← 返回首页</a>
      </div>
    </div>
    
    ${requireAuth ? `
    <div class="auth-section">
      <input type="password" id="token" placeholder="请输入访问令牌">
    </div>
    ` : ''}
    
    <!-- 密码输入区域 -->
    <div class="password-section" id="password-section">
      <h3>🔒 此内容受密码保护</h3>
      <p>请输入密码以访问和编辑内容</p>
      <input type="password" id="password-input" placeholder="请输入密码">
      <button class="btn btn-secondary" onclick="unlockContent()">解锁</button>
      <div class="status" id="password-status"></div>
    </div>
    
    <!-- 内容区域（默认隐藏） -->
    <div id="content-area" style="display: none;">
      <div class="editor-header">
        <div class="editor-controls">
          <label for="expires">⏰ 有效时间：</label>
          <select id="expires">
            <option value="1h">1小时</option>
            <option value="12h">12小时</option>
            <option value="1d">1天</option>
            <option value="3d" selected>3天</option>
            <option value="7d">7天</option>
          </select>
        </div>
        <div class="expiry-display" id="expiry-display" style="display: none;"></div>
      </div>
      
      <div class="editor">
        <textarea id="content" placeholder="正在加载内容..." readonly></textarea>
      </div>
      
      <div class="editor-actions">
        <div class="editor-info">
          <span id="char-count">字符数: 0</span> | 
          <span id="last-saved">未保存</span>
        </div>
        <div class="action-buttons">
          <button class="btn btn-secondary" onclick="saveContent()" id="save-btn">💾 保存</button>
          <button class="btn btn-primary" onclick="copyContent()" id="copy-btn">📋 复制</button>
          <button class="btn btn-danger" onclick="deleteContent()" id="delete-btn">🗑️ 删除</button>
        </div>
      </div>
    </div>
    
    <div class="status" id="status"></div>
  </div>

  <script>
    const key = '${key}';
    const requireAuth = ${requireAuth};
    let originalContent = '';
    let isLoaded = false;
    let isUnlocked = false;
    
    // 验证键名格式（只允许字母、数字、连字符和下划线）
    function isValidKey(key) {
      if (!key) {
        return false;
      }
      
      const keyRegex = /^[a-zA-Z0-9_-]+$/;
      return keyRegex.test(key);
    }
    
    function getHeaders() {
      const headers = { 'Content-Type': 'application/json' };
      if (requireAuth) {
        const token = document.getElementById('token').value.trim();
        if (token) {
          headers['Authorization'] = 'Bearer ' + token;
        }
      }
      return headers;
    }
    
    function showStatus(message, type) {
      const status = document.getElementById('status');
      status.textContent = message;
      status.className = 'status ' + type;
      status.style.display = 'block';
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    }
    
    function updateCharCount() {
      const content = document.getElementById('content').value;
      document.getElementById('char-count').textContent = \`字符数: \${content.length}\`;
    }
    
    function updateLastSaved() {
      const now = new Date();
      document.getElementById('last-saved').textContent = \`最后保存: \${now.toLocaleTimeString()}\`;
    }
    
    // 解锁受保护的内容
    async function unlockContent() {
      const password = document.getElementById('password-input').value;
      
      if (!password) {
        showPasswordStatus('请输入密码', 'error');
        return;
      }
      
      try {
        const requestData = {
          password: password
        };
        
        const response = await fetch(\`/api/read/\${encodeURIComponent(key)}\`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
          const content = await response.text();
          document.getElementById('content').value = content;
          originalContent = content;
          document.getElementById('content').placeholder = '在此编辑您的文本内容...';
          document.getElementById('content').removeAttribute('readonly');
          
          // 隐藏密码区域，显示内容区域
          document.getElementById('password-section').style.display = 'none';
          document.getElementById('content-area').style.display = 'block';
          
          isLoaded = true;
          isUnlocked = true;
          
          // 显示过期时间信息
          const expiresAt = response.headers.get('X-Expires-At');
          showExpiryDisplay(expiresAt);
          
          showStatus('内容解锁成功', 'success');
          updateCharCount();
        } else if (response.status === 401) {
          showPasswordStatus('密码错误', 'error');
        } else if (response.status === 404) {
          showPasswordStatus('内容不存在或已过期', 'error');
        } else {
          showPasswordStatus('解锁失败', 'error');
        }
      } catch (error) {
        showPasswordStatus('网络错误', 'error');
      }
    }
    
    async function loadContent() {
      // 验证键名
      if (!isValidKey(key)) {
        document.getElementById('password-section').innerHTML = '<p>键名格式无效，只能包含字母、数字、连字符(-)和下划线(_)</p>';
        showStatus('键名格式无效', 'error');
        return;
      }
      
      try {
        const response = await fetch(\`/api/read/\${encodeURIComponent(key)}\`, {
          method: 'GET',
          headers: getHeaders()
        });
        
        if (response.ok) {
          const content = await response.text();
          const isProtected = response.headers.get('X-Password-Protected') === 'true';
          
          if (isProtected) {
            // 保持密码输入区域显示
            // 不需要做任何事情，因为默认就是显示的
          } else {
            // 直接显示内容
            document.getElementById('content').value = content;
            originalContent = content;
            document.getElementById('content').placeholder = '在此编辑您的文本内容...';
            document.getElementById('content').removeAttribute('readonly');
            
            // 隐藏密码区域，显示内容区域
            document.getElementById('password-section').style.display = 'none';
            document.getElementById('content-area').style.display = 'block';
            
            isLoaded = true;
            
            // 显示过期时间信息
            const expiresAt = response.headers.get('X-Expires-At');
            showExpiryDisplay(expiresAt);
            
            showStatus('内容加载成功', 'success');
            updateCharCount();
          }
        } else if (response.status === 401) {
          // 保持密码输入区域显示
          // 不需要做任何事情，因为默认就是显示的
        } else if (response.status === 404) {
          // 直接显示内容区域（新文档）
          document.getElementById('content').placeholder = '这是一个新文档，开始输入内容...';
          document.getElementById('content').removeAttribute('readonly');
          
          // 隐藏密码区域，显示内容区域
          document.getElementById('password-section').style.display = 'none';
          document.getElementById('content-area').style.display = 'block';
          
          isLoaded = true;
          
          showStatus('这是一个新文档', 'success');
          updateCharCount();
        } else if (response.status === 400) {
          const errorMessage = await response.text();
          document.getElementById('password-section').innerHTML = \`<p>\${errorMessage}</p>\`;
          showStatus(errorMessage, 'error');
        } else {
          document.getElementById('password-section').innerHTML = '<p>加载失败，请重试</p>';
          showStatus('加载失败', 'error');
        }
      } catch (error) {
        document.getElementById('password-section').innerHTML = '<p>网络错误，请检查连接</p>';
        showStatus('网络错误', 'error');
      }
    }
    
    async function saveContent() {
      if (!isLoaded || !isUnlocked) {
        showStatus('请先解锁内容', 'error');
        return;
      }
      
      const content = document.getElementById('content').value;
      const expires = document.getElementById('expires').value;
      const password = document.getElementById('password-input').value || '';
      
      // 验证键名
      if (!isValidKey(key)) {
        showStatus('键名格式无效，只能包含字母、数字、连字符(-)和下划线(_)', 'error');
        return;
      }
      
      // 检查内容是否为空
      if (content.trim() === '') {
        showStatus('内容不能为空', 'error');
        return;
      }
      
      try {
        const requestData = {
          password: password,
          expires: expires,
          content: content
        };
        
        const response = await fetch(\`/api/write/\${encodeURIComponent(key)}\`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
          const result = await response.json();
          originalContent = content;
          updateLastSaved();
          showExpiryDisplay(result.expires_at);
          showStatus('保存成功', 'success');
        } else if (response.status === 400) {
          const errorMessage = await response.text();
          showStatus(errorMessage, 'error');
        } else if (response.status === 401) {
          showStatus('密码错误或需要密码', 'error');
        } else {
          showStatus('保存失败', 'error');
        }
      } catch (error) {
        showStatus('网络错误', 'error');
      }
    }
    
    function showExpiryDisplay(expiresAt) {
      const expiryDisplay = document.getElementById('expiry-display');
      
      if (expiresAt) {
        const expiry = new Date(expiresAt);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          let timeLeft = '';
          if (days > 0) timeLeft += \`\${days}天 \`;
          if (hours > 0) timeLeft += \`\${hours}小时 \`;
          if (minutes > 0 && days === 0) timeLeft += \`\${minutes}分钟\`;
          
          expiryDisplay.textContent = \`键名 "\${key}" 将在 \${timeLeft.trim()} 后过期 (\${expiry.toLocaleString()})\`;
        } else {
          expiryDisplay.textContent = \`键名 "\${key}" 已过期\`;
        }
        expiryDisplay.style.display = 'block';
      }
    }
    
    function copyContent() {
      const content = document.getElementById('content').value;
      
      // 检查内容是否为空
      if (content.trim() === '') {
        showStatus('内容不能为空', 'error');
        return;
      }
      
      navigator.clipboard.writeText(content).then(() => {
        showStatus('内容已复制到剪贴板', 'success');
      }).catch(() => {
        showStatus('复制失败', 'error');
      });
    }
    
    async function deleteContent() {
      if (!isUnlocked) {
        showStatus('请先解锁内容', 'error');
        return;
      }
      
      // 验证键名
      if (!isValidKey(key)) {
        showStatus('键名格式无效，只能包含字母、数字、连字符(-)和下划线(_)', 'error');
        return;
      }
      
      if (!confirm('确定要删除这个文档吗？此操作无法撤销。')) {
        return;
      }
      
      try {
        const password = document.getElementById('password-input').value || '';
        const requestData = {
          password: password
        };
        
        const response = await fetch(\`/api/delete/\${encodeURIComponent(key)}\`, {
          method: 'DELETE',
          headers: getHeaders(),
          body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
          document.getElementById('content').value = '';
          originalContent = '';
          updateCharCount();
          
          // 清除过期时间显示
          document.getElementById('expiry-display').style.display = 'none';
          showStatus('删除成功', 'success');
        } else if (response.status === 404) {
          showStatus('文档不存在', 'error');
        } else if (response.status === 401) {
          showStatus('密码错误或需要密码', 'error');
        } else if (response.status === 400) {
          const errorMessage = await response.text();
          showStatus(errorMessage, 'error');
        } else {
          showStatus('删除失败', 'error');
        }
      } catch (error) {
        showStatus('网络错误', 'error');
      }
    }
    
    // 事件监听
    document.getElementById('content').addEventListener('input', function() {
      updateCharCount();
    });
    
    // 自动保存功能
    let saveTimeout;
    document.getElementById('content').addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const content = document.getElementById('content').value;
        if (isLoaded && isUnlocked && content !== originalContent && content.trim() !== '') {
          saveContent();
        }
      }, 2000);
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          const content = document.getElementById('content').value.trim();
          if (isValidKey(key) && content !== '' && isLoaded && isUnlocked) {
            saveContent();
          }
        } else if (e.key === 'c' && e.shiftKey) {
          e.preventDefault();
          const content = document.getElementById('content').value.trim();
          if (isValidKey(key) && content !== '') {
            copyContent();
          }
        }
      }
      
      // 回车键快速解锁
      if (e.key === 'Enter' && document.activeElement.id === 'password-input') {
        e.preventDefault();
        unlockContent();
      }
    });
    
    // 离开页面前提醒保存
    window.addEventListener('beforeunload', function(e) {
      if (isLoaded && document.getElementById('content').value !== originalContent) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
    
    // 页面加载时自动加载内容
    window.addEventListener('load', loadContent);
    
    ${requireAuth ? `
    // 令牌输入后自动重新加载
    document.getElementById('token').addEventListener('input', () => {
      clearTimeout(saveTimeout);
      setTimeout(loadContent, 500);
    });
    ` : ''}
  </script>
</body>
</html>`;
};