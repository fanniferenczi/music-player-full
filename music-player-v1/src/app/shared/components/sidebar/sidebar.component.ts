import { SonglibraryService } from '../../songlibrary.service';
import { Component, Inject, OnInit } from '@angular/core';
import { SongService } from '../../song.service';
import { FooterComponent } from '../footer/footer.component';
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
  idCounter:number=0


  getAllSongs(){
    this.libraryService.getAllSong().subscribe(
      response=>{
        this.songs=response
        let initialPlaylist:Playlist={title:'Available Songs', items:this.songs,id:++this.idCounter,  panelOpenState: false}
        this.playlists.push(initialPlaylist)
      }
    );
  }

  getUserPlaylists(){
    let keys=Object.keys(localStorage)
    for(let i=0;i<keys.length;i++){
      if(!keys[i].startsWith("Queue")){
        let data= JSON.parse(localStorage.getItem(keys[i])|| '{}')
        let loadedPlaylist:Playlist={title:keys[i],items:data,id:this.idCounter,panelOpenState: false}
        this.playlists.unshift(loadedPlaylist)
        console.log(this.playlists)
      }
      
    }
  }
 
  dropPlaylist(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlists, event.previousIndex, event.currentIndex);
  } 

 onAdd(audio:string){
   if(this.addedSongs.findIndex(x=>x.title===audio)===-1){
      this.libraryService.getSong(audio).subscribe(
        response=>{
          this.path=response
          let tmp=new Audio(this.path)
          tmp.title=audio
         this.songService.communicateAddedSong(tmp)
        }
      )
    }
    else{
      alert(audio+" is already added!")
    }
  }


  getConnectedList(): any[] {
    let connected=this.playlists.map(x => `${x.id}`)
    connected.push('list-2')
    return connected
  }

  ddAdd(sourceIndex:number,targetIndex:number){
    if(this.addedSongs.findIndex(x=>x.title===this.songs[sourceIndex])===-1){
      this.libraryService.getSong(this.songs[sourceIndex]).subscribe(
        response=>{
          this.path=response
          let tmp=new Audio(this.path)
          tmp.title=this.songs[sourceIndex]
         this.songService.communicateSongAndIndex(tmp,targetIndex)
        }
      )
    }
    else{
      alert(this.songs[sourceIndex]+" is already added!")
    }
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
    if(confirm("Are you sure to delete "+playlist.title+"?")) {
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
 
  title: string=''

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {title: this.title},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!==undefined ){
        if(this.playlists.findIndex(x=>x.title===result)===-1){
          let tmp :string[]=[]
          let newPlaylist:Playlist={title:result,items:tmp,id:++this.idCounter,panelOpenState: false}
          this.playlists.unshift(newPlaylist)
          localStorage.setItem(newPlaylist.title,JSON.stringify(newPlaylist.items))
        }
        else{
          alert(result+" playlist name is already exists!")
        }        
      }
    });
  }

  addAll(playlist:any){
    for(let i=0;i<playlist.items.length;i++){
      this.onAdd(playlist.items[i])
    }
    
  }
}

export interface DialogData {
  title: string
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./dialog.css']
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
} 