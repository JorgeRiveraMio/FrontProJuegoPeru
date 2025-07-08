import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeEvaluacionComponent } from './informe-evaluacion.component';

describe('InformeEvaluacionComponent', () => {
  let component: InformeEvaluacionComponent;
  let fixture: ComponentFixture<InformeEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeEvaluacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
