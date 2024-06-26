import { StyleSheet, Image } from 'react-native';

export default function ImageViewer({ placeholderImageSource, imagemSelecionada }) {
  const imageSource = imagemSelecionada ? { uri: imagemSelecionada } : placeholderImageSource;
  return (
    <Image source={imageSource} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 400,
    height: 440,
    borderRadius: 18,
  },
});
