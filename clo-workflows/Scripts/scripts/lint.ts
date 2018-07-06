import * as shell from "shelljs"
import { resolve } from "path"
const base = resolve(".")
shell.exec(`npx prettier --write --config ${base}/.prettierrc ${base}/**/*.ts*`)
shell.exec(`npx tslint --fix -c '${base}/tslint.json' '${base}/**/*.ts*' --exclude '**/node_modules/**'`)
