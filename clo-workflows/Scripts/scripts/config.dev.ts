// tslint:disable-next-line:no-var-requires
const fs = require("fs")
// tslint:disable-next-line:no-var-requires
const PnpNode = require("sp-pnp-node")
if (!fs.existsSync("config/dev/migrations/private.json")) {
    console.log("configure with the host url")
    new PnpNode.PnpNode({
        config: {
            defaultConfigPath: "config/dev/",
            configPath: "config/dev/migrations/private.json",
        },
    })
        .initAmbient()
        .catch(console.log)
}
if (!fs.existsSync("config/dev/proxy-server/private.json")) {
    console.log("configure with the app url")
    new PnpNode.PnpNode({
        config: {
            defaultConfigPath: "config/dev/",
            configPath: "config/dev/proxy-server/private.json",
        },
    })
        .initAmbient()
        .catch(console.log)
}
