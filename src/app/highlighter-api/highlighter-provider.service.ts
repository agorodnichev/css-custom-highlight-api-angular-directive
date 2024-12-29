import { Injectable, OnDestroy } from "@angular/core";
import { HighlighterRegistryService } from "./highlighter-registry.service";


/**
 * Servers takes first available highlighter from the Registry.
 * So that you can have on a single page multiple search 
 * and highlight functionalities isolated from each other.
 */
@Injectable()
export class HighlighterProvider implements OnDestroy {
    public readonly highlighter: Highlight;
    constructor(private readonly highlighterRegistry: HighlighterRegistryService) {
        this.highlighter = this.highlighterRegistry.reserveAvailableHighlighter();
    }

    ngOnDestroy() {
        this.highlighter.clear();
        this.highlighterRegistry.releaseHighlighter(this.highlighter);
    }

}