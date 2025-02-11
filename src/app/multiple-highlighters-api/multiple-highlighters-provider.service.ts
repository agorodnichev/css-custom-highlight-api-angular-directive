import { Injectable, OnDestroy } from "@angular/core";
import { MultipleHighlightersRegistryService } from "./multiple-highlighters-registry.service";


/**
 * Servers takes first available highlighter from the Registry.
 * So that you can have on a single page multiple search 
 * and highlight functionalities isolated from each other.
 */
@Injectable()
export class MultipleHighlightersProvider implements OnDestroy {
    public readonly highlighter: Highlight;
    constructor(private readonly multipleHighlightersRegistryService: MultipleHighlightersRegistryService) {
        this.highlighter = this.multipleHighlightersRegistryService.reserveAvailableHighlighter();
    }

    ngOnDestroy() {
        this.highlighter.clear();
        this.multipleHighlightersRegistryService.releaseHighlighter(this.highlighter);
    }

}