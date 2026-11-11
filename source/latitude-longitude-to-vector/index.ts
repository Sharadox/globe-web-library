import { Vector3 } from "three";
import { radians } from "@sharadox/web-library/math/radians";

/**
 * A point on a sphere of `radius`. Longitude 0 faces the camera (+z), so
 * `rotation.y = -longitude` brings a longitude to the front and `rotation.x = latitude` centers a latitude.
 */
export function latitudeLongitudeToVector(latitude: number, longitude: number, radius = 1): Vector3 {
  const latitudeRadians = radians(latitude);
  const longitudeRadians = radians(longitude);
  return new Vector3(
    radius * Math.cos(latitudeRadians) * Math.sin(longitudeRadians),
    radius * Math.sin(latitudeRadians),
    radius * Math.cos(latitudeRadians) * Math.cos(longitudeRadians),
  );
}
