import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { BaseModalComponent } from "../../shared/components/base-modal/base-modal.component";
import { MoviesService } from "../../shared/services/movies.service";
import { take } from "rxjs";
import { CATEGORY_NAMES } from "../../shared/constants";
import { ActivatedRoute } from "@angular/router";
import { IMovie } from "../../shared/interfaces/imovie";
import { capitalizeFirstLetterWord, createTimer } from "../../shared/functions";
import { MESSAGE_STATUS } from "../../shared/components/snackbar/enums/snackbar";
import { SnackbarComponent } from "../../shared/components/snackbar/snackbar.component";
import { FormsModule } from "@angular/forms";
import { LoadingComponent } from "../../shared/components/loading/loading.component";

const IMPORTS = [
  CommonModule,
  FormsModule,
  NavbarComponent,
  BaseModalComponent,
  SnackbarComponent,
  LoadingComponent
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MoviesService]
})
export class HomeComponent implements OnInit {
  showSearchMovieModal = false;
  moviesByCategory: any = [];
  searchedMovies: any = [];
  termToSearch: string = '';
  categoryNames = CATEGORY_NAMES;
  formStatus: Array<string> = [];
  messageStatus!: MESSAGE_STATUS;
  suggestedFilmes: any = [];
  showLoading = true;

  get currentProfileId() {
    return this.activatedRoute.snapshot.params['id'];
  }

  constructor(
    private readonly moviesService: MoviesService,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getMoviesGroupedCategories();
    this.findWatchlistByProfileId();
  }

  toggleModalVisibility() {
    this.showSearchMovieModal = !this.showSearchMovieModal;
  }

  private getMoviesGroupedCategories() {
    this.moviesService
      .getMoviesGroupedCategories()
      .pipe(take(1))
      .subscribe({
        next: data => { this.moviesByCategory = data; },
        complete: () => this.showLoading = false
      });
  }

  private hiddenSnackbar() {
    createTimer(5000, () => this.formStatus = []);
  }

  addMovieToWatchlist(movie: IMovie) {
    this.moviesService
      .addMovieToWatchlist(this.currentProfileId, movie)
      .pipe(take(1))
      .subscribe({
        next: ({ message, isError }: any) => {
          this.messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
          this.formStatus = [message ? capitalizeFirstLetterWord(message) : 'Movie added to watch later.'];
          this.hiddenSnackbar();
        },
        error: ({ error }) => {
          if (!error.message.length) return;
          this.messageStatus = MESSAGE_STATUS.error;
          this.formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
          this.hiddenSnackbar();
        }
      });
  }

  searchMovieByTerm() {
    this.moviesService
      .searchMovieByTerm(this.termToSearch)
      .pipe(take(1))
      .subscribe(data => this.searchedMovies = data);
  }

  private getMoviesByCategory(preferredCategories: Array<any>) {
    preferredCategories.map((eachCategory: any) => {
      this.moviesService
        .getMoviesByCategory(eachCategory)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            if (data.length > 0) {
              this.suggestedFilmes = [
                ...this.suggestedFilmes,
                ...data.reverse().splice(1, data.length - 1)
              ];
            }
          },
          complete: () => this.showLoading = false
        });
    });
  }

  private findWatchlistByProfileId() {
    const PREFERRED_CATEGORIES: any = [];

    this.moviesService
      .findWatchlistByProfileId(this.currentProfileId)
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          data?.movies.map((movie: any) => PREFERRED_CATEGORIES.push(movie?.category));
        },
        complete: () => this.getMoviesByCategory(PREFERRED_CATEGORIES)
      });
  }
}

