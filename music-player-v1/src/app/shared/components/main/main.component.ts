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

interface Tab
  {
    listName: string,
    songs: any[]
  }

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  arrayFromSidebar:any
  currentlyPlaying:any
  tmp:any
  

  constructor( private songService:SongService, public loaderService:LoaderService) { }

  ngOnInit(): void {

    localStorage.clear()
    
   this.songService.sendArray.subscribe(array=>{
     //this.arrayFromSidebar=array
     this.tmp=array
     //this.tab1.songs=this.arrayFromSidebar
     //this.tabs.splice(this.selected.value, 1,);
     this.tabs[this.selected.value].songs=this.tmp
     
   })
   this.songService.sendAddedSong.subscribe(audio=>{
    this.tabs[this.selected.value].songs.push(audio)
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
  tab1:Tab={listName:'Queue 1',songs:[]}

  public selectedWeight?:number

  weights: Weight[] = [
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
  ]

  public isPlaying:boolean=false;
  active:any;
  queueCounter=1;
 
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

  onDelete(song:any,tabSongs:any){
    // const index: number=this.arrayFromSidebar.indexOf(song)
    const index:number=tabSongs.indexOf(song)
    if(index!==-1){
      // this.arrayFromSidebar.splice(index,1)
      tabSongs.splice(index,1)
    }
    localStorage.removeItem(song.title)
  }

  public onWeightChange(song:any){
    //localStorage.setItem(song.title,song.weight)

  }



  drop(event: CdkDragDrop<string[]>,songs:any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(songs,event.previousIndex,event.currentIndex)
      // moveItemInArray(this.arrayFromSidebar, event.previousIndex, event.currentIndex)
     
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
  tabs = [this.tab1];
  

  generate(){
    let activeTab=this.tabs[this.selected.value]
    let pairs: Pair[] = [ ]
    for(let i=0;i<activeTab.songs.length;i++){
      let calculatedWeight:number=0
      
      switch(activeTab.songs[i].weight){
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

        let tmp:Pair={title: activeTab.songs[i].title, weight: Math.round(calculatedWeight*100)/100}
        pairs.push(tmp)
    }
    console.log(pairs)

    let sorted = pairs.sort((a,b)=>(a.weight>b.weight)?-1:1)
    console.log("sorted:")
    console.log(sorted)

    //let tab:Tab={listName:'Queue '+(this.tabs.length+1),songs:sorted.map(x=>this.arrayFromSidebar.find((item: { title: string; })=>item.title==x.title))}
    let tab:Tab={listName:'Queue '+ ++this.queueCounter,songs:sorted.map(x=>this.tabs[this.selected.value].songs.find((item: { title: string; })=>item.title==x.title))}
    
    /*tab.songs.forEach(
      (song) => song.weight=null
    )*/
    this.tabs.push(tab)
    this.selected.setValue(this.tabs.length);
  }

  addTab() {
    // this.tabs.push('Queue '+(this.tabs.length+1));     
        let pairs: Pair[] = [ ]
     
        var keys = Object.keys(localStorage),
        i = 0, key;

    for (; key = keys[i]; i++) {
      let calculatedWeight:number=0

      
      switch(localStorage.getItem(key)){
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

    //let tab:Tab={listName:'Queue '+(this.tabs.length+1),songs:sorted.map(x=>this.arrayFromSidebar.find((item: { title: string; })=>item.title==x.title))}
    let tab:Tab={listName:'Queue '+(this.tabs.length+1),songs:sorted.map(x=>this.tabs[this.selected.value].songs.find((item: { title: string; })=>item.title==x.title))}
    this.tabs.push(tab)
    this.selected.setValue(this.tabs.length);
    // this.arrayFromSidebar=sorted.map(x=>this.arrayFromSidebar.find((item: { title: string; })=>item.title==x.title))
  }

  removeTab() {
    this.tabs.splice(this.selected.value, 1);
  }


}
