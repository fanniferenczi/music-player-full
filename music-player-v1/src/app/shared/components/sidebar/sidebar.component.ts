import { SonglibraryService } from '../../songlibrary.service';
import { Component, Inject, OnInit } from '@angular/core';
import { SongService } from '../../song.service';
// import { Song } from 'src/app/models/song.model';
import { FooterComponent } from '../footer/footer.component';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface Playlist {
  title: string
  items: string[]
  id:number
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
        let initialPlaylist:Playlist={title:'Available Songs', items:this.songs,id:++this.idCounter}
        this.playlists.push(initialPlaylist)
        let testPlaylist:Playlist={title:'Playlist1',items:[initialPlaylist.items[0],initialPlaylist.items[1]],id:++this.idCounter}
        this.playlists.unshift(testPlaylist)
      }
    );
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
    return this.playlists.map(x => `${x.id}`);
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


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
    //  console.log(event.previousContainer)
      let targetArray=event.container.data
      console.log(targetArray)
      let song=event.previousContainer.data[event.previousIndex]
      console.log(song)
      if(targetArray.indexOf(song)===-1){
        copyArrayItem (event.previousContainer.data,
                       event.container.data,
                       event.previousIndex,
                       event.currentIndex);
      }
      else{
        alert(song + ' is already added to this playlist!')
      } 

     
    }
  }


 /* addPlaylist(){
    let tmp :string[]=[]
    let newPlaylist:Playlist={title:"new playlist",items:tmp,id:++this.idCounter}
    this.playlists.unshift(newPlaylist)
  } */

  deletePlaylist(playlist:any){
    if(confirm("Are you sure to delete "+playlist.title+"?")) {
      let index=this.playlists.indexOf(playlist)
      if(index!==-1){
        this.playlists.splice(index,1)
      }
    }

    
  }

  deleteSong(song:any,playlist:any){
    let index=playlist.items.indexOf(song)
    if(index!==-1){
      playlist.items.splice(index,1)
    }
  }
 
  title: string=''

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {title: this.title},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!==undefined ){
        if(result==='Available Songs'){
          alert("You can't give this name to your playlist!")
        }
        else{
          let tmp :string[]=[]
          let newPlaylist:Playlist={title:result,items:tmp,id:++this.idCounter}
          this.playlists.unshift(newPlaylist)
        }
        
      }
    });
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