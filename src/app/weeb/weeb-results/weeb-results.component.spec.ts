import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeebResultsComponent} from './weeb-results.component';

describe('WeebResultsComponent', () => {
  let component: WeebResultsComponent;
  let fixture: ComponentFixture<WeebResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeebResultsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeebResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
