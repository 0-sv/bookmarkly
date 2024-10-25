// When the popup loads
document.addEventListener('DOMContentLoaded', function () {
    const sortBtn = document.getElementById('sortBtn');
    const statusDiv = document.getElementById('status');
    const recentBookmarksList = document.getElementById('recentBookmarks');

    // Handle sorting button click
    sortBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'sortBookmarks' }, (response) => {
            if (response.success) {
                statusDiv.innerText = "Bookmarks sorted!";
            } else {
                statusDiv.innerText = "Failed to sort bookmarks.";
            }
        });
    });

    // Fetch and display recent bookmarks
    displayRecentBookmarks();
});

function displayRecentBookmarks() {
    // Define how many recent bookmarks you want to show
    const maxRecentBookmarks = 20;

    chrome.bookmarks.getRecent(maxRecentBookmarks, function (recentBookmarks) {
        const recentBookmarksList = document.getElementById('recentBookmarks');
        recentBookmarksList.innerHTML = ''; // Clear the current list if any

        recentBookmarks.forEach(bookmark => {
            const li = document.createElement('li');
            const a = document.createElement('a');

            a.href = bookmark.url;
            a.textContent = bookmark.title || 'Untitled';
            a.target = '_blank';  // Open the link in a new tab

            li.appendChild(a);
            recentBookmarksList.appendChild(li);
        });
    });
}