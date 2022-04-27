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
    
    this.getAllSongs();
  

    /*
    let mr=new Audio("../assets/01 Mr. Blue Sky.mp3")
    mr.title="Mr. Blue Sky"
  
    let fox=new Audio("../assets/02 Fox on the Run (Single Version).mp3")
    fox.title="Fox on the Run (Single Version)"

    let lake=new Audio("../assets/03 Lake Shore Drive.mp3")
    lake.title="Lake Shore Drive"

    let the=new Audio("../assets/04 The Chain.mp3")
    the.title="The Chain"

    let bring=new Audio("../assets/05 Bring It on Home to Me.mp3")
    bring.title="Bring It on Home to Me" 
    
    this.arraySongs.push(mr);
    this.arraySongs.push(fox);
    this.arraySongs.push(lake);
    this.arraySongs.push(the);
    this.arraySongs.push(bring);
*/
  
  }

  //songs:Song[]=[];
  songs:string[]=[];

  public arraySongs:InstanceType<typeof Audio>[]=[];
  public addedSongs:InstanceType<typeof Audio>[]=[];


  

  public onAdd(audio:any):void{
   
   /* let tmp=new Audio(this.libraryService.baseURL+"/"+audio);
    tmp.title=audio;
    tmp.addEventListener('canplaythrough',()=>{this.add(tmp)}); */
  
   
   if(this.addedSongs.findIndex(x=>x.title===audio)===-1)
    {
      let tmp=new Audio(this.libraryService.baseURL+"/"+audio)
      tmp.title=audio;
      this.addedSongs.push(tmp);
      this.songService.communicateArray(this.addedSongs);
    }
    else{
      alert(audio+" is already added!");
    }
    
    
  }

  add(tmp:InstanceType<typeof Audio>){
    if(this.addedSongs.findIndex(x=>x.title===tmp.title)===-1)
    {
      this.addedSongs.push(tmp);
      this.songService.communicateArray(this.addedSongs);
    }
    else{
      alert(tmp.title+" is already added!");
    }
  }

  getAllSongs(){
    this.libraryService.getAllSong().subscribe(
      response=>{
        this.songs=response;
      }
    );
    
  }


}
