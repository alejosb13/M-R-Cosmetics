import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonoHistorialInsertComponent } from './abono-historial-insert.component';

describe('AbonoHistorialInsertComponent', () => {
  let component: AbonoHistorialInsertComponent;
  let fixture: ComponentFixture<AbonoHistorialInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbonoHistorialInsertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbonoHistorialInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
