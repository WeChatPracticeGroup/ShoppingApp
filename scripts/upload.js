const path = require("path");
const { Project, upload, packNpm } = require("miniprogram-ci");

const { version } = require("../package.json");
const { appid: appId } = require("../project.config.json");

(async () => {
    // Configure a new Project
    const project = new Project({
        appid: appId,
        type: "miniProgram",
        projectPath: path.join(__dirname, "../"),
        privateKeyPath: "scripts/private.key",
        ignores: [
            ".github",
            "scripts",
            "README.md",
            "yarn.lock",
            "node_modules/**/*",
            "cloudFunctions/*"
        ],
    });
    
    // npm build
    const warning = await packNpm(project, {
        ignores: ["pack_npm_ignore_list"],
        reporter: (infos) => {
            console.log("reporter =>");
            console.log(infos);
        },
    });
    console.warn(warning);
    
    // upload and release Dev version
    const uploadResult = await upload({
        project,
        version,
        desc: `上传时间: ${Date.now()}`,
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
