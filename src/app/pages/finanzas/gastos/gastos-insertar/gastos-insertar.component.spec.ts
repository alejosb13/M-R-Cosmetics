import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosInsertarComponent } from './gastos-insertar.component';

describe('GastosInsertarComponent', () => {
  let component: GastosInsertarComponent;
  let fixture: ComponentFixture<GastosInsertarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GastosInsertarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosInsertarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
