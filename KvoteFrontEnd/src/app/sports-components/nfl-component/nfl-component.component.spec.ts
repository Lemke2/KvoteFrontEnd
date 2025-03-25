import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NflComponentComponent } from './nfl-component.component';

describe('NflComponentComponent', () => {
  let component: NflComponentComponent;
  let fixture: ComponentFixture<NflComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NflComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NflComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
