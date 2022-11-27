import { SonglibraryService } from './../../songlibrary.service';
import { LoaderService } from './../../../loader/loader.service';
import { SongService } from './../../song.service';
import { Component, OnInit, Input } from '@angular/core';
import {CdkDragDrop,copyArrayItem,moveItemInArray,transferArrayItem,} from '@angular/cdk/drag-drop';
import { UntypedFormControl } from '@angular/forms';


interface Tab {
  id: number;
  tabName: string;
  songs: any[];
  playingSong: any;
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
    private songlibraryService: SonglibraryService
  ) {}

  ngOnInit(): void {
    this.getUserQueus();
    this.getAddedSong();
    this.getNextSignal();
    this.getPrevSignal();
  }

  selected = new UntypedFormControl(0);
  tabs: Tab[] = [];
  playingTab: Tab = this.tabs[0];
  weights: any[] = [1, 2, 3];


  getUserQueus() {
    let keys = Object.keys(localStorage);
    let queueKeys = keys.filter((x) => x.startsWith('Queue'))
    if (queueKeys.length !== 0) {
      for (let i = 0; i < queueKeys.length; i++) {
          let songTitles = JSON.parse( localStorage.getItem(queueKeys[i]) || '{}' )
          let loadedSongs: any[] = []
          for (let i = 0; i < songTitles.length; i++) {
            this.songlibraryService.getSong(songTitles[i]).subscribe((response) => {
                let tmp = new Audio(response)
                tmp.title = songTitles[i]
                loadedSongs.push(tmp)
              })
          }
          let queueName: string[] = queueKeys[i].split(' ')
          let loadedTab: Tab = {tabName: queueKeys[i], songs: loadedSongs, playingSong: '', id: +queueName[1]}
          this.tabs.push(loadedTab)
      }
    } else {
      this.createInitTab();
    }
    this.tabs.sort((a, b) => (a.tabName > b.tabName ? 1 : -1))
    this.sendTabNames()
  }

  createInitTab() {
    let initSongs: any[] = [];
    let initTab: Tab = {id: 1,tabName: 'Queue 1', songs: initSongs, playingSong: ''}
    this.tabs.push(initTab)
    this.sendTabNames()
  }


  play(song: any, tab: Tab) {
    this.songService.communicateSong(song)
    tab.playingSong = song
    this.playingTab = tab
    this.sendNextSongToFootbar(tab)
  }

  getNextSignal() {
    this.songService.sendCurrentForNext.subscribe((audio) => {
      let currentlyPlaying = audio
      this.playNextSong(currentlyPlaying, this.playingTab)
    })
  }

  playNextSong(song: any, tab: any) {
    if (tab.songs.length !== 0) {
      let currentIndex = tab.songs.indexOf(song)
      if (currentIndex !== -1) {
        if (currentIndex === tab.songs.length - 1) 
          this.play(tab.songs[0], tab)
        else 
          this.play(tab.songs[currentIndex + 1], tab)
      }
    }
  }

  getPrevSignal() {
    this.songService.sendCurrentForPrev.subscribe((audio) => {
      let currentlyPlaying = audio
      this.playPrevSong(currentlyPlaying, this.playingTab)
    })
  }

  playPrevSong(song: any, tab: any) {
    if (song.currentTime >= 3) {
      song.currentTime = 0
      this.play(song, tab)
    } else {
      if (tab.songs.length !== 0) {
        let currentIndex = tab.songs.indexOf(song)
        if (currentIndex !== -1) {
          if (currentIndex <= 0)
            this.play(tab.songs[tab.songs.length - 1], tab)
          else 
            this.play(tab.songs[currentIndex - 1], tab)
        }
      }
    }
  }

  deleteSong(song: any, tab: any) {
    const index: number = tab.songs.indexOf(song)
    if (index !== -1) 
      tab.songs.splice(index, 1)
    this.uploadTabToLocalStorage(tab)
    this.sendNextSongToFootbar(tab)
  }

  drop(event: CdkDragDrop<string[]>, tab: Tab) {
    if (event.previousContainer === event.container) {
      moveItemInArray(tab.songs, event.previousIndex, event.currentIndex)
      this.uploadTabToLocalStorage(this.tabs[this.selected.value])
      this.sendNextSongToFootbar(this.tabs[this.selected.value])
    } else {
      let movingSong = event.previousContainer.data[event.previousIndex]
      if (this.tabs[this.selected.value].songs.findIndex((x) => x.title === movingSong) === -1)
        this.addDroppedSong(movingSong, event.currentIndex);
      else 
        alert(movingSong + ' is already added to ' + tab.tabName + ' !');
    }
  }

  addDroppedSong(song: any, index: number) {
    this.songlibraryService.getSong(song).subscribe((response) => {
      let audio = new Audio(response)
      audio.title = song
      this.tabs[this.selected.value].songs.splice(index, 0, audio)
      this.uploadTabToLocalStorage(this.tabs[this.selected.value])
      this.sendNextSongToFootbar(this.tabs[this.selected.value])
    })
  }

  getAddedSong() {
    this.songService.sendAddedSong.subscribe((audio) => {
      let addedSong: any = audio
      if (this.tabs[this.selected.value].songs.findIndex((x) => x.title === addedSong.title) === -1) {
        this.tabs[this.selected.value].songs.push(audio) 
        this.uploadTabToLocalStorage(this.tabs[this.selected.value])
        this.sendNextSongToFootbar(this.tabs[this.selected.value])
      } else 
          alert(addedSong.title +' is already added to ' + this.tabs[this.selected.value].tabName +'!')
    })
  }

  generate() {
    let activeTab = this.tabs[this.selected.value]
    let pairs: any[] = []
    for (let i = 0; i < activeTab.songs.length; i++) {
      let calculatedWeight: number = 0;
      switch (activeTab.songs[i].weight) {
        case '1': //0..1
          calculatedWeight = Math.random()
          break
        case '2': //1..2
          calculatedWeight = Math.random() * (2 - 1) + 1
          break
        case '3': //2..3
          calculatedWeight = Math.random() * (3 - 2) + 2
          break
        default://0..3
          calculatedWeight = Math.random() * (3 - 0) + 0
          break
      }
      let tmp: any = {
        title: activeTab.songs[i].title,
        weight: Math.round(calculatedWeight * 100) / 100,
      }
      pairs.push(tmp)
    }
    pairs.sort((a, b) => (a.weight > b.weight ? -1 : 1))
    let tabId = this.generateTabId()
    let newTab: Tab = {id: tabId,tabName: 'Queue ' + tabId,songs: pairs.map((x) => activeTab.songs.find((item) => item.title === x.title)), playingSong: ''}
    this.tabs.push(newTab)
    this.sendTabNames()
    this.uploadTabToLocalStorage(newTab)
    this.selected.setValue(this.tabs.length)
  }

  newTab() {
    let tabId = this.generateTabId();
    let tab: Tab = {id: tabId,tabName: 'Queue ' + tabId,songs: [], playingSong: ''}
    this.tabs.push(tab)
    this.sendTabNames()
    this.uploadTabToLocalStorage(tab)
    this.selected.setValue(this.tabs.length)
  }

  sendTabNames() {
    let tabNames = this.tabs.map((x) => `${x.tabName}`)
    this.songService.communicateTabs(tabNames)
  }

  removeTab() {
    localStorage.removeItem(this.tabs[this.selected.value].tabName)
    this.tabs.splice(this.selected.value, 1)
  }

  uploadTabToLocalStorage(tab: Tab) {
    let titles: string[] = [];
    for (let i = 0; i < tab.songs.length; i++) 
      titles.push(tab.songs[i].title);
    localStorage.setItem(tab.tabName, JSON.stringify(titles));
  }

  sendNextSongToFootbar(tab: Tab) {
    if (tab.playingSong.title !== '' && tab.songs.length !== 0) {
      let playingIndex = tab.songs.findIndex((x) => x.title === tab.playingSong.title)
      if (playingIndex === -1) 
        this.songService.communicateNextSongTitle('')
      else {
        if (playingIndex === tab.songs.length - 1) 
          this.songService.communicateNextSongTitle(tab.songs[0].title)
        else 
          this.songService.communicateNextSongTitle(tab.songs[playingIndex + 1].title)
      }
    }
  }

  generateTabId() {
    let tabIds = this.tabs.map((x) => x.id);
    let max = tabIds.reduce((a, b) => Math.max(a, b))
    let newNumber = ++max
    return newNumber
  }
}
