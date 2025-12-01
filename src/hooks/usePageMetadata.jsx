import { useEffect } from "react";

function usePageMetadata({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogUrl,
  ogType,
  ogImage,
}) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    if (description) {
      updateOrCreateMetaName("description", description);
    }
    if (canonicalUrl) {
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      if (canonicalTag) {
        canonicalTag.setAttribute("href", canonicalUrl);
      } else {
        createAndAppendLink("canonical", canonicalUrl);
      }
    }

    // OGP Settings
    const finalOgTitle = ogTitle || title;
    const finalOgDescription = ogDescription || description;
    const finalOgUrl = ogUrl || canonicalUrl;

    if (finalOgTitle) updateOrCreateMetaProperty("og:title", finalOgTitle);
    if (finalOgDescription)
      updateOrCreateMetaProperty("og:description", finalOgDescription);
    if (finalOgUrl) updateOrCreateMetaProperty("og:url", finalOgUrl);
    if (ogType) updateOrCreateMetaProperty("og:type", ogType);
    if (ogImage) updateOrCreateMetaProperty("og:image", ogImage);
  }, [
    title,
    description,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogUrl,
    ogType,
    ogImage,
  ]);
}

function updateOrCreateMetaName(name, content) {
  const element = document.querySelector(`meta[name="${name}"]`);
  if (element) {
    element.setAttribute("content", content);
  } else {
    const meta = document.createElement("meta");
    meta.setAttribute("name", name);
    meta.setAttribute("content", content);
    document.head.appendChild(meta);
  }
}

function updateOrCreateMetaProperty(property, content) {
  const element = document.querySelector(`meta[property="${property}"]`);
  if (element) {
    element.setAttribute("content", content);
  } else {
    const meta = document.createElement("meta");
    meta.setAttribute("property", property);
    meta.setAttribute("content", content);
    document.head.appendChild(meta);
  }
}

function createAndAppendLink(rel, href) {
  const link = document.createElement("link");
  link.setAttribute("rel", rel);
  link.setAttribute("href", href);
  document.head.appendChild(link);
}

export default usePageMetadata;
