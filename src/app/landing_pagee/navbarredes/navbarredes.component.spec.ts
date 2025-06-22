import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarredesComponent } from './navbarredes.component';

describe('NavbarredesComponent', () => {
  let component: NavbarredesComponent;
  let fixture: ComponentFixture<NavbarredesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarredesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarredesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
