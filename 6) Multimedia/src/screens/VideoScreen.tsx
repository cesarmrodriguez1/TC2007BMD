import React, {
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import YoutubePlayer from 'react-native-youtube-iframe';

const VideoScreen = (): React.JSX.Element => {
  const [playing, setPlaying] = useState(false);

  const handleStateChange = (
    state: string,
  ): void => {
    if (state === 'ended') {
      setPlaying(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Reproductor de video
      </Text>

      <View style={styles.playerContainer}>

        <YoutubePlayer
          height={230}
          play={playing}
          videoId="dQw4w9WgXcQ"
          onChangeState={handleStateChange}
        />

      </View>

      <Text style={styles.status}>
        {playing
          ? 'Reproduciendo video'
          : 'Video pausado'}
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },

  playerContainer: {
    width: '100%',
    overflow: 'hidden',
  },

  status: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default VideoScreen;