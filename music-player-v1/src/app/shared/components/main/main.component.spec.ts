import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { SonglibraryService } from './../../songlibrary.service';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let songlibraryService: SonglibraryService;
  let httpMock:HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [ MainComponent ],
      providers:[SonglibraryService]
    })
    .compileComponents();
    songlibraryService=TestBed.inject(SonglibraryService)
    httpMock=TestBed.inject(HttpTestingController)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  afterEach(()=>{})

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should create a new tab',()=>{
    const lengthBefore=component.tabs.length
    component.newTab()
    expect(component.tabs.length).toBe(lengthBefore+1)
  })

  it('should delete a tab',()=>{
    const tab={id:0,tabName:'Q0',songs:['song1','song2','song3'],playingSong:''}
    component.tabs.push(tab)
    const lengthBefore=component.tabs.length
    component.removeTab()
    expect(component.tabs.length).toBe(lengthBefore-1)
  })

  it('should delete song from tab',()=>{
    const tab={id:0,tabName:'Q0',songs:['song1','song2','song3'],playingSong:''}
    component.tabs.push(tab)
    component.deleteSong('song2',tab)
    expect(component.tabs[component.tabs.length-1].songs.length).toBe(2)
    expect(component.tabs[component.tabs.length-1].songs).not.toContain('song2')
  })


}); 

