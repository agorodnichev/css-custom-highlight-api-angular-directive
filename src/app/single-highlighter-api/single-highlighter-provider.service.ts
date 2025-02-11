import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SingleHighlighterProvider {
    public static highlighterSelector = 'highlighter-type-single';
    public readonly highlighter = new Highlight();

    constructor() {
        // Register Highlight object
        CSS.highlights.set(SingleHighlighterProvider.highlighterSelector, this.highlighter);
    }

    clearRanges(ranges: AbstractRange[]): void {
        for (const rangeToRemove of ranges) {
            const removed = this.highlighter.delete(rangeToRemove);
            if (!removed) {
                console.warn('trying to remove range which is not registered in the registry');
            }
        }
    }
}