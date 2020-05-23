import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';

// @Injectable({
//   providedIn: 'root'
// })
// export class RegisterService {

//   constructor() { }
// }

@Injectable({ providedIn: 'root' })
export class RegisterService {
    constructor(private http: HttpClient) { }


    register(user: User) {
        return this.http.post(`http://148.251.122.228:3000/authentication/registration`, user);
    }

}