export interface SearchModel {
  searchType: SearchModelType,
  searchTerm: string
}

export enum SearchModelType {
  TVShow = 'tvShow',
  Movie = 'movie'
}
