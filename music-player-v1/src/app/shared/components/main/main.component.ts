import { SongService } from './../../song.service';
import { Component, OnInit, Input } from '@angular/core';


/*interface Song{
  fileName: String;
  weight?: number;
}*/

interface Weight {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  arrayFromSidebar:any;
  currentlyPlaying:any;

  constructor( private songService:SongService) { }

  ngOnInit(): void {
    
   this.songService.sendArray.subscribe(array=>{
     this.arrayFromSidebar=array;
     console.log(this.arrayFromSidebar)
   })

   this.songService.sendNext.subscribe(audio=>{
      this.currentlyPlaying=audio;
      this.playNextSong(this.currentlyPlaying);
   })

   this.songService.sendBack.subscribe(audio=>{
     this.currentlyPlaying=audio;
     this.playPrevSong(this.currentlyPlaying);
   })

  }
  

  public selectedWeight?:number;

  onDelete(song:any){
    const index: number=this.arrayFromSidebar.indexOf(song);
    if(index!==-1){
      this.arrayFromSidebar.splice(index,1);
    }
  }

  weights: Weight[] = [
    {value: 1, viewValue: '1'},
    {value: 5, viewValue: '5'},
    {value: 10, viewValue: '10'},
  ];

  public onWeightChange(song:any){
  }

  public isPlaying:boolean=false;
  active:any;
    
  play(song:InstanceType<typeof Audio>){
    this.songService.communicateSong(song);  
    this.active=song; 
  }
  playNextSong(song:any){
    if(this.arrayFromSidebar.length!==0  ){
        let currentIndex=this.arrayFromSidebar.indexOf(song);
      if(currentIndex>=this.arrayFromSidebar.length-1){
        this.play(this.arrayFromSidebar[0])
      }
      else{
        this.play(this.arrayFromSidebar[currentIndex+1])
      }
    }
  }

  playPrevSong(song:any){
    if(this.arrayFromSidebar.length!==0){
      if(song.currentTime>3){
        song.currentTime=0;
        this.play(song)
      } 
      else{
        let currentIndex=this.arrayFromSidebar.indexOf(song)
        if(currentIndex<=0){
          this.play(this.arrayFromSidebar[this.arrayFromSidebar.length-1])
        }
        else{
          this.play(this.arrayFromSidebar[currentIndex-1])
        }
      } 
      
    }
  }
  


}
