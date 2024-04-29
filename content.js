"use strict";

function createModal(embedUrl) {
  const overlay = document.createElement("div");
  const modal = document.createElement("div");
  const iframe = document.createElement("iframe");

  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: "9998",
  });

  Object.assign(modal.style, {
    position: "fixed",
    top: "20px",
    left: "20px",
    right: "20px",
    bottom: "20px",
    backgroundColor: "#fff",
    zIndex: "9999",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    overflow: "hidden",
    transform: "translateY(0px)",
  });

  Object.assign(iframe.style, {
    width: "100%",
    height: "100%",
    border: "none",
  });

  iframe.src = embedUrl;

  modal.appendChild(iframe);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  iframe.focus();

  const removeModal = () => {
    document.body.removeChild(overlay);
    document.body.removeChild(modal);
  };

  overlay.addEventListener("click", removeModal);
}

function getServiceUrl(serviceName, urlPart) {
  switch (serviceName) {
    case "DocsWell":
      const match = urlPart.match(/docswell\.com\/slide\/([^\/]+)\/embed/);
      return match
        ? `https://www.docswell.com/slide/${match[1]}/embed?mode=extend`
        : null;
    case "SlideShare":
      return `https://www.slideshare.net/slideshow/embed_code/key/${
        urlPart.split("/").pop().split("?")[0]
      }`;
    case "SpeakerDeck":
      return `https://speakerdeck.com/player/${
        urlPart.split("/").pop().split("?")[0]
      }`;
    default:
      console.error(`Unsupported service: ${serviceName}`);
      return null;
  }
}

window.addEventListener(
  "load",
  () => {
    const currentUrl = window.location.href;
    const services = [
      {
        check: "slideshare.net",
        selector: "meta[name='twitter:player']",
        serviceName: "SlideShare",
      },
      {
        check: "speakerdeck.com",
        selector: "iframe.speakerdeck-iframe",
        serviceName: "SpeakerDeck",
      },
      {
        check: "docswell.com",
        selector: "div.docswell-iframe-wrapper > iframe",
        serviceName: "DocsWell",
      },
    ];

    services.forEach((service) => {
      if (currentUrl.includes(service.check)) {
        const element = document.querySelector(service.selector);
        if (element) {
          let urlPart =
            element.getAttribute("content") || element.getAttribute("src");
          const embedUrl = getServiceUrl(service.serviceName, urlPart);
          if (embedUrl) {
            createModal(embedUrl);
          } else {
            console.error(
              "Failed to generate embed URL for",
              service.serviceName
            );
          }
        }
      }
    });
  },
  false
);
