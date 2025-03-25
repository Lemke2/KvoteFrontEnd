import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TennisComponentComponent } from './tennis-component.component';

describe('TennisComponentComponent', () => {
  let component: TennisComponentComponent;
  let fixture: ComponentFixture<TennisComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TennisComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TennisComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
