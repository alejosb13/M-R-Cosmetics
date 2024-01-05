import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosListComponent } from './gastos-list.component';

describe('GastosListComponent', () => {
  let component: GastosListComponent;
  let fixture: ComponentFixture<GastosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GastosListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
