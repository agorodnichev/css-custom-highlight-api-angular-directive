import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  Inject,
  Injector,
  input,
  runInInjectionContext,
  untracked,
} from '@angular/core';
import { SingleHighlighterProvider } from './single-highlighter-provider.service';

/**
 * How to use:
 *  1) In global styles file define styles like this:
 *      ::highlight(highlighter-type-single) {
 *          color: blue;
 *          text-decoration: palevioletred wavy underline;
 *      }
 *  2) Then Directive can be used like this:
 *     <p [appSingleHighlighterApi]="searchText()">lorem....<p>
 */
@Directive({
  selector: '[appSingleHighlighterApi]',
  standalone: true,
})
export class SingleHighlighterApiDirective implements AfterViewInit {
  // Input fields
  readonly inputTextToHighlight = input.required<string>({
    alias: 'appSingleHighlighterApi',
  });

  // Other variables
  private readonly currentRanges: Range[] = [];
  private readonly treeWalker: TreeWalker;

  constructor(
    private readonly el: ElementRef,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly injector: Injector,
    private readonly singleHighlighterProvider: SingleHighlighterProvider,
  ) {
    this.treeWalker = this.document.createTreeWalker(this.el.nativeElement, NodeFilter.SHOW_TEXT);
  }

  ngAfterViewInit() {
    runInInjectionContext(this.injector, () => {
      this.trackInputSearchTextChanges();
    });
  }

  private trackInputSearchTextChanges(): void {
    effect(() => {
      const inputTextToHighlight = this.inputTextToHighlight();

      untracked(() => {
        // Resets state before next search
        this.resetTreeWalker();
        this.resetCurrentRanges();

        if (!inputTextToHighlight) {
          return;
        }

        // Extracts Text Nodes from the DOM
        const allTextNodes: Node[] = this.collectTextNodes();

        // Finds Ranges to highlight
        const rangesToHighlight = this.getRangesToHighlight(allTextNodes, inputTextToHighlight);

        // Saves ranges
        this.currentRanges.push(...rangesToHighlight);

        this.addRangesToHighlighter(this.currentRanges);
      });
    });
  }

  private getRangesToHighlight(textNodes: Node[], searchText: string): Range[] {
    const ranges = textNodes
      .map((el: Node) => {
        return { el, text: el.textContent!.toLowerCase()! };
      })
      .map(({ text, el }) => {
        const indices = [];
        let startPos = 0;
        while (startPos < text.length) {
          const index = text.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase(), startPos);
          if (index === -1) {
            break;
          }
          indices.push(index);
          startPos = index + searchText.length;
        }

        return indices.map((index: number) => {
          const range = new Range();
          range.setStart(el, index);
          range.setEnd(el, index + searchText.length);
          return range;
        });
      });
    return ranges.flat();
  }

  private addRangesToHighlighter(ranges: Range[]): void {
    for (const range of ranges) {
      this.singleHighlighterProvider.highlighter.add(range);
    }
  }

  private resetCurrentRanges(): void {
    this.singleHighlighterProvider.clearRanges(this.currentRanges);
    this.currentRanges.length = 0;
  }

  private resetTreeWalker(): void {
    this.treeWalker.currentNode = this.treeWalker.root;
  }

  private collectTextNodes(): Node[] {
    const allTextNodes: Node[] = [];
    let currentNode = this.treeWalker.nextNode();
    while (currentNode) {
      allTextNodes.push(currentNode);
      currentNode = this.treeWalker.nextNode();
    }

    return allTextNodes;
  }
}
