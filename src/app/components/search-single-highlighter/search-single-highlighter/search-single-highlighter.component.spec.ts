import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSingleHighlighterComponent } from './search-single-highlighter.component';

describe('SearchSingleHighlighterComponent', () => {
  let component: SearchSingleHighlighterComponent;
  let fixture: ComponentFixture<SearchSingleHighlighterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSingleHighlighterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSingleHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
