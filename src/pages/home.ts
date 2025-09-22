import { Env } from '../types';

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
      transition: background 0.3s ease;
    }
    
    body.dark-mode {
      background: linear-gradient(135deg, #2d3748 0%, #2c1a4d 100%);
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      transition: background 0.3s ease, box-shadow 0.3s ease;
      position: relative;
    }
    
    body.dark-mode .container {
      background: rgba(45, 55, 72, 0.95);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    
    .header-content {
      flex: 1;
      text-align: center;
    }
    
    .header-actions {
      width: 40px;
      display: flex;
      justify-content: flex-end;
    }
    
    .header h1 {
      color: #2d3748;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    body.dark-mode .header h1 {
      color: #e2e8f0;
    }
    
    .header p {
      color: #718096;
      font-size: 1.1rem;
    }
    
    body.dark-mode .header p {
      color: #cbd5e0;
    }
    
    .theme-toggle {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.5rem;
      padding: 5px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .theme-toggle:hover {
      background-color: rgba(0, 0, 0, 0.1);
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    body.dark-mode .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
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
    
    body.dark-mode label {
      color: #e2e8f0;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: white;
      color: #2d3748;
    }
    
    body.dark-mode input,
    body.dark-mode textarea,
    body.dark-mode select {
      background: #2d3748;
      border-color: #4a5568;
      color: #e2e8f0;
    }
    
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    body.dark-mode input:focus,
    body.dark-mode textarea:focus,
    body.dark-mode select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
    }
    
    /* 新增输入框按钮组样式 */
    .input-group {
      display: flex;
      gap: 8px;
    }
    
    .input-group input {
      flex: 1;
      margin-bottom: 0;
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
    
    /* 功能按钮基础样式 */
    .btn-action {
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
    
    .btn-action:disabled {
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
    
    /* 图标按钮样式 */
    .btn-icon {
      background: #edf2f7;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 0;
      width: 45px;
      height: 45px;
      min-width: 45px;
      min-height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 0 0 auto;
      box-sizing: border-box;
    }
    
    body.dark-mode .btn-icon {
      background: #4a5568;
      border-color: #4a5568;
      color: #e2e8f0;
    }
    
    .btn-icon:hover {
      background: #e2e8f0;
      transform: translateY(-2px);
    }
    
    body.dark-mode .btn-icon:hover {
      background: #718096;
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
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
    
    body.dark-mode .status.success {
      background: #22543d;
      color: #f0fff4;
      border: 1px solid #9ae6b4;
    }
    
    .status.error {
      background: #fed7d7;
      color: #742a2a;
      border: 1px solid #feb2b2;
    }
    
    body.dark-mode .status.error {
      background: #742a2a;
      color: #fed7d7;
      border: 1px solid #feb2b2;
    }
    
    .expiry-info {
      margin-top: 15px;
      padding: 10px 16px;
      background: #e6fffa;
      border: 1px solid #81e6d9;
      border-radius: 6px;
      font-size: 16px;
      color: #234e52;
    }
    
    body.dark-mode .expiry-info {
      background: #234e52;
      border: 1px solid #81e6d9;
      color: #e6fffa;
    }
    
    .expiry-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .expiry-status::before {
      content: '⏰';
    }
    
    /* 为复制链接按钮添加特殊样式 */
    .copy-link-btn {
      background: none !important;
      border: none !important;
      box-shadow: none !important;
      margin-left: auto;
      font-size: 18px; /* 与提示文本字体大小一致 */
      width: 24px;
      height: 24px;
      min-width: 24px;
      min-height: 24px;
      padding: 0;
    }
    
    .copy-link-btn:hover {
      background: rgba(0, 0, 0, 0.05) !important;
      transform: scale(1.1);
    }
    
    body.dark-mode .copy-link-btn:hover {
      background: rgba(255, 255, 255, 0.1) !important;
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
    
    body.dark-mode .quick-actions {
      border-top: 2px solid #4a5568;
    }
    
    .quick-actions h3 {
      color: #2d3748;
      margin-bottom: 15px;
    }
    
    body.dark-mode .quick-actions h3 {
      color: #e2e8f0;
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
      font-size: 16px;
    }
    
    body.dark-mode .quick-link {
      background: #4a5568;
      color: #e2e8f0;
    }
    
    .quick-link:hover {
      background: #667eea;
      color: white;
      transform: translateY(-1px);
    }
    
    body.dark-mode .quick-link:hover {
      background: #667eea;
      color: white;
    }
    
    /* 模态框样式 */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .modal.show {
      opacity: 1;
      visibility: visible;
    }
    
    .modal-content {
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 500px;
      transform: translateY(-50px);
      transition: transform 0.3s ease;
    }
    
    .modal.show .modal-content {
      transform: translateY(0);
    }
    
    body.dark-mode .modal-content {
      background: #2d3748;
      color: #e2e8f0;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
    }
    
    body.dark-mode .modal-header {
    }
    
    .modal-header h3 {
      margin: 0;
      color: #2d3748;
    }
    
    body.dark-mode .modal-header h3 {
      color: #e2e8f0;
    }
    
    .close {
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
      color: #718096;
      transition: color 0.2s;
    }
    
    .close:hover {
      color: #2d3748;
    }
    
    body.dark-mode .close:hover {
      color: #e2e8f0;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .modal-body p {
      margin: 0;
      color: #4a5568;
      line-height: 1.6;
    }
    
    body.dark-mode .modal-body p {
      color: #cbd5e0;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 20px;
    }
    
    body.dark-mode .modal-footer {
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
      
      .theme-toggle {
        top: 10px;
        right: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-actions"></div>
      <div class="header-content">
        <h1>📋 CF Clipboard</h1>
        <p>基于 Cloudflare Workers 的网络文本共享服务</p>
      </div>
      <div class="header-actions">
        <button class="theme-toggle" id="themeToggle" aria-label="切换主题">🌙</button>
      </div>
    </div>
    
    ${requireAuth ? `
    <div class="form-group">
      <label for="token">🔐 授权令牌</label>
      <input type="password" id="token" placeholder="请输入访问令牌">
    </div>
    ` : ''}
    
    <div class="form-group">
      <label for="key">🔑 存储键名</label>
      <div class="input-group">
        <input type="text" id="key" placeholder="请输入键名，例如：my-note">
        <button class="btn-icon" onclick="generateRandomKey()" title="生成随机键名">🎲</button>
        <button class="btn-icon" onclick="copyKey()" title="复制键名">📋</button>
      </div>
      <div id="key-error" style="color: #e53e3e; font-size: 16px; margin-top: 5px; display: none;"></div>
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
      <button class="btn-action btn-primary" onclick="readContent()" id="read-btn">📖 读取</button>
      <button class="btn-action btn-secondary" onclick="writeContent()" id="write-btn">💾 写入</button>
      <button class="btn-action btn-danger" onclick="deleteContent()" id="delete-btn">🗑️ 删除</button>
    </div>
    
    <div class="status" id="status"></div>
    
    <div class="expiry-info" id="expiry-info" style="display: none;">
      <div class="expiry-status">
        <span id="expiry-text"></span>
        <button class="btn-icon copy-link-btn" id="copy-detail-link" title="复制详情页链接" style="display: none;">📋</button>
      </div>
    </div>
    
    <div class="quick-actions" style="display: none;">
      <h3>🚀 快速操作</h3>
      <a href="javascript:copyCurrentUrl()" class="quick-link" id="copy-link">复制链接</a>
      <a href="javascript:generateRandomKey()" class="quick-link">随机键名</a>
    </div>
    
    <!-- 删除确认模态框 -->
    <div id="delete-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>确认删除</h3>
          <span class="close" id="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <p>确定要删除键名 "<span id="delete-key-name"></span>" 的内容吗？此操作无法撤销。</p>
        </div>
        <div class="modal-footer">
          <button class="btn-action btn-secondary" id="cancel-delete">取消</button>
          <button class="btn-action btn-danger" id="confirm-delete">删除</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    // 主题切换功能
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // 检查用户之前选择的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
      themeToggle.textContent = '☀️';
    }
    
    // 切换主题
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      
      // 保存用户选择的主题
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
      } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
      }
    });
    
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
      const copyDetailLinkBtn = document.getElementById('copy-detail-link');
      
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
        
        // 设置复制按钮的键名属性并显示
        copyDetailLinkBtn.setAttribute('data-key', key);
        copyDetailLinkBtn.style.display = 'inline-flex';
        expiryInfo.style.display = 'block';
      }
    }
    
    function hideExpiryInfo() {
      document.getElementById('expiry-info').style.display = 'none';
      const copyDetailLinkBtn = document.getElementById('copy-detail-link');
      if (copyDetailLinkBtn) {
        copyDetailLinkBtn.style.display = 'none';
      }
    }
    
    // 添加复制详情页链接的函数
    function copyDetailLink() {
      const copyDetailLinkBtn = document.getElementById('copy-detail-link');
      const key = copyDetailLinkBtn.getAttribute('data-key');
      
      if (!key) {
        showStatus('无法获取键名', 'error');
        return;
      }
      
      const url = window.location.origin + '/detail/' + encodeURIComponent(key);
      navigator.clipboard.writeText(url).then(() => {
        showStatus('详情页链接已复制到剪贴板', 'success');
      }).catch(() => {
        showStatus('复制失败', 'error');
      });
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
      
      // 显示自定义模态框
      showDeleteModal(key);
    }
    
    // 显示删除确认模态框
    function showDeleteModal(key) {
      const modal = document.getElementById('delete-modal');
      const deleteKeyName = document.getElementById('delete-key-name');
      
      if (!modal || !deleteKeyName) {
        // 如果模态框元素不存在，回退到使用confirm
        if (confirm('确定要删除这个键的内容吗？')) {
          performDelete(key);
        }
        return;
      }
      
      deleteKeyName.textContent = key;
      
      // 显示模态框
      modal.classList.add('show');
      
      // 更新确认按钮上的键名数据
      const confirmDelete = document.getElementById('confirm-delete');
      if (confirmDelete) {
        confirmDelete.setAttribute('data-key', key);
      }
    }
    
    // 执行实际的删除操作
    async function performDelete(key) {
      const password = document.getElementById('password').value || '';
      
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
          hideExpiryInfo(); // 只有在键名不存在时才隐藏过期信息
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
    
    // 复制键名函数
    function copyKey() {
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
      
      navigator.clipboard.writeText(key).then(() => {
        showStatus('键名已复制到剪贴板', 'success');
      }).catch(() => {
        showStatus('复制失败', 'error');
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
    
    // 在 DOMContentLoaded 事件中添加复制按钮的事件监听器
    document.addEventListener('DOMContentLoaded', function() {
      updateButtonStates();
      
      // 添加复制详情页链接按钮的事件监听器
      const copyDetailLinkBtn = document.getElementById('copy-detail-link');
      if (copyDetailLinkBtn) {
        copyDetailLinkBtn.addEventListener('click', copyDetailLink);
      }
      
      // 为模态框按钮添加事件监听器
      const closeModal = document.getElementById('close-modal');
      const cancelDelete = document.getElementById('cancel-delete');
      const confirmDelete = document.getElementById('confirm-delete');
      
      if (closeModal) {
        closeModal.addEventListener('click', function() {
          document.getElementById('delete-modal').classList.remove('show');
        });
      }
      
      if (cancelDelete) {
        cancelDelete.addEventListener('click', function() {
          document.getElementById('delete-modal').classList.remove('show');
        });
      }
      
      if (confirmDelete) {
        confirmDelete.addEventListener('click', function() {
          const key = this.getAttribute('data-key') || document.getElementById('delete-key-name').textContent;
          document.getElementById('delete-modal').classList.remove('show');
          performDelete(key);
        });
      }
      
      // 点击模态框外部区域关闭模态框
      const modal = document.getElementById('delete-modal');
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            modal.classList.remove('show');
          }
        });
        
        // 按ESC键关闭模态框
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
          }
        });
      }
    });
  </script>
</body>
</html>`;
};