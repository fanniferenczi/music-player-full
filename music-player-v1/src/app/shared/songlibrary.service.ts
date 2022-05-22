import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class SonglibraryService {

  constructor(private http:HttpClient) { }

  readonly baseURL='https://localhost:7147/Song'
  
  
  getSong(fileName:string):Observable<string>{
    return this.http.get(this.baseURL+'/get/'+fileName,{responseType: 'text'})
  }


  getAllSong():Observable<string[]>{
    return this.http.get<string[]>(this.baseURL+'/getAll');
  }
}

 
