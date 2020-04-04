import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, LayoutAnimation } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import Fire from "../Fire";

const firebase = require("firebase");
require("firebase/firestore");

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    posts: [],
    isLoading: true,
  };

  componentDidMount() {
    this.getPosts();
  }

  getUsers() {
    for (let i = 0; i < this.state.posts.length; i++) {
      Fire.shared.firestore
        .collection("users")
        .doc(this.state.posts[i].uid)
        .onSnapshot(
          (doc) => {
            let posts = [...this.state.posts];
            posts[i].user = doc.data();
            this.setState({ posts });
          },
          (error) => {
            alert(error.message);
          }
        );
    }
  }

  async getPosts() {
    const temp = [];
    await firebase
      .firestore()
      .collection("posts")
      .get()
      .then((Snapshot) => {
        Snapshot.docs.forEach((doc) => {
          //this.setState({ posts: [...this.state.posts, doc.data()] });
          const { image, text, timestamp, uid } = doc.data();
          temp.push({
            id: doc.id,
            image,
            text,
            timestamp,
            uid,
            user: {},
          });
        });

        this.setState({ posts: temp });

        //if (this.state.isLoading) {
        this.setState({ isLoading: false });
        //}
      })
      .catch((error) => {
        alert(error.message);
      });

    this.getUsers();
  }

  onRefresh() {
    this.setState({ isLoading: true }, function () {
      this.getPosts();
    });
  }

  renderPost = (post) => {
    return (
      <View style={styles.feedItem}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <View style={styles.userDetails}>
                <Image
                  source={post.user.avatar ? { uri: post.user.avatar } : require("../assets/icon.png")}
                  style={styles.avatar}
                />
                <Text style={styles.name}>{post.user.name}</Text>
              </View>
              <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
            </View>

            <Ionicons name="ios-more" size={24} color="#78788B" style={styles.icon}></Ionicons>
          </View>

          <Text style={styles.post}>{post.text}</Text>
          {post.image !== null && <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />}

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Ionicons name="ios-heart-empty" size={24} color="#78788B" style={styles.icon}></Ionicons>
            <Ionicons name="ios-chatboxes" size={24} color="#78788B" style={styles.icon}></Ionicons>
          </View>
        </View>
      </View>
    );
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
        </View>

        <FlatList
          style={styles.feed}
          data={this.state.posts.sort((a, b) => b.timestamp - a.timestamp)}
          renderItem={({ item }) => this.renderPost(item)}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isLoading}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFECF4",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    marginBottom: 8,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 8,
    shadowOpacity: 0.4,
    elevation: 10,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
    borderWidth: 2,
    borderColor: "#038887",
  },
  userDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "400",
    color: "#454D65",
  },
  timestamp: {
    fontSize: 10,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899",
  },
  postImage: {
    width: undefined,
    height: 200,
    borderRadius: 5,
    marginTop: 16,
  },
  icon: {
    marginTop: 16,
    marginRight: 16,
  },
});
