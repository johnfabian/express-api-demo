import fs from 'node:fs';

const generated = './db/migrations/schema.ts';
const target = './db/schema.ts';

if (!fs.existsSync(generated)) {
    console.error(`Expected ${generated} after drizzle-kit pull. Did pull fail?`);
    process.exit(1);
}

fs.renameSync(generated, target);
fs.rmSync('./db/migrations', { recursive: true, force: true });
console.log(`schema.ts → ${target}; removed db/migrations/`);
