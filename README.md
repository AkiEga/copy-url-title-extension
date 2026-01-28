# Copy URL & Title Chrome Extension

A simple yet powerful Chrome Extension that allows you to copy the current page's Title and URL to your clipboard in a customizable format.

## Features

- 📋 **One-click Copy**: Click the toolbar icon to instantly copy metadata.
- 🖱️ **Context Menu Support**: Right-click anywhere on a page to copy without reaching for the toolbar.
- 🛠️ **Customizable Formats**: Define your own output format (e.g., Markdown, plain text).
- 🧩 **Rich Metadata**: Support for extracting Open Graph (OGP) tags like `og:title` and `og:description`.

## Installation

Since this extension is not yet in the Chrome Web Store, you need to load it manually:

1.  Clone or download this repository.
2.  Open Chrome and navigate to `chrome://extensions`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the folder containing this extension (`copy-url-title-extension`).

## Usage

### Toolbar Popup
Click the 'C' icon in your browser toolbar. A "Copied!" message will confirm the action.

### Right-Click Menu
Right-click on any page and select **Copy Page Title & URL**.

## Configuration

You can customize the text format used for copying.

1.  Right-click the extension icon and select **Options**.
2.  Enter your desired format string.
3.  Click **Save**.

### Available Placeholders

- `${Title}` - Page Title
- `${URL}` - Page URL
- `${OG:Title}` - Open Graph Title
- `${OG:Description}` - Open Graph Description
- `${Meta:Description}` - Meta Description

### Examples

**Markdown (Default)**
```
[${Title}](${URL})
```

**With Description**
```
${Title}
${URL}
> ${OG:Description}
```
