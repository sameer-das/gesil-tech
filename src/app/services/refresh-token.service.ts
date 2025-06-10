import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RefreshTokenService {
    constructor(private http: HttpClient, private router: Router) { }

    private refreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);


    get refreshTokenInProgress(): boolean {
        return this.refreshing;
    }

    set refreshTokenInProgress(value: boolean) {
        this.refreshing = value;
    }

    getRefreshTokenSubject(): BehaviorSubject<string | null> {
        return this.refreshTokenSubject;
    }

    getAccessToken(): string | null {
        return localStorage.getItem('jwt');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    setTokens(access: string, refresh: string): void {
        localStorage.setItem('jwt', access);
        localStorage.setItem('refreshToken', refresh);
    }


    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Navigate to login or handle logout
        this.router.navigate(['/login'])
    }


    refreshToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        const accessToken = this.getAccessToken();

        if (!refreshToken) {
            return throwError(() => new Error('No refresh token'));
        }

        return this.http.post<any>(`${environment.service_base_url}${environment.refreshToken}`, {
            accessToken,
            refreshToken
        }).pipe(
            tap((tokens) => {
                this.setTokens(tokens.accessToken, tokens.refreshToken);
                this.refreshTokenSubject.next(tokens.accessToken);
            }),
            catchError((err) => {
                console.log(err)
                this.logout();
                return throwError(() => err);
            })
        );
    }
}