import React, { Component } from "react";
import { View, Text, Image, StyleSheet, Platform, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { GiftedChat, Bubble, Time, Day } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Fire from "../Fire";

export default class MessageScreen extends Component {
  constructor(props) {
    super(props);

    this.renderAvatar = this.renderAvatar.bind(this);
    //this.renderTime = this.renderTime.bind(this);
  }
  state = {
    user: {},
    loading: true,
    messages: [],
    message: {}
  };

  get user() {
    if (this.state.loading === false) {
      return {
        _id: Fire.shared.uid,
        name: this.state.user.name
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
        doc => {
          this.setState({ user: doc.data(), loading: false });
        },
        error => {
          alert(error.message);
        }
      );

    Fire.shared.get(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
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
            backgroundColor: "#038887"
          },
          left: {
            backgroundColor: "white"
          }
        }}
        textStyle={{
          right: {
            color: "white"
          },
          left: {
            color: "black"
          }
        }}
      />
    );
  }
  //needs some work, get users for each message and their avatars...
  renderAvatar(props) {
    return (
      <Image
        style={styles.avatar}
        source={this.state.user.avatar ? { uri: this.state.user.avatar } : require("../assets/icon.png")}
      />
    );
  }

  renderTime(props) {
    console.log("hi time");
    return <Time {...props} />;
  }

  renderDay(props) {
    return <Day {...props} />;
  }

  render() {
    const chat = (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.user}
        showUserAvatar={true}
        renderUsernameOnMessage={true}
        renderBubble={this.renderBubble}
        //renderMessage={this.renderMessage}
        renderTime={this.renderTime}
        //renderDay={this.renderDay}
        //timeTextStyle={{ left: { color: "red" }, right: { color: "yellow" } }}
        // needs some work --> renderAvatar={this.renderAvatar}
      />
    );

    if (Platform.OS === "android") {
      return (
        <KeyboardAvoidingView style={{ flex: 1 }} behaviour="padding" keyboardVerticalOffset={30} enabled>
          {chat}
        </KeyboardAvoidingView>
      );
    }
    {
      /* <View style={{ flex: 1 }}>
          {chat}
          <KeyboardSpacer />
        </View> */
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {chat}
        <KeyboardSpacer />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 16
  }
});
