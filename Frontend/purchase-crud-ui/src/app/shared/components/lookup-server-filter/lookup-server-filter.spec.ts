import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupServerFilter } from './lookup-server-filter';

describe('LookupServerFilter', () => {
  let component: LookupServerFilter;
  let fixture: ComponentFixture<LookupServerFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookupServerFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(LookupServerFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
