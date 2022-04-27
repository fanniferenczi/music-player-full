import { Tile } from './../../../app.component';
import { SongService } from './../../song.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, AfterViewInit {

  constructor(private songService:SongService) { }

  ngOnInit(): void {
   this.songService.sendAudio.subscribe(audio=>{
     if(this.isPlaying===true){
       this.systemVolume=this.song.volume;
        this.song.pause();
        this.song.currentTime=0;
        this.song.load();
        this.isPlaying=false;
     }
     
     this.song=audio; 
     this.song.volume=this.systemVolume; 
     //this.song.addEventListener('canplaythrough',this.play(this.song),false);
     this.play(this.song);   
     this.song.ontimeupdate=function(){}
     
    })
  }

 systemVolume=0.5;
 song:any;
 isPlaying=false;
 time:any;
 
 play(song:any){
   if(!this.isPlaying){
     this.isPlaying=true;
     song.play();
   }
   else{
    this.isPlaying=false;
     song.pause();
   }

 }

 @ViewChild('progress_bar')progressbarElementRef?: ElementRef;

 ngAfterViewInit(): void {
   this.progressbarElementRef?.nativeElement.focus();
 }

 onClickProgress(event:MouseEvent,song:any){
  //song.currentTime=(event.offsetX/this.progressbarElementRef?.nativeElement.offsetWidth)*song.duration;
  
 
  song.currentTime=20;
  console.log("legyen 20nál")
 }

 onNextSong(song:any){
  this.songService.communicateNext(song); 
 }
 onBackSong(song:any){
  this.songService.communicateBack(song);
 }

 onVolumeUp(song:any){
  if(song.volume<0.9){
    song.volume+=0.1;
  }
  
 }
 onVolumeDown(song:any){
  if(song.volume>0.1){
    song.volume-=0.1;
  }
  
 }

}
 


