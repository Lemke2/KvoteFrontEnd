import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingTicketComponent } from './betting-ticket.component';

describe('BettingTicketComponent', () => {
  let component: BettingTicketComponent;
  let fixture: ComponentFixture<BettingTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BettingTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BettingTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
