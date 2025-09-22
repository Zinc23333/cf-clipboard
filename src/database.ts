// src/database.ts
import { Env, ClipboardEntry } from './types';

// 过期时间选项（毫秒）
export const EXPIRY_OPTIONS = {
  '1h': 60 * 60 * 1000,           // 1小时
  '12h': 12 * 60 * 60 * 1000,     // 12小时
  '1d': 24 * 60 * 60 * 1000,      // 1天
  '3d': 3 * 24 * 60 * 60 * 1000,  // 3天
  '7d': 7 * 24 * 60 * 60 * 1000   // 7天
};

// 默认过期时间（3天）
export const DEFAULT_EXPIRY = 3 * 24 * 60 * 60 * 1000;

// 初始化数据库表
export const initDB = async (db: D1Database) => {
  if (!db) {
    throw new Error('Database not available. Please check your D1 binding configuration.');
  }
  
  try {
    // 创建带 expires_at 和 password 字段的表（如果不存在）
    // password字段默认为空字符串而不是NULL
    await db.exec('CREATE TABLE IF NOT EXISTS clipboard (key TEXT PRIMARY KEY, content TEXT NOT NULL, password TEXT DEFAULT \'\', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, expires_at INTEGER)');
    
    // 检查并添加 expires_at 列（如果表已存在但没有该列）
    try {
      await db.exec('ALTER TABLE clipboard ADD COLUMN expires_at INTEGER');
    } catch (e) {
      // 列可能已经存在，忽略错误
      // D1 不支持 IF NOT EXISTS 用于 ALTER TABLE ADD COLUMN
    }
    
    // 检查并添加 password 列（如果表已存在但没有该列）
    try {
      await db.exec('ALTER TABLE clipboard ADD COLUMN password TEXT DEFAULT \'\'');
    } catch (e) {
      // 列可能已经存在，忽略错误
    }
    
    // 为已存在的记录设置默认密码为空字符串（而不是NULL）
    await db.exec('UPDATE clipboard SET password = \'\' WHERE password IS NULL');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// 清理过期内容
export const cleanupExpired = async (db: D1Database) => {
  // 确保在清理前先初始化数据库
  await initDB(db);
  
  try {
    const now = Date.now();
    // 为没有设置过期时间的内容设置默认过期时间（创建时间+3天）
    await db.prepare(`
      UPDATE clipboard 
      SET expires_at = created_at + ? 
      WHERE expires_at IS NULL
    `).bind(DEFAULT_EXPIRY).run();
    
    // 删除所有已过期的内容
    const result = await db.prepare('DELETE FROM clipboard WHERE expires_at < ?').bind(now).run();
    // 注意：根据规范，应该使用 result.meta.changes 而不是 result.changes
    if (result.meta.changes > 0) {
      console.log(`Cleaned up ${result.meta.changes} expired entries`);
    }
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
};

// 解析过期时间参数
export const parseExpiryParam = (expiryParam: string | null): number => {
  const duration = EXPIRY_OPTIONS[expiryParam as keyof typeof EXPIRY_OPTIONS];
  if (duration === undefined) {
    return Date.now() + EXPIRY_OPTIONS['3d']; // 默认3天
  }
  
  return Date.now() + duration;
};