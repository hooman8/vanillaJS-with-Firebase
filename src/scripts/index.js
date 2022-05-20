import firebase from 'firebase';
import 'firebase/auth';
import '../firebase/firebaseConfiguration';
import { assignClick, initializeSigninButtons, addSongToMySongs } from './utilities';
import {
   googleSignin,
   signOut,
   facebookSignin,
   twitterSignin,
   emailSignin,
   createEmailSigninAccount,
   anonymousSignin
  } from '../firebase/firebaseAuthentication';

import { 
  writeSongToFireStore,
  readSongsFromFirestore,
  deleteSongFromFirestore,
  getSongFromFirestore,
  updateSongInFirebase,
  getAudioFromStorage
 } from '../firebase/firebaseRepository';

initializeSigninButtons();
anonymousSignin();
assignClick('signin-google', googleSignin);
assignClick('signin-google', facebookSignin);
assignClick('signin-google', twitterSignin);
assignClick('appbar-signout-button', signOut);

const emailSigninForm = document.getElementById('email-signin-form');
if(emailSigninForm) {
  emailSigninForm.onsubmit = (event) => {
    event.preventDefault();
    const email = event.target['email-input'].value;
    const password = event.target['password-input'].value;
    emailSignin(email, password);
  }
}

const createEmailSigninForm = document.getElementById('create-email-signin');
if(createEmailSigninForm) {
  createEmailSigninForm.onsubmit = (event) => {
    event.preventDefault();
    const email = event.target['email-input'].value;
    const password = event.target['password-input'].value;
    createEmailSigninAccount(email, password);
  }
}

const createTuneForm = document.getElementById('add-tune-form');
if(createTuneForm) {
  createTuneForm.onsubmit = (event) => {
    event.preventDefault();
    const songArtist = event.target['artist-input'].value;
    const songTitle = event.target['song-title-input'].value;
    const songFile = event.target['song-file'].files[0];
    writeSongToFireStore(songArtist, songTitle, songFile);
  }
}
const mySongsComponent = document.getElementById('my-songs-component');
if(mySongsComponent) {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      readSongsFromFirestore(user.uid)
      .then(songs => {
        songs.forEach(song => {
          addSongToMySongs(mySongsComponent, song);
        });
      });
    }
  })

}

window.deleteSong = function(id) {
  deleteSongFromFirestore(id)
    .then(() => window.location.reload());
}

const editSongForm = document.getElementById('edit-tune-form');
if(editSongForm) {
  const searchParams = new URLSearchParams(location.search);
  const searchId = searchParams.get('id');
  getSongFromFirestore(searchId)
    .then(song => {
      //populate the form with song artist, song title, and song id
      editSongForm.elements['song-id'].value = song.id;
      editSongForm.elements['artist-input-edit'].value = song.songArtist;
      editSongForm.elements['song-title-input-edit'].value = song.songTitle;
      
    })

  //Create on submit function
  editSongForm.onsubmit = (event) => {
    event.preventDefault();
    const id = event.target['song-id'].value;
    const songArtist = event.target['artist-input-edit'].value;
    const songTitle = event.target['song-title-input-edit'].value;
    const song = {id, songArtist, songTitle};
    updateSongInFirebase(song);
  }
}

const audioElement = document.getElementById('audio-component');
if(audioElement) {
  const userId = searchParams.get('userid');
  const searchParams = new URLSearchParams(location.search);
  const fileName = searchParams.get('filename');
  getAudioFromStorage(userId, fileName)
    .then(fileURL => {
      audioElement.setAttribute('src', fileURL);
    });
}