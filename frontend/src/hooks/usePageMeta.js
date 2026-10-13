import { useEffect } from "react";

const SITE_NAME = "Paige's Corner";
const DEFAULT_DESCRIPTION =
  "Paige's Corner is Paige Swain's sunflower-themed family home on the web — fresh recipes, a weekly sunshine journal, gentle wellness exercises, and family warmth.";

/**
 * Sets a page-specific document title and meta description for SEO/sharing.
 * Restores nothing on unmount — the next page sets its own values.
 */
export function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    if (title) {
      document.title = `${title} • ${SITE_NAME}`;
    }
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}

export { DEFAULT_DESCRIPTION };
