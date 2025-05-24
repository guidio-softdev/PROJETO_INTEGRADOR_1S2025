import { Component, OnInit } from '@angular/core';
import { Produto } from '../../models/produto.model';
import { ProductService } from '../../services/produtos.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../componentes/card/card.component';
import { firstValueFrom } from 'rxjs';
import { signal } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  produtos = signal<Produto[]>([]);
  carregando = signal(true);

  constructor(private productService: ProductService) {
    this.carregarProdutos();
  }

  async carregarProdutos() {
    try {
      const produtos = await firstValueFrom(this.productService.getProducts());
      this.produtos.set(produtos);
    } catch (erro) {
      console.error(erro);
    } finally {
      this.carregando.set(false);
    }
  }
}
