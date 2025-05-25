import { Component, OnDestroy, OnInit } from '@angular/core';
import { VisibilityService } from '../../services/visibility.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-painel-admin',
  imports: [RouterModule],
  templateUrl: './painel-admin.component.html',
  styleUrl: './painel-admin.component.css'
})
export class PainelAdminComponent implements OnInit, OnDestroy {
  constructor(private visibilityService: VisibilityService) {

    this.ngOnInit();
   }

  ngOnInit() {
    this.visibilityService.setHeaderVisibility(false);
    this.visibilityService.setFooterVisibility(false);
  }
  ngOnDestroy() {
    this.visibilityService.setHeaderVisibility(true);
    this.visibilityService.setFooterVisibility(true);
  }
}
