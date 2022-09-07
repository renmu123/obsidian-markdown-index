/**
 * The main class to add markdown index.
 */
interface LINE {
  line: number;
  value: string;
  content: string;
  level: number;
  mark?: number[];
  id: number;
  pid: number;
  deep?: number;
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

    for (const [line, lineContent] of content.entries()) {
      isInCode = this.isInCodeArea(lineContent, isInCode);
      if (isInCode) {
        continue;
      }
      if (lineContent.startsWith("#")) {
        const currentHeading = lineContent.match(this.REGEX_HEADING);
        const level = this.count(currentHeading[1], "#");

        data.push({
          line: line,
          value: lineContent,
          content: currentHeading[2],
          level: level,
          mark: [],
          id: line,
          pid: null,
        });
      }
    }
    let list = data.map((item, index) => {
      if (item.level === 1) {
        item.pid = null;
      } else {
        item.pid = this.findLastParIndex(item, data.slice(0, index));
      }
      return item;
    });

    // skipHeader1=1
    const skipHeader1 = true;
    if (skipHeader1) {
      list = list.filter(el => el.level !== 1);
    }

    list.forEach(el => {
      const deep = this.getDeep(list, el.id);
      el.deep = deep;
    });

    const map = this.arrayToObject(list, "id");

    list.forEach((el, index) => {
      // 父级标签
      const lastParNode = map[el.pid];
      const lastParNodeId = lastParNode ? lastParNode.id : 0;

      let i = el.deep - 1;
      // 同级标签id
      const sameLevelId = this.findSameLevelId(
        el,
        list.slice(
          list.findIndex(el => el.id === lastParNodeId),
          index
        )
      );

      if (lastParNode) {
        // 如果有父级标签，那么子标签的值等于父级标签
        el.mark = [...lastParNode.mark];
      }

      if (sameLevelId === -1) {
        el.mark[i] = 1;
      } else {
        el.mark[i] = map[sameLevelId].mark[i] + 1;
      }
      // console.log(
      //   "lastParNode",
      //   JSON.stringify(lastParNode),
      //   sameLevelId,
      //   JSON.stringify(el)
      // );
    });

    return list;
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

  getDeep(list: any[], id: number) {
    const map = this.arrayToObject(list, "id");
    let deep = 1;
    // @ts-ignore
    while (id) {
      // @ts-ignore
      id = map[map[id].pid]?.id;
      if (id) {
        deep += 1;
      } else {
        break;
      }
    }
    return deep;
  }
  // 找到距离最近的上一级标签
  findLastParIndex(item: LINE, data: LINE[]) {
    let value = -1;
    data.forEach(element => {
      if (element.level < item.level) {
        value = element.id;
        return;
      }
    });
    return value;
  }
  // 找到距离最近的同级标签
  findSameLevelId(item: LINE, data: LINE[]) {
    let value = -1;
    data.forEach(element => {
      if (element.level === item.level) {
        value = element.id;
        return;
      }
    });
    return value;
  }

  arrayToObject(
    arr: any[],
    key: string
  ): {
    [key: string]: any;
  } {
    let obj = {};
    arr.forEach(element => {
      // @ts-ignore
      obj[element[key]] = element;
    });
    return obj;
  }

  addIndex(content: string[], start: number = 1) {
    const data = this.getTitleData(content);
    console.log(data, content);
    data.forEach(el => {
      content[el.line] = `${Array(el.level).fill("#").join("")} ${el.mark.join(
        "."
      )} ${el.content}`;
    });
    return content;
  }

  public addMarkdownIndex(content: string[]) {
    this.addIndex(content, 0);
    return content;
  }
}

export default MarkdownIndex;
