import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilidadTerapeutaComponent } from './disponibilidad-terapeuta.component';

describe('DisponibilidadTerapeutaComponent', () => {
  let component: DisponibilidadTerapeutaComponent;
  let fixture: ComponentFixture<DisponibilidadTerapeutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisponibilidadTerapeutaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisponibilidadTerapeutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
