import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, ImageBackground, Image, StatusBar, TouchableOpacity } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Fire from "../Fire";
import UserPermissions from "../utilities/UserPermissions";
import * as ImagePicker from "expo-image-picker";

export default class RegisterScreen extends Component {
  static navigationOptions = {
    headerShown: false
  };

  state = {
    user: {
      name: "",
      email: "",
      password: "",
      avatar: null
    },
    errorMessage: null
  };

  handlePickAvatar = async () => {
    UserPermissions.getCameraPermission();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ user: { ...this.state.user, avatar: result.uri } });
    }
  };

  handleSignUp = () => {
    /*    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(userCredentials => {
        return userCredentials.user.updateProfile({
          displayName: this.state.name
        });
      })
      .catch(error => this.setState({ errorMessage: error.message })); */
    Fire.shared.createUser(this.state.user);
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/background1.jpg")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover">
          <StatusBar barstyle="light-content"></StatusBar>

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.greeting}>{`Sign up to get started!`}</Text>
            <TouchableOpacity style={styles.avatarPlaceHolder} onPress={this.handlePickAvatar}>
              {/* {this.state.user.avatar != null ? (
                <Image source={{ uri: this.state.user.avatar }} style={styles.avatar} />
              ) : (
                <Text>Upload Avatar</Text>
              )} */}
              <Image source={{ uri: this.state.user.avatar }} style={styles.avatar} />
              <AntDesign name="adduser" size={32} color="#038887" style={{ marginTop: 10, marginLeft: 2 }}></AntDesign>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.back} onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="ios-arrow-round-back" size={32} color="#FFF"></Ionicons>
          </TouchableOpacity>

          <View style={styles.errorMessage}>
            {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
          </View>

          <View style={styles.form}>
            <View style={{ marginTop: -40 }}>
              <Text style={styles.inputTitle}>Please enter a name</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                onChangeText={name => this.setState({ user: { ...this.state.user, name } })}
                value={this.state.user.name}></TextInput>
            </View>

            <View style={{ marginTop: 32 }}>
              <Text style={styles.inputTitle}>Email Address</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                onChangeText={email => this.setState({ user: { ...this.state.user, email } })}
                value={this.state.user.email}></TextInput>
            </View>

            <View style={{ marginTop: 32 }}>
              <Text style={styles.inputTitle}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={password => this.setState({ user: { ...this.state.user, password } })}
                value={this.state.user.password}></TextInput>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 32 }}
            onPress={() => this.props.navigation.navigate("Login")}>
            <Text style={{ color: "#414959", fontSize: 16 }}>
              Already have an account? <Text style={{ fontWeight: "bold", color: "#E9446A" }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  greeting: {
    marginTop: 95,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 14,
    textTransform: "uppercase"
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 16,
    color: "#161F3D"
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "500"
  },
  back: {
    position: "absolute",
    top: 48,
    left: 32,
    height: 50,
    width: 50,
    borderRadius: 32,
    backgroundColor: "#038887",
    alignItems: "center",
    justifyContent: "center",
    padding: 5
  },
  avatarPlaceHolder: {
    width: 100,
    height: 100,
    backgroundColor: "#E1E2E6",
    borderRadius: 48,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    position: "absolute",
    height: 100,
    width: 100,
    borderRadius: 48
  }
});
