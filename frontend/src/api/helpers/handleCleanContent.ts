export const handleCleanContent = (string: string) =>
  string?.trim().replace(/\n/g, "<br/>");
// Clean up body content of the page. Supports HTML only.
