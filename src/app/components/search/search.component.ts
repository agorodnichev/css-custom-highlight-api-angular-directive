import { Component, signal } from '@angular/core';
import { HighlighterProvider } from '../../highlighter-api/highlighter-provider.service';
import { HighlighterApiDirective } from '../../highlighter-api/highlighter-api.directive';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  imports: [HighlighterApiDirective, ReactiveFormsModule],
  providers: [HighlighterProvider]
})
export class SearchComponent {

  readonly minNumberOfCharactersToTriggerSearch = 3;
  readonly ctrl: FormControl<string>;
  readonly searchText = signal('');
  constructor(private readonly fb: NonNullableFormBuilder) {
    this.ctrl = this.fb.control('');

    this.ctrl.valueChanges.pipe(
      filter(value => value.length >= this.minNumberOfCharactersToTriggerSearch)
    ).subscribe(value => {
      this.searchText.set(value);
    })
  }
}
