import { SonglibraryService } from '../../songlibrary.service';
import { Component, OnInit } from '@angular/core';
import { SongService } from '../../song.service';
import { Song } from 'src/app/models/song.model';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private songService:SongService,public libraryService:SonglibraryService) { }

  ngOnInit(): void {
    this.getAllSongs()
  }

  songs:string[]=[]
  path:string=''
  public addedSongs:InstanceType<typeof Audio>[]=[]

  getAllSongs(){
    this.libraryService.getAllSong().subscribe(
      response=>{
        this.songs=response
      }
    );
  }

  public onAdd(audio:string):void{
   if(this.addedSongs.findIndex(x=>x.title===audio)===-1){
      this.getSong(audio)
    }
    else{
      alert(audio+" is already added!")
    }
  }

  getSong(song:string){
    this.libraryService.getSong(song).subscribe(
      response=>{
        this.path=response
        this.addSong(song)
      }
    )
  }

  addSong(title:string){
    let tmp=new Audio(this.path)
    tmp.title=title
    this.addedSongs.push(tmp)
    this.songService.communicateArray(this.addedSongs)
  }
}
