import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAdminComponent } from './check-admin.component';

describe('CheckAdminComponent', () => {
  let component: CheckAdminComponent;
  let fixture: ComponentFixture<CheckAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
