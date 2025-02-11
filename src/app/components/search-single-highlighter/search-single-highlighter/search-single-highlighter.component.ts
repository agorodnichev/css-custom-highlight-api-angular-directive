import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SingleHighlighterApiDirective } from '../../../single-highlighter-api/single-highlighter-api.directive';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-single-highlighter',
  standalone: true,
  imports: [SingleHighlighterApiDirective, ReactiveFormsModule],
  templateUrl: './search-single-highlighter.component.html',
  styleUrl: './search-single-highlighter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchSingleHighlighterComponent {
  readonly minNumberOfCharactersToTriggerSearch = 3;
  readonly ctrl: FormControl<string>;
  readonly searchText = signal('');
  constructor(private readonly fb: NonNullableFormBuilder) {
    this.ctrl = this.fb.control('');

    this.ctrl.valueChanges.pipe(
      takeUntilDestroyed(),
    ).subscribe(value => {
      if (value.length >= this.minNumberOfCharactersToTriggerSearch) {
        this.searchText.set(value);
      } else {
        this.searchText.set('');
      }
    });
  }
}
