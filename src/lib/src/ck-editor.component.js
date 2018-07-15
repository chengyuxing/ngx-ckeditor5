"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var upload_adapter_1 = require("./upload-adapter");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
exports.CKEditors = {
    classic: typeof ClassicEditor === 'undefined' ? undefined : ClassicEditor,
    balloon: typeof BalloonEditor === 'undefined' ? undefined : BalloonEditor,
    decoupled: typeof DecoupledEditor === 'undefined' ? undefined : DecoupledEditor,
    inline: typeof InlineEditor === 'undefined' ? undefined : InlineEditor,
};
exports.CKEDITOR_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return CkEditorComponent; }),
    multi: true
};
exports.defaultConfig = {
    url: '/',
    maxSize: '5MB',
    useCkfinder: true
};
var CkEditorComponent = /** @class */ (function () {
    function CkEditorComponent(ngZone, http) {
        this.ngZone = ngZone;
        this.http = http;
        this.innerValue = '';
        this.readOnly = false;
        this.uploadConfig = {};
        this.change = new core_1.EventEmitter();
    }
    CkEditorComponent.prototype.propagateChange = function (_) { };
    CkEditorComponent.prototype.propagateTouch = function () { };
    CkEditorComponent.prototype.writeValue = function (obj) {
        var _this = this;
        this.innerValue = obj || '';
        if (this.ckInstance) {
            this.ckInstance.then(function (editor) {
                editor.setData(_this.innerValue);
                var val = editor.getData();
                editor.setData(val);
                return editor;
            });
        }
    };
    CkEditorComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    CkEditorComponent.prototype.registerOnTouched = function (fn) {
        this.propagateTouch = fn;
    };
    CkEditorComponent.prototype.setDisabledState = function (isDisabled) {
    };
    CkEditorComponent.prototype.ngAfterViewInit = function () {
        this.destoryCkEditor();
        this.initCkeditor();
        this.ckInstance.then(function (editor) { return console.log(editor); });
    };
    CkEditorComponent.prototype.ngOnDestroy = function () {
        this.destoryCkEditor();
    };
    CkEditorComponent.prototype.ngOnInit = function () {
    };
    CkEditorComponent.prototype.destoryCkEditor = function () {
        if (this.ckInstance) {
            this.ckInstance.then(function (editor) {
                editor.destory()
                    .catch(function (err) { return console.log(err); });
            });
        }
    };
    CkEditorComponent.prototype.initCkeditor = function () {
        if (typeof exports.CKEditors[this.type] === 'undefined') {
            return console.warn("CKEditor5.x-" + this.type + " not found! https://ckeditor.com/ckeditor-5/download/");
        }
        var opt = this.option();
        if (this.type === 'decoupled') {
            this.initDecoupledEditor(opt);
        }
        else {
            this.initOtherEditor(opt);
        }
    };
    CkEditorComponent.prototype.initDecoupledEditor = function (opt) {
        var _this = this;
        this.ckInstance = exports.CKEditors[this.type].create(this.textarea.nativeElement, opt)
            .then(function (editor) {
            var toolbarContainer = _this.div_toolbar.nativeElement;
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
            editor.isReadOnly = _this.readOnly;
            if (!opt.useCkfinder) {
                _this.registerUploadAdapter(editor, opt.url, opt.maxSize);
            }
            _this.registerHandle(editor);
            return editor;
        });
    };
    CkEditorComponent.prototype.initOtherEditor = function (opt) {
        var _this = this;
        exports.CKEditors[this.type].create(this.textarea.nativeElement, opt)
            .then(function (editor) {
            editor.isReadOnly = _this.readOnly;
            if (!opt.useCkfinder) {
                _this.registerUploadAdapter(editor, opt.url, opt.maxSize);
            }
            _this.registerHandle(editor);
            return editor;
        });
    };
    CkEditorComponent.prototype.option = function () {
        var option = Object.assign({}, { language: this.language }, exports.defaultConfig, this.uploadConfig);
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
    };
    /**
     * 注册事件
     * @param editor 编辑器实例
     */
    CkEditorComponent.prototype.registerHandle = function (editor) {
        var _this = this;
        var editorElement = editor.ui.view.editable.element;
        var toolbarElement = editor.ui.view.toolbar.element;
        var imageFileInput = toolbarElement.getElementsByClassName('ck-file-dialog-button')[0].lastChild;
        // 内容部分change事件
        editorElement.onkeyup = function () {
            _this.ngZone.run(function () {
                _this.handleChange(editor);
            });
        };
        // 内容部分click事件
        editorElement.onclick = function () {
            _this.ngZone.run(function () {
                _this.handleChange(editor);
            });
        };
        // 工具栏点击事件
        toolbarElement.onclick = function () {
            _this.ngZone.run(function () {
                _this.handleChange(editor);
            });
        };
        // 点击上传图片后触发事件
        imageFileInput.onchange = function () {
            _this.handleChange(editor);
        };
    };
    // 注册自定义文件上传适配器
    CkEditorComponent.prototype.registerUploadAdapter = function (editor, url, maxSize) {
        var _this = this;
        editor.plugins.get('FileRepository').createUploadAdapter = function (loader) { return new upload_adapter_1.UploadAdapter(_this.http, loader, url, maxSize); };
    };
    CkEditorComponent.prototype.handleChange = function (editor) {
        var data = editor.getData();
        if (this.innerValue !== data) {
            this.innerValue = data;
            this.propagateChange(data);
            this.propagateTouch();
            this.change.emit(data);
        }
    };
    __decorate([
        core_1.ViewChild('ck'),
        __metadata("design:type", core_1.ElementRef)
    ], CkEditorComponent.prototype, "textarea", void 0);
    __decorate([
        core_1.ViewChild('toolbar'),
        __metadata("design:type", core_1.ElementRef)
    ], CkEditorComponent.prototype, "div_toolbar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CkEditorComponent.prototype, "language", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CkEditorComponent.prototype, "type", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], CkEditorComponent.prototype, "toolbar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CkEditorComponent.prototype, "heading", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CkEditorComponent.prototype, "readOnly", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CkEditorComponent.prototype, "uploadConfig", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CkEditorComponent.prototype, "change", void 0);
    CkEditorComponent = __decorate([
        core_1.Component({
            // tslint:disable-next-line:component-selector
            selector: 'ck-editor',
            template: "<ng-container [ngSwitch]=\"type\">\n                <textarea #ck *ngSwitchCase=\"'classic'\"></textarea>\n                <div #ck *ngSwitchCase=\"'inline'\"></div>\n                <div #ck *ngSwitchCase=\"'balloon'\"></div>\n                <ng-container *ngSwitchCase=\"'decoupled'\">\n                    <div class=\"outer\">\n                        <div #toolbar></div>\n                        <div class=\"inner\">\n                            <div #ck></div>\n                        </div>\n                    </div>\n                </ng-container>\n              </ng-container>",
            styles: ["\n        .outer {\n          background-color: #eee;\n        }\n        .outer>.inner {\n          font-size: 17px;\n          line-height: 2.5rem;\n          padding: 5rem 10rem;\n          max-height: 700px;\n          overflow-y: auto;\n        }\n        .outer>.inner div {\n          max-width: 100%;\n          min-height: 29.7cm;\n          margin: 0 auto;\n          padding: 2cm 2cm;\n          border: 1px #d3d3d3 solid;\n          background-color: #fff;\n          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);\n        }\n  "],
            providers: [exports.CKEDITOR_VALUE_ACCESSOR]
        }),
        __metadata("design:paramtypes", [core_1.NgZone,
            http_1.HttpClient])
    ], CkEditorComponent);
    return CkEditorComponent;
}());
exports.CkEditorComponent = CkEditorComponent;
//# sourceMappingURL=ck-editor.component.js.map