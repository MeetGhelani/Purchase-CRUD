import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupFloatingFilter } from './lookup-floating-filter';

describe('LookupFloatingFilter', () => {
  let component: LookupFloatingFilter;
  let fixture: ComponentFixture<LookupFloatingFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookupFloatingFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(LookupFloatingFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
