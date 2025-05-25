import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class VisibilityService {
  private headerVisibility = new BehaviorSubject<boolean>(true);
  private footerVisibility = new BehaviorSubject<boolean>(true);

  headerVisible$ = this.headerVisibility.asObservable();
  footerVisible$ = this.footerVisibility.asObservable();

  setHeaderVisibility(visible: boolean) {
    this.headerVisibility.next(visible);
  }

  setFooterVisibility(visible: boolean) {
    this.footerVisibility.next(visible);
  }

}