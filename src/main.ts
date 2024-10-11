import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import SinglePatternSketch from './single_pattern_sketch';
import HexPattern from './hex_pattern';
import { DEFAULT_SETTINGS, HexPatternMarkdownSettings, HexPatternMarkdownSettingsTab } from './settings';

export default class HexPatternMarkdown extends Plugin {

	settings: HexPatternMarkdownSettings;
	
	async onload() {
		await this.loadSettings();
		
		this.registerMarkdownCodeBlockProcessor('hexpattern', (source: string, element: HTMLElement, context: MarkdownPostProcessorContext) => {
			const rows = source.split('\n').filter((row) => row.length > 0);

			try {
				const pattern = HexPattern.fromString(rows[0]);
				const _sketch = new SinglePatternSketch(pattern, element, this);
			} catch {
				// Ignored
			}
		
		});

		this.addSettingTab(new HexPatternMarkdownSettingsTab(this.app, this));
	}

	async onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}