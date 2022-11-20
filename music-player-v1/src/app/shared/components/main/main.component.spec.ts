import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { SonglibraryService } from './../../songlibrary.service';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let songlibraryService: SonglibraryService;
  let mockSongService:any;
  let mockLoaderService:any;
  let httpMock:HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [ MainComponent ],
      providers:[SonglibraryService]
    })
    .compileComponents();
    songlibraryService=TestBed.get(SonglibraryService)
    httpMock=TestBed.get(HttpTestingController)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // beforeEach(()=>{
  //   mockSonglibraryService=jasmine.createSpyObj(['getSong','getAll'])
  //   mockSongService=jasmine.createSpyObj([])
  //   mockLoaderService=jasmine.createSpyObj([])
  //   component=new MainComponent(mockSongService,mockLoaderService,mockSonglibraryService)
  // })

  afterEach(()=>{
    httpMock.verify();

  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create an init tab',()=>{
    const lengthBefore=component.tabs.length
    component.ngOnInit();
    expect(component.tabs.length).toBe(lengthBefore+1)
  });



});

