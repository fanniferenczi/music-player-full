import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  sendArray = new Subject();
  sendAudio=new Subject();
  sendNext=new Subject();
  sendBack=new Subject();

  constructor() { }

  communicateArray(array:any){
    this.sendArray.next(array);
  }

  communicateSong(audio:any){
    this.sendAudio.next(audio);
  }

  communicateNext(audio:any){
    this.sendNext.next(audio);
  }
  communicateBack(audio:any){
    this.sendBack.next(audio);
  }
}
