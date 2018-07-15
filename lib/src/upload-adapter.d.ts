import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export declare class ResponseMessage {
    uploadTotal: any;
    uploaded: number;
    uploadedPercent: number;
    url: string;
    error: string;
}
export declare class UploadAdapter {
    private http;
    private loader;
    private url;
    private maxSize;
    constructor(http: HttpClient, loader: any, url: string, maxSize: string);
    upload(): Promise<any>;
    abort(): void;
    byte(size: string): number;
    handleError<T>(operation?: string, result?: T, reject?: any): (error: any) => Observable<T>;
}
