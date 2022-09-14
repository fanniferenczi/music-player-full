import { LoaderService } from './../../../loader/loader.service';
import { SongService } from './../../song.service';
import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
interface Weight {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  arrayFromSidebar:any
  currentlyPlaying:any

  constructor( private songService:SongService, public loaderService:LoaderService) { }

  ngOnInit(): void {
    
   this.songService.sendArray.subscribe(array=>{
     this.arrayFromSidebar=array
   })

   this.songService.sendNext.subscribe(audio=>{
      this.currentlyPlaying=audio
      this.playNextSong(this.currentlyPlaying)
   })

   this.songService.sendBack.subscribe(audio=>{
     this.currentlyPlaying=audio
     this.playPrevSong(this.currentlyPlaying)
   })

  }



  public selectedWeight?:number

  weights: Weight[] = [
    {value: 1, viewValue: '1'},
    {value: 5, viewValue: '5'},
    {value: 10, viewValue: '10'},
  ]

  public isPlaying:boolean=false;
  active:any;
 
  play(song:InstanceType<typeof Audio>){
    this.songService.communicateSong(song)
    this.active=song
  }

  playNextSong(song:any){
    if(this.arrayFromSidebar.length!==0 ){
        let currentIndex=this.arrayFromSidebar.indexOf(song)
      if(currentIndex >= this.arrayFromSidebar.length-1){
        this.play(this.arrayFromSidebar[0])
      }
      else{
        this.play(this.arrayFromSidebar[currentIndex+1])
      }
    }
  }

  playPrevSong(song:any){
    if(this.arrayFromSidebar.length!==0){
      if(song.currentTime > 3){
        song.currentTime=0
        this.play(song)
      } 
      else{
        let currentIndex=this.arrayFromSidebar.indexOf(song)
        if(currentIndex <= 0){
          this.play(this.arrayFromSidebar[this.arrayFromSidebar.length-1])
        }
        else{
          this.play(this.arrayFromSidebar[currentIndex-1])
        }
      } 
    }
  }

  onDelete(song:any){
    const index: number=this.arrayFromSidebar.indexOf(song)
    if(index!==-1){
      this.arrayFromSidebar.splice(index,1)
    }
  }

  public onWeightChange(song:any){
  }


 /* drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.arrayFromSidebar, event.previousIndex, event.currentIndex);
  }*/

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.arrayFromSidebar, event.previousIndex, event.currentIndex)
    } else {
      /*transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );*/
      this.songService.communicateIndexes(event.previousIndex,event.currentIndex)
    }
  }

  items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);

}
