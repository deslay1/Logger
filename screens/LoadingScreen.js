import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated } from "react-native";
import MaskedView from "@react-native-community/masked-view";
import firebase from "firebase";

export default class LoadingScreen extends Component {
  state = {
    loadingProgress: new Animated.Value(0),
    animationDone: false
  };

  componentDidMount() {
    Animated.timing(this.state.loadingProgress, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: true,
      delay: 400
    }).start(() => {
      this.setState({ animationDone: true });
    });

    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? "App" : "Auth");
    });
  }

  render() {
    const colorLayer = this.state.animationDone ? null : (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#038887" }]}>
        <Image source={require("../assets/lion-logo.png")} style={styles.imageTemp} resizeMode="contain" />
      </View>
    );

    const whiteLayer = this.state.animationDone ? null : (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#C4C5CD" }]} />
    );

    const imageScale = {
      transform: [
        {
          scale: this.state.loadingProgress.interpolate({
            inputRange: [0, 15, 100],
            outputRange: [0.1, 0.06, 16]
          })
        }
      ]
    };

    const opacity = {
      opacity: this.state.loadingProgress.interpolate({
        inputRange: [0, 25, 50],
        outputRange: [0, 0, 1],
        extrapolate: "clamp"
      })
    };

    return (
      <View style={{ flex: 1 }}>
        {colorLayer}
        <MaskedView
          style={{ flex: 1 }}
          maskElement={
            <View style={styles.container}>
              <Animated.Image
                source={require("../assets/lion-logo.png")}
                style={[{ width: 1000, backgroundColor: "transparent" }, imageScale]}
                resizeMode="contain"
              />
              <Text style={styles.textTemp}>Temporary Loading Screen</Text>
              <ActivityIndicator size="large"></ActivityIndicator>
            </View>
          }>
          {whiteLayer}

          <Animated.View style={[opacity, styles.container]}>
            <Text>Your app!</Text>
          </Animated.View>
        </MaskedView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageTemp: {
    width: 300,
    alignSelf: "center"
  },
  textTemp: {
    fontSize: 24,
    color: "#FFF",
    marginBottom: 200
  }
});
