import React, { Component } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import Fire from "../Fire";

export default class ProfileScreen extends Component {
  state = {
    user: {},
    loading: false
  };

  unsubscribe = null;

  componentDidMount() {
    const user = this.props.uid || Fire.shared.uid;

    this.unsubscribe = Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot(
        doc => {
          this.setState({ user: doc.data(), loading: true });
        },
        error => {
          alert(error.message);
        }
      );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.avatarContainer}>
            {this.state.loading === true && (
              <Image
                style={styles.avatar}
                source={this.state.user.avatar ? { uri: this.state.user.avatar } : require("../assets/icon.png")}
              />
            )}
          </View>
          <Text style={styles.name}>{this.state.user.name}</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>21</Text>
            <Text style={styles.statTitle}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>0</Text>
            <Text style={styles.statTitle}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statAmount}>0</Text>
            <Text style={styles.statTitle}>Following</Text>
          </View>
        </View>
        <Button
          color="#038887"
          onPress={() => {
            Fire.shared.signOut();
          }}
          title="Sign Out"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarContainer: {
    borderRadius: 68,
    shadowColor: "#151734",
    shadowRadius: 30,
    shadowOpacity: 0.4,
    elevation: 20
  },
  avatar: {
    width: 136,
    height: 136,
    borderRadius: 68
  },
  name: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "bold"
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 32
  },
  stat: {
    alignItems: "center",
    flex: 1
  },
  statAmount: {
    color: "#4F566D",
    fontSize: 18,
    fontWeight: "300"
  },
  statTitle: {
    color: "#038887",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4
  }
});
