import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperacionAnualComponent } from './recuperacion-anual.component';

describe('RecuperacionAnualComponent', () => {
  let component: RecuperacionAnualComponent;
  let fixture: ComponentFixture<RecuperacionAnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecuperacionAnualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperacionAnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
