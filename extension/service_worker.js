chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: `chrome-extension://${chrome.runtime.id}/options_ui/page.html`}, function (tab) {
        console.log("options page opened");
    });
});