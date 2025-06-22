import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuteladosComponent } from './tutelados.component';

describe('TuteladosComponent', () => {
  let component: TuteladosComponent;
  let fixture: ComponentFixture<TuteladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuteladosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuteladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
