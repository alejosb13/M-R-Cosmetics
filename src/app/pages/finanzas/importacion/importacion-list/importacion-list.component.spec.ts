import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportacionListComponent } from './importacion-list.component';

describe('ImportacionListComponent', () => {
  let component: ImportacionListComponent;
  let fixture: ComponentFixture<ImportacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportacionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
