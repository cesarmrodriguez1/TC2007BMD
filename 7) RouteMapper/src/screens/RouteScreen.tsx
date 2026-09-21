import React, {
  useRef,
  useState
} from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE
} from 'react-native-maps';

import type {
  Region
} from 'react-native-maps';

import {
  calculateRoute
} from '../services/routeService';

import type {
  RouteResult
} from '../types/route';

import {
  decodePolyline
} from '../utils/polyline';

export default function RouteScreen() {

  const mapRef =
    useRef<MapView>(null);

  const [origin, setOrigin] =
    useState('');

  const [destination, setDestination] =
    useState('');

  const [route, setRoute] =
    useState<RouteResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const initialRegion: Region = {

    latitude: 20.6597,

    longitude: -103.3496,

    latitudeDelta: 0.08,

    longitudeDelta: 0.08
  };

  const handleTraceRoute =
    async (): Promise<void> => {

      if (!origin.trim()) {

        Alert.alert(
          'Origen requerido',
          'Escribe el lugar de origen.'
        );

        return;
      }

      if (!destination.trim()) {

        Alert.alert(
          'Destino requerido',
          'Escribe el lugar de destino.'
        );

        return;
      }

      try {

        setLoading(true);

        const result =
          await calculateRoute(
            origin,
            destination
          );

        setRoute(result);

        mapRef.current?.fitToCoordinates(
          [
            result.startLocation,
            result.endLocation
          ],
          {
            edgePadding: {
              top: 80,
              right: 50,
              bottom: 230,
              left: 50
            },

            animated: true
          }
        );

      } catch (error) {

        console.error(
          'Error:',
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : 'No fue posible calcular la ruta.';

        Alert.alert(
          'Error al calcular la ruta',
          message
        );

      } finally {

        setLoading(false);
      }
    };

  const formatDistance =
    (meters: number): string => {

      if (meters < 1000) {

        return `${Math.round(meters)} m`;
      }

      return `${(
        meters / 1000
      ).toFixed(1)} km`;
    };

  const formatDuration =
    (duration: string): string => {

      const seconds =
        Number(
          duration.replace(
            's',
            ''
          )
        );

      if (!Number.isFinite(seconds)) {

        return duration;
      }

      const minutes =
        Math.round(
          seconds / 60
        );

      if (minutes < 60) {

        return `${minutes} min`;
      }

      const hours =
        Math.floor(
          minutes / 60
        );

      const remainingMinutes =
        minutes % 60;

      if (
        remainingMinutes === 0
      ) {

        return `${hours} h`;
      }

      return (
        `${hours} h ` +
        `${remainingMinutes} min`
      );
    };

  return (

    <SafeAreaView
      style={styles.container}
    >

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <View
          style={styles.header}
        >

          <Text
            style={styles.title}
          >
            Trazar ruta
          </Text>

          <Text
            style={styles.subtitle}
          >
            Especifica dos lugares
          </Text>

          <TextInput
            style={styles.input}
            value={origin}
            onChangeText={setOrigin}
            placeholder="Lugar de origen"
            placeholderTextColor="#777777"
            autoCapitalize="sentences"
            autoCorrect={false}
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={
              setDestination
            }
            placeholder="Lugar de destino"
            placeholderTextColor="#777777"
            autoCapitalize="sentences"
            autoCorrect={false}
            returnKeyType="done"
          />

          <Pressable
            style={[
              styles.button,

              loading &&
                styles.buttonDisabled
            ]}
            onPress={
              handleTraceRoute
            }
            disabled={loading}
          >

            {loading ? (

              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

            ) : (

              <Text
                style={
                  styles.buttonText
                }
              >
                Trazar ruta
              </Text>
            )}

          </Pressable>

        </View>

        <View
          style={styles.mapContainer}
        >

          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={
              initialRegion
            }
            showsCompass
            showsScale
            showsBuildings
            showsTraffic
          >

            {route && (

              <>

                <Marker
                  coordinate={
                    route.startLocation
                  }
                  title="Origen"
                  description={
                    origin
                  }
                />

                <Marker
                  coordinate={
                    route.endLocation
                  }
                  title="Destino"
                  description={
                    destination
                  }
                />

                <Polyline
                  coordinates={
                    decodePolyline(
                      route.polyline
                    )
                  }
                  strokeWidth={5}
                  strokeColor="#1565C0"
                  lineCap="round"
                  lineJoin="round"
                />

              </>
            )}

          </MapView>

          {route && (

            <View
              style={styles.infoCard}
            >

              <Text
                style={styles.infoTitle}
              >
                Información de la ruta
              </Text>

              <View
                style={styles.infoRow}
              >

                <Text
                  style={styles.infoLabel}
                >
                  Distancia
                </Text>

                <Text
                  style={styles.infoValue}
                >
                  {formatDistance(
                    route.distanceMeters
                  )}
                </Text>

              </View>

              <View
                style={styles.infoRow}
              >

                <Text
                  style={styles.infoLabel}
                >
                  Tiempo estimado
                </Text>

                <Text
                  style={styles.infoValue}
                >
                  {formatDuration(
                    route.duration
                  )}
                </Text>

              </View>

            </View>
          )}

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#202124'
  },

  subtitle: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 14,
    color: '#5F6368'
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
    fontSize: 16,
    color: '#202124',
    backgroundColor: '#FFFFFF'
  },

  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonDisabled: {
    opacity: 0.7
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },

  mapContainer: {
    flex: 1,
    position: 'relative'
  },

  map: {
    flex: 1
  },

  infoCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 10
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },

  infoLabel: {
    fontSize: 14,
    color: '#5F6368'
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202124'
  }
});