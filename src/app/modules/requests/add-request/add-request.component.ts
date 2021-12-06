import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AngularFireStorage } from '@angular/fire/storage';
import { ImageService } from '../../../services/image/image.service';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss']
})
export class AddRequestComponent implements OnInit {

  imgSrc: string;
  selectedImage: any = null;
  submitted: boolean = false;
  requestForm: FormGroup;
  waitingSubmit: boolean = false;
  subject: string = '';
  content: string = '';
  constructor(
    private formLog: FormBuilder,
    // private storage: AngularFireStorage,
    private service: ImageService) {
      this.imgSrc = '/assets/img/image_placeholder.jpg';
  }

  ngOnInit(): void {
    this.requestForm = this.formLog.group({
      'subject': ['', [Validators.required]],
      'content': ['', [Validators.required]],
      'imageUrl': ['']
    });
    this.waitingSubmit = false;
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

  submit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.requestForm.invalid) {
      return;
    }
    this.waitingSubmit = true;
  }

}
