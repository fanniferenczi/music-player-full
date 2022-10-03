import { Tile } from './../../../app.component';
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
    activeSong:any
  }

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor( private songService:SongService, public loaderService:LoaderService) { }

  ngOnInit(): void { 

    this.songService.sendSongAndIndex.subscribe(array =>{
      this.songAndIndex=array
      if(this.tabs[this.selected.value].songs.findIndex(x=>x.title===this.songAndIndex[0].title)===-1){
          this.tabs[this.selected.value].songs.splice(this.songAndIndex[1],0,this.songAndIndex[0])
       }
      else{
        alert(this.songAndIndex[0]+" is already added!")
      }
    })

   this.songService.sendAddedSong.subscribe(audio=>{
    let addedSong:any=audio
    if(this.tabs[this.selected.value].songs.findIndex(x=>x.title===addedSong.title)===-1){
      this.tabs[this.selected.value].songs.push(audio)
    }
    else{
      alert(addedSong.title+" is already added!")
    }
   })

   this.songService.sendNext.subscribe(audio=>{
      this.currentlyPlaying=audio
      this.playNextSong(this.currentlyPlaying,this.playingTab)
   })

   this.songService.sendBack.subscribe(audio=>{
     this.currentlyPlaying=audio
     this.playPrevSong(this.currentlyPlaying,this.playingTab)
   })

  }
  songAndIndex:any
  arrayFromSidebar:any
  currentlyPlaying:any
  tmp:any
  
  tab1:Tab={listName:'Queue 1',songs:[],activeSong:''}

  public selectedWeight?:number

  weights: Weight[] = [
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
  ]

  public isPlaying:boolean=false;
  queueCounter=1;
  selected = new FormControl(0);
  tabs = [this.tab1];

  playingTab:Tab=this.tab1
 
  play(song:InstanceType<typeof Audio>,tab:Tab){
    this.songService.communicateSong(song)
    tab.activeSong=song;
    this.playingTab=tab
    let currentSongIndex=tab.songs.findIndex(x=>x.title===song.title)
    if(currentSongIndex==tab.songs.length-1){
      this.songService.communicateNextSongTitle(tab.songs[0].title)
    }
    else{
      this.songService.communicateNextSongTitle(tab.songs[currentSongIndex+1].title)  
    }    
  }

  playNextSong(song:any, tab:any){
    if(tab.songs.length!==0 ){
        let currentIndex=tab.songs.indexOf(song)
      if(currentIndex >= tab.songs.length-1){
        this.play(tab.songs[0],tab)
      }
      else{
        this.play(tab.songs[currentIndex+1],tab)
      }
    }
  }

  playPrevSong(song:any,tab:any){
    if(tab.songs.length!==0){
      if(song.currentTime > 3){
        song.currentTime=0
        this.play(song,tab)
      } 
      else{
        let currentIndex=tab.songs.indexOf(song)
        if(currentIndex <= 0){
          this.play(tab.songs[tab.songs.length-1],tab)
        }
        else{
          this.play(tab.songs[currentIndex-1],tab)
        }
      } 
    }
  } 
 

  onDelete(song:any,tabSongs:any){
    const index:number=tabSongs.indexOf(song)
    if(index!==-1){
      tabSongs.splice(index,1)
    }
    localStorage.removeItem(song.title)
  }

  public onWeightChange(song:any){
  }

  drop(event: CdkDragDrop<string[]>,songs:any,tab:Tab) {
    if (event.previousContainer === event.container) {
      moveItemInArray(songs,event.previousIndex,event.currentIndex)
    } else {
      this.songService.communicateIndexes(event.previousIndex,event.currentIndex)
    }
    let activeIndex=tab.songs.findIndex(x=>x.title===tab.activeSong.title)
    if(activeIndex==tab.songs.length-1){
      this.songService.communicateNextSongTitle(tab.songs[0].title)
    }
    else{
      this.songService.communicateNextSongTitle(tab.songs[activeIndex+1].title)  
    }    
  }

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

    let tab:Tab={listName:'Queue '+ ++this.queueCounter,songs:sorted.map(x=>this.tabs[this.selected.value].songs.find((item: { title: string; })=>item.title==x.title)),activeSong:''}
   
    this.tabs.push(tab)
    this.selected.setValue(this.tabs.length);
  }
  removeTab() {
    this.tabs.splice(this.selected.value, 1);
  }

}
