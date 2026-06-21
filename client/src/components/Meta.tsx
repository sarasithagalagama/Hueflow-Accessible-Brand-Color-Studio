import { useEffect } from "react";

export function Meta({ title, description, noIndex = false }: { title: string; description: string; noIndex?: boolean }) {
  useEffect(() => {
    document.title = `${title} — Hueflow`;
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.name = name;
        document.head.append(element);
      }
      element.content = content;
    };
    setMeta("description", description);
    setMeta("robots", noIndex ? "noindex,nofollow" : "index,follow");
    setMeta("twitter:card", "summary_large_image");
  }, [title, description, noIndex]);
  return null;
}
