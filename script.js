const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');



  // Create the loading spinner and loading message
  const loadingSpinner = document.createElement('div');
  loadingSpinner.className = 'loading-spinner hidden'; // Hide initially

  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Uploading...';
  loadingMessage.className = 'hidden';

  preview.appendChild(loadingSpinner);
  preview.appendChild(loadingMessage);

  // Handle file input change event
  fileInput.addEventListener('change', (event) => {
    const files = event.target.files;

    // Clear the preview section and show the loading spinner and message
    preview.innerHTML = '';
    preview.appendChild(loadingSpinner);
    preview.appendChild(loadingMessage);

    loadingSpinner.classList.remove('hidden');
    loadingMessage.classList.remove('hidden');
    fileInput.disabled = true;

    // Simulate an upload process
    setTimeout(() => {
      // Hide the spinner and message after "upload"
      loadingSpinner.classList.add('hidden');
      loadingMessage.classList.add('hidden');
      fileInput.disabled = false;

      // Display a preview of the uploaded files
      Array.from(files).forEach(file => {
        const fileElement = document.createElement('p');
        fileElement.textContent = `Uploaded: ${file.name}`;
        preview.appendChild(fileElement);
      });
    }, 3000); // Simulate a 3-second upload delay
  });

  Array.from(files).forEach((file) => {
    const storageRef = firebase.storage().ref(`uploads/${file.name}`);

    // Start uploading the file
    storageRef.put(file)
      .then(() => {
        console.log(`${file.name} uploaded successfully!`);

        // Get the download URL after upload completes
        return storageRef.getDownloadURL();
      })
      .then((url) => {
        console.log(`Download URL: ${url}`);

        // Create a download link
        const link = document.createElement('a');
        link.href = url;
        link.textContent = `Download ${file.name}`;
        link.target = '_blank';

        // Create a shareable input field
        const shareInput = document.createElement('input');
        shareInput.type = 'text';
        shareInput.value = url;
        shareInput.readOnly = true;

        // Create a copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Link';
        copyButton.addEventListener('click', () => {
          shareInput.select();
          document.execCommand('copy');
          alert('Download link copied to clipboard!');
        });

        // Append the download link and input field to the preview section
        preview.appendChild(link);
        preview.appendChild(document.createElement('br'));
        preview.appendChild(shareInput);
        preview.appendChild(copyButton);
        preview.appendChild(document.createElement('hr'));
      })
      .catch((error) => {
        console.error('Error uploading or getting download URL:', error);
        alert('Failed to upload or generate download link. Please check the console for more details.');
      })
      .finally(() => {
        // Re-enable the file input and hide the loading message
        fileInput.disabled = false;
        loadingMessage.style.display = 'none';
      });
  });
});
