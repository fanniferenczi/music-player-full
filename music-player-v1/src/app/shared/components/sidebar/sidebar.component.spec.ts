import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SonglibraryService } from '../../songlibrary.service';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let songlibraryService: SonglibraryService;
  let httpMock:HttpTestingController;
  let matDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule,MatDialogModule],
      declarations: [ SidebarComponent ],
      providers:[SonglibraryService]
    })
    .compileComponents();
    songlibraryService=TestBed.inject(SonglibraryService);
    httpMock=TestBed.inject(HttpTestingController);
    matDialog=TestBed.inject(MatDialog);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })


  it('should create', () => {
    expect(component).toBeTruthy()
  })


});
