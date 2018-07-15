"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ResponseMessage = /** @class */ (function () {
    function ResponseMessage() {
    }
    return ResponseMessage;
}());
exports.ResponseMessage = ResponseMessage;
var UploadAdapter = /** @class */ (function () {
    function UploadAdapter(http, loader, url, maxSize) {
        this.http = http;
        this.loader = loader;
        this.url = url;
        this.maxSize = maxSize;
    }
    UploadAdapter.prototype.upload = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var file = _this.loader.file;
            var genericError = "Cannot upload file:" + file.name;
            if (file.size > _this.byte(_this.maxSize)) {
                return reject("Out of the maxSize " + _this.maxSize);
            }
            var data = new FormData();
            data.append('upload', _this.loader.file);
            _this.http.post(_this.url, data).pipe(operators_1.catchError(_this.handleError("upload " + file.name + " to server", null, reject))).subscribe(function (response) {
                if (!response || !response.uploaded) {
                    reject(response && response.error ? response.error : genericError);
                }
                else {
                    resolve({
                        default: response.url,
                        uploaded: response.uploaded || 1,
                        uploadedPercent: response.uploadedPercent || 1,
                        uploadTotal: response.uploadTotal
                    });
                }
            });
        });
    };
    UploadAdapter.prototype.abort = function () {
    };
    UploadAdapter.prototype.byte = function (size) {
        var regex = /[^\d]/g;
        size = size.toLowerCase();
        var _size = +size.replace(regex, '');
        if (size.endsWith('kb') || size.endsWith('k')) {
            return _size * 1024;
        }
        else if (size.endsWith('mb') || size.endsWith('m')) {
            return _size * 1024 * 1024;
        }
        else {
            return 0;
        }
    };
    UploadAdapter.prototype.handleError = function (operation, result, reject) {
        if (operation === void 0) { operation = 'operation'; }
        return function (error) {
            reject(operation + " [ fail! ]");
            console.error(error);
            return rxjs_1.of(result);
        };
    };
    return UploadAdapter;
}());
exports.UploadAdapter = UploadAdapter;
//# sourceMappingURL=upload-adapter.js.map