import { existsSync } from "fs"
import { PnpNode } from "sp-pnp-node"
if (!existsSync("config/dev/migrations/private.json")) {
    console.log("configure with the host url")
    new PnpNode({
        config: {
            defaultConfigPath: "config/dev/",
            configPath: "config/dev/migrations/private.json",
        },
    })
        .initAmbient()
        .catch(console.log)
}
if (!existsSync("config/dev/proxy-server/private.json")) {
    console.log("configure with the app url")
    new PnpNode({
        config: {
            defaultConfigPath: "config/dev/",
            configPath: "config/dev/proxy-server/private.json",
        },
    })
        .initAmbient()
        .catch(console.log)
}
