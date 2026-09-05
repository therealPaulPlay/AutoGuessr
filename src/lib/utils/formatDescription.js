const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

// Dealer text ends up in an {@html} block, so it has to be escaped before it is inserted
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);

// Values the API uses in place of a real description
const PLACEHOLDERS = new Set(["", "n/a", "na", "none", "null", "undefined", "-", "--", "."]);

// Descriptions have no fixed shape, so only the API's paragraph breaks are parsed out
export function formatSellerDescription(text) {
	if (typeof text !== "string" || PLACEHOLDERS.has(text.trim().toLowerCase())) {
		return '<p style="margin: 0.75em 0;">No description was provided for this listing.</p>';
	}

	return text
		.replace(/\r\n?/g, "\n")
		.replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, "")
		.replace(/<br\s*\/?>|<\/(p|div|h[1-6]|li|ul|ol)\s*>/gi, "\n")
		.replace(/<\/?[a-zA-Z][^>]*>/g, "")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.split(/\n+|[ \t]{2,}/)
		.map((paragraph) => paragraph.trim().replace(/\s+/g, " "))
		.filter(Boolean)
		.map((paragraph) => `<p style="margin: 0.75em 0;">${escapeHtml(paragraph)}</p>`)
		.join("");
}