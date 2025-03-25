import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateBarComponent } from './date-bar.component';

describe('DateBarComponent', () => {
  let component: DateBarComponent;
  let fixture: ComponentFixture<DateBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
