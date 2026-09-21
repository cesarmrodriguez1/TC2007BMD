export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteResult {
  distanceMeters: number;
  duration: string;
  polyline: string;
  startLocation: Coordinate;
  endLocation: Coordinate;
}