import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  sendAudio=new Subject()
  sendNext=new Subject()
  sendBack=new Subject()
  sendInformation=new Subject()
  sendAddedSong=new Subject()
  sendSongAndIndex=new Subject()
  sendNextSongTitle=new Subject()
  sendTabs=new Subject();

  constructor() { }

  communicateAddedSong(audio:any){
    this.sendAddedSong.next(audio)
  }
  
  communicateSong(audio:any){
    this.sendAudio.next(audio)
  }

  communicateNext(audio:any){
    this.sendNext.next(audio)
  }
  communicateBack(audio:any){
    this.sendBack.next(audio)
  }
  communicateInformation(source:number,target:number,sourcePlylistId:number){
    let indexes=[source,target,sourcePlylistId]
    this.sendInformation.next(indexes)
  }

  communicateSongAndIndex(audio:any,index:number){
    let songAndIndex=[audio,index];
    this.sendSongAndIndex.next(songAndIndex)
  }

  communicateNextSongTitle(sonsTitle:string){
    this.sendNextSongTitle.next(sonsTitle)
  }

  communicateTabs(queues:string[]){
    this.sendTabs.next(queues)
  }
}
