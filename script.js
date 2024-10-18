const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

// Create a loading indicator
const loadingMessage = document.createElement('p');
loadingMessage.textContent = 'Uploading... Please wait.';
loadingMessage.style.display = 'none'; // Initially hidden
preview.appendChild(loadingMessage);

// Handle file input change event
fileInput.addEventListener('change', (event) => {
  const files = event.target.files;

  // Clear the preview section and show loading message
  preview.innerHTML = '';
  preview.appendChild(loadingMessage);
  loadingMessage.style.display = 'block';

  // Disable the file input while uploading
  fileInput.disabled = true;

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
