import { Component } from '@angular/core';
import { VisibilityService } from '../../services/visibility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajuda-admin',
  imports: [],
  templateUrl: './ajuda-admin.component.html',
  styleUrls: ['./ajuda-admin.component.css']
})
export class AjudaAdminComponent {
  painelAtivo: string = 'ajuda';
  constructor(
    private visibilityService: VisibilityService,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.visibilityService.setHeaderVisibility(false);
      this.visibilityService.setFooterVisibility(false);
    });
  }

  ngOnDestroy() {
    setTimeout(() => {
      // Restaura a visibilidade do cabeçalho e rodapé ao sair da página  
      this.visibilityService.setHeaderVisibility(true);
      this.visibilityService.setFooterVisibility(true);
    });
  }

   selecionarPainel(painel: string): void {
    this.painelAtivo = painel;
    // Redireciona para o painel correto ao clicar no menu
    if (painel === 'produtos' || painel === 'usuarios') {
      this.router.navigate(['/admin']);
    }
    else if (painel === 'sair'){
      // Redireciona para a página de login ao clicar em sair
      this.router.navigate(['/login']);
    }
  }
}
