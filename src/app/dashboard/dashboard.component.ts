// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
// import { ProdutoService } from '../../services/produto.service';
// // import { UserService } from '../../services/user.service'; // Descomente se existir

// @Component({
//   selector: 'app-dashboard',
//   imports: [CommonModule, BreadcrumbComponent, RouterLink],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css'
// })
// export class DashboardComponent implements OnInit {

//   productCount = 0;
//   activeProductCount = 0;
//   lowStockCount = 0;
//   userCount = 0;
//   activeUserCount = 0;
//   recentProducts: any[] = [];
//   recentUsers: any[] = [];

//   constructor(
//     private productService: ProdutoService,
//     // private userService: UserService // Descomente se existir
//   ) {}

//   ngOnInit(): void {
//     this.loadDashboardData();
//   }

//   loadDashboardData(): void {
//     this.productService.getAll().subscribe(products => {
//       this.productCount = products.length;
//       this.activeProductCount = products.filter(p => p.ativo === true).length;
//       this.lowStockCount = products.filter(p => p.stock <= 5).length;

//       // Corrige para datas em string ou Date
//       this.recentProducts = [...products]
//         .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//         .slice(0, 5);
//     });

//     // Descomente e ajuste se tiver UserService implementado
//     /*
//     this.userService.getUsers().subscribe(users => {
//       this.userCount = users.length;
//       this.activeUserCount = users.filter(u => u.status === 'active').length;

//       this.recentUsers = [...users]
//         .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//         .slice(0, 5);
//     });
//     */
//   }
// }