import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballComponentComponent } from './football-component.component';

describe('FootballComponentComponent', () => {
  let component: FootballComponentComponent;
  let fixture: ComponentFixture<FootballComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FootballComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootballComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
