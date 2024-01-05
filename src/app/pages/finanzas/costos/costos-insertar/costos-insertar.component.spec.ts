import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosInsertarComponent } from './costos-insertar.component';

describe('CostosInsertarComponent', () => {
  let component: CostosInsertarComponent;
  let fixture: ComponentFixture<CostosInsertarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostosInsertarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostosInsertarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
