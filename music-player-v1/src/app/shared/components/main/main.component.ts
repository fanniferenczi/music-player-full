import { SonglibraryService } from './../../songlibrary.service';
import { Tile } from './../../../app.component';
import { LoaderService } from './../../../loader/loader.service';
import { SongService } from './../../song.service';
import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { UntypedFormControl } from '@angular/forms';

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
  

  constructor( private songService:SongService, public loaderService:LoaderService, private libraryService:SonglibraryService) { }

  ngOnInit(): void { 

     // this.tabs.push(this.tab1)
    // localStorage.setItem(this.tab1.listName,JSON.stringify([]))
   
     this.getUserQueus()

    // this.songService.sendSongAndIndex.subscribe(array =>{
    //   this.songAndIndex=array
    //   if(this.tabs[this.selected.value].songs.findIndex(x=>x.title===this.songAndIndex[0].title)===-1){
    //       this.tabs[this.selected.value].songs.splice(this.songAndIndex[1],0,this.songAndIndex[0])
    //    }
    //   else{
    //     alert(this.songAndIndex[0].title+" is already added!")
    //   }
    // })

   this.songService.sendAddedSong.subscribe(audio=>{
    let addedSong:any=audio
    if(this.tabs[this.selected.value].songs.findIndex(x=>x.title===addedSong.title)===-1){
      this.tabs[this.selected.value].songs.push(audio)

     

          let titles:string[]=[]

          for(let i=0;i<this.tabs[this.selected.value].songs.length;i++){
            titles.push(this.tabs[this.selected.value].songs[i].title)
          }

        localStorage.setItem(this.tabs[this.selected.value].listName,JSON.stringify(titles))


      
      if(this.tabs[this.selected.value].activeSong.title!==undefined){
        let activeIndex=this.tabs[this.selected.value].songs.findIndex(x=>x.title===this.tabs[this.selected.value].activeSong.title)
        if(activeIndex==this.tabs[this.selected.value].songs.length-1){
          this.songService.communicateNextSongTitle(this.tabs[this.selected.value].songs[0].title)
        }
        else{
          this.songService.communicateNextSongTitle(this.tabs[this.selected.value].songs[activeIndex+1].title)  
        }
      }   
    }
    else{
      alert(addedSong.title+" is already added to "+this.tabs[this.selected.value].listName+"!")
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
  
  tab1:Tab={listName:'Queue 1',songs:[],activeSong:''}

  public selectedWeight?:number

  weights: Weight[] = [
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
  ]

  public isPlaying:boolean=false;
  queueCounter=1;
  selected = new UntypedFormControl(0);
  tabs:Tab[] = [];
  listNumbers:number[]=[1]


  playingTab:Tab=this.tab1

  getUserQueus(){  
    let keys=Object.keys(localStorage)
    for(let i=0;i<keys.length;i++){
      if(keys[i].startsWith("Queue")){
        let songTitles= JSON.parse(localStorage.getItem(keys[i])|| '{}')
        let loadedSongs:InstanceType<typeof Audio>[]=[]
        for(let i=0;i<songTitles.length;i++){
          this.libraryService.getSong(songTitles[i]).subscribe(
            response=>{
              let path=response
              let tmp=new Audio(path)
              tmp.title=songTitles[i]
              loadedSongs.push(tmp);
            }
          )
        }
        
        let loadedTab:Tab={listName:keys[i],songs:loadedSongs,activeSong:''}     
        this.tabs.push(loadedTab) 

        let listName:string[]=keys[i].split(" ")
        this.listNumbers.push(+listName[1])

        
      }     
    }
    this.tabs.sort( (a,b)=>a.listName > b.listName ? 1: -1 )
    if(this.tabs.findIndex( (tab)=> tab.listName=='Queue 1') <0){
      this.tabs.unshift(this.tab1)
     }
  }

 
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
    
  }

  public onWeightChange(song:any){
  }

  drop(event: CdkDragDrop<string[]>,songs:any,tab:Tab) {
    if (event.previousContainer === event.container) {
      moveItemInArray(songs,event.previousIndex,event.currentIndex)
    } else {
      this.songService.communicateIndexes(event.previousIndex,event.currentIndex)
    }
    if(tab.activeSong.title!==undefined){
      let activeIndex=tab.songs.findIndex(x=>x.title===tab.activeSong.title)
      if(activeIndex==tab.songs.length-1){
        this.songService.communicateNextSongTitle(tab.songs[0].title)
      }
      else{
        this.songService.communicateNextSongTitle(tab.songs[activeIndex+1].title)  
      }
    }
    //itt kéne törölni,majd újra feltölteni a localstorageba (így remélhetőleg elmenti a sorrendet)
       
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
   

    let sorted = pairs.sort((a,b)=>(a.weight>b.weight)?-1:1)

    let max = this.listNumbers.reduce((a, b) => Math.max(a, b));
    this.listNumbers.push(++max)

    let tab:Tab={listName:'Queue '+  max,songs:sorted.map(x=>this.tabs[this.selected.value].songs.find((item: { title: string; })=>item.title==x.title)),activeSong:''}
   
    this.tabs.push(tab)
    this.selected.setValue(this.tabs.length);
    let titles:string[]=[]

    for(let i=0;i<tab.songs.length;i++){
      titles.push(tab.songs[i].title)
    }

     localStorage.setItem(tab.listName,JSON.stringify(titles))
    
  }

 

  
  removeTab() {
    localStorage.removeItem(this.tabs[this.selected.value].listName)
    let listname=this.tabs[this.selected.value].listName.split(" ")
    if(this.listNumbers.indexOf(+listname[1]) >-1){
      this.listNumbers.splice(this.listNumbers.indexOf(+listname[1]),1)
    }
    this.tabs.splice(this.selected.value, 1);
    
  }

}
