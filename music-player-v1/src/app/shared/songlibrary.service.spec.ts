import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SonglibraryService } from './songlibrary.service';
import { TestBed } from '@angular/core/testing';

describe('SonglibraryService', () => {
  let service: SonglibraryService;
  let httpMock:HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports:[HttpClientTestingModule],
        providers:[SonglibraryService]
    });
    service = TestBed.get(SonglibraryService);
    httpMock=TestBed.get(HttpTestingController);
  });

  afterEach(()=>{
    httpMock.verify();
  })

  it('should retrieve songs from API', () => {
    const dummySongs=['Song1','Song2','Song3'];
    service.getAllSong().subscribe(songs=>{
        expect(songs.length).toBe(3);
        expect(songs).toEqual(dummySongs);
    });
    const request=httpMock.expectOne(`${service.baseURL}/getAll`);
    expect(request.request.method).toBe('GET');
    request.flush(dummySongs);
  });

  it('should retrieve one song from API', () => {
    const dummySong='Song1';
    service.getSong(dummySong).subscribe(song=>{
        expect(song).toEqual(dummySong);
    });
    const request=httpMock.expectOne(`${service.baseURL}/get/${dummySong}`);
    expect(request.request.method).toBe('GET');
    request.flush(dummySong);
  });
});
