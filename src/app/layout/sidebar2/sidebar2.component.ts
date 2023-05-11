import {
  Component,
  OnInit,
  Directive,
  HostListener,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-sidebar2',
  templateUrl: './sidebar2.component.html',
  styleUrls: ['./sidebar2.component.scss'],
})
export class Sidebar2Component implements OnInit {
  constructor() {}
  menuCategories: any = {};
  ngOnInit(): void {
   this.menuCategories = JSON.parse(localStorage.getItem('menu_categories') || '{}' );
   console.log(this.menuCategories)
  }

  expand(e: any) {
    console.log(e);
  }
}

@Directive({
  selector: '[haveSubmenu]',
})
export class HaveSubmenuDirective {
  constructor(private _el: ElementRef) {}
  @HostListener('click') onClick() {
    if (this._el.nativeElement.nextSibling.classList.contains('active')) {
      this._el.nativeElement.classList.remove('active');
      this._el.nativeElement.nextSibling.classList.remove('active');
      setTimeout(() => {
        this._el.nativeElement.lastChild.innerText = 'arrow_right';
      },200)
    } else {
      this._el.nativeElement.nextSibling.classList.add('active');
      this._el.nativeElement.classList.add('active');
      setTimeout(() => {
        this._el.nativeElement.lastChild.innerText = 'arrow_drop_down';
      },200)
    }
  }
}
