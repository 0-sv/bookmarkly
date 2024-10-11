// When the page in the popup is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const sortBtn = document.getElementById('sortBtn');
    const statusDiv = document.getElementById('status');

    // Add functionality to sort button
    sortBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'sortBookmarks' }, (response) => {
            if (response.success) {
                statusDiv.innerText = "Bookmarks sorted!";
            } else {
                statusDiv.innerText = "Failed to sort bookmarks.";
            }
        });
    });
});