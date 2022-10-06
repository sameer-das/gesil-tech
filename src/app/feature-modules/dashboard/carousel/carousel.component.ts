import { AfterViewInit, Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  public carousel_items: any[] = [
    {
      name: 'Mobile Recharge',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/mobile.png',
    },
    {
      name: 'DTH',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/dth.png',
    },
    {
      name: 'Post Paid',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/postpaid.png',
    },
    {
      name: 'Electricty',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/electricity.png',
    },
    {
      name: 'Transfer',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/money-transfer.png',
    },
    {
      name: 'Fastag',
      img:'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/fasttag.png'
    },
    {
      name: 'Gas',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/gas.png',
    },
    {
      name: 'Land Line',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/landline.png',
    },
    {
      name: 'Loan',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/loan.png',
    },
    {
      name: 'APES',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Indo-Nepal',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/indo-nepal.png',
    },
  ];

  customOptions: OwlOptions = {
    autoplay:true,
    autoplayTimeout:2000,
    autoplaySpeed:1500,
    autoplayHoverPause:true,

    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      576: {
        items: 4
      },
      768: {
        items: 6
      },
      992: {
        items: 8
      }
    },
    nav: false
  }
}
