import { useEffect } from "react";

function usePageMetadata({ title, description }) {
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
  }, [title, description]);
}

function createAndAppendMeta(name, content) {
  const meta = document.createElement("meta");
  meta.setAttribute("name", name);
  meta.setAttribute("content", content);
  document.head.appendChild(meta);
}

export default usePageMetadata;
