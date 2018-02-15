import * as fs from "fs"
import { IPnpNodeSettings, PnpNode } from "sp-pnp-node"

if (!fs.existsSync("./sp_config/migrations/private.json")) {
    new PnpNode().initAmbient().catch(console.log)
}
