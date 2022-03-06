import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonoEditarComponent } from './abono-editar.component';

describe('AbonoEditarComponent', () => {
  let component: AbonoEditarComponent;
  let fixture: ComponentFixture<AbonoEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbonoEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbonoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
