import { App, Plugin, PluginSettingTab, Setting, MarkdownView } from "obsidian";
import { MarkdownIndex } from "./MarkdownIndex";
interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "add-markdown-index",
      name: "add-markdown-index",
      callback: () => {
        this.addMarkdownIndex();
      },
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
  addMarkdownIndex() {
    const editor = this.getEditor();
    const lines = editor.getValue().split("\n");
    const markdownIndex = new MarkdownIndex();
    const newlines = markdownIndex.addMarkdownIndex(lines);
    editor.setValue(newlines.join("\n"));
  }

  getEditor() {
    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
    return mdView.editor;
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText(text =>
        text
          .setPlaceholder("Enter your secret")
          .setValue("")
          .onChange(async value => {
            console.log("Secret: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
