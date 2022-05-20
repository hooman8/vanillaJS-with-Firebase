import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { firestoreDb, cloudStorage } from './firebaseConfiguration';

export const writeSongToFireStore = (songArtist, songTitle, songFile) => {
  const song = {
    songTitle,
    songFileName: songFile.name
  };
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // Get the collection of songs for the current user.
      const songsCollection = firestoreDb.collection(`users/${user.uid}/songs`);
      // Add the song to a document in the songs collection and log the doc 
      songsCollection.add(song)
        .then(docRef => {
          console.log('song document id ', docRef.id);
          saveSongFile(user.uid, docRef.id, songFile);
        })
        .catch(error => console.log(error));
        // Add artist to user doc if artist exists
        if(songArtist) {
          const userDocument = firestoreDb.doc(`users/${user.uid}`);
          userDocument.set({
            artistName: songArtist
          });
        } 
    }
  });
}


const saveSongFile = (userId, docRefId, songFile) => {
  
  // Create a refrence to the file path in cloud storage
  //This will create the path if it does not already exist
  const fileRef = cloudStorage.ref(`songs/${userId}/${docRefId}-${songFile.name}`);
  //Upload the file to cloud storage
  const uploadTask = fileRef.put(songFile);
  // The restuned task can indicate changes in the state of the file upload.
  uploadTask.on('state_changed', 
  // The progress function can indicate how many byte have been transfereed to cloud storage.
  function progress(snapshot) {
    console.log('Bytes transferred: ', snapshot.bytesTransferred);
    console.log('total bytes: ', snapshot.totalBytes);
  },
  // The error function will be called if there is an error while the file is uploading
  function error(error) {
    console.error('There was an error while saving to cloud storage: ', error);
  },
  //The complete function will be called once the upload has completed successfully
  function complete() {
    console.log('File successfully saved to cloud storage');
  }
  )
}


export const readSongsFromFirestore = (userId) => {
  return new Promise(resolve => {
    getArtistName(userId)
      .then(songArtist => {
        const songs = [];
        const songsCollection = firestoreDb.collection(`users/${userId}/songs`);
        songsCollection.get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              const songData = {...doc.data(), id: doc.id, songArtist};
                songs.push(songData);
            });
            resolve(songs);
          });
      });
  });
}

export const deleteSongFromFirestore = (songId) => {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        const songDocument = firestoreDb.doc(`users/${user.uid}/songs/${songId}`);
        songDocument.delete()
          .then(() => {
            console.log(`The song with an id of ${songId} has been deleted successfully`);
            resolve();
          })
          .catch((error) => {
            console.log(`There was an error while trying to delete song with if ${songId}`, error);
            resolve();
          });
      }
    });
  });
}

export const getSongFromFirestore = (songId) => {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        const songDocument = firestoreDb.doc(`users/${user.uid}/songs/${songId}`);

        //get the song data from Firestore
        songDocument.get()
          .then(doc => {
            if(doc.exists){
              const songData = {...doc.data(), id: doc.id};
              resolve(songData);
            }
          })
          .catch(error => {
            console.error(`There was an error while trying to get song with id ${songId}`, error);
            resolve();
          });
      }
    });
  });
}

export const updateSongInFirebase = (song) => {
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
      //Assign the refrence to the song document using songId
      const songDocument = firestoreDb.doc(`users/${user.uid}/songs/${song.id}`);
      
      // create a new song object 
      const updatedSong = {
        songArtist: song.songArtist,
        songTitle: song.songTitle
      }
      //update the song with the new song object including songArtist and songTitle
      songDocument.update(updatedSong)
        .then(() => console.log('Your song was updated successfully: ', song))
        .catch(error => console.error('there was an error while updating your song: ', song, error));
    }
  });
} 

export const getAudioFromStorage = (userId, fileName) => {
  return new Promise(resolve => {
    // Get the refrence to the file in Cloud Storage
    const fileRef = cloudStorage.ref(`songs/${userId}/${fileName}`);
    
    // Get the URL for the song file in Cloud Storage
    fileRef.getDownloadURL()
      .then(url => resolve(url))
      .catch(error => console.error('There was an error while retriving a file from Cloud Storage', error));
  });
}

export const getArtistName = (userId) => {
  return new Promise(resolve => {
    const userDocument = firestoreDb.doc(`users/${userId}`);
    userDocument.get()
      .then(doc => {
        if(doc.exists){
          resolve(doc.data().artistName);
        }
      });
  })
}