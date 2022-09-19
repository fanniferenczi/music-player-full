import { LoaderService } from './../../../loader/loader.service';
import { SongService } from './../../song.service';
import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';

interface Weight {
  value: number;
  viewValue: string;
}

interface Pair {
  title: string;
  weight: number;
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

    sessionStorage.clear()
    
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
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
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
    sessionStorage.removeItem(song.title)
  }

  public onWeightChange(song:any){
    sessionStorage.setItem(song.title,song.weight)
  }



  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.arrayFromSidebar, event.previousIndex, event.currentIndex)
     
    } else {
     /* transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );*/
      this.songService.communicateIndexes(event.previousIndex,event.currentIndex)
    }
  }

  
  selected = new FormControl(0);
  tabs = ['Queue 1'];
  

  addTab() {

    this.tabs.push('Queue '+(this.tabs.length+1));
      this.selected.setValue(this.tabs.length - 1);

      let pairs: Pair[] = [ ]

      
        var keys = Object.keys(sessionStorage),
        i = 0, key;

    for (; key = keys[i]; i++) {
      let calculatedWeight:number=0

      
      switch(sessionStorage.getItem(key)){
        case '1':{ //0-1
          calculatedWeight=Math.random()
          break
        }
        case '2':{//1-2
          calculatedWeight=Math.random()*(2-1)+1
          break
        }
        case '3':{ //2-3
          calculatedWeight=Math.random()*(3-2)+2
          break
        }
        default: { //0-3
          calculatedWeight=Math.random()*(3-0)+0
          break
        }
      }

        let tmp:Pair={title: key, weight: Math.round(calculatedWeight*100)/100}
        pairs.push(tmp)
    }
    console.log(pairs)

    let sorted = pairs.sort((a,b)=>(a.weight>b.weight)?-1:1)
    console.log("sorted:")
    console.log(sorted)

   this.arrayFromSidebar=sorted.map(x=>this.arrayFromSidebar.find((item: { title: string; })=>item.title==x.title))

  }

  removeTab() {
    this.tabs.splice(this.selected.value, 1);
  }

}
