import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	const theme = cookies.get('theme') ?? 'modern';
	const mode = cookies.get('mode') ?? 'system';

	return {
		theme,
		mode
	};
};
