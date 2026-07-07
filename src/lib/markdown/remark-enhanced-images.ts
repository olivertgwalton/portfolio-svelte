import path from 'node:path';
import type { Html, Image, PhrasingContent, Root, RootContent } from 'mdast';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';

// mdsvex attaches `filename` at runtime; not part of the base VFile type.
type MdsvexFile = VFile & { filename?: string };

/** Remark plugin to transform local images to use enhanced:img */
export function remarkEnhancedImages() {
	return (tree: Root, file: MdsvexFile) => {
		const imports: string[] = [];
		let count = 0;

		const newTreeChildren: RootContent[] = [];
		for (const node of tree.children) {
			if (node.type !== 'paragraph') {
				newTreeChildren.push(node);
				continue;
			}

			const children = node.children;
			let currentParagraphChildren: PhrasingContent[] = [];
			let currentGroup: Image[] = [];

			const flushPara = () => {
				if (currentParagraphChildren.length > 0) {
					newTreeChildren.push({ type: 'paragraph', children: currentParagraphChildren });
					currentParagraphChildren = [];
				}
			};

			const flushGroup = () => {
				if (currentGroup.length === 0) return;

				flushPara(); // Flush any text preceding the images

				const tags = currentGroup.map((img) => {
					const { url, alt, title } = img;
					const importName = `enhanced_image_${count++}`;
					let importPath = url;
					if (url.startsWith('/assets/')) {
						importPath = url.replace('/assets/', '$lib/assets/');
					} else if (url.startsWith('./') && file.filename) {
						importPath = path.resolve(path.dirname(file.filename), url);
					}
					imports.push(`import ${importName} from '${importPath}?enhanced';`);
					const sizeAttr = title ? ` size="${title}"` : '';
					return `<MarkdownImage src={${importName}} alt="${alt || ''}"${sizeAttr} />`;
				});

				// If grouped (more than 1), use a grid.
				if (currentGroup.length > 1) {
					newTreeChildren.push({
						type: 'html',
						value: `<div class="grid grid-cols-2 gap-4 md:grid-cols-3 my-6 items-start">${tags.join('')}</div>`
					});
				} else {
					// Single image, just render it normally (full width)
					newTreeChildren.push({ type: 'html', value: tags[0] });
				}

				currentGroup = [];
			};

			for (let j = 0; j < children.length; j++) {
				const child = children[j];
				// Check for image node
				if (child.type === 'image') {
					currentGroup.push(child);
				} else if (
					child.type === 'text' &&
					!child.value.trim() &&
					((j > 0 && children[j - 1].type === 'image') ||
						(j < children.length - 1 && children[j + 1].type === 'image'))
				) {
					// Ignore whitespace/newlines between images so they group together
				} else {
					// Text or other content breaks the group
					if (currentGroup.length > 0) {
						flushGroup();
					}
					currentParagraphChildren.push(child);
				}
			}
			flushGroup(); // Flush any remaining group at end of paragraph
			flushPara(); // Flush any remaining text
		}
		tree.children = newTreeChildren;

		if (imports.length === 0) return;

		imports.unshift(`import MarkdownImage from '$lib/components/markdown/MarkdownImage.svelte';`);
		const importContent = imports.join('\n');
		const scriptNodeRef: { current: Html | null } = { current: null };

		visit(tree, 'html', (node) => {
			if (node.value.trim().startsWith('<script') && !node.value.includes('context="module"')) {
				scriptNodeRef.current = node;
				return false;
			}
		});

		if (scriptNodeRef.current) {
			const scriptNode = scriptNodeRef.current;
			scriptNode.value = scriptNode.value.replace(/^<script.*?>/, `$& \n${importContent}`);
		} else {
			tree.children.unshift({ type: 'html', value: `<script>\n${importContent}\n</script>` });
		}
	};
}
