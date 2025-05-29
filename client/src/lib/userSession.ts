// Browser-based user session management
export class UserSession {
  private static readonly USER_ID_KEY = 'plagiarism_detector_user_id';

  static getUserId(): string {
    let userId = localStorage.getItem(this.USER_ID_KEY);
    
    if (!userId) {
      // Generate a unique user ID for this browser
      userId = this.generateUserId();
      localStorage.setItem(this.USER_ID_KEY, userId);
    }
    
    return userId;
  }

  private static generateUserId(): string {
    // Generate a random user ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `user_${timestamp}_${random}`;
  }

  static clearSession(): void {
    localStorage.removeItem(this.USER_ID_KEY);
  }

  static hasSession(): boolean {
    return !!localStorage.getItem(this.USER_ID_KEY);
  }
}