import {Injectable} from '@angular/core';
import {LocalStorageService} from 'ngx-webstorage';

@Injectable()
export class StorageService {
    constructor(private storage: LocalStorageService) {
    }

    public store(key: string, value: any): void {
        this.storage.store(key, value);
    }

    public retrieve(key: string): string {
        let value = this.storage.retrieve(key);
        if (value === null) {
            return '';
        } else {
            return value;
        }
    }

    public clear(key: string): void {
        this.storage.clear(key);
    }

    public clearAll(): void {
        this.storage.clear();
    }
}
