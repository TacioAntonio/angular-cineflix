import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { of, BehaviorSubject, throwError } from "rxjs";
import { BaseModalComponent } from "../../shared/components/base-modal/base-modal.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { SnackbarComponent } from "../../shared/components/snackbar/snackbar.component";
import { FAKE_TOKEN, FAKE_PROFILE } from "../../shared/fake-constants";
import { capitalizeFirstLetterWord, createTimer, setLocalStorage } from "../../shared/functions";
import { MoviesService } from "../../shared/services/movies.service";
import { MyMovieListComponent } from "../my-movie-list/my-movie-list.component";
import { HomeComponent } from "./home.component";
import { CATEGORY_NAMES } from "../../shared/constants";
import { IMovie } from "../../shared/interfaces/imovie";
import { MESSAGE_STATUS } from "../../shared/components/snackbar/enums/snackbar";

const IMPORTS = [
  CommonModule,
  FormsModule,
  NavbarComponent,
  BaseModalComponent,
  SnackbarComponent,
  LoadingComponent,
  HttpClientTestingModule
];

describe('HomeComponent', () => {
  let component: HomeComponent;
  let moviesService: MoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getMoviesGroupedCategories: jest.fn(() => of({})),
            addMovieToWatchlist: jest.fn(() => of({})),
            searchMovieByTerm: jest.fn(() => of({})),
            getMoviesByCategory: jest.fn(() => of({})),
            findWatchlistByProfileId: jest.fn(() => of({}))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: '123',
              },
              data: {}
            },
            paramMap: of({ get: (key: string) => '123' })
          },
        }
      ]
    }).compileComponents();

    // setLocalStorage('token', FAKE_TOKEN);
    setLocalStorage('currentProfile', FAKE_PROFILE);
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(HomeComponent);
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
    expect(component.showSearchMovieModal).toBeFalsy();
    expect(component.moviesByCategory).toEqual([]);
    expect(component.searchedMovies).toEqual([]);
    expect(component.termToSearch).toBe('');
    expect(component.categoryNames).toBe(CATEGORY_NAMES);
    expect(component.formStatus).toEqual([]);
    expect(component.suggestedFilmes).toBeDefined();
    expect(component.showLoading).toBeTruthy();
  });


  it('should correctly return currentProfileId', () => {
    const controls = component.currentProfileId;

    expect(controls).toBe('123');
  });

  it('should correctly return the toggleModalVisibility', () => {
    component.toggleModalVisibility();

    expect(component.showSearchMovieModal).toBeTruthy();
  });

  it('should perform the searchMovieByTerm', () => {
    const searchMovieByTermSpy = jest.spyOn(component, 'searchMovieByTerm');
    const searchMovieByTermServiceSpy = jest.spyOn(moviesService, 'searchMovieByTerm');
    const termToSearch = 'Exemple';

    component.termToSearch = termToSearch;
    component.searchMovieByTerm();

    createTimer(1000, () => {
      expect(searchMovieByTermSpy).toHaveBeenCalled();
      expect(searchMovieByTermServiceSpy).toHaveBeenCalledTimes(1);
      expect(searchMovieByTermServiceSpy).toHaveBeenCalledWith(termToSearch);
      expect(component.searchedMovies).toBeDefined();
    });
  });


  it('should perform the addMovieToWatchlist', () => {
    const searchMovieByTermSpy = jest.spyOn(component, 'addMovieToWatchlist');
    const addMovieToWatchlisteSpy = jest.spyOn(moviesService, 'addMovieToWatchlist');
    const movieFixture: IMovie = {
      id: '123',
      title: '123',
      overview: '123',
      poster_path: '123',
      already_watched: false,
      category: '123'
    };

    component.addMovieToWatchlist(movieFixture);

    createTimer(1000, () => {
      expect(searchMovieByTermSpy).toHaveBeenCalled();
      expect(addMovieToWatchlisteSpy).toHaveBeenCalledTimes(1);
      expect(addMovieToWatchlisteSpy).toHaveBeenCalledWith(movieFixture);
      expect(component.messageStatus).toBe(MESSAGE_STATUS.success);
      expect(component.formStatus ).toBe(MESSAGE_STATUS.success);
      expect(component['hiddenSnackbar']).toHaveBeenCalled();
    });
  });

  it('should correctly perform the addMovieToWatchlist, but an error occurred', () => {
    const movieFixture: IMovie = {
      id: '123',
      title: '123',
      overview: '123',
      poster_path: '123',
      already_watched: false,
      category: '123'
    };
    const mockError = {
      "message": "Error.",
      "isError": true
    };
    const addMovieToWatchlistSpy = jest.spyOn(moviesService, 'addMovieToWatchlist')
                              .mockReturnValue(of(mockError));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus!: Array<string>;

    moviesService.addMovieToWatchlist('123', movieFixture).subscribe({
      next: ({ message, isError }: any) => {
        if (isError) {
          messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
          formStatus = [message ? capitalizeFirstLetterWord(message) : 'Movie added to watch later.'];
        }}
    });

    expect(addMovieToWatchlistSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Error. ']);
  });

  it('should incorrectly perform the addMovieToWatchlist', () => {
    const movieFixture: IMovie = {
      id: '123',
      title: '123',
      overview: '123',
      poster_path: '123',
      already_watched: false,
      category: '123'
    };
    const mockError = {
      "error": {
        "message": ["Invalid."]
      }
    };
    const signInSpy = jest.spyOn(moviesService, 'addMovieToWatchlist')
                              .mockReturnValue(throwError(() => mockError));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus!: Array<string>;

    moviesService.addMovieToWatchlist('123', movieFixture).subscribe({
      error: ({ error }) => {
        if (!error.message.length) return;
        messageStatus = MESSAGE_STATUS.error;
        formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
      }
    });

    expect(signInSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Invalid. ']);
  });
});
