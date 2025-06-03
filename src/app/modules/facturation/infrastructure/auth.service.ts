import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  private getStorage(): Storage | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage;
    }
    return null;
  }

  setToken(token: string): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    const storage = this.getStorage();
    if (storage) {
      return storage.getItem(this.tokenKey);
    }
    return null;
  }

  removeToken(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(this.tokenKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
} 