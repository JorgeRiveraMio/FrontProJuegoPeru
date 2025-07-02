import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroSesionComponent } from './registro-sesion.component';

describe('RegistroSesionComponent', () => {
  let component: RegistroSesionComponent;
  let fixture: ComponentFixture<RegistroSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroSesionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
