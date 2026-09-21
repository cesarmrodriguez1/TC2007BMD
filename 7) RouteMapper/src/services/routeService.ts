import type { RouteResult } from '../types/route';

const GOOGLE_ROUTES_API_KEY = 'API KEY IS PLACED HERE';

const ROUTES_URL =
  'https://routes.googleapis.com/directions/v2:computeRoutes';

interface RoutesApiResponse {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;

    polyline?: {
      encodedPolyline?: string;
    };

    legs?: Array<{
      startLocation?: {
        latLng?: {
          latitude?: number;
          longitude?: number;
        };
      };

      endLocation?: {
        latLng?: {
          latitude?: number;
          longitude?: number;
        };
      };
    }>;
  }>;
}

export async function calculateRoute(
  origin: string,
  destination: string
): Promise<RouteResult> {
  if (!origin.trim()) {
    throw new Error('Ingresa el lugar de origen.');
  }

  if (!destination.trim()) {
    throw new Error('Ingresa el lugar de destino.');
  }

  const response = await fetch(ROUTES_URL, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',

      'X-Goog-Api-Key': GOOGLE_ROUTES_API_KEY,

      'X-Goog-FieldMask':
        'routes.distanceMeters,' +
        'routes.duration,' +
        'routes.polyline.encodedPolyline,' +
        'routes.legs.startLocation,' +
        'routes.legs.endLocation',
    },

    body: JSON.stringify({
      origin: {
        address: origin.trim(),
      },

      destination: {
        address: destination.trim(),
      },

      travelMode: 'DRIVE',

      routingPreference: 'TRAFFIC_AWARE',

      polylineQuality: 'OVERVIEW',

      polylineEncoding: 'ENCODED_POLYLINE',

      computeAlternativeRoutes: false,

      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
      },

      languageCode: 'es-MX',

      regionCode: 'MX',

      units: 'METRIC',
    }),
  });

  const responseText = await response.text();

  let data: RoutesApiResponse | { error?: any };

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Google Routes API devolvió una respuesta no válida. HTTP ${response.status}`
    );
  }

  if (!response.ok) {
    const errorData = data as { error?: any };

    const googleMessage =
      errorData.error?.message ||
      'La solicitud a Google Routes API fue rechazada.';

    throw new Error(
      `Google Routes API: ${googleMessage}`
    );
  }

  const routes = (data as RoutesApiResponse).routes;

  if (!routes || routes.length === 0) {
    throw new Error(
      'Google Routes API no encontró una ruta entre los lugares indicados.'
    );
  }

  const route = routes[0];

  const encodedPolyline =
    route.polyline?.encodedPolyline;

  if (!encodedPolyline) {
    throw new Error(
      'Google Routes API no devolvió la polilínea de la ruta.'
    );
  }

  const startLocation =
    route.legs?.[0]?.startLocation?.latLng;

  const endLocation =
    route.legs?.[route.legs.length - 1]?.endLocation?.latLng;

  if (
    !startLocation ||
    startLocation.latitude === undefined ||
    startLocation.longitude === undefined
  ) {
    throw new Error(
      'Google Routes API no devolvió la ubicación inicial.'
    );
  }

  if (
    !endLocation ||
    endLocation.latitude === undefined ||
    endLocation.longitude === undefined
  ) {
    throw new Error(
      'Google Routes API no devolvió la ubicación final.'
    );
  }

  return {
    distanceMeters: route.distanceMeters ?? 0,

    duration: route.duration ?? '0s',

    polyline: encodedPolyline,

    startLocation: {
      latitude: startLocation.latitude,
      longitude: startLocation.longitude,
    },

    endLocation: {
      latitude: endLocation.latitude,
      longitude: endLocation.longitude,
    },
  };
}