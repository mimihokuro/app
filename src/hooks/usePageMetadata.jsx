import { useEffect } from "react";

function usePageMetadata({ title, description, canonicalUrl }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      const descriptionTag = document.querySelector('meta[name="description"]');
      if (descriptionTag) {
        descriptionTag.setAttribute("content", description);
      } else {
        createAndAppendMeta("description", description);
      }
    }
    if (canonicalUrl) {
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      if (canonicalTag) {
        canonicalTag.setAttribute("href", canonicalUrl);
      } else {
        createAndAppendLink("canonical", canonicalUrl);
      }
    }
  }, [title, description, canonicalUrl]);
}

function createAndAppendMeta(name, content) {
  const meta = document.createElement("meta");
  meta.setAttribute("name", name);
  meta.setAttribute("content", content);
  document.head.appendChild(meta);
}

function createAndAppendLink(rel, href) {
  const link = document.createElement("link");
  link.setAttribute("rel", rel);
  link.setAttribute("href", href);
  document.head.appendChild(link);
}

export default usePageMetadata;
