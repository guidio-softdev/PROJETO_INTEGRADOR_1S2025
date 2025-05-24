import { Component, Input } from '@angular/core';
import { Produto} from '../../models/produto.model';


@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() product!: Produto;
}
