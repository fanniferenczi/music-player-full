import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  sendAudio=new Subject()
  sendCurrentForNext=new Subject()
  sendCurrentForPrev=new Subject()
  sendAddedSong=new Subject()
  sendNextSongTitle=new Subject()
  sendTabs=new Subject()

  constructor() { }

  communicateAddedSong(audio:any){
    this.sendAddedSong.next(audio)
  }
  
  communicateSong(audio:any){
    this.sendAudio.next(audio)
  }

  commCurrentForNext(audio:any){
    this.sendCurrentForNext.next(audio)
  }
  commCurrentForPrev(audio:any){
    this.sendCurrentForPrev.next(audio)
  }

  communicateNextSongTitle(sonsTitle:string){
    this.sendNextSongTitle.next(sonsTitle)
  }

  communicateTabs(queues:string[]){
    this.sendTabs.next(queues)
  }
}
