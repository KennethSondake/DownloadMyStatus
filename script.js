const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

fileInput.addEventListener('change', (event) => {
    preview.innerHTML = ''; // Clear previous content
    const files = event.target.files;

    Array.from(files).forEach(file => {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Create a preview element (image or video)
            let element;
            if (file.type.startsWith('image/')) {
                element = document.createElement('img');
                element.src = e.target.result;
            } else if (file.type.startsWith('video/')) {
                element = document.createElement('video');
                element.src = e.target.result;
                element.controls = true;
            }

            // Create a download link
            const link = document.createElement('a');
            link.href = e.target.result;
            link.download = file.name;
            link.textContent = `Download ${file.name}`;

            // Create a shareable link (copyable input)
            const shareInput = document.createElement('input');
            shareInput.type = 'text';
            shareInput.value = e.target.result;
            shareInput.readOnly = true;
            shareInput.style.width = '100%';
            shareInput.style.marginTop = '5px';

            // Copy button for the link
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy Link';
            copyButton.addEventListener('click', () => {
                shareInput.select();
                document.execCommand('copy');
                alert('Link copied to clipboard!');
            });

            // Append everything to the preview section
            preview.appendChild(element);
            preview.appendChild(link);
            preview.appendChild(shareInput);
            preview.appendChild(copyButton);
        };

        reader.readAsDataURL(file); // Read the file as a data URL
    });
});
