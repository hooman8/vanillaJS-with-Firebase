import firebase from 'firebase/app';
import 'firebase/auth';
export const googleSignin = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => console.log(result.user.displayName))
    .catch(error => console.log(error));
}

export const facebookSignin = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => console.log(result.user.displayName))
    .catch(error => console.log(error));
}

export const twitterSignin = () => {
  const provider = new firebase.auth.TwitterAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => console.log(result.user.displayName))
    .catch(error => console.log(error));
}

export const signOut = () => {
  firebase.auth().signOut()
    .then(() => console.log('user successfully sign out'))
    .catch((error) => console.error('there was a problem', error));
}

export const emailSignin = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => console.log('user logged in successfully with email and password'))
    .catch(error => console.error(error));
}
export const createEmailSigninAccount = (email, password) => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(()=> console.log('user successfully creayed an account with email and password'))
    .catch(error => console.error(error));
}

export const anonymousSignin = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if(!user) {
      firebase.auth().signInAnonymously()
      .then(() => console.log('user loggned in anonymously'))
      .catch(error => console.error('there was an error while signing in anonymously: ', error));
    }
  });
}