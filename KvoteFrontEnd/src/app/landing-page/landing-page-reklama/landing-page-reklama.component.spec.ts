import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageReklamaComponent } from './landing-page-reklama.component';

describe('LandingPageReklamaComponent', () => {
  let component: LandingPageReklamaComponent;
  let fixture: ComponentFixture<LandingPageReklamaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPageReklamaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageReklamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
