import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import SinglePatternSketch from './single_pattern_sketch';
import HexPattern from './hex_pattern';

export default class HexPatternMarkdown extends Plugin {

	async onload() {
		this.registerMarkdownCodeBlockProcessor('hexpattern', hexPatternPostProcessor);
	}

	async onunload() {
	}

}

function hexPatternPostProcessor(source: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
	const rows = source.split('\n').filter((row) => row.length > 0);
	const pattern = HexPattern.fromString(rows[0], true);

	const _sketch = new SinglePatternSketch(pattern, element);
}