// Condensed comment block.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto } from '../models/recipe.model';

// Comment block removed.
@Injectable({ providedIn: 'root' })
export class AuthService {
    // Base URL for the backend API
    // In production, this would come from environment configuration
    private apiUrl = 'http://localhost:5147/api/auth';

    constructor(private http: HttpClient) { }

    // Comment block removed.
    register(dto: RegisterDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, dto).pipe(
            tap(response => this.storeToken(response))
        );
    }

    // Comment block removed.
    login(dto: LoginDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dto).pipe(
            tap(response => this.storeToken(response))
        );
    }

    // Comment block removed.
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('fullName');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
    }

    // Comment block removed.
    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    // Comment block removed.
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAdmin(): boolean {
        return localStorage.getItem('role') === 'Admin';
    }

    // Comment block removed.
    getUserId(): number {
        return parseInt(localStorage.getItem('userId') || '0', 10);
    }

    // Comment block removed.
    getFullName(): string {
        return localStorage.getItem('fullName') || '';
    }

    // Comment block removed.
    private storeToken(response: AuthResponse): void {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId.toString());
        localStorage.setItem('fullName', response.fullName);
        localStorage.setItem('email', response.email);
        localStorage.setItem('role', response.role || 'User');
    }
}
