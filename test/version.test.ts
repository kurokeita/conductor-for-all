import { execSync } from "node:child_process";
import { describe, it, expect } from "vitest";
import pkg from "../package.json";

describe("Version Display", () => {
  it("should display the correct version with --version flag", () => {
    const output = execSync("pnpm tsx bin/install.ts --version").toString().trim();
    expect(output).toBe(pkg.version);
  });

  it("should display the correct version with -v flag", () => {
    const output = execSync("pnpm tsx bin/install.ts -v").toString().trim();
    expect(output).toBe(pkg.version);
  });

  it("should display the version in help output", () => {
    const output = execSync("pnpm tsx bin/install.ts --help").toString();
    expect(output).toContain(pkg.version);
  });
});
