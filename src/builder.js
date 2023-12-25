import { spawn } from 'child_process';
import fs from 'fs';

export default async function buildProject(options) {
    const cmd = 'dune';
    const args = [
        'build',
        ...(options.buildArgs ?? []),
        options.watch ? '--watch' : null,
        `--display=${options.display ?? 'quiet'}`,
    ].filter((x) => x);

    const printOutput =
        (io, callback = null) =>
        (chunk) => {
            const output = chunk.toString().trimEnd();

            if (options.verbose) {
                process[io].write(output);
            }

            if (typeof callback === 'function') {
                callback(output);
            }
        };

    const child = spawn(cmd, args);
    const successToken = 'Success, waiting for filesystem changes';

    await new Promise((resolve, reject) => {
        child.on('error', (err) => {
            reject(new Error(err));
        });

        child.stderr?.on(
            'data',
            printOutput('stdout', (output) => {
                if (options.watch && output.includes(successToken)) {
                    resolve();
                }
            }),
        );

        child.on('close', (code) => {
            /**
             * Dune exit statuses:
             *      0: on success
             *      1: if an error happened
             *      130: if it was interrupted by a signal
             */
            if (code != 0) {
                reject(new Error(`Dune process killed. Please restart Vite manually`));
            } else {
                resolve();
            }
        });

        if (options.timeout > 0) {
            setTimeout(() => {
                resolve();
            }, options.timeout);
        }
    });

    return {
        stopWatcher: () => {
            if (!child.killed) {
                const pid = child.pid.toString();
                child.kill();
                const lockedPid = fs.readFileSync(options.lockFile, 'utf-8');
                                
                if (pid === lockedPid) {
                    fs.rmSync(options.lockFile);
                }
            }
        }
    };
}
