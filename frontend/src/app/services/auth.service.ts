import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponse, RegisterEtudiantRequest, RegisterEntrepriseRequest, User, RoleEnum } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private TOKEN_KEY = 'unistage_jwt_token';
  private USER_KEY = 'unistage_user_info';

  public currentUser = signal<LoginResponse | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; motDePasse: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.saveSession(response);
      })
    );
  }

  registerEtudiant(data: RegisterEtudiantRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register/etudiant`, data);
  }

  registerEntreprise(data: RegisterEntrepriseRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register/entreprise`, data);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): RoleEnum | null {
    const user = this.currentUser();
    return user ? user.role : null;
  }

  private saveSession(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response));
    this.currentUser.set(response);
  }

  private getStoredUser(): LoginResponse | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
