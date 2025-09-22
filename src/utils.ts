// src/utils.ts
// 工具函数

// 验证键名格式（只允许字母、数字、连字符和下划线）
export const isValidKey = (key: string): boolean => {
  // 检查键名是否为空
  if (!key) {
    return false;
  }
  
  // 使用正则表达式验证键名格式
  // 只允许字母（大小写）、数字、连字符(-)和下划线(_)
  const keyRegex = /^[a-zA-Z0-9_-]+$/;
  return keyRegex.test(key);
};

// 验证并返回标准化的键名错误信息
export const getKeyValidationError = (key: string): string | null => {
  if (!key) {
    return '键名不能为空';
  }
  
  if (!isValidKey(key)) {
    return '键名只能包含字母、数字、连字符(-)和下划线(_)';
  }
  
  return null;
};