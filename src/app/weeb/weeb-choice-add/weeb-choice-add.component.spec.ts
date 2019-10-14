import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeebChoiceAddComponent} from './weeb-choice-add.component';

describe('WeebChoiceAddComponent', () => {
  let component: WeebChoiceAddComponent;
  let fixture: ComponentFixture<WeebChoiceAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeebChoiceAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeebChoiceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
