import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      id: [0],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.id ? this.getUserDetail(this.id) : '';
    });
  }

  getUserDetail(id: string) {
    this.userService.getUserById(id).subscribe(
      next => {
        this.userForm.patchValue(next.data);
      }, err => {
        console.log(err)
      }
    )
  }

  saveUser() {
    if(this.userForm.get('id')?.value) {
      this.userService.updateUser(this.userForm.value).subscribe(
        next => this.router.navigate(['users']),
        err => console.log(err)
      )
    } else {
      this.userService.addUser(this.userForm.value).subscribe(
        next => this.router.navigate(['users']),
        err => console.log(err)
      )
    }
  }
}
