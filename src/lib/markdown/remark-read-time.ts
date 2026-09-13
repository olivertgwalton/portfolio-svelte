import { toString as mdastToString } from "mdast-util-to-string";
import type { Root } from "mdast";
import type { VFile } from "vfile";

// mdsvex attaches `data.fm` (frontmatter) at runtime; not part of the base vfile-data types.
type MdsvexFile = VFile & {
	data: VFile["data"] & { fm?: Record<string, unknown> };
};

export function remarkReadTime() {
	return (tree: Root, file: MdsvexFile) => {
		const words = mdastToString(tree).split(/\s+/).filter(Boolean).length;
		file.data.fm = {
			...file.data.fm,
			readTime: `${Math.ceil(words / 200)} min read`,
		};
	};
}
