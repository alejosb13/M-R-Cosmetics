import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasAnualComponent } from './ventas-anual.component';

describe('VentasAnualComponent', () => {
  let component: VentasAnualComponent;
  let fixture: ComponentFixture<VentasAnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasAnualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
