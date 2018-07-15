import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ResponseMessage {
    uploadTotal: any;
    uploaded: number;
    uploadedPercent: number;
    url: string;
    error: string;
}

export class UploadAdapter {

    constructor(
        private http: HttpClient,
        private loader: any,
        private url: string,
        private maxSize: string
    ) { }

    upload(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const file = <File>this.loader.file;
            const genericError = `Cannot upload file:${file.name}`;
            if (file.size > this.byte(this.maxSize)) {
                return reject(`Out of the maxSize ${this.maxSize}`);
            }
            const data = new FormData();
            data.append('upload', this.loader.file);
            this.http.post<ResponseMessage>(this.url, data).pipe(
                catchError(this.handleError<ResponseMessage>(`upload ${file.name} to server`, null, reject))
            ).subscribe(response => {
                if (!response || !response.uploaded) {
                    reject(response && response.error ? response.error : genericError);
                } else {
                    resolve({
                        default: response.url,
                        uploaded: response.uploaded || 1,
                        uploadedPercent: response.uploadedPercent || 1,
                        uploadTotal: response.uploadTotal
                    });
                }
            }
            );
        });
    }

    abort() {

    }

    byte(size: string): number {
        const regex = /[^\d]/g;
        size = size.toLowerCase();
        const _size = +size.replace(regex, '');
        if (size.endsWith('kb') || size.endsWith('k')) {
            return _size * 1024;
        } else if (size.endsWith('mb') || size.endsWith('m')) {
            return _size * 1024 * 1024;
        } else {
            return 0;
        }
    }

    handleError<T>(operation = 'operation', result?: T, reject?: any) {
        return (error: any): Observable<T> => {
            reject(`${operation} [ fail! ]`);
            console.error(error);
            return of(result as T);
        };
    }
}
