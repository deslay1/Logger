import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Fire from "../Fire";
import * as ImagePicker from "expo-image-picker";
import UserPermissions from "../utilities/UserPermissions";

const firebase = require("firebase");
require("firebase/firestore");

export default class PostScreen extends Component {
  state = {
    text: "",
    image: null,
    loading: false
  };

  componentDidMount() {
    UserPermissions.getCameraPermission();
  }

  handlePost = () => {
    Fire.shared
      .addPost({ text: this.state.text.trim(), localUri: this.state.image })
      .then(ref => {
        this.setState({ text: "", image: null });
        this.props.navigation.goBack();
      })
      .catch(error => {
        alert(error.message);
      });
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri, loading: false });
    } else {
      this.setState({ image: result.uri, loading: true });
    }
  };

  render() {
    const loading = this.state.loading;
    return (
      <SafeAreaView style={styles.AndroidSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="md-arrow-back" size={24} color="#038887"></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handlePost}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Image source={require("../assets/icon.png")} style={styles.avatar}></Image>
          <TextInput
            autoFocus={true}
            multiline={true}
            numberOfLines={4}
            style={{ flex: 1 }}
            placeholder="Wanna post something?"
            onChangeText={text => this.setState({ text })}
            value={this.state.text}></TextInput>
        </View>

        <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
          <Ionicons name="md-camera" size={32} color="#038887"></Ionicons>
        </TouchableOpacity>

        <View style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}>
          {!loading ? (
            <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <Text>Bad</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB"
  },
  inputContainer: {
    marginLeft: 32,
    alignItems: "center",
    flexDirection: "row"
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32
  }
});
