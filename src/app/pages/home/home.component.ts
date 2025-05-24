import { Component, OnInit } from '@angular/core';
import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  ListaProdutos: Produto[] = [];

  constructor(private service: ProdutoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.service.listar().subscribe((produtos) => {
      this.ListaProdutos = produtos;
    })
  }

}
