import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View} from 'react-native';
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from 'react-native-view-shot';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
const PlaceholderImage = require('./assets/images/background-image.png');


import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

export default function App() {
  const imageRef = useRef();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
     setSelectedImage(result.assets[0].uri);
     setShowAppOptions(true);
    } else {
      alert('Você não selecionou uma imagem.');
    }
  };
  
  if (status === null) {
    requestPermission();
  }

  return (
    <GestureHandlerRootView  style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer 
            placeholderImageSource={PlaceholderImage}
            imagemSelecionada={selectedImage}
          />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {showAppOptions ? (
         <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton 
              icon="refresh" 
              label="Desfazer"
              onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton 
                icon="save-alt"
                label="Salvar"
               onPress={onSaveImageAsync}
              />
          </View>
        </View>
      ) : (
      <View style={styles.footerContainer}>
        <Button 
          theme="primary" 
          label="Escolha uma photo" 
          onPress={pickImageAsync}
        />
        <Button 
          label="Utilize essa photo"  
          onPress={() => setShowAppOptions(true)}
        />
      </View>
    )}

      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList
          onSelect={setPickedEmoji} 
          onCloseModal={onModalClose} 
        />
      </EmojiPicker>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
