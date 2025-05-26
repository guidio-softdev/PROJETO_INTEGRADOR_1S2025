import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-cadastro-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-usuarios.component.html',
  styleUrls: ['./cadastro-usuarios.component.css']
})
export class CadastroUsuariosComponent implements OnInit{

  usuarios: any[] = [];
  usuarioForm!: FormGroup;

  ngOnInit(): void {
      this.inicializarFormulario();
  }

  // Método para enviar o formulário de cadastro
  cadastrarNovoUsuario(): void {
    // Verifica se o formulário é válido
    if (this.usuarioForm.valid) {
      // Prepara os dados do usuário, removendo a confirmação de senha
      const novoUsuario = {
        nome: this.usuarioForm.value.nome,
        email: this.usuarioForm.value.email,
        senha: this.usuarioForm.value.senha,
        telefone: this.usuarioForm.value.telefone,
        dataNascimento: this.usuarioForm.value.dataNascimento
      };

      // Chama o serviço para criar o usuário
      this.usuarioService.createUserLogin(novoUsuario).subscribe({
        next: () => {
          alert('Usuário cadastrado com sucesso!');
          this.usuarioForm.reset(); // Limpa o formulário
          this.carregarUsuarios(); // Atualiza a lista de usuários
        },
        error: (erro) => {
          console.error('Erro no cadastro:', erro);
          alert('Erro ao cadastrar usuário!');
        }
      });
    }
  }

  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      telefone: [''],
      dataNascimento: ['']
    }, { validators: this.senhasIguaisValidator });
  }

  senhasIguaisValidator(form: FormGroup) {
    return form.get('senha')?.value === form.get('confirmarSenha')?.value 
      ? null : { senhasDiferentes: true };
  }

  // Método auxiliar para carregar usuários (necessário para atualizar a lista)
  carregarUsuarios() {
    this.usuarioService.getAll().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (erro) => {
        console.error('Erro ao carregar usuários:', erro);
      }
    });
  }

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef) { }

}