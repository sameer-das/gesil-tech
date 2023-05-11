import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/popups/popup.service';

@Component({
  selector: 'app-service-category',
  templateUrl: './service-category.component.html',
  styleUrls: ['./service-category.component.scss']
})
export class ServiceCategoryComponent implements OnInit {

  constructor(private router:Router, private _popupService: PopupService) { }
  menuCategories = JSON.parse(localStorage.getItem('menu_categories') || '{}' );

  category: any = {}
   ngOnInit(): void {
    // console.log(this.router.url)

    this.category = this.menuCategories.menuCategories.find((curr:any) => curr.services_Name === this.router.url.substring(1).split('-').join(' ') )
    // console.log(this.category)
  }


  assetPath: string = 'assets/icons/newicons/';
  getImagePath(imageName: string) {
    return `${this.assetPath}${imageName}`;
  }

  notImplemented = ['AEPS','New-Adhar','Print-PVC','PGDCA','DCA']
  getRoutePath(path:string) {
    if(path === '/Mobile-Recharge')
      return path.toLowerCase();

      //if not implemented or null go to same url
    if(this.notImplemented.includes(path?.substring(1)) || !path){
      return this.router.url;
    }

    return `../bbps/service${path ? path : '/'}`;
  }

  getState(service:any) {
    return {services_ID: service.services_ID ,services_Cat_ID: service.services_Cat_ID}
  }

  onTileClick(service: any){
    // console.log(service);
    if(this.notImplemented.includes(service.route?.substring(1)) || !service.route) {
      this._popupService.openAlert({
        header:'Coming Soon',
        message: 'This service is under development.'
      })
    }
  }

}
