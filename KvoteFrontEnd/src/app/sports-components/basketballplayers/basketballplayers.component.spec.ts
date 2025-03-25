import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketballplayersComponent } from './basketballplayers.component';

describe('BasketballplayersComponent', () => {
  let component: BasketballplayersComponent;
  let fixture: ComponentFixture<BasketballplayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasketballplayersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketballplayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
