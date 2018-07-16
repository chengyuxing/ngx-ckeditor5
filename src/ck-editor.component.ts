import { HttpClient } from '@angular/common/http';
import { UploadAdapter } from './upload-adapter';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  forwardRef,
  AfterViewInit,
  NgZone,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

declare var ClassicEditor: any;
declare var BalloonEditor: any;
declare var DecoupledEditor: any;
declare var InlineEditor: any;

export const CKEditors: { [type: string]: any } = {
  classic: typeof ClassicEditor === 'undefined' ? undefined : ClassicEditor,
  balloon: typeof BalloonEditor === 'undefined' ? undefined : BalloonEditor,
  decoupled: typeof DecoupledEditor === 'undefined' ? undefined : DecoupledEditor,
  inline: typeof InlineEditor === 'undefined' ? undefined : InlineEditor,
};

export const CKEDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CkEditorComponent),
  multi: true
};

export const defaultConfig: any = {
  url: '/',
  maxSize: '5MB',
  useCkfinder: true
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ck-editor',
  template: `<ng-container [ngSwitch]="type">
                <textarea #ck *ngSwitchCase="'classic'"></textarea>
                <div #ck *ngSwitchCase="'inline'"></div>
                <div #ck *ngSwitchCase="'balloon'"></div>
                <ng-container *ngSwitchCase="'decoupled'">
                    <div class="outer">
                        <div #toolbar></div>
                        <div class="inner">
                            <div #ck></div>
                        </div>
                    </div>
                </ng-container>
              </ng-container>`,
  styles: [`
        .outer {
          background-color: #eee;
        }
        .outer>.inner {
          font-size: 17px;
          line-height: 2.5rem;
          padding: 5rem 10rem;
          max-height: 700px;
          overflow-y: auto;
        }
        .outer>.inner div {
          max-width: 100%;
          min-height: 29.7cm;
          margin: 0 auto;
          padding: 2cm 2cm;
          border: 1px #d3d3d3 solid;
          background-color: #fff;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
  `],
  providers: [CKEDITOR_VALUE_ACCESSOR]
})
export class CkEditorComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  private ckInstance: any;

  private innerValue = '';

  @ViewChild('ck') textarea: ElementRef;
  @ViewChild('toolbar') div_toolbar: ElementRef;

  @Input() public language: string;
  @Input() public type: string;
  @Input() public toolbar: string[];
  @Input() public heading: {};
  @Input() public readOnly = false;
  @Input() public uploadConfig = {};

  @Output() change = new EventEmitter();

  private propagateChange(_: any) { }
  private propagateTouch() { }

  writeValue(obj: any): void {
    this.innerValue = obj || '';
    if (this.ckInstance) {
      this.ckInstance.then(editor => {
        editor.setData(this.innerValue);
        const val = editor.getData();
        editor.setData(val);
        return editor;
      });
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {

  }

  constructor(
    private ngZone: NgZone,
    private http: HttpClient
  ) { }

  ngAfterViewInit(): void {
    this.destoryCkEditor();
    this.initCkeditor();
  }

  ngOnDestroy(): void {
    this.destoryCkEditor();
  }

  ngOnInit() {

  }

  private destoryCkEditor() {
    if (this.ckInstance) {
      this.ckInstance.then(editor => {
        editor.destory()
          .catch(err => console.log(err));
      });
    }
  }

  private initCkeditor() {
    if (typeof CKEditors[this.type] === 'undefined') {
      return console.warn(`CKEditor5.x-${this.type} not found! https://ckeditor.com/ckeditor-5/download/`);
    }
    const opt = this.option();
    if (this.type === 'decoupled') {
      this.initDecoupledEditor(opt);
    } else {
      this.initOtherEditor(opt);
    }
  }

  private initDecoupledEditor(opt: any) {
    this.ckInstance = CKEditors[this.type].create(this.textarea.nativeElement, opt)
      .then(editor => {
        const toolbarContainer = this.div_toolbar.nativeElement;
        toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        editor.isReadOnly = this.readOnly;
        if (!opt.useCkfinder) {
          this.registerUploadAdapter(editor, opt.url, opt.maxSize);
        }
        this.registerHandle(editor);
        return editor;
      });
  }

  private initOtherEditor(opt: any) {
     this.ckInstance = CKEditors[this.type].create(this.textarea.nativeElement, opt)
      .then(editor => {
        editor.isReadOnly = this.readOnly;
        if (!opt.useCkfinder) {
          this.registerUploadAdapter(editor, opt.url, opt.maxSize);
        }
        this.registerHandle(editor);
        return editor;
      });
  }

  option(): { [key: string]: any } {
    const option = Object.assign({}, { language: this.language }, defaultConfig, this.uploadConfig);
    if (this.toolbar) {
      option['toolbar'] = this.toolbar;
    }
    if (this.heading) {
      option['heading'] = this.heading;
    }
    if (option.useCkfinder) {
      option['ckfinder'] = {
        uploadUrl: option.url
      };
    }
    return option;
  }

  /**
   * 注册事件
   * @param editor 编辑器实例
   */
  private registerHandle(editor: any) {

    const editorElement = <HTMLDivElement>editor.ui.view.editable.element;
    const toolbarElement = <HTMLDivElement>editor.ui.view.toolbar.element;
    const imageFileInput = <HTMLInputElement>toolbarElement.getElementsByClassName('ck-file-dialog-button')[0].lastChild;

    // 内容部分change事件
    editorElement.onkeyup = () => {
      this.ngZone.run(() => {
        this.handleChange(editor);
      });
    };

    // 内容部分click事件
    editorElement.onclick = () => {
      this.ngZone.run(() => {
        this.handleChange(editor);
      });
    };

    // 工具栏点击事件
    toolbarElement.onclick = () => {
      this.ngZone.run(() => {
        this.handleChange(editor);
      });
    };

    // 点击上传图片后触发事件
    imageFileInput.onchange = () => {
      this.handleChange(editor);
    };
  }

  // 注册自定义文件上传适配器
  private registerUploadAdapter(editor, url, maxSize) {
    editor.plugins.get('FileRepository').createUploadAdapter = loader => new UploadAdapter(this.http, loader, url, maxSize);
  }

  private handleChange(editor: any): void {
    const data = editor.getData();
    if (this.innerValue !== data) {
      this.innerValue = data;
      this.propagateChange(data);
      this.propagateTouch();
      this.change.emit(data);
    }
  }
}
