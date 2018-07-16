import { NgModule } from '@angular/core';
import { CkEditorComponent } from './ck-editor.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    FormsModule,
    CkEditorComponent
  ],
  declarations: [CkEditorComponent]
})
export class CkeditorModule { }
