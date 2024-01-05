import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosListComponent } from './costos-list.component';

describe('CostosListComponent', () => {
  let component: CostosListComponent;
  let fixture: ComponentFixture<CostosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostosListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
