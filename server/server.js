const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Amazon Ürün Arka Plan Prompt Şablonu
function buildAmazonPrompt(customPrompt) {
    const basePrompt = "Professional Amazon product photography, clean studio lighting, pure bright white background, realistic soft floor shadow, high resolution, 8k, photorealistic";
    return customPrompt ? `${customPrompt}, ${basePrompt}` : basePrompt;
}

app.post('/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        const finalPrompt = buildAmazonPrompt(prompt);
        console.log("İşlenen Prompt:", finalPrompt);

        // Limitsiz & Ücretsiz Pollinations API
        const encodedPrompt = encodeURIComponent(finalPrompt);
        const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}&model=flux`;

        console.log("Görsel üretildi:", imageUrl);

        res.json({
            success: true,
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});