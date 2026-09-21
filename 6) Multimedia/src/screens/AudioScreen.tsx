import React, {
  useRef,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Video, {
  OnLoadData,
} from 'react-native-video';

const AudioScreen = (): React.JSX.Element => {
  const playerRef = useRef<Video>(null);

  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);

  const handleLoad = (
    data: OnLoadData,
  ): void => {
    setDuration(data.duration);
  };

  const togglePlayback = (): void => {
    setPaused(current => !current);
  };

  const stopPlayback = (): void => {
    setPaused(true);

    playerRef.current?.seek(0);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Reproductor de audio
      </Text>

      <Text style={styles.subtitle}>
        Audio de demostración
      </Text>

      <Video
        ref={playerRef}
        source={require('../assets/audio.mp3')}
        paused={paused}
        onLoad={handleLoad}
        audioOnly={true}
        playInBackground={false}
        playWhenInactive={false}
        controls={false}
        style={styles.audioPlayer}
      />

      <Text style={styles.duration}>
        Duración:{' '}
        {duration.toFixed(0)} segundos
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={togglePlayback}
      >
        <Text style={styles.buttonText}>
          {paused
            ? '▶ Reproducir'
            : '⏸ Pausar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={stopPlayback}
      >
        <Text style={styles.buttonText}>
          ⏹ Detener
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 15,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },

  audioPlayer: {
    width: 1,
    height: 1,
  },

  duration: {
    fontSize: 16,
    marginVertical: 20,
  },

  button: {
    width: '80%',
    paddingVertical: 16,
    marginVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
});

export default AudioScreen;