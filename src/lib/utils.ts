export function formatDate(date: string | Date | undefined) {
	if (!date) return '';
	const d = new Date(date);
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}
