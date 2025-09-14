#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Commands to run
const commands = [
    'npm install',
    'npx tsc',
];

// Execute each command
commands.forEach(command => {
    try {
        execSync(command, {
            stdio: 'inherit',
            cwd: path.join(__dirname)
        });
    } catch (error) {
        console.error(`Failed to execute command: ${command}`);
        process.exit(1);
    }
});
