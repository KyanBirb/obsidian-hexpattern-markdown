import { App, PluginSettingTab, Setting } from "obsidian";
import HexPatternMarkdown from "./main";
import HexPattern from "./hex_pattern";
import SinglePatternSketch from "./single_pattern_sketch";

export interface HexPatternMarkdownSettings {
	patternColorStart: string;
    patternColorEnd: string;
    animatePattern: boolean;
    directionIndicator: boolean;
    patternSize: number;
}

export const DEFAULT_SETTINGS: Partial<HexPatternMarkdownSettings> = {
    patternColorStart: "#7f6df2",
    patternColorEnd: "#423975",
    animatePattern: true,
    directionIndicator: false,
    patternSize: 500
};

export class HexPatternMarkdownSettingsTab extends PluginSettingTab {

    plugin: HexPatternMarkdown;

    constructor(app: App, plugin: HexPatternMarkdown) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const containerElement = this.containerEl;

        containerElement.empty();

        new Setting(containerElement)
            .setName('Pattern start color')
            .addColorPicker(colorPicker => colorPicker
                .setValue(this.plugin.settings.patternColorStart)
                .onChange(async color => {
                    this.plugin.settings.patternColorStart = color;
                    await this.plugin.saveSettings();
                })
            );
        
        new Setting(containerElement)
            .setName('Pattern end color')
            .addColorPicker(colorPicker => colorPicker
                .setValue(this.plugin.settings.patternColorEnd)
                .onChange(async color => {
                    this.plugin.settings.patternColorEnd = color;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerElement)
            .setName('Animate patterns')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.animatePattern)
                .onChange(async color => {
                    this.plugin.settings.animatePattern = color;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerElement)
            .setName('Direction indicator')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.directionIndicator)
                .onChange(async color => {
                    this.plugin.settings.directionIndicator = color;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerElement)
            .setName('Pattern size')
            .addSlider(slider => slider
                .setLimits(10, 500, 10)
                .setValue(this.plugin.settings.patternSize)
                .setDynamicTooltip()
                .setInstant(true)
                .onChange(async size => {
                    this.plugin.settings.patternSize = size;
                    await this.plugin.saveSettings();
                })
            );
        
        const examplePattern = HexPattern.fromString('(EAST wwaqqqqqeawqwqwqwqwqwwqqeadaeqqeqqeadaeqq)');
        const sketch = new SinglePatternSketch(examplePattern, containerElement, this.plugin);
        
    }
}