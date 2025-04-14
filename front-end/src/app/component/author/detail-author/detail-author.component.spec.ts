import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAuthorComponent } from './detail-author.component';

describe('DetailAuthorComponent', () => {
  let component: DetailAuthorComponent;
  let fixture: ComponentFixture<DetailAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAuthorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
