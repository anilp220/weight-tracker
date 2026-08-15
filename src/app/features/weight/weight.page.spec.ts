import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeightPage } from './weight.page';

describe('WeightPage', () => {
  let component: WeightPage;
  let fixture: ComponentFixture<WeightPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
