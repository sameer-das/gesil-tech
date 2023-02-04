import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appImageFallback]'
})
export class ImageFallbackDirective {
  @Input() appImageFallback!: string;
  constructor(private elementRef: ElementRef) { 
    console.log('appImageFallback')
  }

  @HostListener('error')
  loadFallbackImage(){
    console.log('appImageFallback Image load error')
    const element:HTMLImageElement = <HTMLImageElement>this.elementRef.nativeElement;
    element.src = this.appImageFallback || 'assets/avatar/avatar.png';
  }
}
