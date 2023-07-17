import { parse } from "https://deno.land/std@0.184.0/flags/mod.ts";

type DenoLock = {
  remote: Record<string, string>;
  npm: {
    specifiers: Record<string, string>;
    packages: Record<string, unknown>;
  };
};

const flags = parse(Deno.args, {
  boolean: ["reload"],
});

const buffer = await Deno.readFile("deno.lock");
const denoJson: DenoLock = JSON.parse(new TextDecoder().decode(buffer));

let code = "";

for (const module of Object.keys(denoJson.remote)) {
  code += `import "${module}";\n`;
}

for await (const key of Object.keys(denoJson.npm.packages)) {
  code += `import "npm:${key}";\n`;
}

const tmp = await Deno.makeTempFile({
  prefix: "deno_module_",
  suffix: ".ts",
});

await Deno.writeTextFile(tmp, code);

const command = new Deno.Command("deno", {
  args: ["cache", tmp].concat(flags.reload ? ["--reload"] : []),
  stdin: "piped",
  stdout: "piped",
});

const child = command.spawn();

// open a file and pipe the subprocess output to it.
child.stdout.pipeTo(Deno.stdout.writable);

// manually close stdin
child.stdin.close();

await child.status;

await Deno.remove(tmp);
