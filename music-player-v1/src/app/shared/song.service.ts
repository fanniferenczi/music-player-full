import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  sendAudio=new Subject()
  sendNext=new Subject()
  sendBack=new Subject()
  sendIndexes=new Subject()
  sendAddedSong=new Subject()
  sendSongAndIndex=new Subject()
  sendNextSongTitle=new Subject()

  communicateAddedSong(audio:any){
    this.sendAddedSong.next(audio)
  }
  constructor() { }

  communicateSong(audio:any){
    this.sendAudio.next(audio)
  }

  communicateNext(audio:any){
    this.sendNext.next(audio)
  }
  communicateBack(audio:any){
    this.sendBack.next(audio)
  }
  communicateIndexes(source:number,target:number){
    let indexes=[source,target]
    this.sendIndexes.next(indexes)
  }

  communicateSongAndIndex(audio:any,index:number){
    let songAndIndex=[audio,index];
    this.sendSongAndIndex.next(songAndIndex)
  }

  communicateNextSongTitle(sonsTitle:string){
    this.sendNextSongTitle.next(sonsTitle)
  }
}
