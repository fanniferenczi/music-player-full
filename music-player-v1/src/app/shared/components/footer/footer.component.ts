import { Tile } from './../../../app.component';
import { SongService } from './../../song.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { reduce } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, AfterViewInit {
  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.getSong();
    this.getNextSongTitle();
  }

  max = 0.8;
  min = 0;
  step = 0.01;
  vertical = false;
  tickInterval = 0.01;
  systemVolume = 0.4;
  song: any;
  isPlaying = false;
  nextSongTitle: any = '';

  play(song: any) {
    song.addEventListener('ended', () => {
      this.onNextSong(song);
    });
    if (!this.isPlaying) {
      this.isPlaying = true;
      song.play();
    } else {
      this.isPlaying = false;
      song.pause();
    }
  }

  @ViewChild('progress_bar') progressbarElementRef?: ElementRef;

  ngAfterViewInit(): void {
    this.progressbarElementRef?.nativeElement.focus();
  }

  onClickProgress(event: MouseEvent, song: any) {
    //song.currentTime=(event.offsetX/this.progressbarElementRef?.nativeElement.offsetWidth)*song.duration;
    //ha a zenéket nem stream-eljük működik a kattintásos tekerés a progressbar-on
    song.currentTime = 20; //visszugrik 0-ra, sajnos egyelőre nincs megoldás
    console.log('ugrás');
  }

  getSong() {
    this.songService.sendAudio.subscribe((audio) => {
      if (this.isPlaying === true) {
        this.systemVolume = this.song.volume;
        this.song.pause();
        this.song.currentTime = 0;
        this.song.load();
        this.isPlaying = false;
      }
      this.song = audio;
      this.song.volume = this.systemVolume;
      this.play(this.song);
      this.song.ontimeupdate = function () {};
    });
  }

  getNextSongTitle() {
    this.songService.sendNextSongTitle.subscribe((songTitle) => {
      this.nextSongTitle = songTitle;
    });
  }

  onNextSong(song: any) {
    this.songService.communicateNext(song);
  }

  onBackSong(song: any) {
    this.songService.communicateBack(song);
  }
}
 


