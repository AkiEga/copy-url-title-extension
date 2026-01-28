function getMetadata() {
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
    const ogDescription = document.querySelector('meta[property="og:description"]')?.content || '';
    const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
    return {
        ogTitle,
        ogDescription,
        metaDescription
    };
}

// Function to escape regex special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

document.addEventListener('DOMContentLoaded', async () => {
    const statusDiv = document.getElementById('status');

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
            statusDiv.textContent = 'No active tab';
            statusDiv.classList.add('error');
            return;
        }

        // Get custom format or use default
        const data = await chrome.storage.sync.get('format');
        const format = data.format || '${Title}\n${URL}';

        // Execute script to get metadata
        let metadata = { ogTitle: '', ogDescription: '', metaDescription: '' };
        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: getMetadata,
            });
            if (results && results[0] && results[0].result) {
                metadata = results[0].result;
            }
        } catch (e) {
            console.warn('Could not extract metadata via scripting, using fallbacks.', e);
            // Fallback or ignore if cannot execute script (e.g. chrome:// pages)
        }

        let textToCheck = format;

        // Replace placeholders
        // We use replaceAll so all instances are replaced
        textToCheck = textToCheck.replace(/\$\{Title\}/g, tab.title || '');
        textToCheck = textToCheck.replace(/\$\{URL\}/g, tab.url || '');
        textToCheck = textToCheck.replace(/\$\{OG:Title\}/g, metadata.ogTitle || '');
        textToCheck = textToCheck.replace(/\$\{OG:Description\}/g, metadata.ogDescription || '');
        textToCheck = textToCheck.replace(/\$\{Meta:Description\}/g, metadata.metaDescription || '');

        // Copy to clipboard
        await navigator.clipboard.writeText(textToCheck);

        statusDiv.textContent = 'Copied!';
        statusDiv.classList.add('success');

        setTimeout(() => {
            window.close();
        }, 1500);

    } catch (err) {
        console.error(err);
        statusDiv.textContent = 'Error!';
        statusDiv.classList.add('error');
    }
});
