import { existsSync } from "fs"
import { PnpNode } from "sp-pnp-node"
if (!existsSync("./sp_config/migrations/private.json")) {
    new PnpNode().initAmbient().catch(console.log)
}
