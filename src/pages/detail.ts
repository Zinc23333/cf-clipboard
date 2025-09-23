import { Env } from '../types';
import { t } from '../i18n';

// 生成详细页面HTML
export const generateDetailPage = (key: string, env: Env) => {
  const requireAuth = !!(env as any).TOKEN;
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title data-i18n="detail.title">${t('detail.title')} - ${key}</title>
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
      max-width: 900px;
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
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .title {
      color: #2d3748;
    }
    
    body.dark-mode .title {
      color: #e2e8f0;
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
      font-size: 1.2rem;
    }
    
    body.dark-mode .title .key-name {
      background: #2d3748;
      color: #667eea;
    }
    
    .nav-buttons {
      display: flex;
      gap: 10px;
      align-items: center;
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
    
    body.dark-mode .btn-outline {
      color: #e2e8f0;
      border: 2px solid #4a5568;
    }
    
    .btn-outline:hover {
      background: #f7fafc;
      border-color: #cbd5e0;
    }
    
    body.dark-mode .btn-outline:hover {
      background: #4a5568;
      border-color: #718096;
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
      background: white;
      color: #2d3748;
    }
    
    body.dark-mode .auth-section input {
      background: #2d3748;
      border-color: #4a5568;
      color: #e2e8f0;
    }
    
    body.dark-mode .auth-section input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
    }
    ` : ''}
    
    .editor-header {
      margin-bottom: 15px;
      padding: 15px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    body.dark-mode .editor-header {
      background: #2d3748;
      border: 1px solid #4a5568;
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
    
    body.dark-mode .editor-controls label {
      color: #e2e8f0;
    }
    
    .editor-controls select {
      flex: 1;
      max-width: 200px;
      padding: 8px 12px;
      border: 1px solid #cbd5e0;
      border-radius: 6px;
      font-size: 14px;
      background: white;
      color: #2d3748;
    }
    
    body.dark-mode .editor-controls select {
      background: #2d3748;
      border: 1px solid #4a5568;
      color: #e2e8f0;
    }
    
    .expiry-display {
      font-size: 14px;
      color: #2d3748;
      padding: 8px 12px;
      background: #e6fffa;
      border: 1px solid #81e6d9;
      border-radius: 6px;
    }
    
    body.dark-mode .expiry-display {
      background: #234e52;
      border: 1px solid #81e6d9;
      color: #e6fffa;
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
      color: #2d3748;
    }
    
    body.dark-mode .editor textarea {
      background: #2d3748;
      border: 2px solid #4a5568;
      color: #e2e8f0;
    }
    
    .editor textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    body.dark-mode .editor textarea:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
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
    
    body.dark-mode .editor-info {
      color: #a0aec0;
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
    
    .loading {
      text-align: center;
      color: #718096;
      font-style: italic;
      padding: 40px 20px;
    }
    
    body.dark-mode .loading {
      color: #a0aec0;
    }
    
    .loading p {
      margin: 0;
      font-size: 16px;
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
    
    body.dark-mode .password-section h3 {
      color: #e2e8f0;
    }
    
    .password-section p {
      color: #718096;
      margin-bottom: 20px;
    }
    
    body.dark-mode .password-section p {
      color: #a0aec0;
    }
    
    .password-section input {
      width: 100%;
      max-width: 300px;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 16px;
      margin-bottom: 20px;
      background: white;
      color: #2d3748;
    }
    
    body.dark-mode .password-section input {
      background: #2d3748;
      border: 2px solid #4a5568;
      color: #e2e8f0;
    }
    
    .password-section input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    body.dark-mode .password-section input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
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
    
    body.dark-mode .password-section .status.error {
      background: #742a2a;
      color: #fed7d7;
      border: 1px solid #feb2b2;
    }
    
    .password-section .status.success {
      background: #f0fff4;
      color: #22543d;
      border: 1px solid #9ae6b4;
    }
    
    body.dark-mode .password-section .status.success {
      background: #22543d;
      color: #f0fff4;
      border: 1px solid #9ae6b4;
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
      box-sizing: border-box;
    }
    
    .theme-toggle:hover {
      background-color: rgba(0, 0, 0, 0.1);
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    body.dark-mode .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
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
      <div class="title">
        <h1 data-i18n="detail.title">📋 ${t('detail.title')}</h1>
        <div class="key-name">${key}</div>
      </div>
      <div class="nav-buttons">
        <a href="/" class="btn btn-outline" data-i18n="detail.notFound.create">← ${t('detail.notFound.create')}</a>
        <button class="theme-toggle" id="themeToggle" aria-label="${t('btn.themeToggle')}" data-i18n="btn.themeToggle|aria-label">🌙</button>
      </div>
    </div>
    
    ${requireAuth ? `
    <div class="auth-section">
      <input type="password" id="token" placeholder="${t('detail.token.placeholder')}" data-i18n="detail.token.placeholder|placeholder">
    </div>
    ` : ''}
    
    <!-- 加载状态 -->
    <div class="loading" id="loading-section">
      <p data-i18n="detail.loading">${t('detail.loading')}</p>
    </div>
    
    <!-- 密码输入区域（默认隐藏） -->
    <div class="password-section" id="password-section" style="display: none;">
      <h3 data-i18n="detail.password.title">${t('detail.password.title')}</h3>
      <p data-i18n="detail.password.description">${t('detail.password.description')}</p>
      <input type="password" id="password-input" placeholder="${t('detail.password.placeholder')}" data-i18n="detail.password.placeholder|placeholder">
      <button class="btn btn-secondary" onclick="unlockContent()" data-i18n="detail.password.submit">${t('detail.password.submit')}</button>
      <div class="status" id="password-status"></div>
    </div>
    
    <!-- 内容区域（默认隐藏） -->
    <div id="content-area" style="display: none;">
      <div class="editor-header">
        <div class="editor-controls">
          <label for="expires" data-i18n="expires.label">${t('expires.label')}：</label>
          <select id="expires">
            <option value="1h" data-i18n="expires.1h">${t('expires.1h')}</option>
            <option value="12h" data-i18n="expires.12h">${t('expires.12h')}</option>
            <option value="1d" data-i18n="expires.1d">${t('expires.1d')}</option>
            <option value="3d" selected data-i18n="expires.3d">${t('expires.3d')}</option>
            <option value="7d" data-i18n="expires.7d">${t('expires.7d')}</option>
          </select>
        </div>
        <div class="expiry-display" id="expiry-display" style="display: none;"></div>
      </div>
      
      <div class="editor">
        <textarea id="content" placeholder="${t('detail.content.loading')}" readonly data-i18n="detail.content.loading|placeholder"></textarea>
      </div>
      
      <div class="editor-actions">
        <div class="editor-info">
          <span id="char-count">${t('detail.charCount').replace('{count}', '0')}</span> | 
          <span id="last-saved">${t('detail.lastSaved').replace('{time}', t('status.notSaved'))}</span>
        </div>
        <div class="action-buttons">
          <button class="btn btn-secondary" onclick="saveContent()" id="save-btn" data-i18n="detail.toolbar.save">${t('detail.toolbar.save')}</button>
          <button class="btn btn-primary" onclick="copyContent()" id="copy-btn" data-i18n="detail.toolbar.copy">${t('detail.toolbar.copy')}</button>
          <button class="btn btn-danger" onclick="deleteContent()" id="delete-btn" data-i18n="detail.toolbar.delete">${t('detail.toolbar.delete')}</button>
        </div>
      </div>
    </div>
    
    <div class="status" id="status"></div>
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
    
    function showPasswordStatus(message, type) {
      const status = document.getElementById('password-status');
      status.textContent = message;
      status.className = 'status ' + type;
      status.style.display = 'block';
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    }
    
    function updateCharCount() {
      const content = document.getElementById('content').value;
      document.getElementById('char-count').textContent = \`${t('detail.charCount').replace('{count}', '\${content.length}')}\`;
    }
    
    function updateLastSaved() {
      const now = new Date();
      document.getElementById('last-saved').textContent = t('detail.lastSaved').replace('{time}', now.toLocaleTimeString());
    }
    
    // 解锁受保护的内容
    async function unlockContent() {
      const password = document.getElementById('password-input').value;
      
      if (!password) {
        showPasswordStatus('${t('detail.password.error')}', 'error');
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
          document.getElementById('content').placeholder = '${t('detail.content.edit')}';
          document.getElementById('content').removeAttribute('readonly');
          
          // 隐藏密码区域，显示内容区域
          document.getElementById('loading-section').style.display = 'none';
          document.getElementById('password-section').style.display = 'none';
          document.getElementById('content-area').style.display = 'block';
          
          isLoaded = true;
          isUnlocked = true;
          
          // 显示过期时间信息
          const expiresAt = response.headers.get('X-Expires-At');
          showExpiryDisplay(expiresAt);
          
          showStatus('${t('detail.save.success')}', 'success');
          updateCharCount();
        } else if (response.status === 401) {
          showPasswordStatus('${t('detail.password.error')}', 'error');
        } else if (response.status === 404) {
          showPasswordStatus('${t('detail.notFound.description')}', 'error');
        } else {
          showPasswordStatus('${t('detail.save.error')}', 'error');
        }
      } catch (error) {
        showPasswordStatus('${t('status.network.error')}', 'error');
      }
    }
    
    async function loadContent() {
      // 首先隐藏所有区域，显示加载状态
      document.getElementById('loading-section').style.display = 'block';
      document.getElementById('password-section').style.display = 'none';
      document.getElementById('content-area').style.display = 'none';
      
      hideExpiryInfo();
      
      // 验证键名
      if (!isValidKey(key)) {
        document.getElementById('loading-section').innerHTML = '<p>${t('key.error.invalid')}</p>';
        showStatus('${t('key.error.invalid')}', 'error');
        return;
      }
      
      try {
        const response = await fetch(\`/api/read/\${encodeURIComponent(key)}\`, {
          method: 'GET',
          headers: getHeaders()
        });
        
        if (response.ok) {
          const content = await response.text();
          
          // 直接显示内容
          document.getElementById('content').value = content;
          originalContent = content;
          document.getElementById('content').placeholder = '${t('detail.content.edit')}';
          document.getElementById('content').removeAttribute('readonly');
          
          // 隐藏加载区域和密码区域，显示内容区域
          document.getElementById('loading-section').style.display = 'none';
          document.getElementById('password-section').style.display = 'none';
          document.getElementById('content-area').style.display = 'block';
          
          isLoaded = true;
          
          // 显示过期时间信息
          const expiresAt = response.headers.get('X-Expires-At');
          showExpiryDisplay(expiresAt);
          
          showStatus('${t('detail.save.success')}', 'success');
          updateCharCount();
        } else if (response.status === 401) {
          // 需要密码，显示密码输入区域
          document.getElementById('loading-section').style.display = 'none';
          document.getElementById('password-section').style.display = 'block';
          document.getElementById('content-area').style.display = 'none';
        } else if (response.status === 404) {
          // 直接显示内容区域（新文档）
          document.getElementById('content').placeholder = '${t('detail.content.new')}';
          document.getElementById('content').removeAttribute('readonly');
          
          // 隐藏加载区域和密码区域，显示内容区域
          document.getElementById('loading-section').style.display = 'none';
          document.getElementById('password-section').style.display = 'none';
          document.getElementById('content-area').style.display = 'block';
          
          isLoaded = true;
          
          showStatus('${t('detail.notFound.title')}', 'success');
          updateCharCount();
        } else if (response.status === 400) {
          const errorMessage = await response.text();
          document.getElementById('loading-section').innerHTML = \`<p>\${errorMessage}</p>\`;
          showStatus(errorMessage, 'error');
        } else {
          document.getElementById('loading-section').innerHTML = '<p>${t('detail.save.error')}</p>';
          showStatus('${t('detail.save.error')}', 'error');
        }
      } catch (error) {
        document.getElementById('loading-section').innerHTML = '<p>${t('status.network.error')}</p>';
        showStatus('${t('status.network.error')}', 'error');
      }
    }
    
    async function saveContent() {
      hideExpiryInfo();
      if (!isLoaded || !isUnlocked) {
        showStatus('${t('detail.password.title')}', 'error');
        return;
      }
      
      const contentElement = document.getElementById('content');
      const expiresElement = document.getElementById('expires');
      const passwordInputElement = document.getElementById('password-input');
      
      if (!(contentElement instanceof HTMLTextAreaElement) || 
          !(expiresElement instanceof HTMLSelectElement)) {
        showStatus('${t('status.error')}', 'error');
        return;
      }
      
      const content = contentElement.value;
      const expires = expiresElement.value;
      const password = passwordInputElement instanceof HTMLInputElement ? passwordInputElement.value : '';
      
      // 验证键名
      if (!isValidKey(key)) {
        showStatus('${t('key.error.invalid')}', 'error');
        return;
      }
      
      // 检查内容是否为空
      if (content.trim() === '') {
        showStatus('${t('content.error.empty')}', 'error');
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
          showStatus('${t('detail.save.success')}', 'success');
        } else if (response.status === 400) {
          const errorMessage = await response.text();
          showStatus(errorMessage, 'error');
        } else if (response.status === 401) {
          showStatus('${t('status.read.wrongPassword')}', 'error');
        } else {
          showStatus('${t('detail.save.error')}', 'error');
        }
      } catch (error) {
        showStatus('${t('status.network.error')}', 'error');
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
          if (days > 0) timeLeft += \`\${days}\${t('time.day')} \`;
          if (hours > 0) timeLeft += \`\${hours}\${t('time.hour')} \`;
          if (minutes > 0 && days === 0) timeLeft += \`\${minutes}\${t('time.minute')}\`;
          
          expiryDisplay.textContent = \`${t('detail.expiry.remaining', 'zh').replace('{key}', key).replace('{timeLeft}', '\${timeLeft.trim()}').replace('{expiry}', '\${expiry.toLocaleString()}')}\`;
        } else {
          expiryDisplay.textContent = \`${t('detail.expiry.expired', 'zh').replace('{key}', key)}\`;
        }
        expiryDisplay.style.display = 'block';
      }
    }
    
    function hideExpiryInfo() {
      const expiryDisplay = document.getElementById('expiry-display');
      if (expiryDisplay) {
        expiryDisplay.style.display = 'none';
      }
    }
    
    function copyContent() {
      const content = document.getElementById('content').value;
      
      // 检查内容是否为空
      if (content.trim() === '') {
        showStatus('${t('content.error.empty')}', 'error');
        return;
      }
      
      navigator.clipboard.writeText(content).then(() => {
        showStatus('${t('detail.copy.success')}', 'success');
      }).catch(() => {
        showStatus('${t('status.copy.failed')}', 'error');
      });
    }
    
    async function deleteContent() {
      hideExpiryInfo();
      if (!isUnlocked) {
        showStatus('${t('detail.password.title')}', 'error');
        return;
      }
      
      // 验证键名
      if (!isValidKey(key)) {
        showStatus('${t('key.error.invalid')}', 'error');
        return;
      }
      
      if (!confirm('${t('detail.delete.confirm')}')) {
        return;
      }
      
      try {
        const passwordInputElement = document.getElementById('password-input');
        const password = passwordInputElement instanceof HTMLInputElement ? passwordInputElement.value : '';
        
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
          showStatus('${t('detail.delete.success')}', 'success');
        } else if (response.status === 404) {
          showStatus('${t('status.delete.notFound')}', 'error');
        } else if (response.status === 401) {
          showStatus('${t('status.read.wrongPassword')}', 'error');
        } else if (response.status === 400) {
          const errorMessage = await response.text();
          showStatus(errorMessage, 'error');
        } else {
          showStatus('${t('detail.delete.error')}', 'error');
        }
      } catch (error) {
        showStatus('${t('status.network.error')}', 'error');
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
    document.addEventListener('DOMContentLoaded', () => {
      // 确保初始状态正确设置
      document.getElementById('loading-section').style.display = 'block';
      document.getElementById('password-section').style.display = 'none';
      document.getElementById('content-area').style.display = 'none';
      
      loadContent();
    });
    
    ${requireAuth ? `
    // 令牌输入后自动重新加载
    document.getElementById('token').addEventListener('input', () => {
      clearTimeout(saveTimeout);
      setTimeout(() => {
        // 重新加载前重置状态
        document.getElementById('loading-section').style.display = 'block';
        document.getElementById('password-section').style.display = 'none';
        document.getElementById('content-area').style.display = 'none';
        document.getElementById('status').style.display = 'none';
        
        loadContent();
      }, 500);
    });
    ` : ''}
  </script>
</body>
</html>`;
};