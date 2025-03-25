import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurebetComponent } from './surebet.component';

describe('SurebetComponent', () => {
  let component: SurebetComponent;
  let fixture: ComponentFixture<SurebetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurebetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurebetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
