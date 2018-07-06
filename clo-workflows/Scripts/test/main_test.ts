function adder(a: number, b: number) {
    return a + b
}

test("main test that tests the main function", () => expect(adder(2, 3)).not.toBe(6))

