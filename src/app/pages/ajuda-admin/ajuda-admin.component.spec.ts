import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjudaAdminComponent } from './ajuda-admin.component';

describe('AjudaAdminComponent', () => {
  let component: AjudaAdminComponent;
  let fixture: ComponentFixture<AjudaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjudaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjudaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
