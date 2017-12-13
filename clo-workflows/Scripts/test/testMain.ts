import * as ava from "ava"

ava.test("test test", t => t.pass())
ava.test(".", t => t.deepEqual(1, 1))
ava.test(".", t => t.notDeepEqual(0, 1))
