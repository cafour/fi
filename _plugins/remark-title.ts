import { merge } from "lume/core/utils/object.ts";
import { Root, Text } from "npm:mdast";
import { VFile } from "npm:vfile";
import { visit } from "npm:unist-util-visit";

export interface Options {
  /** Heading level to look for the title. Use 0 to take whichever heading comes first. */
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Key to save the title in the page data */
  key: string;

  /** Function to transform the title before saving it */
  transform?: (title: string | undefined, data: any) => string;
}

export const defaults: Options = {
  level: 1,
  key: "title",
};

export default function title(userOptions?: Readonly<Options> | null | undefined): ((tree: Root, file: VFile) => undefined) {
  const options = merge(defaults, userOptions ?? undefined);

  return (tree, file) => {
    visit(tree, node => {
      if (node.type === "heading"
        && (node.children.length == 1 && node.children[0].type == "text")
        && (options.level === 0 || node.depth == options.level)) {
          const text = node.children[0] as Text;
        file.data[options.key] = text.value;
        return false;
      }
    })
  };

  //   function getTitle(tokens: any[]): string | undefined {
  //     for (let i = 0; i < tokens.length; i++) {
  //       const token = tokens[i];

  //       if (token.type !== "heading_open") {
  //         continue;
  //       }

  //       // Calculate the level
  //       const level = parseInt(token.tag.substr(1), 10);

  //       if (options.level === 0 || level === options.level) {
  //         return getRawText(tokens[i + 1].children);
  //       }
  //     }
  //   }

  //   md.core.ruler.push("getTitle", function (state: any) {
  //     const data = state.env.data?.page?.data;

  //     if (!data || data[options.key]) {
  //       return;
  //     }

  //     const title = options.transform
  //       ? options.transform(getTitle(state.tokens), data)
  //       : getTitle(state.tokens);

  //     data[options.key] = title;
  //   });
}
