const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

// Handle file input change event
fileInput.addEventListener('change', (event) => {
  const files = event.target.files;  // Get uploaded files

  // Loop through all selected files
  Array.from(files).forEach((file) => {
    const storageRef = firebase.storage().ref(`uploads/${file.name}`);  // Set Firebase storage path

    // Upload the file to Firebase Storage
    storageRef.put(file).then(() => {
      console.log(`${file.name} uploaded successfully!`);

      // Get the download URL after upload
      storageRef.getDownloadURL().then((url) => {
        console.log(`Download URL: ${url}`);

        // Create a download link
        const link = document.createElement('a');
        link.href = url;
        link.textContent = `Download ${file.name}`;
        link.target = '_blank';  // Open in a new tab

        // Optional: Add a copyable input with the download link
        const shareInput = document.createElement('input');
        shareInput.type = 'text';
        shareInput.value = url;
        shareInput.readOnly = true;

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Link';
        copyButton.addEventListener('click', () => {
          shareInput.select();
          document.execCommand('copy');
          alert('Download link copied to clipboard!');
        });

        // Append everything to the preview section
        preview.appendChild(link);
        preview.appendChild(document.createElement('br'));  // Line break
        preview.appendChild(shareInput);
        preview.appendChild(copyButton);
        preview.appendChild(document.createElement('hr'));  // Divider for each file
      }).catch((error) => {
        console.error('Error getting download URL:', error);
      });
    }).catch((error) => {
      console.error('Error uploading file:', error);
    });
  });
});
