import { InterceptorService } from './loader/interceptor.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { MatIconModule } from '@angular/material/icon';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { MatSliderModule } from '@angular/material/slider';
import {MatSidenavModule} from '@angular/material/sidenav'
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {NgProgressModule} from 'ngx-progressbar'
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatGridListModule} from '@angular/material/grid-list';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CovalentLayoutModule,
    MatIconModule,
    AngularFileUploaderModule,
    MatSliderModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatSelectModule,
    FormsModule,
    NgProgressModule,
    MatProgressBarModule,
    MatGridListModule,
    SharedModule,
    HttpClientModule,
    DragDropModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
