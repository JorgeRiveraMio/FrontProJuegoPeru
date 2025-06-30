import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSesionComponent } from './tipo-sesion.component';

describe('TipoSesionComponent', () => {
  let component: TipoSesionComponent;
  let fixture: ComponentFixture<TipoSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoSesionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
