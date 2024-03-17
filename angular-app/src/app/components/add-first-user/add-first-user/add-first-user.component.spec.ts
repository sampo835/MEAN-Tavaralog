import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFirstUserComponent } from './add-first-user.component';

describe('AddFirstUserComponent', () => {
  let component: AddFirstUserComponent;
  let fixture: ComponentFixture<AddFirstUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFirstUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFirstUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
