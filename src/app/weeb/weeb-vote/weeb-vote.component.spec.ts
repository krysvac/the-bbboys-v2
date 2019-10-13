import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WeebVoteComponent} from './weeb-vote.component';

describe('WeebVoteComponent', () => {
  let component: WeebVoteComponent;
  let fixture: ComponentFixture<WeebVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeebVoteComponent]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeebVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
