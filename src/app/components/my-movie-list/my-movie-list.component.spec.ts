import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { of, BehaviorSubject } from "rxjs";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { FAKE_PROFILE, FAKE_TOKEN } from "../../shared/fake-constants";
import { createTimer, setLocalStorage } from "../../shared/functions";
import { MoviesService } from "../../shared/services/movies.service";
import { MyMovieListComponent } from "./my-movie-list.component";

const IMPORTS = [
  CommonModule,
  NavbarComponent,
  HttpClientTestingModule
];

describe('MyMovieListComponent', () => {
  let component: MyMovieListComponent;
  let moviesService: MoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            findWatchlistByProfileId: jest.fn(() => of({})),
            markMovieAsWatched: jest.fn(() => of({}))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: new BehaviorSubject(convertToParamMap({})),
          },
        }
      ]
    }).compileComponents();

    setLocalStorage('token', FAKE_TOKEN);
    setLocalStorage('currentProfile', FAKE_PROFILE);
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(MyMovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    moviesService = TestBed.inject(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should that the attributes have been initialized correctly', () => {
    expect(component.moviesToWatch).toEqual([]);
  });


  it('should perform the markMovieAsWatched', () => {
    const markMovieAsWatchedSpy = jest.spyOn(component, 'markMovieAsWatched');
    const markMovieAsWatchedServiceSpy = jest.spyOn(moviesService, 'markMovieAsWatched');

    component.markMovieAsWatched('111', true);

    createTimer(1000, () => {
      expect(markMovieAsWatchedSpy).toHaveBeenCalled();
      expect(markMovieAsWatchedServiceSpy).toHaveBeenCalledTimes(1);
      expect(markMovieAsWatchedServiceSpy).toHaveBeenCalledWith('111', true);
      expect(component['findWatchlistByProfileId']).toHaveBeenCalledTimes(1);
    });
  });
});
