import { NgModule } from '@angular/core';
import { CkEditorComponent } from './ck-editor.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [],
  exports:[
    FormsModule,
    HttpClientModule
  ],
  declarations: [CkEditorComponent]
})
export class CkeditorModule { }
