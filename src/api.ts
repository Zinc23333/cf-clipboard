// src/api.ts
import { Env } from './types';
import { initDB, cleanupExpired, parseExpiryParam, DEFAULT_EXPIRY } from './database';
import { isValidKey, getKeyValidationError } from './utils';

// 验证token
export const validateToken = (request: Request, env: Env): boolean => {
  if (!env.TOKEN) return true; // 如果没有设置TOKEN，则不需要验证
  
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  return token === env.TOKEN;
};

// 验证密码
export const validatePassword = (storedPassword: string, providedPassword: string | undefined): boolean => {
  // 使用严格相等比较（===）
  // 如果存储的密码是空字符串，则不需要密码验证
  if (storedPassword === '') {
    return true;
  }
  
  // 如果设置了密码，但没有提供密码，则验证失败
  if (providedPassword === undefined || providedPassword === null) {
    return false;
  }
  
  // 比较密码
  return storedPassword === providedPassword;
};

// 验证内容长度
const validateContentLength = (content: string, maxLength?: string): { valid: boolean; error?: string } => {
  // 如果没有设置MAX_CONTENT_LENGTH，则没有限制
  if (!maxLength) {
    return { valid: true };
  }

  // 解析最大长度
  const maxLen = parseInt(maxLength, 10);
  if (isNaN(maxLen) || maxLen <= 0) {
    return { valid: true }; // 如果解析失败或值无效，则无限制
  }

  // 检查内容长度
  if (content.length > maxLen) {
    return { 
      valid: false, 
      error: `Content length exceeds maximum allowed length of ${maxLen} characters` 
    };
  }

  return { valid: true };
};

// 处理API路由
export const handleAPI = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  
  // 检查数据库绑定
  if (!env.DB) {
    console.error('D1 Database binding not found. Please check your wrangler.jsonc configuration.');
    return new Response('Database configuration error', { status: 500 });
  }
  
  // 验证token
  if (!validateToken(request, env)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    await initDB(env.DB);
    // 每次API调用时清理过期内容
    ctx.waitUntil(cleanupExpired(env.DB));
  } catch (error) {
    console.error('Database initialization error:', error);
    return new Response('Database initialization failed', { status: 500 });
  }
  
  if (pathParts[2] === 'read' && pathParts[3] && request.method === 'GET') {
    // GET /api/read/<key>
    const key = pathParts[3];
    
    // 验证键名格式
    const keyValidationError = getKeyValidationError(key);
    if (keyValidationError) {
      return new Response(keyValidationError, { status: 400 });
    }
    
    const now = Date.now();
    const result = await env.DB.prepare('SELECT content, expires_at, created_at, password FROM clipboard WHERE key = ?').bind(key).first();
    
    if (!result) {
      return new Response('Key not found', { status: 404 });
    }
    
    // 检查是否过期（考虑默认过期时间）
    let isExpired = false;
    let effectiveExpiry: number = result.expires_at as number;
    
    if (result.expires_at === null) {
      // 如果未设置过期时间，则使用默认过期时间（创建时间+3天）
      effectiveExpiry = (result.created_at as number) + DEFAULT_EXPIRY;
    }
    
    if (effectiveExpiry < now) {
      isExpired = true;
    }
    
    if (isExpired) {
      return new Response('Key not found or expired', { status: 404 });
    }
    
    // 检查密码 - 如果内容有密码保护，GET请求不能访问
    if (result.password !== '') {
      return new Response('Unauthorized', { status: 401 });
    }
    
    return new Response(result.content as string, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Expires-At': new Date(effectiveExpiry).toISOString(),
        'X-Password-Protected': result.password !== '' ? 'true' : 'false'
      }
    });
  }
  
  if (pathParts[2] === 'read' && pathParts[3] && request.method === 'POST') {
    // POST /api/read/<key> - 支持密码验证的读取
    const key = pathParts[3];
    
    // 验证键名格式
    const keyValidationError = getKeyValidationError(key);
    if (keyValidationError) {
      return new Response(keyValidationError, { status: 400 });
    }
    
    let requestData: any;
    try {
      requestData = await request.json();
    } catch (e) {
      return new Response('Invalid JSON', { status: 400 });
    }
    
    const password = requestData.password;
    
    const now = Date.now();
    const result = await env.DB.prepare('SELECT content, expires_at, created_at, password FROM clipboard WHERE key = ?').bind(key).first();
    
    if (!result) {
      return new Response('Key not found', { status: 404 });
    }
    
    // 检查是否过期（考虑默认过期时间）
    let isExpired = false;
    let effectiveExpiry: number = result.expires_at as number;
    
    if (result.expires_at === null) {
      // 如果未设置过期时间，则使用默认过期时间（创建时间+3天）
      effectiveExpiry = (result.created_at as number) + DEFAULT_EXPIRY;
    }
    
    if (effectiveExpiry < now) {
      isExpired = true;
    }
    
    if (isExpired) {
      return new Response('Key not found or expired', { status: 404 });
    }
    
    // 验证密码
    if (!validatePassword(result.password as string, password)) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    return new Response(result.content as string, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Expires-At': new Date(effectiveExpiry).toISOString(),
        'X-Password-Protected': result.password !== '' ? 'true' : 'false'
      }
    });
  }
  
  if (pathParts[2] === 'write' && pathParts[3] && request.method === 'POST') {
    // POST /api/write/<key> - 写入内容
    const key = pathParts[3];
    
    // 验证键名格式
    const keyValidationError = getKeyValidationError(key);
    if (keyValidationError) {
      return new Response(keyValidationError, { status: 400 });
    }
    
    let requestData: any;
    try {
      requestData = await request.json();
    } catch (e) {
      return new Response('Invalid JSON', { status: 400 });
    }
    
    const password = requestData.password;
    const expires = requestData.expires;
    const content = requestData.content;
    
    // 检查内容是否为空
    if (content === undefined || content === null || content.trim() === '') {
      return new Response('Content cannot be empty', { status: 400 });
    }
    
    // 检查内容长度是否超过限制
    const lengthValidation = validateContentLength(content, env.MAX_CONTENT_LENGTH);
    if (!lengthValidation.valid) {
      return new Response(lengthValidation.error, { status: 400 });
    }
    
    const now = Date.now();
    
    // 先检查键是否已存在且有密码保护
    const existingRecord = await env.DB.prepare('SELECT password FROM clipboard WHERE key = ?').bind(key).first();
    if (existingRecord) {
      // 如果已存在且有密码，则必须提供正确密码才能更新
      if (!validatePassword(existingRecord.password as string, password)) {
        return new Response('Unauthorized', { status: 401 });
      }
    }
    
    // 解析过期时间参数
    const expiryParam = expires || '3d'; // 默认3天
    const expiresAt = parseExpiryParam(expiryParam);
    
    await env.DB.prepare(`
      INSERT INTO clipboard (key, content, password, created_at, updated_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
      content = excluded.content,
      password = CASE 
        WHEN clipboard.password = '' THEN excluded.password
        ELSE clipboard.password
      END,
      updated_at = excluded.updated_at,
      expires_at = excluded.expires_at
    `).bind(key, content, password || '', now, now, expiresAt).run();
    
    const response = {
      message: 'OK',
      expires_at: new Date(expiresAt).toISOString(),
      expires_in: Math.max(0, Math.floor((expiresAt - now) / 1000)) + 's'
    };
    
    return new Response(JSON.stringify(response), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (pathParts[2] === 'delete' && pathParts[3] && request.method === 'DELETE') {
    // DELETE /api/delete/<key>
    const key = pathParts[3];
    
    // 验证键名格式
    const keyValidationError = getKeyValidationError(key);
    if (keyValidationError) {
      return new Response(keyValidationError, { status: 400 });
    }
    
    let requestData: any;
    try {
      requestData = await request.json();
    } catch (e) {
      // 如果没有请求体，使用空对象
      requestData = {};
    }
    
    const password = requestData.password;
    
    // 先查询记录以检查密码
    const record = await env.DB.prepare('SELECT password FROM clipboard WHERE key = ?').bind(key).first();
    
    if (!record) {
      return new Response('Key not found', { status: 404 });
    }
    
    // 验证密码
    if (!validatePassword(record.password as string, password)) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const result = await env.DB.prepare('DELETE FROM clipboard WHERE key = ?').bind(key).run();
    
    // 注意：根据规范，应该使用 result.meta.changes 而不是 result.changes
    if (result.meta.changes === 0) {
      return new Response('Key not found', { status: 404 });
    }
    
    return new Response('OK', { status: 200 });
  }
  
  // GET /api/list - 列出所有有效的键（可选功能）
  if (pathParts[2] === 'list' && request.method === 'GET') {
    const now = Date.now();
    // 先为没有设置过期时间的内容设置默认过期时间
    await env.DB.prepare(`
      UPDATE clipboard 
      SET expires_at = created_at + ? 
      WHERE expires_at IS NULL
    `).bind(DEFAULT_EXPIRY).run();
    
    const results = await env.DB.prepare('SELECT key, created_at, updated_at, expires_at, password FROM clipboard WHERE expires_at > ? ORDER BY updated_at DESC LIMIT 50').bind(now).all();
    
    const items = results.results.map((row: any) => ({
      key: row.key,
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
      expires_at: row.expires_at ? new Date(row.expires_at).toISOString() : null,
      password_protected: row.password !== '',
      content_length: 0 // 不返回实际内容，只返回元数据
    }));
    
    return new Response(JSON.stringify({
      total: items.length,
      items: items
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Not Found', { status: 404 });
};