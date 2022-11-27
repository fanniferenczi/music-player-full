
import { SongService } from './../../song.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { reduce } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.getSong();
    this.getNextSongTitle();
  }

  max = 0.4;
  min = 0;
  step = 0.01;
  vertical = false;
  systemVolume = 0.2;
  song: any;
  isPlaying = false;
  nextSongTitle: any = '';

  play(song: any) {
    song.addEventListener('ended', () => {
     this.nextSong(song);
    });
    if (!this.isPlaying) {
      this.isPlaying = true
      song.play()
    } else {
      this.isPlaying = false
      song.pause()
    }
  }

  getSong() {
    this.songService.sendAudio.subscribe((audio) => {
      if (this.isPlaying === true) {
        this.systemVolume = this.song.volume
        this.song.pause()
        this.song.currentTime = 0
        this.isPlaying = false
      }
      this.song = audio
      this.song.volume = this.systemVolume
      this.play(this.song)
      this.song.ontimeupdate = function(){}
    })
  }

  getNextSongTitle() {
    this.songService.sendNextSongTitle.subscribe((songTitle) => {
      this.nextSongTitle = songTitle
    })
  }

  nextSong(song:any) {
    this.songService.commCurrentForNext(song)
  }

  prevSong(song:any) {
    this.songService.commCurrentForPrev(song)
  }

  mute(song:any){
    this.systemVolume=song.volume
    song.volume=0
  }
  unMute(song:any){
    song.volume=this.systemVolume
  }
}
 


