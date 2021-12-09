import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageService } from '../../../services/image/image.service';
import { FileService } from '../../../services/files/file.service';
import { finalize } from 'rxjs/operators';
import { BasicRequestService } from '../../../services/request/basic-request.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Request } from '../../../entity/request';
import { User } from '../../../entity/user';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss']
})
export class AddRequestComponent implements OnInit {
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  submitted: boolean = false;
  requestForm: FormGroup;
  waitingSubmit: boolean = false;
  subject: string = '';
  content: string = '';
  requestData = new Request();
  userOwner:User=new User();
  constructor(
    private authService: AuthService,
    private formLog: FormBuilder,
    private storage: AngularFireStorage,
    private service: ImageService,
    private requestService: BasicRequestService) {
    this.imgSrc = '/assets/img/image_placeholder.jpg';
  }

  ngOnInit(): void {
    this.requestForm = this.formLog.group({
      'object': ['', [Validators.required]],
      'content': ['', [Validators.required]],
      'imageUrl': ['']
    });
    this.waitingSubmit = false;
    this.authService.currentUserSubject.subscribe((user)=>{
      if(!user) return;
      this.userOwner=user;
    })
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = '/assets/img/image_placeholder.jpg';
      this.selectedImage = null;
    }
  }

  get f() {
    return this.requestForm.controls;
  }

  submit(formValue) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.requestForm.invalid) {
      return;
    }
    this.waitingSubmit = true;
    this.isSubmitted = true;

    if (this.requestForm.valid) {
      this.requestData.idOwner = this.authService.currentUser.id;
      this.requestData.requestContent = this.requestForm.value.content;
      this.requestData.requestSubject = this.requestForm.value.object;
      this.requestData.imgUrl = this.requestForm.value.imageUrl;
      if (this.requestForm.value.imageUrl) {
        var filePath = `requests/${this.authService.currentUser.id.toString()}/${this.requestData.id}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);
        this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              // formValue['imageUrl'] = url;
              this.requestForm.value.imageUrl = url;
              this.requestData.imgUrl = url;
              console.log('form urlImg: ', this.requestForm.value.imageUrl);
              this.requestService.addRequest(this.requestData);
              this.service.insertImageDetails(this.requestData);
              this.waitingSubmit = false;
              this.isSubmitted = false;
            });
          })
        ).subscribe();
      } else { 
        this.requestService.addRequest(this.requestData);
        this.waitingSubmit = false;
        this.isSubmitted = false;
      }
    }
  }

}
