// import { existsSync } from "fs"
// import { PnpNode } from "sp-pnp-node"
// if (!existsSync("config/prod/migrations/private.json")) {
//     console.log("configure with the host url")
//     new PnpNode({
//         config: {
//             defaultConfigPath: "config/prod/",
//             configPath: "config/prod/migrations/private.json",
//         },
//     })
//         .initAmbient()
//         .catch(console.log)
// }
// if (!existsSync("config/prod/proxy-server/private.json")) {
//     console.log("configure with the app url")
//     new PnpNode({
//         config: {
//             defaultConfigPath: "config/prod/",
//             configPath: "config/prod/proxy-server/private.json",
//         },
//     })
//         .initAmbient()
//         .catch(console.log)
// }
