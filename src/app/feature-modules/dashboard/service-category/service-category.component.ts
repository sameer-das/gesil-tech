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
    // console.log(service);
    if (service.route?.substring(1) === 'pan') {
      // Redirect to PAN portal, URL comes from backend
      this._popupService.openConfirm({
        header: 'Redirect Alert!',
        message: 'You will be redirected to PAN portal for PAN related transactions.',
        showCancelButton: true
      }).afterClosed().subscribe((isOk: boolean) => {
        if (isOk) {
          console.log('Call API');
          this._loaderService.showLoader();
          this._authService.getPANUrl(this.currentUser.user.user_ID).subscribe({
            next: (response: any) => {
              this._loaderService.hideLoader();
              if(response.status === 'Success' && response.code === 200 && response.data !== '') {
                window.open(response.data, '_blank');
              } else {
                this._popupService.openAlert({
                  header: 'Alert',
                  message:'Something went wrong while fetching details for PAN. Please contact support team!'
                });
              }
            }, error: (error: any) => {
              this._loaderService.hideLoader();
              this._popupService.openAlert({
                header: 'Fail',
                message:'Error while fetching details for PAN. Please contact support team!'
              });
            }
          })
        } else {
          console.log('Dont redirect')
        }
      });

      return;
    }

    if(this.notImplemented.includes(service.route?.substring(1)) || !service.route) {
      this._popupService.openAlert({
        header:'Coming Soon',
        message: 'This service is under development.'
      })
    }
  }

}
