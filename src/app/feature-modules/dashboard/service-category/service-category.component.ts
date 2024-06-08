import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-service-category',
  templateUrl: './service-category.component.html',
  styleUrls: ['./service-category.component.scss']
})
export class ServiceCategoryComponent implements OnInit {

  constructor(private router:Router, private _popupService: PopupService,
    private _loaderService: LoaderService, private _authService: AuthService) { }
  menuCategories = JSON.parse(localStorage.getItem('menu_categories') || '{}' );
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');

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

  notImplemented = ['AEPS','New-Adhar','Print-PVC','PGDCA','DCA','pan']
  getRoutePath(path:string) {
    return `${path}`;
  }

  getState(service:any) {
    return {services_ID: service.services_ID ,services_Cat_ID: service.services_Cat_ID}
  }

  onTileClick(service: any){
    console.log(`setServiceDetails ==== service_id ${service.services_ID }, service_cat_id ${service.services_Cat_ID}`)
    sessionStorage.setItem('current_service', JSON.stringify({services_ID: service.services_ID, services_Cat_ID: service.services_Cat_ID    }));
  }

}
