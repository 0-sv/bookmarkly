function sortBookmarksRecursively(bookmarkTreeNode) {
    // Skip if node is undefined or null
    if (!bookmarkTreeNode) return;

    // If node has children (is a folder), sort them
    if (bookmarkTreeNode.children) {
        // Sort current level
        bookmarkTreeNode.children.sort((a, b) => {
            // Folders come before bookmarks
            if (a.children && !b.children) return -1;
            if (!a.children && b.children) return 1;

            // Sort alphabetically by title
            return a.title.localeCompare(b.title);
        });

        // Recursively sort each child that is a folder
        bookmarkTreeNode.children.forEach(child => {
            sortBookmarksRecursively(child);
        });
    }
}

function updateFolderChildren(folder) {
    folder.children.forEach(node => {
        chrome.bookmarks.move(node.id, {
            parentId: folder.id,
            index: folder.children.indexOf(node)
        });

        // Recursively update if this is also a folder
        if (node.children) {
            updateFolderChildren(node);
        }
    });
}

// Main function to sort all bookmarks
function sortAllBookmarks() {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        const rootNode = bookmarkTreeNodes[0];

        // Sort all three main folders
        const mainFolders = [
            { name: 'Bookmarks Bar', index: 0 },
            { name: 'Other Bookmarks', index: 1 },
            { name: 'Mobile Bookmarks', index: 2 }
        ];

        mainFolders.forEach(folder => {
            const bookmarkFolder = rootNode.children[folder.index];
            if (bookmarkFolder) {
                console.log(`Sorting ${folder.name}...`);
                sortBookmarksRecursively(bookmarkFolder);

                // Update the bookmarks in this folder
                bookmarkFolder.children.forEach(node => {
                    chrome.bookmarks.move(node.id, {
                        parentId: bookmarkFolder.id,
                        index: bookmarkFolder.children.indexOf(node)
                    });

                    // If this is a folder, update its children recursively
                    if (node.children) {
                        updateFolderChildren(node);
                    }
                });
            }
        });

        console.log('Bookmark sorting complete!');
    });
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