import { SonglibraryService } from './../../songlibrary.service';
import { LoaderService } from './../../../loader/loader.service';
import { SongService } from './../../song.service';
import { Component, OnInit, Input } from '@angular/core';
import {CdkDragDrop,copyArrayItem,moveItemInArray,transferArrayItem,} from '@angular/cdk/drag-drop';
import { UntypedFormControl } from '@angular/forms';

interface Weight {
  value: number;
  viewValue: string;
}

interface Pair {
  title: string;
  weight: number;
}

interface Tab {
  tabName: string;
  songs: any[];
  activeSong: any;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(
    private songService: SongService,
    public loaderService: LoaderService,
    private libraryService: SonglibraryService
  ) {}

  ngOnInit(): void {
    this.getUserQueus()
    this.getDroppedSongAndIndex()
    this.getAddedSong()
    this.getNext()
    this.getPrevious()  
  }


  songAndIndex: any;
  currentlyPlaying: any;
  isPlaying: boolean = false;
  selected = new UntypedFormControl(0);
  tabs: Tab[] = [];
  tabNumbers: number[] = [1];
  playingTab:Tab=this.tabs[0]

  weights: Weight[] = [
    { value: 1, viewValue: '1' },
    { value: 2, viewValue: '2' },
    { value: 3, viewValue: '3' },
  ];

  getUserQueus() {
    let keys = Object.keys(localStorage);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].startsWith('Queue')) {
        let songTitles = JSON.parse(localStorage.getItem(keys[i]) || '{}');
        let loadedSongs: InstanceType<typeof Audio>[] = [];
        for (let i = 0; i < songTitles.length; i++) {
          this.libraryService.getSong(songTitles[i]).subscribe((response) => {
            let path = response;
            let tmp = new Audio(path);
            tmp.title = songTitles[i];
            loadedSongs.push(tmp);
          });
        }
        let loadedTab: Tab = {tabName: keys[i],songs: loadedSongs,activeSong: ''};
        this.tabs.push(loadedTab);
        this.sendTabNames()
        let listName: string[] = keys[i].split(' ');
        this.tabNumbers.push(+listName[1]);
      }
    }
     this.tabs.sort( (a,b)=>a.tabName > b.tabName ? 1: -1 )
  }

  play(song: InstanceType<typeof Audio>, tab: Tab) {
    this.songService.communicateSong(song);
    tab.activeSong = song;
    this.playingTab = tab;
    this.sendNextSongToFootbar(tab)
  }

  getNext(){
    this.songService.sendNext.subscribe((audio) => {
      this.currentlyPlaying = audio;
      this.playNextSong(this.currentlyPlaying, this.playingTab);
    });
  }

  playNextSong(song: any, tab: any) {
    if (tab.songs.length !== 0) {
      let currentIndex = tab.songs.indexOf(song);
      if (currentIndex >= tab.songs.length - 1) {
        this.play(tab.songs[0], tab);
      } else {
        this.play(tab.songs[currentIndex + 1], tab);
      }
    }
  }

  getPrevious(){
    this.songService.sendBack.subscribe((audio) => {
      this.currentlyPlaying = audio;
      this.playPrevSong(this.currentlyPlaying, this.playingTab);
    });
  }

  playPrevSong(song: any, tab: any) {
    if (tab.songs.length !== 0) {
      if (song.currentTime > 3) {
        song.currentTime = 0;
        this.play(song, tab);
      } else {
        let currentIndex = tab.songs.indexOf(song);
        if (currentIndex <= 0) {
          this.play(tab.songs[tab.songs.length - 1], tab);
        } else {
          this.play(tab.songs[currentIndex - 1], tab);
        }
      }
    }
  }

  onDelete(song: any, tab: any) {
    const index: number = tab.songs.indexOf(song);
    if (index !== -1) {
      tab.songs.splice(index, 1);
    }
    this.uploadTabToLocalStorage(tab);
  }


  drop(event: CdkDragDrop<string[]>, songs: any, tab: Tab) {
    if (event.previousContainer === event.container) {
      moveItemInArray(songs, event.previousIndex, event.currentIndex);
    } else {
      this.songService.communicateInformation(
        event.previousIndex,
        event.currentIndex,
        +event.previousContainer.id
      );
    }
    this.sendNextSongToFootbar(tab)
    this.uploadTabToLocalStorage(tab)
  }

  getDroppedSongAndIndex(){
    this.songService.sendSongAndIndex.subscribe((array) => {
      this.songAndIndex = array;
      if (this.tabs[this.selected.value].songs.findIndex(
          (x) => x.title === this.songAndIndex[0].title) === -1) {
            this.tabs[this.selected.value].songs.splice(this.songAndIndex[1], 0,this.songAndIndex[0]);
            this.uploadTabToLocalStorage(this.tabs[this.selected.value])
            this.sendNextSongToFootbar(this.tabs[this.selected.value])
      } else {
        alert(this.songAndIndex[0].title + ' is already added!');
      }
    });
  }

  getAddedSong(){
    this.songService.sendAddedSong.subscribe((audio) => {
      let addedSong: any = audio;
      if (this.tabs[this.selected.value].songs.findIndex((x) => x.title === addedSong.title) === -1) {
        this.tabs[this.selected.value].songs.push(audio);
        this.uploadTabToLocalStorage(this.tabs[this.selected.value])
        this.sendNextSongToFootbar(this.tabs[this.selected.value])
      } else {
        alert(addedSong.title +' is already added to ' + this.tabs[this.selected.value].tabName +'!');
      }
    });
  }

  generate() {
    let activeTab = this.tabs[this.selected.value];
    let pairs: Pair[] = [];
    for (let i = 0; i < activeTab.songs.length; i++) {
      let calculatedWeight: number = 0;

      switch (activeTab.songs[i].weight) {
        case '1': {//0..1
          calculatedWeight = Math.random();
          break;
        }
        case '2': {//1..2
          calculatedWeight = Math.random() * (2 - 1) + 1;
          break;
        }
        case '3': {//2..3
          calculatedWeight = Math.random() * (3 - 2) + 2;
          break;
        }
        default: {//0..3
          calculatedWeight = Math.random() * (3 - 0) + 0;
          break;
        }
      }

      let tmp: Pair = {
        title: activeTab.songs[i].title,
        weight: Math.round(calculatedWeight * 100) / 100,
      };
      pairs.push(tmp);
    }
    let sorted = pairs.sort((a, b) => (a.weight > b.weight ? -1 : 1));
    let tabNumber=this.generateTabNumber()
    let tab: Tab = {
      tabName: 'Queue ' + tabNumber,
      songs: sorted.map((x) =>this.tabs[this.selected.value].songs.find((item: { title: string }) => item.title == x.title)),
      activeSong: '',
    };

    this.tabs.push(tab);
    this.sendTabNames();
    this.uploadTabToLocalStorage(tab)
    this.selected.setValue(this.tabs.length);
  }

  newTab() {
    let tabNumber=this.generateTabNumber()
    let tab: Tab = { tabName: 'Queue ' + tabNumber, songs: [], activeSong: '' };
    this.tabs.push(tab);
    this.sendTabNames()
    this.uploadTabToLocalStorage(tab)
    this.selected.setValue(this.tabs.length);
  }

  removeTab() {
    localStorage.removeItem(this.tabs[this.selected.value].tabName);
    let listname = this.tabs[this.selected.value].tabName.split(' ');
    if (this.tabNumbers.indexOf(+listname[1]) > -1) {
      this.tabNumbers.splice(this.tabNumbers.indexOf(+listname[1]), 1);
    }
    this.tabs.splice(this.selected.value, 1);
  }

  sendTabNames(){
    let tabNames=this.tabs.map(x=>`${x.tabName}`)
    this.songService.communicateTabs(tabNames)
  }

  uploadTabToLocalStorage(tab:Tab){
    let titles: string[] = [];
    for (let i = 0; i < tab.songs.length; i++) {
      titles.push(tab.songs[i].title);
    }
    localStorage.setItem(tab.tabName, JSON.stringify(titles));
  }

  sendNextSongToFootbar(tab:Tab){
    if (tab.activeSong.title !== undefined) {
      let activeIndex = tab.songs.findIndex((x) => x.title === tab.activeSong.title);
      if (activeIndex == tab.songs.length - 1) {
        this.songService.communicateNextSongTitle(tab.songs[0].title);
      } else {
        this.songService.communicateNextSongTitle(tab.songs[activeIndex + 1].title);
      }
    }
  }

  generateTabNumber(){
    let max = this.tabNumbers.reduce((a, b) => Math.max(a, b));
    let newNumber=++max
    this.tabNumbers.push(newNumber);
    return newNumber
  }
}
