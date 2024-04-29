function injectScript(file_path) {
  const script = document.createElement('script');
  script.src = file_path;
  document.body.appendChild(script);
}

injectScript(chrome.runtime.getURL('content.js'));
