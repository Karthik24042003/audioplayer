const audioFileInput = document.getElementById('audioFileInput');
const uploadButton = document.getElementById('uploadButton');
const playlist = document.getElementById('playlist');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const audioPlayer = document.getElementById('audioPlayer');

let playlistItems = []; // Array to store audio file objects
let currentPlayingIndex = -1; // Index of the currently playing audio file

// Event listener for file upload
uploadButton.addEventListener('click', () => {
    const files = audioFileInput.files;
    for (const file of files) {
        if (file.type !== 'audio/mpeg') {
            alert('Invalid file format. Please upload MP3 files only.');
            continue;
        }

        playlistItems.push({
            file: file,
            url: URL.createObjectURL(file), // Create a temporary URL for audio playback
            title: file.name // Extract the filename as the title
        });

        addPlaylistItem(file.name); // Add a list item to the playlist

        if (currentPlayingIndex === -1) { // Start playing the first uploaded file
            playAudio(0);
        }
    }

    audioFileInput.value = ''; // Clear the file input after upload
});

// Function to add an item to the playlist
function addPlaylistItem(title) {
    const listItem = document.createElement('li');
    listItem.textContent = title;
    listItem.addEventListener('click', () => playAudio(playlistItems.findIndex(item => item.title === title)));
    playlist.appendChild(listItem);
}

// Function to play an audio file from the playlist
function playAudio(index) {
    currentPlayingIndex = index;

    const audioItem = playlistItems[index];
    nowPlayingTitle.textContent = audioItem.title;

    if (audioPlayer.src !== audioItem.url) { // Avoid unnecessary resource usage
        audioPlayer.src = audioItem.url;
        audioPlayer.play();
    } else {
        audioPlayer.currentTime = 0; // Restart playback if the same file is clicked
        audioPlayer.play();
    }

    audioPlayer.addEventListener('ended', () => {
        if (currentPlayingIndex + 1 < playlistItems.length) {
            playAudio(currentPlayingIndex + 1);
        }
    });
}

// Restore playback on page reload
window.addEventListener('storage', event => {
    if (event.key === 'audioPlayerState') {
        const state = JSON.parse(event.newValue);
        if (state.index !== undefined && state.time !== undefined) {
            currentPlayingIndex = state.index;
            audioPlayer.src = playlistItems[state.index].url;
            audioPlayer.currentTime = state.time;
        }
    }
});

// Store playback state on unload
window.addEventListener('beforeunload', () => {
    const state = {
        index: currentPlayingIndex,
        time: audioPlayer.currentTime
    };
    localStorage.setItem('audioPlayerState', JSON.stringify(state));
});
