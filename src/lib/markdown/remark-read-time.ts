import { toString } from 'mdast-util-to-string';
import type { Root } from 'mdast';
import getReadingTime from 'reading-time';
import type { VFile } from 'vfile';

// mdsvex attaches `data.fm` (frontmatter) at runtime; not part of the base vfile-data types.
type MdsvexFile = VFile & { data: VFile['data'] & { fm?: Record<string, unknown> } };

export function remarkReadTime() {
	return (tree: Root, file: MdsvexFile) => {
		const readingTime = getReadingTime(toString(tree));
		file.data.fm = {
			...file.data.fm,
			readTime: `${Math.ceil(readingTime.minutes)} min read`
		};
	};
}
