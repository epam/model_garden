export interface IBucket {
  id: string;
  name: string;
}

export interface IBucketsResponse {
  results: IBucket[];
}
