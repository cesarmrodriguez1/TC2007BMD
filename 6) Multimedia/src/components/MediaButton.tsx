import React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

interface MediaButtonProps {
  title: string;
  onPress: () => void;
}

const MediaButton = ({
  title,
  onPress,
}: MediaButtonProps): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '85%',
    paddingVertical: 18,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default MediaButton;