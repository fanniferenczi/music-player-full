import { SonglibraryService } from '../../songlibrary.service';
import { Component, Inject, OnInit } from '@angular/core';
import { SongService } from '../../song.service';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface Playlist {
  title: string
  items: string[]
  id:number
  panelOpenState:boolean 
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  constructor(private songService:SongService,public libraryService:SonglibraryService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllSongs()
    this.getUserPlaylists()
    this.getInformation()
    this.getTabs()
  }
 
  tabs:any
  playlists:Playlist[]=[] 
  songs:string[]=[]
  ddInformation:any
  playlistIds:number[]=[1]

getInformation(){
  this.songService.sendInformation.subscribe(array=>{
    this.ddInformation=array
    this.ddAdd(this.ddInformation[0],this.ddInformation[1],this.ddInformation[2])
  })
}

getTabs(){
  this.songService.sendTabs.subscribe(array=>{
    this.tabs=array
  })
}

  getAllSongs(){
    this.libraryService.getAllSong().subscribe(
      response=>{
        this.songs=response
        let initialPlaylist:Playlist={title:'Available Songs', items:this.songs,id:this.playlistIds[0],  panelOpenState: false}
        this.playlists.push(initialPlaylist)
      }
    );
  }
  

  getUserPlaylists(){
    let keys=Object.keys(localStorage)
    for(let i=0;i<keys.length;i++){
      if(!keys[i].startsWith("Queue")){
        let data= JSON.parse(localStorage.getItem(keys[i])|| '{}')
        let newId=this.generatePlaylistId()
        let loadedPlaylist:Playlist={title:keys[i],items:data,id:newId,panelOpenState: false}
        this.playlists.unshift(loadedPlaylist)
      }
    }
  }
 
  dropPlaylist(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlists, event.previousIndex, event.currentIndex);
  } 

 onAdd(audio:string){
      this.libraryService.getSong(audio).subscribe(
        response=>{
          let path=response
          let tmp=new Audio(path)
          tmp.title=audio
         this.songService.communicateAddedSong(tmp)
        }
      )
  }


  getConnectedList(): any[] {
    let playlists=this.playlists.map(x => `${x.id}`)
     let connected=playlists.concat(this.tabs)
    return connected
  }

  ddAdd(sourceIndex:number,targetIndex:number,sourcePlaylistId:number){
      let sourcePlyalist=this.playlists.find(x=>x.id==sourcePlaylistId)
      this.libraryService.getSong(sourcePlyalist!.items[sourceIndex]).subscribe(
        response=>{
          let path=response
          let tmp=new Audio(path)
          tmp.title=sourcePlyalist!.items[sourceIndex]
         this.songService.communicateSongAndIndex(tmp,targetIndex)
        }
      )
  }

  drop(event: CdkDragDrop<string[]>,playlist:any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let targetArray=event.container.data
      let song=event.previousContainer.data[event.previousIndex]
      if(targetArray.indexOf(song)===-1){
        copyArrayItem (event.previousContainer.data, event.container.data,event.previousIndex, event.currentIndex)
        localStorage.setItem(playlist.title,JSON.stringify(playlist.items))
      }
      else{
        alert(song + ' is already added to this playlist!')
      }      
    }
  }

  deletePlaylist(playlist:any){
    if(confirm("Are you sure you want to delete "+playlist.title+"?")) {
      let index=this.playlists.indexOf(playlist)
      if(index!==-1){
        this.playlists.splice(index,1)
      }
      localStorage.removeItem(playlist.title)
    }
  }

  deleteSong(song:any,playlist:any){
    let index=playlist.items.indexOf(song)
    if(index!==-1){
      playlist.items.splice(index,1)
    }
    localStorage.setItem(playlist.title,JSON.stringify(playlist.items))
  }
 

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {title: ''},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!==undefined ){
        if(this.playlists.findIndex(x=>x.title===result)===-1){
          let tmp :string[]=[]
          let newId=this.generatePlaylistId()
          let newPlaylist:Playlist={title:result,items:tmp,id:newId,panelOpenState: false}
          this.playlists.unshift(newPlaylist)
          localStorage.setItem(newPlaylist.title,JSON.stringify(newPlaylist.items))
        }
        else{
          alert(result+" playlist is already exists!")
        }        
      }
    });
  }

  addAll(playlist:any){
    for(let i=0;i<playlist.items.length;i++){
      this.onAdd(playlist.items[i])
    }
  }
  generatePlaylistId(){
    let max = this.playlistIds.reduce((a, b) => Math.max(a, b));
    let newId=++max
    this.playlistIds.push(newId);
    return newId
  }
}

export interface DialogData {
  title: string
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./dialog.css']
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
} 