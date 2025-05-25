import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroUsuariosComponent } from './pages/cadastro-usuarios/cadastro-usuarios.component';
import { PainelAdminComponent } from './pages/painel-admin/painel-admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { adminAuthGuard } from './pages/guards/admin-auth.guard';

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
    children: [
      {
        path: '',
        component: DashboardComponent,
        title: 'Dashboard'
      }
    ]
  },
  
  // Rota coringa para página não encontrada (opcional)
  {
    path: '**',
    redirectTo: ''
  }
]