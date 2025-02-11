import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchMultipleHighlightersComponent } from './components/search-multiple-highlighters/search-multiple-highlighters.component';
import { SearchSingleHighlighterComponent } from './components/search-single-highlighter/search-single-highlighter/search-single-highlighter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchMultipleHighlightersComponent, SearchSingleHighlighterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
