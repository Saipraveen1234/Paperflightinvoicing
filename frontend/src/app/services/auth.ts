import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    // Check local storage for persistence
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.isLoggedInSubject.next(true);
    }
  }

  login(password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { password }).pipe(
      tap((response: any) => {
        if (response.success) {
          localStorage.setItem('user', 'partner');
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, { currentPassword, newPassword });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }
}

