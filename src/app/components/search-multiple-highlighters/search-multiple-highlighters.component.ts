import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MultipleHighlightersProvider } from '../../multiple-highlighters-api/multiple-highlighters-provider.service';
import { MultipleHighlightersApiDirective } from '../../multiple-highlighters-api/multiple-highlighters-api.directive';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-multiple-highlighters',
  standalone: true,
  templateUrl: './search-multiple-highlighters.component.html',
  styleUrl: './search-multiple-highlighters.component.scss',
  imports: [MultipleHighlightersApiDirective, ReactiveFormsModule],
  providers: [MultipleHighlightersProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchMultipleHighlightersComponent {
  readonly minNumberOfCharactersToTriggerSearch = 3;
  readonly ctrl: FormControl<string>;
  readonly searchText = signal('');

  constructor(private readonly fb: NonNullableFormBuilder) {
    this.ctrl = this.fb.control('');

    this.ctrl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      if (value.length >= this.minNumberOfCharactersToTriggerSearch) {
        this.searchText.set(value);
      } else {
        this.searchText.set('');
      }
    });
  }
}
