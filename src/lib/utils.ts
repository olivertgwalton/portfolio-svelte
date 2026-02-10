export const dateFormatter = new Intl.DateTimeFormat('en-GB', {
	year: 'numeric',
	month: 'long',
	day: 'numeric'
});

export const getHSL = (str: string) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
	return `hsl(${hash % 360} 70% 50% / 0.15)`;
};
