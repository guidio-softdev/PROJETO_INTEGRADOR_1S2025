import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
// Importe o componente de cadastro se for standalone
import { CadastroUsuariosComponent } from '../cadastro-usuarios/cadastro-usuarios.component';
import { HttpClient } from '@angular/common/http';
import { VisibilityService } from '../../services/visibility.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CadastroUsuariosComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoginMode = signal(true);
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private visibilityService: VisibilityService) {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.initializeForms();
    this.visibilityService.setHeaderVisibility(false);
    this.visibilityService.setFooterVisibility(false);
  }
  ngOnDestroy() {
    this.visibilityService.setHeaderVisibility(true);
    this.visibilityService.setFooterVisibility(true);
  }



  private initializeForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  switchForm(isLogin: boolean): void {
    this.isLoginMode.set(isLogin);
    this.clearMessages();
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;

      try {
        // Busca TODOS os usuários no banco de dados
        const allUsers = await this.http
          .get<any[]>(`http://localhost:3000/usuarios?email=${email}`)
          .toPromise() as any[];

        if (!allUsers || allUsers.length === 0) {
          this.showError('Nenhum usuário cadastrado no sistema.');
          return;
        }

        // Procura o usuário com email correspondente
        const foundUser = allUsers.find(user => user.email === email);

        if (!foundUser) {
          this.showError('E-mail não encontrado.');
          return;
        }

        // Verifica a senha
        if (foundUser.senha !== password) {
          this.showError('Senha incorreta.');
          return;
        }

        // Redireciona conforme o tipo de usuário
        if (foundUser.admin) {
          this.showSuccess('Login de admin realizado com sucesso!');
          setTimeout(() => this.router.navigate(['/admin']), 1000);
        } else {
          this.showSuccess('Login realizado com sucesso!');
          setTimeout(() => this.router.navigate(['/dashboard']), 1000);
        }

      } catch (error) {
        this.showError('Erro ao fazer login. Tente novamente.');
        console.error('Erro no login:', error);
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.markFormGroupTouched(this.loginForm);
      this.showError('Por favor, preencha todos os campos corretamente.');
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.delay(1000);
      this.showSuccess('Redirecionando para login com Google...');
    } catch {
      this.showError('Erro ao conectar com Google.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async loginWithFacebook(): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.delay(1000);
      this.showSuccess('Redirecionando para login com Facebook...');
    } catch {
      this.showError('Erro ao conectar com Facebook.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onForgotPassword(): void {
    const email = prompt('Digite seu e-mail para recuperação de senha:');
    if (email && this.isValidEmail(email)) {
      // Busca o usuário pelo e-mail
      this.http.get<any[]>(`http://localhost:3000/usuarios?email=${email}`).subscribe(users => {
        if (users && users.length > 0) {
          const user = users[0];
          const newPassword = prompt('Digite a nova senha:');
          if (newPassword && newPassword.length >= 6) {
            // Atualiza a senha no json-server
            this.http.patch(`http://localhost:3000/usuarios/${user.id}`, { password: newPassword }).subscribe(() => {
              this.showSuccess('Senha redefinida com sucesso!');
            }, () => {
              this.showError('Erro ao atualizar a senha.');
            });
          } else {
            this.showError('A senha deve ter pelo menos 6 caracteres.');
          }
        } else {
          this.showError('E-mail não encontrado.');
        }
      }, () => {
        this.showError('Erro ao buscar usuário.');
      });
    } else if (email) {
      this.showError('Por favor, digite um e-mail válido.');
    }
  }

  // Utilitários
  private showError(message: string): void {
    this.errorMessage.set(message);
    this.successMessage.set('');
    this.autoHideMessage();
  }

  private showSuccess(message: string): void {
    this.successMessage.set(message);
    this.errorMessage.set('');
    this.autoHideMessage();
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private autoHideMessage(): void {
    setTimeout(() => {
      this.clearMessages();
    }, 5000);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}