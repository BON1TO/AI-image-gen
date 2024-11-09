let generateImageForm = document.getElementById('generate-image-form');
let formInput = document.getElementById('input-value');
let imageContainerText = document.getElementById('imageContainerText');
let imageGenerated = document.getElementById('generated-image');
let imageContainer = document.getElementById('images-visible');

// API key
const apiKey = 'sk-V6EzNTFyWUbt83OfmpfPt22jqsx91HrdjUaPBfZdSu0zPwtU'; // Your API key

async function fetchImages(category) {
    try {
        let response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-v1-4/text-to-image", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": category,
                "cfg_scale": 7,
                "samples": 1,
                "width": 512,
                "height": 512
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        if (data.artifacts && data.artifacts.length > 0) {
            const imageUrl = data.artifacts[0].url;
            imageContainerText.innerText = "Below is your generated Image:";
            imageContainer.style.display = "block";
            imageGenerated.src = imageUrl;
        } else {
            throw new Error('No image URL returned from API.');
        }
    } catch (error) {
        console.error("Error during image generation:", error);
        imageContainerText.innerText = `Error: ${error.message}`;
    }
}

generateImageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let enteredText = formInput.value.trim();
    if (enteredText !== "") {
        fetchImages(enteredText);
    } else {
        imageContainerText.innerText = "Input field cannot be empty!";
    }
});
