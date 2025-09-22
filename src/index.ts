// src/index.ts
import { Env } from './types';
import { handleAPI } from './api';
import { generateHomePage } from './pages/home';
import { generateDetailPage } from './pages/detail';
import { cleanupExpired } from './database';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // API 路由
    if (path.startsWith('/api/')) {
      return handleAPI(request, env, ctx);
    }
    
    // 详情页路由 /detail/<key>
    if (path.startsWith('/detail/')) {
      const key = path.substring(8); // 移除 '/detail/'
      if (key) {
        return new Response(generateDetailPage(decodeURIComponent(key), env), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
    }
    
    // 主页路由
    if (path === '/') {
      return new Response(generateHomePage(env), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // 404 页面
    return new Response('Not Found', { status: 404 });
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    try {
      // 执行定期清理任务
      await cleanupExpired(env.DB);
      console.log('Scheduled cleanup completed successfully');
    } catch (error) {
      console.error('Scheduled cleanup failed:', error);
    }
  }
};