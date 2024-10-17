fileInput.addEventListener('change', (event) => {
    preview.innerHTML = '';  // Clear previous previews
    const files = event.target.files;

    Array.from(files).forEach(file => {
        const reader = new FileReader();

        reader.onload = function(e) {
            let element;
            if (file.type.startsWith('image/')) {
                element = document.createElement('img');
                element.src = e.target.result;
            } else if (file.type.startsWith('video/')) {
                element = document.createElement('video');
                element.src = e.target.result;
                element.controls = true;
            }

            const link = document.createElement('a');
            link.href = e.target.result;
            link.download = file.name;
            link.textContent = `Download ${file.name}`;

            preview.appendChild(element);
            preview.appendChild(link);
        };

        reader.readAsDataURL(file);
    });
});
