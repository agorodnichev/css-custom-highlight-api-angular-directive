import { Injectable, OnDestroy } from "@angular/core";
import { MultipleHighlightersRegistryService } from "./multiple-highlighters-registry.service";


/**
 * Service takes first available Highlight object from the Registry.
 * So that you can have on a single page multiple search 
 * with highlight functionalities isolated from each other.
 * Pay attention that it is not provided in root, so that
 * you decide what part of the component hierarchy should be
 * served by single Highlight object.
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