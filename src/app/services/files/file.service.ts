import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { CustomFile } from '../../entity/custom-file';
import { FirebaseFile } from '../firebase/FirebaseFile.service';
import { ResultStatut } from '../firebase/resultstatut';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    constructor(
    private firebaseApiFile: FirebaseFile,
    )
    {}
    uploadFileWithProgression(dir: string, files: CustomFile[]): BehaviorSubject<ResultStatut>
    {
      let result: ResultStatut = new ResultStatut();
      result.result = {
        file: "",
        percent: 0,
        url: ""
      }
      let subject: BehaviorSubject<ResultStatut> = new BehaviorSubject<ResultStatut>(result)
      files.forEach((file: CustomFile) => this.firebaseApiFile.uploadFile(dir, file).subscribe({
        next: (value) => {
          result.apiCode = value.apiCode;
          result.result.file = file.name;
          if (value.apiCode == ResultStatut.SUCCESS) 
          {
            result.result.url = value.result.link;
            result.result.percent = 100;
          }
          else { result.result.percent = value.result; }
          subject.next(result);
        },
        complete: () => subject.complete()
      }))
      return subject;
    }
    uploadFile(dir: string, files: CustomFile[]): Promise<ResultStatut>
    {
      return new Promise<ResultStatut>((resolve, reject) => {
        let fLink: CustomFile[] = [];
        forkJoin(files.map((file: CustomFile) => this.firebaseApiFile.uploadFile(dir, file))).subscribe({
          next: (value) => fLink = value.map((result: ResultStatut) => result.result),
          complete: () => {
            let result: ResultStatut = new ResultStatut();
            result.result = fLink;
            resolve(result)
          },
          error: (error) => reject(error)
        })
      })
    }
    
}
