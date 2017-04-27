import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersdetailComponent } from './usersdetail.component';

describe('UsersdetailComponent', () => {
  let component: UsersdetailComponent;
  let fixture: ComponentFixture<UsersdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
