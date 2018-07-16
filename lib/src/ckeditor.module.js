"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ck_editor_component_1 = require("./ck-editor.component");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var common_1 = require("@angular/common");
var CkeditorModule = /** @class */ (function () {
    function CkeditorModule() {
    }
    CkeditorModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                http_1.HttpClientModule
            ],
            exports: [
                forms_1.FormsModule,
                ck_editor_component_1.CkEditorComponent
            ],
            declarations: [ck_editor_component_1.CkEditorComponent]
        })
    ], CkeditorModule);
    return CkeditorModule;
}());
exports.CkeditorModule = CkeditorModule;
//# sourceMappingURL=ckeditor.module.js.map