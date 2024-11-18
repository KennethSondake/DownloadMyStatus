// script.js

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZQ_A8j6ZEdvXAqZtFZQ067OA_T-nQemQ",
    authDomain: "file-download-1dd6c.firebaseapp.com",
    projectId: "file-download-1dd6c",
    storageBucket: "file-download-1dd6c.appspot.com",
    messagingSenderId: "324375451725",
    appId: "1:324375451725:web:d28384c0cecab6c951a404"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// DOM Elements
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

// Create loading spinner element
const loadingSpinner = document.createElement('div');
loadingSpinner.className = 'loading-spinner hidden';
preview.appendChild(loadingSpinner);

// File input change event listener
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    preview.innerHTML = ''; // Clear previous content

    if (files.length === 0) {
        preview.innerHTML = '<p>No files uploaded yet.</p>';
        return;
    }

    Array.from(files).forEach((file) => {
        const storageRef = ref(storage, `uploads/${file.name}`);
        const fileDiv = document.createElement('div'); // Wrap each file's preview
        preview.appendChild(fileDiv);

        // Show loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        fileDiv.appendChild(spinner);

        // Upload file to Firebase storage
        uploadBytes(storageRef, file).then(() => {
            // Get the download URL after upload
            return getDownloadURL(storageRef);
        }).then((url) => {
            // Hide spinner
            spinner.remove();

            // Create elements for the uploaded file
            const link = document.createElement('a');
            link.href = url;
            link.textContent = `Download ${file.name}`;
            link.target = '_blank';

            const shareInput = document.createElement('input');
            shareInput.type = 'text';
            shareInput.value = url;
            shareInput.readOnly = true;

            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy Link';
            copyButton.addEventListener('click', () => {
                shareInput.select();
                document.execCommand('copy');
                alert('Link copied to clipboard!');
            });

            // Append elements to the file preview
            fileDiv.appendChild(link);
            fileDiv.appendChild(shareInput);
            fileDiv.appendChild(copyButton);
        }).catch((error) => {
            console.error('Error uploading file:', error);
            alert('Upload failed. Please try again.');

            // Remove spinner
            spinner.remove();
        });
    });
});
