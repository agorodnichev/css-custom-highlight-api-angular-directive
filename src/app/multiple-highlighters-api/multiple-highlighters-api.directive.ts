import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, effect, ElementRef, Inject, Injector, input, runInInjectionContext } from '@angular/core';
import { MultipleHighlightersProvider } from './multiple-highlighters-provider.service';

@Directive({
  selector: '[appMultipleHighlightersApi]',
  standalone: true
})
export class MultipleHighlightersApiDirective implements AfterViewInit {

  readonly inputTextToHighlight = input.required<string>({
    alias: 'appMultipleHighlightersApi',
  });

  private currentRanges: Range[] | null = null;

  private readonly treeWalker: TreeWalker;

  constructor(
    private readonly el: ElementRef,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly injector: Injector,
    private readonly multipleHighlightersProvider: MultipleHighlightersProvider
  ) {

    this.treeWalker = this.document.createTreeWalker(
      this.el.nativeElement,
      NodeFilter.SHOW_TEXT
    )
  }

  ngAfterViewInit() {
    runInInjectionContext(this.injector, () => {
      this.trackInputSearchTextChanges();
    })
  }

  private trackInputSearchTextChanges(): void {
    effect(() => {
      const inputTextToHighlight = this.inputTextToHighlight();

      this.resetStateBeforeNewSearch();

      if (!inputTextToHighlight) {
        this.multipleHighlightersProvider.highlighter.clear();
        return;
      }

      const allTextNodes: Node[] = this.collectTextNodes();

      this.currentRanges = this.getRangesToHighlight(allTextNodes, inputTextToHighlight);

      this.addRangesToHighlighter(this.currentRanges);
    })
  }


  private getRangesToHighlight(textNodes: Node[], searchText: string): Range[] {
    const ranges = textNodes.map((el: Node) => {
      return { el, text: el.textContent!.toLowerCase()! }
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
        })
      })
    return ranges.flat();
  }

  private addRangesToHighlighter(ranges: Range[]): void {
    for (const range of ranges) {
      this.multipleHighlightersProvider.highlighter.add(range);
    }
  }

  private resetStateBeforeNewSearch(): void {
    this.resetTreeWalker();
    if (this.currentRanges) {
      this.resetCurrentRanges();
    }
  }

  private resetCurrentRanges(): void {
    this.currentRanges?.forEach((range: Range) => {
      this.multipleHighlightersProvider.highlighter.delete(range);
    });
    this.currentRanges = null;
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

    return allTextNodes
  }

}
