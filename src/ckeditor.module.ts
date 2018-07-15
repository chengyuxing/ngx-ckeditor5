import { NgModule } from '@angular/core';
import { CkEditorComponent } from './ck-editor.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UploadAdapter,ResponseMessage } from './upload-adapter';

@NgModule({
  imports: [],
  exports:[
    FormsModule,
    HttpClientModule,
    UploadAdapter,
    ResponseMessage
  ],
  declarations: [CkEditorComponent]
})
export class CkeditorModule { }
