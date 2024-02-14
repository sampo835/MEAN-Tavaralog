import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanAdminComponent } from './scan-admin.component';

describe('ScanAdminComponent', () => {
  let component: ScanAdminComponent;
  let fixture: ComponentFixture<ScanAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScanAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScanAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
