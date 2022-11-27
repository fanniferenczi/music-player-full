import { SongService } from './../../song.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let songService:SongService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterComponent ],
      providers:[SongService]
    })
    .compileComponents();
    songService=TestBed.inject(SongService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current song',()=>{
    const testSong=new Audio('')
    testSong.title='Test title'
    component.song=testSong
    fixture.detectChanges()
     const titleElement=fixture.debugElement.query(By.css('.title')).nativeElement
     expect(titleElement).not.toBeNull()
     expect(titleElement.textContent).toEqual(testSong.title)
  })

  it('should display the next song',()=>{
    const nextSong='Test next song title'
    component.nextSongTitle=nextSong
    fixture.detectChanges()
    const titleElement=fixture.debugElement.query(By.css('.next')).nativeElement
    expect(titleElement).not.toBeNull()
    expect(titleElement.textContent).toEqual('Next: '+ nextSong)
  })

});
