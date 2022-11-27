import { SonglibraryService } from '../../songlibrary.service';
import { Component, Inject, OnInit } from '@angular/core';
import { SongService } from '../../song.service';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from './dialogoverviewexampledialog.component';

interface Playlist {
  id:number
  title: string
  items: string[]
  panelOpenState:boolean 
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  constructor(
    private songService:SongService,
    public libraryService:SonglibraryService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllSongs()
    this.getTabs()
  }
 
  tabs:any
  playlists:Playlist[]=[] 
  userPlaylists:Playlist[]=[]

  getAllSongs(){
    this.libraryService.getAllSong().subscribe(
      response=>{
        let songs=response
        let initialPlaylist:Playlist={title:'Available Songs', items:songs, id:0,  panelOpenState: false}
        this.playlists.push(initialPlaylist)
        this.getUserPlaylists()
      }
    )
  }

  getUserPlaylists(){
    let userPlyalists=JSON.parse(localStorage.getItem('userplaylists') || '[]')
    if(userPlyalists!==undefined){
      let initPlaylist=this.playlists.find(x=>x.id===0)
      let oldPlaylistIndex=userPlyalists.findIndex((x: { id: number; })=>x.id===0)
      userPlyalists.splice(oldPlaylistIndex,1,initPlaylist)
      for(var list of userPlyalists)
        list.panelOpenState=false
      this.playlists=userPlyalists
    }
  }


getTabs(){
  this.songService.sendTabs.subscribe(array=>{
    this.tabs=array
  })
}
  
// new playlist
openDialog(): void {
  const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    width: '250px',
    data: {title: ''},
  })
  dialogRef.afterClosed().subscribe(result => {
    if(result!==undefined ){
      if(this.playlists.findIndex(x=>x.title===result)===-1){
        let tmp :string[]=[]
        let newId=this.generatePlaylistId()
        let newPlaylist:Playlist={title:result,items:tmp,id:newId,panelOpenState: false}
        this.playlists.unshift(newPlaylist)
        localStorage.setItem('userplaylists',JSON.stringify(this.playlists))
      }
      else
        alert(result+" playlist is already exists!");      
    }
  })
}
 
generatePlaylistId(){
  let playlistIds=this.playlists.map(x => x.id)
  let max = playlistIds.reduce((a, b) => Math.max(a, b))
  let newId=++max
  return newId
}

deletePlaylist(playlist:any){
  if(confirm("Are you sure you want to delete "+playlist.title+"?")) {
    let index=this.playlists.indexOf(playlist)
    if(index!==-1)
      this.playlists.splice(index,1)
    localStorage.setItem('userplaylists',JSON.stringify(this.playlists))
  }
}

dropPlaylist(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.playlists, event.previousIndex, event.currentIndex)
  localStorage.setItem('userplaylists',JSON.stringify(this.playlists))
} 

dropIntoPlaylist(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) 
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
  else {
    let targetArray=event.container.data
    let song=event.previousContainer.data[event.previousIndex]
    if(targetArray.indexOf(song)===-1)
      copyArrayItem (event.previousContainer.data, event.container.data,event.previousIndex, event.currentIndex)
    else
      alert(song + ' is already added to this playlist!')     
  }
  localStorage.setItem('userplaylists',JSON.stringify(this.playlists))
}

deleteSong(song:any,playlist:any){
  let index=playlist.items.indexOf(song)
  if(index!==-1){
    playlist.items.splice(index,1)
  }
  localStorage.setItem('userplaylists',JSON.stringify(this.playlists))
}

  addToTab(song: string) {
    this.libraryService.getSong(song).subscribe(
      response => {
        let audio = new Audio(response)
        audio.title = song
        this.songService.communicateAddedSong(audio)
      })
  }

  getConnectedList(): any[] {
    let playlists=this.playlists.map(x => `${x.id}`)
    let connected=playlists.concat(this.tabs)
    return connected
  } 

  addAll(playlist:any){
    for(let i=0;i<playlist.items.length;i++)
      this.addToTab(playlist.items[i])
  }
}



 