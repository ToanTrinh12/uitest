/**
 * Utility functions to detect and handle different environments
 */

/**
 * Check if the app is running in Zalo Mini App environment
 */
export function isZaloEnvironment(): boolean {
  return typeof window !== 'undefined' && !!(window as any).APP_ID;
}

/**
 * Check if the app is running in web browser environment
 */
export function isWebEnvironment(): boolean {
  return typeof window !== 'undefined' && !isZaloEnvironment();
}

/**
 * Get environment type
 */
export function getEnvironment(): 'zalo' | 'web' {
  return isZaloEnvironment() ? 'zalo' : 'web';
}

/**
 * Safe wrapper for Zalo SDK functions
 */
export async function safeZaloCall<T>(
  zaloFunction: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    if (isZaloEnvironment()) {
      return await zaloFunction();
    }
    return fallback;
  } catch (error) {
    console.warn('Zalo SDK call failed, using fallback:', error);
    return fallback;
  }
}

/**
 * Mock user data for web environment
 */
export function getMockUserData() {
  return {
    id: "web-user-123",
    name: "Người dùng Web",
    avatar: "https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=U",
    avatarType: "normal" as const
  };
}
