const path = require("path");
const { Project, packNpm } = require("miniprogram-ci");

const { version, description } = require("../package.json");
const { appid: appId } = require("../project.config.json");

(async () => {
    const project = new Project({
        appid: appId,
        type: "miniProgram",
        projectPath: path.join(__dirname, "../"),
        privateKeyPath: "./private.key",
        ignores: [
            ".github",
            "scripts",
            "README.md",
            "yarn.lock",
            "node_modules/**/*",
        ],
    });
    // 在有需要的时候构建npm
    const warning = await packNpm(project, {
        ignores: ["pack_npm_ignore_list"],
        reporter: (infos) => {
            console.log(infos);
        },
    });
    console.warn(warning);
    // 可对warning进行格式化
    /*
    warning.map((it, index) => {
            return `${index + 1}. ${it.msg}
    \t> code: ${it.code}
    \t@ ${it.jsPath}:${it.startLine}-${it.endLine}`
          }).join('---------------\n')
  */
    // 完成构建npm之后，可用ci.preview或者ci.upload
})();
