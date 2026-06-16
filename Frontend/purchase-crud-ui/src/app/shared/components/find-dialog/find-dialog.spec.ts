import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindDialog } from './find-dialog';

describe('FindDialog', () => {
  let component: FindDialog;
  let fixture: ComponentFixture<FindDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(FindDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
