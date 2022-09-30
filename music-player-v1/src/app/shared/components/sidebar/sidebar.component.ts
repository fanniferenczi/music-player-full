import { SonglibraryService } from '../../songlibrary.service';
import { Component, OnInit } from '@angular/core';
import { SongService } from '../../song.service';
// import { Song } from 'src/app/models/song.model';
import { FooterComponent } from '../footer/footer.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface Playlist {
  title: string
  items: string[]
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  constructor(private songService:SongService,public libraryService:SonglibraryService) { }

  ngOnInit(): void {
    this.getAllSongs()
    
    this.songService.sendIndexes.subscribe(array=>{
      this.ddIndexes=array
      this.ddAdd(this.ddIndexes[0],this.ddIndexes[1])
    })
   
  }

  
 playlists:Playlist[]=[]

  songs:string[]=[]
  path:string=''
  public addedSongs:InstanceType<typeof Audio>[]=[]
  ddIndexes:any

  getAllSongs(){
    this.libraryService.getAllSong().subscribe(
      response=>{
        this.songs=response
        let initialPlaylist:Playlist={title:'Available Songs', items:this.songs}
        this.playlists.push(initialPlaylist)
      }
    );
    
  }
  
 
  dropPlaylist(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlists, event.previousIndex, event.currentIndex);
  }



  public ddAdd(sourceIndex:number,targetIndex:number){
    if(this.addedSongs.findIndex(x=>x.title===this.songs[sourceIndex])===-1){
      this.libraryService.getSong(this.songs[sourceIndex]).subscribe(
        response=>{
          this.path=response
          //this.sendSong(song)
          let tmp=new Audio(this.path)
          tmp.title=this.songs[sourceIndex]
         // this.addedSongs.push(tmp)
         this.addedSongs.splice(targetIndex,0,tmp)
         localStorage.setItem(this.addedSongs[targetIndex].title,'null')
          this.songService.communicateArray(this.addedSongs)
        }
      )
    }
    else{
      alert(this.songs[sourceIndex]+" is already added!")
    }
  }

  noReturnPredicate() {
    return false;
  } 

  public onAdd(audio:string){
   if(this.addedSongs.findIndex(x=>x.title===audio)===-1){
    
     this.getSong(audio)
    /*  this.libraryService.getSong(audio).subscribe(
        response=>{
          this.path=response*/
         // this.sendSong(song)
          /*let tmp=new Audio(this.path)
          tmp.title=audio
          this.addedSongs.push(tmp)
          this.songService.communicateArray(this.addedSongs)*/
       // }
     // )
    }
    else{
      alert(audio+" is already added!")
    }
  }

  getSong(song:string){
    this.libraryService.getSong(song).subscribe(
      response=>{
        this.path=response
        this.sendSong(song)
       /* let tmp=new Audio(this.path)
        tmp.title=song
        this.addedSongs.push(tmp)
        this.songService.communicateArray(this.addedSongs)*/
      }
    )
  }


  sendSong(title:string){
    let tmp=new Audio(this.path)
    tmp.title=title
    this.addedSongs.push(tmp)
    localStorage.setItem(tmp.title, "null")
    this.songService.communicateArray(this.addedSongs)
  }

 /* drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.songs, event.previousIndex, event.currentIndex);
  }*/

 /* drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.songs, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }*/
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.songs, event.previousIndex, event.currentIndex);
  }

  addPlaylist(){
    let tmp :string[]=[]
    let newPlaylist:Playlist={title:"new playlist",items:tmp}
    this.playlists.unshift(newPlaylist)
    // this.playlists.push(playlist)
  }

}
