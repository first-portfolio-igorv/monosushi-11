import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { DiscountInfoComponent } from './pages/discount-info/discount-info.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductInfoComponent } from './pages/product-info/product-info.component';
import { AdminComponent } from './admin/admin.component';
import { AdminDiscountComponent } from './admin/admin-discount/admin-discount.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { AdminOrderComponent } from './admin/admin-order/admin-order.component';
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp} from '@angular/fire/app';
import { provideStorage, getStorage} from '@angular/fire/storage';
import { AboutComponent } from './pages/about/about.component';
import { CabinetComponent } from './pages/cabinet/cabinet.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    DeliveryComponent,
    DiscountComponent,
    DiscountInfoComponent,
    ProductComponent,
    ProductInfoComponent,
    AdminComponent,
    AdminDiscountComponent,
    AdminCategoryComponent,
    AdminProductComponent,
    AdminOrderComponent,
    AboutComponent,
    CabinetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
