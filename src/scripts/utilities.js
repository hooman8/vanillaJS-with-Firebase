import { signOut } from "../firebase/firebaseAuthentication";

import firebase from 'firebase/app';
import 'firebase/auth';
export const assignClick = (elementId, func) => {
  const clickElement = document.getElementById(elementId);
  if(clickElement) clickElement.onclick = func;
}

export const initializeSigninButtons = () => {
  const signInButton = document.getElementById('appbar-signin-button');
  const signOutButton = document.getElementById('appbar-signout-button');
  const addTuneButton = document.getElementById('appbar-addtune-button');
  const mySongsLink = document.getElementById('appbar-mysongs-link');

  // check whether there is a user signed in or not
  //makes sure it has acces to user's object before doing anything with it

  if(signInButton && signOutButton && addTuneButton && mySongsLink) {
    firebase.auth().onAuthStateChanged((user) => {
      if(user && !user.isAnonymous) {
        signInButton.style.display = 'none';
        signOutButton.style.display = 'inline-block';
        addTuneButton.style.display = 'inline-block';
        mySongsLink.style.display = 'inline-block';
      } else {
        signInButton.style.display = 'inline-block';
        signOutButton.style.display = 'none';
        addTuneButton.style.display = 'none';
        mySongsLink.style.display = 'none';
      }
    });
  }
}

export const addSongToMySongs = (mySongsComponent, song) => {
  const songContainer = document.createElement('div');
  songContainer.setAttribute('class', 'song-container');
  songContainer.innerHTML = `
  <h3>${song.songTitle} by ${song.songArtist}</h3>
  <div>
    <a href="/edittune.html?id=${song.id}"<button>Edit</button></a>
    <button onclick="window.deleteSong('${song.id}')">Delete</button>
  </div>
  `;
  mySongsComponent.append(songContainer);
}

