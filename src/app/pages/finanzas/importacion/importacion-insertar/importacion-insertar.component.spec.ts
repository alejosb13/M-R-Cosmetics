import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportacionInsertarComponent } from './importacion-insertar.component';

describe('ImportacionInsertarComponent', () => {
  let component: ImportacionInsertarComponent;
  let fixture: ComponentFixture<ImportacionInsertarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportacionInsertarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportacionInsertarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
