import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { MoviesService } from "../../shared/services/movies.service";
import { getLocalStorage } from "../../shared/functions";
import { take } from "rxjs";
import { IMovie } from "../../shared/interfaces/imovie";

const IMPORTS = [CommonModule, NavbarComponent];

@Component({
  selector: 'app-my-movie-list',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './my-movie-list.component.html',
  styleUrl: './my-movie-list.component.scss',
  providers: [MoviesService]
})
export class MyMovieListComponent implements OnInit {
  moviesToWatch: Array<IMovie> = [];

  get currentProfileId(): any {
    return JSON.parse(getLocalStorage('currentProfile') || '')?.id;
  }

  constructor(private readonly moviesService: MoviesService) { }

  ngOnInit(): void {
    this.findWatchlistByProfileId();
  }

  private findWatchlistByProfileId() {
    this.moviesService
        .findWatchlistByProfileId(this.currentProfileId)
        .pipe(take(1))
        .subscribe((data: any) =>  {
          this.moviesToWatch = data?.movies ? [
            ...data?.movies.filter((movie: any) => !movie.already_watched),
            ...data?.movies.filter((movie: any) => movie.already_watched)] : [];
        })
  }

  markMovieAsWatched(movieId: string, alreadyWatched: boolean) {
    this.moviesService
      .markMovieAsWatched({
        profileId: this.currentProfileId,
        movieId,
        alreadyWatched: !alreadyWatched
      })
      .pipe(take(1))
      .subscribe(() => this.findWatchlistByProfileId());
  }
}
