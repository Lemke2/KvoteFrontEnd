import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketballComponentComponent } from './basketball-component.component';

describe('BasketballComponentComponent', () => {
  let component: BasketballComponentComponent;
  let fixture: ComponentFixture<BasketballComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasketballComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketballComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
