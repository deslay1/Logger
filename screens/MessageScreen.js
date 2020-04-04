import React, { Component } from "react";
import { View, Text, Image, StyleSheet, Platform, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { GiftedChat, Bubble, Time, Day } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Fire from "../Fire";

export default class MessageScreen extends Component {
  constructor(props) {
    super(props);

    //this.renderTime = this.renderTime.bind(this);
  }
  state = {
    user: {},
    loading: true,
    messages: [],
    message: {},
  };

  get user() {
    if (this.state.loading === false) {
      return {
        _id: Fire.shared.uid,
        name: this.state.user.name,
        avatar: this.state.user.avatar,
        //name: this.props.navigation.state.params.name
      };
    }
  }

  unsubscribe = null;

  componentDidMount() {
    const user = this.props.uid || Fire.shared.uid;

    this.unsubscribe = Fire.shared.firestore
      .collection("users")
      .doc(user)
      .onSnapshot(
        (doc) => {
          this.setState({ user: doc.data(), loading: false });
        },
        (error) => {
          alert(error.message);
        }
      );

    Fire.shared.get((message) =>
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }

  componentWillUnmount() {
    Fire.shared.off();
    this.unsubscribe();
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#038887",
          },
          left: {
            backgroundColor: "white",
          },
        }}
        textStyle={{
          right: {
            color: "white",
          },
          left: {
            color: "black",
          },
        }}
      />
    );
  }

  renderTime(props) {
    return <Time {...props} timeTextStyle={{ left: { color: "#038887" }, right: { color: "yellow" } }} />;
  }

  renderDay(props) {
    return <Day {...props} textStyle={{ color: "#ab0000" }} />;
  }

  render() {
    const chat = (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.user}
        showUserAvatar={true}
        showAvatarForEveryMessage={true}
        renderUsernameOnMessage={true}
        renderBubble={this.renderBubble}
        renderTime={this.renderTime}
        renderDay={this.renderDay}
      />
    );

    if (Platform.OS === "android") {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Global Chat</Text>
          </View>
          <KeyboardAvoidingView style={{ flex: 1 }} behaviour="padding" keyboardVerticalOffset={30} enabled>
            {chat}
          </KeyboardAvoidingView>
        </View>
      );
    }
    {
      /* <View style={{ flex: 1 }}>
          {chat}
          <KeyboardSpacer />
        </View> */
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Global Chat</Text>
        </View>
        <SafeAreaView style={{ flex: 1 }}>
          {chat}
          <KeyboardSpacer />
        </SafeAreaView>
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
    paddingTop: 32,
    paddingBottom: 8,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#038887",
  },
});
