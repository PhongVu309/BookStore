import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailModalComponent } from './order-detail-modal.component';

describe('OrderDetailModalComponent', () => {
  let component: OrderDetailModalComponent;
  let fixture: ComponentFixture<OrderDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
