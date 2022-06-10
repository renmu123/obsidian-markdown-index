/**
 * The main class to add markdown index.
 */
interface LINE {
  line: number;
  value: string;
  content: string;
  level: number;
  mark: number;
  index: number;
}

export class MarkdownIndex {
  // index base configuration for user, default value is "#"
  REGEX_HEADING = /^(#+) (.*)/;
  levelType = {
    1: { type: "number", start: 1 },
    2: { type: "number", start: 1 },
    3: { type: "number", start: 1 },
    4: { type: "number", start: 1 },
    5: { type: "number", start: 1 },
    6: { type: "number", start: 1 },
  };
  DEPMARK = ".";

  constructor() {}

  addPrefix(line: string, prefix: string, markCount: number) {}

  replacePrefix() {}

  getTitleData(content: string[]): LINE[] {
    let data: LINE[] = [];
    let isInCode = false;
    let index = 0;

    for (const [line, lineContent] of content.entries()) {
      isInCode = this.isInCodeArea(lineContent, isInCode);
      if (isInCode) {
        continue;
      }
      if (lineContent.startsWith("#")) {
        const currentHeading = lineContent.match(this.REGEX_HEADING);
        const level = this.count(currentHeading[1], "#");

        data.push({
          line: line + 1,
          value: lineContent,
          content: currentHeading[2],
          level: level,
          mark: 0,
          index: index,
        });
        index += 1;
      }
    }
    return data;
  }

  // if in areacode
  isInCodeArea(lineContent: string, isInCodeArea: boolean) {
    if (lineContent.startsWith("```")) {
      isInCodeArea = !isInCodeArea;
    }
    return isInCodeArea;
  }
  count(str: string, search: string) {
    let count = 0;
    let pos = str.indexOf(search);

    while (pos !== -1) {
      count++;
      pos = str.indexOf(search, pos + 1);
    }
    return count;
  }
  // 找到距离最近的上一级标签
  findLastParIndex(data: LINE[], index: number) {
    const level = data[index].level;
    const sliceData = data.slice(0, index);

    for (let line of [...sliceData].reverse()) {
      if (line.level < level) {
        return [line.level, line.index];
      }
    }
    return [-1, -1];
  }
  findLastRelIndex(data: LINE[], lastIndex: number, index: number) {
    const level = data[index].level;

    const sliceData = data.slice(lastIndex + 1, index);
    for (let line of [...sliceData].reverse()) {
      if (line.level === level) {
        return line.mark + 1;
      }
    }
    return 1;
  }

  addIndex(content: string[], start: number = 1) {
    const data = this.getTitleData(content);
    console.log(data);
    for (let [i, line] of data.entries()) {
      const index = this.findLastParIndex(data, line.index);
      const mark = this.findLastRelIndex(data, index[1], i);
      data[i].mark = mark;
    }

    for (let [i, line] of data.entries()) {
      const index = this.findLastParIndex(data, line.index);
      const mark = this.findLastRelIndex(data, index[1], i);
      data[i].mark = mark;
    }

    for (let [i, line] of data.entries()) {
    }

    // for (let line of data) {
    //   const index = line.line - 1;
    //   content[index] = `${"#".repeat(line.level)} ${line.mark} ${line.content}`;
    // }
    console.log(data);
  }

  getMark(level: number, mask: number) {
    if (level === 1) {
      return `${mask}.`;
    } else if (level === 2) {
      return `.${mask}`;
    }
  }

  public addMarkdownIndex(content: string[]) {
    this.addIndex(content, 0);
    return content;
  }
}

export default MarkdownIndex;
