import { getMediaContent } from "@/lib/data/media"
import MediaCoverageClient from "./media-coverage-client"

export default async function MediaCoverageSection() {
  const { items, error } = await getMediaContent();

  if (error) {
    // Non-blocking error for the homepage, just won't render the section.
    console.error("Media Coverage Section Error:", error);
    return null;
  }

  if (!items || items.length === 0) {
    return null; // Don't render if there are no items
  }
  
  return <MediaCoverageClient items={items} />
}
