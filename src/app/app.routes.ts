import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroUsuariosComponent } from './pages/cadastro-usuarios/cadastro-usuarios.component';
import { PainelAdminComponent } from './pages/painel-admin/painel-admin.component';
import { AjudaAdminComponent } from './pages/ajuda-admin/ajuda-admin.component';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    title: 'Pagina Inicial',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Pagina de Login'
  },    
  {
    path: 'cadastro',
    component: CadastroUsuariosComponent,
    title: 'Cadastro'
  },
  {
    path: 'admin',
    component: PainelAdminComponent,
    title: 'Painel Admin',
  },
  {
  path: 'ajuda-admin',
  component: AjudaAdminComponent,
  title: 'Ajuda Admin'
},
  {
    path: '**',
    redirectTo: ''
  }
]