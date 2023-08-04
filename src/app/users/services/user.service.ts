import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {

  users = [
    { "id": 1, "firstName": "Superman", "lastName": "sup", "gender": "male" },
    { "id": 2, "firstName": "Batman", "lastName": "bat", "gender": "male" },
    { "id": 5, "firstName": "BatGirl", "lastName": "bg", "gender": "female" },
    { "id": 3, "firstName": "Robin", "lastName": "rb", "gender": "male" },
    { "id": 4, "firstName": "Rose", "lastName": "fl", "gender": "female" },
    { "id": 6, "firstName": "Max", "lastName": "super", "gender": "male" },
    { "id": 7, "firstName": "Mona", "lastName": "Seth", "gender": "male" },
    { "id": 8, "firstName": "Joker", "lastName": "jojo", "gender": "female" },
    { "id": 9, "firstName": "Jeni", "lastName": "robert", "gender": "male" },
    { "id": 10, "firstName": "Honey", "lastName": "SIngh", "gender": "female" }
  ];

  url: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  /**
   * 
   * @param pageNumber 
   * @returns filtered paginated data based on page number
   */
  getUsers(pageNumber: number): Observable<any> {
    // return this.http.get(this.url).pipe(map((res: any) => {
    //   const startIndex = pageNumber ? (pageNumber - 1)* 5 :  pageNumber;
    //   const endIndex = startIndex + 5;
    //   const userToDisplay = res.users.slice(startIndex, endIndex);
    //   const response = {
    //     status: '200',
    //     data: userToDisplay,
    //     totalUsers: res.users.length
    //   }
    //   return response;
    // }))
    
    // throw new Error('My Pretty Error');
    const startIndex = pageNumber ? (pageNumber - 1) * 5 : pageNumber;
    const endIndex = startIndex + 5;
    const userToDisplay = this.users.slice(startIndex, endIndex);
    const response = {
      status: '200',
      data: userToDisplay,
      totalUsers: this.users.length
    }
    return of(response);
  }

  /**
   * 
   * @param id 
   * @returns user detail based on id
   */
  getUserById(id: string): Observable<any> {
    const user = this.users.find(user => user.id.toString() == id);
    const response = {
      status: '200',
      data: user
    }
    return of(response);
  }

  /**
   * 
   * @param userDetail 
   * @returns update user detail on server
   */
  updateUser(userDetail: any): Observable<{ status: string; }> {
    const index = this.users.findIndex(user => user.id.toString() == userDetail.id);
    this.users.splice(index, 1, userDetail);
    const response = {
      status: '200',
    }
    return of(response);
  }

  addUser(userDetail: any) {
    const ids = this.users.map(object => {
      return object.id;
    });
    const max = Math.max(...ids);
    userDetail.id = max + 1;
    this.users.push(userDetail);
    console.log(this.users);
    const response = {
      status: '200',
    }
    return of(response);
  }

  deleteUser(id: number) {
    this.users.splice(this.users.findIndex(user => user.id == id), 1);
    const response = {
      status: '200',
    }
    return of(response);
  }

  getStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getStatusFromServer()
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  getStatusFromServer() {
    let status = ["Red", "Blue",
      "Yellow", "Green"];

    let randomStatus = status[(Math.floor(Math.random() * status.length))]
    return of(randomStatus);
  }




}
