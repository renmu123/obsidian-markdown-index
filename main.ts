import { Plugin, MarkdownView } from "obsidian";
import { MarkdownIndex } from "./MarkdownIndex";

export default class titleIndexPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "add-markdown-index",
      name: "add-markdown-index",
      checkCallback: (checking: boolean) => {
        const markdownView =
          this.app.workspace.getActiveViewOfType(MarkdownView);
        if (markdownView) {
          if (!checking) {
            const editor = markdownView.editor;
            const cursor = editor.getCursor();

            const lines = editor.getValue().split("\n");
            const markdownIndex = new MarkdownIndex();
            const newlines = markdownIndex.addMarkdownIndex(lines);
            editor.setValue(newlines.join("\n"));

            editor.setCursor(cursor);
          }
          return true;
        }
        return false;
      },
    });
  }
}
