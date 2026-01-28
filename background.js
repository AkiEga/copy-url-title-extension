// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "copy-url-title",
        title: "Copy Page Title & URL",
        contexts: ["page"]
    });
});

// Function to be injected and executed in the page
function copyToClipboard(format) {
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

    const metadata = getMetadata();
    let text = format;

    text = text.replace(/\$\{Title\}/g, document.title || '');
    text = text.replace(/\$\{URL\}/g, window.location.href || '');
    text = text.replace(/\$\{OG:Title\}/g, metadata.ogTitle || '');
    text = text.replace(/\$\{OG:Description\}/g, metadata.ogDescription || '');
    text = text.replace(/\$\{Meta:Description\}/g, metadata.metaDescription || '');

    navigator.clipboard.writeText(text).then(() => {
        // Show a temporary toast notification on the page
        const div = document.createElement('div');
        div.textContent = 'Copied!';
        div.style.position = 'fixed';
        div.style.top = '20px';
        div.style.right = '20px';
        div.style.padding = '10px 20px';
        div.style.backgroundColor = '#0b8043';
        div.style.color = '#fff';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        div.style.zIndex = '999999';
        div.style.fontFamily = 'sans-serif';
        div.style.fontSize = '14px';
        div.style.opacity = '0';
        div.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(div);

        // Animate in
        setTimeout(() => div.style.opacity = '1', 10);

        // Remove after 2 seconds
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 300);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard.');
    });
}

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "copy-url-title" && tab.id) {
        try {
            const data = await chrome.storage.sync.get('format');
            const format = data.format || '${Title}\n${URL}';

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: copyToClipboard,
                args: [format]
            });
        } catch (err) {
            console.error('Script injection failed', err);
        }
    }
});
