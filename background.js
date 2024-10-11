// Function to recursively sort bookmarks inside folders
function sortBookmarksRecursively(bookmarkTreeNodes) {
    if (!bookmarkTreeNodes || bookmarkTreeNodes.length === 0) return;

    bookmarkTreeNodes.forEach(node => {
        if (node.children && node.children.length > 0) {
            // Sort by title
            node.children.sort((a, b) => a.title.localeCompare(b.title));

            // Recurse to sort child bookmarks/folders
            sortBookmarksRecursively(node.children);
        }
    });
}

// Function to initiate sorting of all bookmarks
function sortAllBookmarks() {
    chrome.bookmarks.getTree(function (bookmarkTree) {
        sortBookmarksRecursively(bookmarkTree);
        updateBookmarksTree(bookmarkTree[0].children); // Pass bookmarks directly under Bookmark Bar, etc.
    });
}

// Function to update the entire bookmark tree after sorting
function updateBookmarksTree(bookmarks) {
    bookmarks.forEach(node => recursivelyUpdateBookmarks(node));
}

// Helper function to update each bookmark recursively
function recursivelyUpdateBookmarks(node) {
    chrome.bookmarks.move(node.id, { parentId: node.parentId, index: node.index });

    if (node.children && node.children.length > 0) {
        node.children.forEach((childNode, index) => {
            chrome.bookmarks.move(childNode.id, { parentId: node.id, index });
            recursivelyUpdateBookmarks(childNode);
        });
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sortBookmarks') {
        try {
            sortAllBookmarks();
            sendResponse({ success: true });
        } catch (error) {
            console.error('Error sorting bookmarks:', error);
            sendResponse({ success: false });
        }
    }
});