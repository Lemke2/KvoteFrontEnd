import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandballComponent } from './handball.component';

describe('HandballComponent', () => {
  let component: HandballComponent;
  let fixture: ComponentFixture<HandballComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandballComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
