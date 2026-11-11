import { geoContains } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

/**
 * Evenly spaced dots on land (a Fibonacci lattice over the sphere), as [latitude, longitude] pairs, from a
 * world-atlas land topology. Antarctica is left out below `southernLimit` for a cleaner silhouette.
 *
 * @example
 * landPoints(topology, 42000).length / 2; // ≈ number of dots
 */
export function landPoints(topology: Topology, samples = 42000, southernLimit = -60): Float32Array {
  const land = feature(topology, topology.objects.land as GeometryCollection);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points: number[] = [];
  for (let index = 0; index < samples; index++) {
    const y = 1 - (index / (samples - 1)) * 2;
    const latitude = (Math.asin(y) * 180) / Math.PI;
    const longitude = (((((golden * index * 180) / Math.PI) % 360) + 540) % 360) - 180;
    if (latitude >= southernLimit && geoContains(land, [longitude, latitude])) points.push(latitude, longitude);
  }
  return new Float32Array(points);
}
