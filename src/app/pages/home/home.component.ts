import { Component, OnDestroy, OnInit } from '@angular/core';
import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';
import { Router } from '@angular/router';
import { VisibilityService } from '../../services/visibility.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  ListaProdutos: Produto[] = [];

  constructor(private service: ProdutoService,
    private router: Router,
    private visibilityService: VisibilityService
  ) {

    this.ngOnInit();

  }

  ngOnInit(): void {
    this.visibilityService.setHeaderVisibility(true);
    this.visibilityService.setFooterVisibility(true);
    this.carregarProdutos();
  }

  ngOnDestroy(): void {
    this.visibilityService.setHeaderVisibility(true);
    this.visibilityService.setFooterVisibility(true);
  }

  private carregarProdutos(): void {
  this.service.getAll().subscribe({
    next: (produtos) => this.ListaProdutos = produtos,
    error: (err) => console.error('Erro ao carregar produtos:', err)
  });
}

}
