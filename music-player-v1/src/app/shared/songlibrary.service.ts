import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class SonglibraryService {

  constructor(private http:HttpClient) { }

  readonly baseURL='https://localhost:7147/Song'
  

  /*getAllSong():Observable<Song[]>{
    return this.http.get<Song[]>(this.baseURL+'/getAll');
  }*/
  getAllSong():Observable<string[]>{
    return this.http.get<string[]>(this.baseURL+'/getAll');
  }
}

 
