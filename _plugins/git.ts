import { merge } from "lume/core/utils/object.ts";

export interface GitMetadata {
    shortSha: string;
}

export interface Options {
    fallbackShortSha: string;
}

export const DEFAULT_OPTIONS: Options = {
    fallbackShortSha: "HEAD"
};

export default function git(userOptions?: Partial<Options>): Lume.Plugin {
    const options = merge(DEFAULT_OPTIONS, userOptions);

    return (site: Lume.Site) => {
        site.addEventListener("beforeBuild", async () => {
            const cmd = new Deno.Command("git", {
                stdout: "piped",
                args: [
                    "rev-parse", "--short", "HEAD"
                ]
            });
            const process = cmd.spawn();
            let commit = new TextDecoder().decode((await process.output()).stdout);
            commit = commit.trim();
            const status = await process.status;
            if (!status.success) {
                commit = options.fallbackShortSha;
            }

            const gitMetadata: GitMetadata = {
                shortSha: commit
            };

            site.data("git", gitMetadata);
        });
    };
}
