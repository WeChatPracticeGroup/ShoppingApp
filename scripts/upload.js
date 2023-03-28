const path = require("path");
const { Project, upload, packNpm } = require("miniprogram-ci");

const { version, description } = require("../package.json");
const { appid: appId } = require("../project.config.json");

(async () => {
    // 注意： new ci.Project 调用时，请确保项目代码已经是完整的，避免编译过程出现找不到文件的报错。
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
    // 构建npm
    const warning = await packNpm(project, {
        ignores: ["pack_npm_ignore_list"],
        reporter: (infos) => {
            console.log(infos);
        },
    });
    console.warn(warning);

    // 上传体验版
    const uploadResult = await upload({
        project,
        version,
        desc: description,
        setting: {
            es7: true,
            minify: true,
            codeProtect: true,
            minifyJS: true,
            minifyWXML: true,
            minifyWXSS: true,
            autoPrefixWXSS: true,
        },
        onProgressUpdate: console.log,
    });

    console.log(uploadResult);
})();
