import { HttpClient } from '@angular/common/http';
import { OnInit, ElementRef, AfterViewInit, NgZone, EventEmitter, OnDestroy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare const CKEditors: {
    [type: string]: any;
};
export declare const CKEDITOR_VALUE_ACCESSOR: any;
export declare const defaultConfig: any;
export declare class CkEditorComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
    private ngZone;
    private http;
    private ckInstance;
    private innerValue;
    textarea: ElementRef;
    div_toolbar: ElementRef;
    language: string;
    type: string;
    toolbar: string[];
    heading: {};
    readOnly: boolean;
    uploadConfig: {};
    change: EventEmitter<{}>;
    private propagateChange;
    private propagateTouch;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState?(isDisabled: boolean): void;
    constructor(ngZone: NgZone, http: HttpClient);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    private destoryCkEditor;
    private initCkeditor;
    private initDecoupledEditor;
    private initOtherEditor;
    option(): {
        [key: string]: any;
    };
    /**
     * 注册事件
     * @param editor 编辑器实例
     */
    private registerHandle;
    private registerUploadAdapter;
    private handleChange;
}
