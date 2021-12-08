import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { CustomFile } from '../../entity/custom-file';
import { EntityID } from '../../entity/EntityID';
import { FireBaseConstant } from './firebase-constant';
import { FirebaseApi } from './FirebaseApi';
import { ResultStatut } from './resultstatut';

@Injectable({
  providedIn: 'root'
})
export class FirebaseFile {
  db:any;
  constructor(private firebaseDatabaseApi:FirebaseApi) {
    this.db=this.firebaseDatabaseApi.getFirebaseFile().ref();
   }
  uploadFile(repos:string,file:CustomFile):BehaviorSubject<ResultStatut>
  {
    let result:ResultStatut=new ResultStatut();
    result.result=0;

    let subject:BehaviorSubject<ResultStatut>=new BehaviorSubject<ResultStatut>(result);

    let uploadTask=this.db.child(`${repos}/${(new EntityID()).toString()}.${file.getExtention()}`).put(file.data,{
      contentType:file.type
    })
    
    uploadTask.on(firebase.default.storage.TaskEvent.STATE_CHANGED,
      (snapshot)=>
      {
        result.result=Math.trunc((snapshot.bytesTransferred/snapshot.totalBytes) *100);
        switch(snapshot.state)
        {
          case firebase.default.storage.TaskState.PAUSED:
            result.apiCode=ResultStatut.UPLOAD_PAUSED;            
            subject.next(result);
            break;
          case firebase.default.storage.TaskState.RUNNING:
            result.apiCode=ResultStatut.UPLOAD_RUNNING;
            subject.next(result)
            break;
        }
      },
      (error)=>{
        result.apiCode=error.code;
        subject.error(result);
      },
      ()=>{
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
          file.link=downloadURL;
          result.apiCode=ResultStatut.SUCCESS;
          result.result=file;
          subject.next(result);
          subject.complete()
        })
      }
    )
    return subject;
  }
  
}

