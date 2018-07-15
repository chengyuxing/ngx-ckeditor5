# ngx-ckeditor5

**The CKEditor5 component for angular(2.x,4.x,5.x,6.x).**

Before use this component , I think you already use the ckeditor5 on your normal js project.

 ## Installation 

- Import CKEditor js file , and language js file , in angular.json or index.html

  ```json
  "scripts": [
      "node_modules/@ckeditor/ckeditor5-build-decoupled-document/build/ckeditor.js",
      "node_modules/@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn.js"
   ]
  ```

  or

  ```html
  <script src="https://cdn.ckeditor.com/ckeditor5/10.1.0/decoupled-document/ckeditor.js"></script>
      <script src="https://cdn.ckeditor.com/ckeditor5/10.1.0/decoupled-document/translations/zh-cn.js"></script>
  ```

- Install `ngx-cheditor5`

  ```bash
  npm i ngx-ckeditor5 --save 
  or
  ng add ngx-ckeditor5(angular6.x)
  ```

## Sample

Import `CkeditorModule` module in your man module:

```typescript
// app.compoennt.ts
import { CkEditorModule } from 'ngx-ckeditor5';
@NgModule({
  imports: [
    // ...
    CkEditorModule
  ],
  // ...
})
export class AppModule { }

```

Then use in in your component :

```html
// app.component.html
<ck-editor [type]="'decoupled'" [uploadConfig]="config" [heading]="heading" [toolbar]="toolbar" [language]="'zh-cn'" [readOnly]="false" [(ngModel)]="content"></ck-editor>
```

```typescript
// app.compoennt.ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  toolbar = ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'];
  heading = {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
    ]
  };
  config = {
    url: '/springboot/upload',
    useCkfinder: false
  };
  content: any;
}

```

## `CKEditorCompoennt` options

| Type    | Name         | DataType | Allow Null | Default Value                             | Description                                                  |
| ------- | ------------ | -------- | ---------- | ----------------------------------------- | ------------------------------------------------------------ |
| Input   | type         | string   | Not        |                                           | Set the ckeditor type[classic, balloon, decoupled, inline],depend on your imported ckeditor's js file. |
| Input   | uploadConfig | {}       | Yes        | {url:"/",maxSize:"5M", useCkfinder: true} | Default UploadAdapter is CKFinder,but maxSize is invalid,set the useCKFinder to false,use another implementation ,and maxSize is available. |
| Input   | heading      | {}       | Yes        |                                           | if is unset, then default the ckeditor's heading.            |
| Input   | toolbar      | []       | Yes        |                                           | if is unset then default the ckeditor's toolbar.             |
| Input   | language     | string   | Yes        | "en"                                      | toolbar's language,depend on your ckeditor's language js file. |
| Input   | readOnly     | boolean  | Yes        | false                                     | Enable / disable editable.                                   |
| Two-way | ngModel      | string   | Yes        |                                           | Two-way binding the ckeditor's content.                      |

## Warn

This component's property `type` and imported js relation:

```html
// classic
<script src="https://cdn.ckeditor.com/ckeditor5/10.1.0/classic/ckeditor.js"></script>
// ...translations/....js

// balloon
<script src="https://cdn.ckeditor.com/ckeditor5/10.1.0/balloon/ckeditor.js"></script>
// ...translations/....js

// decoupled
<script src="https://cdn.ckeditor.com/ckeditor5/10.1.0/decoupled-document/ckeditor.js"></script>
// ...translations/....js

// inline
<script src="https://cdn.ckeditor.com/ckeditor5/10.1.0/inline/ckeditor.js"></script>
// ...translations/....js
```

