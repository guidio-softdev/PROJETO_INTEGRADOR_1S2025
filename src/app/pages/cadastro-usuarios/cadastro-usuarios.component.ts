import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-usuarios.component.html',
  styleUrls: ['./cadastro-usuarios.component.css']
})
export class CadastroUsuariosComponent {
  signupForm!: FormGroup;
  isLoading = signal(false);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      cpf: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern(/^\d{11}$/)
        ]
      ],
      birthdate: ['', [Validators.required]], // Corrigido aqui
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(11), // Corrigido para 11 dígitos (celular)
          Validators.pattern(/^\d+$/)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors?.['passwordMismatch'];
      if (Object.keys(confirmPassword.errors || {}).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  async onSignup(): Promise<void> {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      try {
        await this.http.post('http://localhost:3000/usuarios', this.signupForm.value).toPromise();
        alert('Cadastro realizado com sucesso!');
        this.signupForm.reset();
      } catch {
        alert('Erro ao cadastrar!');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      Object.values(this.signupForm.controls).forEach(control => control.markAsTouched());
    }
  }
}