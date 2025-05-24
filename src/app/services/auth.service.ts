// // auth.service.ts
// import { Injectable, signal, computed } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Observable, BehaviorSubject, throwError } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface SignupRequest {
//   name: string;
//   email: string;
//   password: string;
// }

// export interface AuthResponse {
//   user: User;
//   token: string;
//   refreshToken: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly API_URL = 'https://api.seudominio.com'; // Substitua pela sua API
  
//   // Signals para gerenciar estado
//   private userSignal = signal<User | null>(null);
//   private tokenSignal = signal<string | null>(null);
//   private loadingSignal = signal<boolean>(false);

//   // Computed signals
//   public readonly user = this.userSignal.asReadonly();
//   public readonly token = this.tokenSignal.asReadonly();
//   public readonly isLoading = this.loadingSignal.asReadonly();
//   public readonly isAuthenticated = computed(() => !!this.userSignal() && !!this.tokenSignal());

//   // Subject para compatibilidade com observables
//   private userSubject = new BehaviorSubject<User | null>(null);
//   public user$ = this.userSubject.asObservable();

//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) {
//     this.initializeAuth();
//   }

//   /**
//    * Inicializa o serviço verificando se há dados de autenticação salvos
//    */
//   private initializeAuth(): void {
//     const token = this.getStoredToken();
//     const userData = this.getStoredUser();

//     if (token && userData) {
//       this.setAuthData(userData, token);
//       this.validateToken().subscribe({
//         error: () => this.logout()
//       });
//     }
//   }

//   /**
//    * Realiza login do usuário
//    */
//   login(credentials: LoginRequest): Observable<AuthResponse> {
//     this.loadingSignal.set(true);

//     return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
//       .pipe(
//         tap(response => this.handleAuthSuccess(response)),
//         catchError(error => this.handleAuthError(error)),
//         tap(() => this.loadingSignal.set(false))
//       );
//   }

//   /**
//    * Realiza cadastro do usuário
//    */
//   signup(userData: SignupRequest): Observable<AuthResponse> {
//     this.loadingSignal.set(true);

//     return this.http.post<AuthResponse>(`${this.API_URL}/auth/signup`, userData)
//       .pipe(
//         tap(response => this.handleAuthSuccess(response)),
//         catchError(error => this.handleAuthError(error)),
//         tap(() => this.loadingSignal.set(false))
//       );
//   }

//   /**
//    * Login com Google OAuth
//    */
//   loginWithGoogle(): Observable<AuthResponse> {
//     this.loadingSignal.set(true);
    
//     // Implementar integração com Google OAuth
//     // Exemplo usando Google Sign-In API
//     return new Observable(observer => {
//       // @ts-ignore
//       if (typeof google !== 'undefined' && google.accounts) {
//         // @ts-ignore
//         google.accounts.id.prompt((notification: any) => {
//           if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
//             observer.error(new Error('Google Sign-In não disponível'));
//           }
//         });

//         // @ts-ignore
//         google.accounts.id.renderButton(
//           document.getElementById('google-signin-button'),
//           {
//             theme: 'outline',
//             size: 'large',
//             type: 'standard'
//           }
//         );
//       } else {
//         observer.error(new Error('Google Sign-In não carregado'));
//       }

//       this.loadingSignal.set(false);
//     }).pipe(
//       catchError(error => this.handleAuthError(error))
//     );
//   }

//   /**
//    * Login com Facebook
//    */
//   loginWithFacebook(): Observable<AuthResponse> {
//     this.loadingSignal.set(true);

//     return new Observable(observer => {
//       // @ts-ignore
//       if (typeof FB !== 'undefined') {
//         // @ts-ignore
//         FB.login((response: any) => {
//           if (response.authResponse) {
//             // Enviar o token do Facebook para sua API
//             this.http.post<AuthResponse>(`${this.API_URL}/auth/facebook`, {
//               accessToken: response.authResponse.accessToken
//             }).subscribe({
//               next: (authResponse) => {
//                 this.handleAuthSuccess(authResponse);
//                 observer.next(authResponse);
//                 observer.complete();
//               },
//               error: (error) => observer.error(error)
//             });
//           } else {
//             observer.error(new Error('Login com Facebook cancelado'));
//           }
//         }, { scope: 'email,public_profile' });
//       } else {
//         observer.error(new Error('Facebook SDK não carregado'));
//       }

//       this.loadingSignal.set(false);
//     }).pipe(
//       catchError(error => this.handleAuthError(error))
//     );
//   }

//   /**
//    * Solicita recuperação de senha
//    */
//   forgotPassword(email: string): Observable<{ message: string }> {
//     return this.http.post<{ message: string }>(`${this.API_URL}/auth/forgot-password`, { email })
//       .pipe(
//         catchError(error => this.handleAuthError(error))
//       );
//   }

//   /**
//    * Reseta a senha com token
//    */
//   resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
//     return this.http.post<{ message: string }>(`${this.API_URL}/auth/reset-password`, {
//       token,
//       password: newPassword
//     }).pipe(
//       catchError(error => this.handleAuthError(error))
//     );
//   }

//   /**
//    * Valida o token atual
//    */
//   validateToken(): Observable<User> {
//     return this.http.get<User>(`${this.API_URL}/auth/me`)
//       .pipe(
//         tap(user => {
//           this.userSignal.set(user);
//           this.userSubject.next(user);
//         }),
//         catchError(error => this.handleAuthError(error))
//       );
//   }

//   /**
//    * Atualiza o token usando refresh token
//    */
//   refreshToken(): Observable<{ token: string }> {
//     const refreshToken = this.getStoredRefreshToken();
    
//     if (!refreshToken) {
//       return throwError(() => new Error('Refresh token não encontrado'));
//     }

//     return this.http.post<{ token: string }>(`${this.API_URL}/auth/refresh`, {
//       refreshToken
//     }).pipe(
//       tap(response => {
//         this.tokenSignal.set(response.token);
//         this.storeToken(response.token);
//       }),
//       catchError(error => {
//         this.logout();
//         return this.handleAuthError(error);
//       })
//     );
//   }

//   /**
//    * Realiza logout do usuário
//    */
//   logout(): void {
//     // Limpar dados locais
//     this.clearStoredData();
    
//     // Resetar signals
//     this.userSignal.set(null);
//     this.tokenSignal.set(null);
//     this.userSubject.next(null);

//     // Fazer logout no servidor (opcional)
//     const token = this.getStoredToken();
//     if (token) {
//       this.http.post(`${this.API_URL}/auth/logout`, {}).subscribe();
//     }

//     // Redirecionar para login
//     this.router.navigate(['/login']);
//   }

//   /**
//    * Verifica se o usuário tem uma role específica
//    */
//   hasRole(role: string): boolean {
//     const user = this.userSignal();
//     return user ? (user as any).roles?.includes(role) : false;
//   }

//   /**
//    * Verifica se o usuário tem permissão específica
//    */
//   hasPermission(permission: string): boolean {
//     const user = this.userSignal();
//     return user ? (user as any).permissions?.includes(permission) : false;
//   }

//   // Métodos privados para gerenciamento de dados

//   private handleAuthSuccess(response: AuthResponse): void {
//     this.setAuthData(response.user, response.token);
//     this.storeAuthData(response);
//   }

//   private setAuthData(user: User, token: string): void {
//     this.userSignal.set(user);
//     this.tokenSignal.set(token);
//     this.userSubject.next(user);
//   }

//   private handleAuthError(error: HttpErrorResponse): Observable<never> {
//     let errorMessage = 'Erro desconhecido';

//     if (error.error instanceof ErrorEvent) {
//       // Erro do cliente
//       errorMessage = error.error.message;
//     } else {
//       // Erro do servidor
//       switch (error.status) {
//         case 401:
//           errorMessage = 'Credenciais inválidas';
//           break;
//         case 403:
//           errorMessage = 'Acesso negado';
//           break;
//         case 404:
//           errorMessage = 'Serviço não encontrado';
//           break;
//         case 422:
//           errorMessage = error.error?.message || 'Dados inválidos';
//           break;
//         case 500:
//           errorMessage = 'Erro interno do servidor';
//           break;
//         default:
//           errorMessage = error.error?.message || `Erro: ${error.status}`;
//       }
//     }

//     this.loadingSignal.set(false);
//     return throwError(() => new Error(errorMessage));
//   }

//   private storeAuthData(response: AuthResponse): void {
//     localStorage.setItem('auth_token', response.token);
//     localStorage.setItem('refresh_token', response.refreshToken);
//     localStorage.setItem('user_data', JSON.stringify(response.user));
//   }

//   private storeToken(token: string): void {
//     localStorage.setItem('auth_token', token);
//   }

//   private getStoredToken(): string | null {
//     return localStorage.getItem('auth_token');
//   }

//   private getStoredRefreshToken(): string | null {
//     return localStorage.getItem('refresh_token');
//   }

//   private getStoredUser(): User | null {
//     const userData = localStorage.getItem('user_data');
//     return userData ? JSON.parse(userData) : null;
//   }

//   private clearStoredData(): void {
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user_data');
//   }
// }