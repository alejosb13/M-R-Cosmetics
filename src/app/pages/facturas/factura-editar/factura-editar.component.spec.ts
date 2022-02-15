import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaEditarComponent } from './factura-editar.component';

describe('FacturaEditarComponent', () => {
  let component: FacturaEditarComponent;
  let fixture: ComponentFixture<FacturaEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
