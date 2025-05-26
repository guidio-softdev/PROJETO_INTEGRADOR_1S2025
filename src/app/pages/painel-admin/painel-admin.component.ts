import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { VisibilityService } from '../../services/visibility.service';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProdutoService } from '../../services/produto.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-painel-admin',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './painel-admin.component.html',
  styleUrl: './painel-admin.component.css',
})
export class PainelAdminComponent implements OnInit, OnDestroy {
  // Produtos
  produtos: any[] = [];
  produtoForm!: FormGroup;
  imagemPreview: string | ArrayBuffer | null = null;
  imagemFile: File | null = null;
  editando: boolean = false;
  produtoEditandoId: number | null = null;

  // Usuários
  usuarios: any[] = [];
  usuarioForm!: FormGroup;
  editandoUsuario: boolean = false;
  usuarioEditandoId: number | null = null;

  // Controle de painel ativo
  painelAtivo: 'produtos' | 'usuarios' = 'produtos';

  constructor(
    private visibilityService: VisibilityService,
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarProdutos();
    this.carregarUsuarios();

    setTimeout(() => {
    this.visibilityService.setHeaderVisibility(false);
    this.visibilityService.setFooterVisibility(false);
    this.cdr.detectChanges();
  });

    // Formulário de produtos
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      preco: ['', Validators.required],
      marca: ['', Validators.required],
      quantidade: ['', Validators.required],
      descricao: ['', Validators.required],
      imagem: [null],
    });

    // Formulário de usuários
    this.usuarioForm = this.fb.group(
      {
        nome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', [Validators.required]],
        telefone: [''],
        dataNascimento: [''],
      },
      { validators: this.senhasIguaisValidator }
    );
  }
  
  // Validador para senhas iguais
senhasIguaisValidator(form: FormGroup) {
  const senha = form.get('senha')?.value;
  const confirmarSenha = form.get('confirmarSenha')?.value;
  return senha === confirmarSenha ? null : { senhasDiferentes: true };
}

  ngOnDestroy() {
    this.visibilityService.setHeaderVisibility(true);
    this.visibilityService.setFooterVisibility(true);
  }

  // Troca de painel
  selecionarPainel(painel: 'produtos' | 'usuarios') {
    this.painelAtivo = painel;
  }

  // PRODUTOS
  carregarProdutos() {
    this.produtoService.getAll().subscribe((data) => {
      this.produtos = data;
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagemFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.imagemPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.produtoForm.valid) {
      const produto = {
        ...this.produtoForm.value,
        imagem: this.imagemPreview,
      };

      if (this.editando && this.produtoEditandoId !== null) {
        this.produtoService
          .updateProduct(this.produtoEditandoId, produto)
          .subscribe({
            next: () => {
              alert('Produto atualizado com sucesso!');
              this.produtoForm.reset();
              this.imagemPreview = null;
              this.editando = false;
              this.produtoEditandoId = null;
              this.carregarProdutos();
            },
            error: () => {
              alert('Erro ao atualizar produto!');
            },
          });
      } else {
        this.produtoService.createProduct(produto).subscribe({
          next: () => {
            alert('Produto cadastrado com sucesso!');
            this.produtoForm.reset();
            this.imagemPreview = null;
            this.carregarProdutos();
          },
          error: () => {
            alert('Erro ao cadastrar produto!');
          },
        });
      }
    }
  }

  updateProduct(produto: any): void {
    this.produtoForm.patchValue({
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      marca: produto.marca,
      quantidade: produto.quantidade,
      descricao: produto.descricao,
      imagem: produto.imagem,
    });
    this.imagemPreview = produto.imagem;
    this.editando = true;
    this.produtoEditandoId = produto.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  apagarProduto(id: number): void {
    if (confirm('Tem certeza que deseja apagar este produto?')) {
      this.produtoService.deleteProduct(id).subscribe({
        next: () => {
          alert('Produto apagado com sucesso!');
          this.carregarProdutos();
        },
        error: () => {
          alert('Erro ao apagar produto!');
        },
      });
    }
  }

  // USUÁRIOS
  carregarUsuarios() {
    this.usuarioService.getAll().subscribe((data) => {
      this.usuarios = data;
    });
  }

  onSubmitUsuario(): void {
  console.log('submit', this.usuarioForm.value, this.usuarioForm.valid);
  if (this.usuarioForm.valid) {
    const usuario = { ...this.usuarioForm.value };
    delete usuario.confirmarSenha;

    if (this.editandoUsuario && this.usuarioEditandoId !== null) {
      this.usuarioService.updateUser(this.usuarioEditandoId, usuario).subscribe({
        next: () => {
          alert('Usuário atualizado com sucesso!');
          this.usuarioForm.reset();
          this.editandoUsuario = false;
          this.usuarioEditandoId = null;
          this.carregarUsuarios();
          this.cdr.detectChanges();
        },
        error: () => {
          alert('Erro ao atualizar usuário!');
        }
      });
    } else {
      this.usuarioService.createUser(usuario).subscribe({
        next: () => {
          alert('Usuário cadastrado com sucesso!');
          this.usuarioForm.reset();
          this.carregarUsuarios();
          this.cdr.detectChanges(); // <-- força atualização do template
        },
        error: () => {
          alert('Erro ao cadastrar usuário!');
        }
      });
    }
  }
}

 editarUsuario(usuario: any): void {
  this.usuarioForm.patchValue({
    nome: usuario.nome,
    email: usuario.email,
    senha: '', 
    confirmarSenha: '',
    telefone: usuario.telefone,
    dataNascimento: usuario.dataNascimento
  });
  this.editandoUsuario = true;
  this.usuarioEditandoId = usuario.id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

  apagarUsuario(id: number): void {
    if (confirm('Tem certeza que deseja apagar este usuário?')) {
      this.usuarioService.deleteUser(id).subscribe({
        next: () => {
          alert('Usuário apagado com sucesso!');
          this.carregarUsuarios();
        },
        error: () => {
          alert('Erro ao apagar usuário!');
        },
      });
    }
  }
}
