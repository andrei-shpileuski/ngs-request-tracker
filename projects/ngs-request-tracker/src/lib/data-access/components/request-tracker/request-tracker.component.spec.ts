import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTrackerComponent } from './request-tracker.component';

describe('RequestTrackerComponent', () => {
  let component: RequestTrackerComponent;
  let fixture: ComponentFixture<RequestTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
