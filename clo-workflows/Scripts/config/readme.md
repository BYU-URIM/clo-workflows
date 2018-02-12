# config

use this readme for sp_config instructions
it is here to ensure that thw 'config' folder exists

```json
    <!-- delete all lists and fields -->
    "ts:deleteAll": "ts-node ./sp_config/tasks/Init && ts-node ./sp_config/tasks/DeleteAll",
    <!-- create all lists and fields -->
    "ts:createAll": "ts-node ./sp_config/tasks/Init && ts-node ./sp_config/tasks/CreateAll",
    <!-- delete all fields and then create all lists and fields -->
    "ts:deleteAllandCreateAll": "ts-node ./sp_config/tasks/Init && ts-node ./sp_config/tasks/DeleteAll && ts-node ./sp_config/tasks/CreateAll"
```