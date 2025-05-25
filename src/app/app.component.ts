import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './compartilhado/header/header.component';
import { FooterComponent } from "./compartilhado/footer/footer.component";
import { VisibilityService } from './services/visibility.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  headerVisible = true;
  footerVisible = true;

  constructor(private visibilityService: VisibilityService) {
    this.visibilityService.headerVisible$.subscribe(visible => {
      this.headerVisible = visible;
    });
    
    this.visibilityService.footerVisible$.subscribe(visible => {
      this.footerVisible = visible;
    });
  }
}
