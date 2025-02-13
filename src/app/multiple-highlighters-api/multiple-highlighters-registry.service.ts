import { Injectable } from '@angular/core';

interface HighlighterState {
  available: boolean;
  highlighter: Highlight;
}

export enum HighlighterKeys {
  highlighter1 = 'highlighter-1',
  highlighter2 = 'highlighter-2',
  highlighter3 = 'highlighter-3',
  highlighter4 = 'highlighter-4',
  highlighter5 = 'highlighter-5',
  highlighter6 = 'highlighter-6',
  highlighter7 = 'highlighter-7',
  highlighter8 = 'highlighter-8',
}

type RegistryItem = Record<HighlighterKeys, HighlighterState>;

/**
 * Service creates 8 "Highlight" objects. Every "Highlight"
 * object can define unique style and consume "Range" objects to apply CSS rules
 * to provided Range(s).
 * Every instantiation of the consumer (Highlight Directive) of this service takes
 * next available Highlight object, so that every instance of Directive doesn't
 * interfere with each other.
 */
@Injectable({ providedIn: 'root' })
export class MultipleHighlightersRegistryService {
  private readonly highlighters: RegistryItem;

  constructor() {
    this.highlighters = this.generateHighlighters();
    this.registerHighlighters(this.highlighters);
  }

  // When consumer (Directive) is created it reserves 1 out of 8 Highlight objects.
  // So it can be used to highlight specified ranges with specififed styles.
  reserveAvailableHighlighter(): Highlight {
    if (!this.hasAvailableHighlighter()) {
      throw new Error('All highlighters are already used');
    }
    const nextAvailable = Object.entries(this.highlighters).find(
      ([, value]) => value.available === true,
    )![1];
    nextAvailable.available = false;

    return nextAvailable.highlighter;
  }

  // On consumer object destroy (i.e. ngOnDestroy on multiple-highlighters-provider.service.ts)
  // releases hihglighter by setting available to true.
  // It allows to reuse highlighter by other consumers.
  releaseHighlighter(highlighter: Highlight): void {
    for (const key of Object.values(HighlighterKeys)) {
      const tracker: HighlighterState = this.highlighters[key];
      if (tracker.highlighter === highlighter) {
        tracker.available = true;
      }
    }
  }

  // Adds "Highlight" objects to the registry:
  // https://developer.mozilla.org/en-US/docs/Web/API/CSS/highlights_static
  private registerHighlighters(highlighters: RegistryItem): void {
    Object.entries(highlighters).forEach(([key, value]) => {
      CSS.highlights.set(key, value.highlighter);
    });
  }

  private hasAvailableHighlighter(): boolean {
    return Object.entries(this.highlighters).some(([, value]) => value.available === true);
  }

  // Creates multiple Highlight objects:
  // https://developer.mozilla.org/en-US/docs/Web/API/Highlight
  private generateHighlighters(): RegistryItem {
    let highlighters = {} as RegistryItem;

    for (const key of Object.values(HighlighterKeys)) {
      highlighters = {
        ...highlighters,
        [key]: {
          available: true,
          highlighter: new Highlight(),
        },
      };
    }
    return highlighters;
  }
}
