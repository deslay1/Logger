import FirebaseKeys from "./config";
import firebase from "firebase";
require("firebase/firestore");

class Fire {
  constructor() {
    firebase.initializeApp(FirebaseKeys);
    this.checkAuth();
  }

  checkAuth = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase
          .auth()
          .signInAnonymously()
          .catch(function (error) {
            alert(error.message);
          });
      }
    });
  };

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  send = (messages) => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };

      this.append(message);
    }
  };

  append = (message) => this.db.push(message);

  parse = (message) => {
    const { timestamp, text, user } = message.val();
    const { key: _id } = message;
    const createdAt = new Date(timestamp);

    return {
      _id,
      createdAt,
      text,
      user,
    };
  };

  get = (callback) => {
    this.db.limitToLast(20).on("child_added", (snapshot) => callback(this.parse(snapshot)));
  };

  off() {
    this.db.off();
  }

  get db() {
    return firebase.database().ref("messages");
    //return this.firestore.collection("messages");
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  addPost = async ({ text, localUri }) => {
    const remoteUri = null;

    if (localUri !== null) {
      remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`);
    }

    return new Promise((res, rej) => {
      this.firestore
        .collection("posts")
        .add({
          text,
          uid: this.uid,
          timestamp: this.timestamp,
          image: remoteUri,
        })
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  uploadPhotoAsync = async (uri, filename) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(filename).put(file);

      upload.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  createUser = async (user) => {
    let remoteUri = null;

    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .catch((error) => {
          alert(error.message);
        });

      let db = this.firestore.collection("users").doc(this.uid);

      db.set({
        name: user.name,
        email: user.email,
        avatar: null,
      });

      if (user.avatar) {
        remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);

        db.set({ avatar: remoteUri }, { merge: true });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  get firestore() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;
