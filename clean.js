const fs = require('fs');
const path = require('path');

function walk(dir, call) {
    let files = fs.readdirSync(dir);
    for (let x of files) {
        let p = path.join(dir, x);
        if (fs.statSync(p).isDirectory()) {
            if (!['node_modules', 'bin', 'obj', 'dist', '.angular', '.git'].includes(x)) {
                walk(p, call);
            }
        } else {
            if (p.endsWith('.ts') || p.endsWith('.cs') || p.endsWith('.sql')) {
                call(p);
            }
        }
    }
}

walk(__dirname, (filePath) => {
    let code = fs.readFileSync(filePath, 'utf8');

    // Replace giant equal sign comment blocks with single line
    const blockRegex = /\/\/\s*={20,}[\s\S]*?\/\/\s*={20,}/g;
    code = code.replace(blockRegex, '// Condensed comment block.');

    const sqlBlockRegex = /--\s*={20,}[\s\S]*?--\s*={20,}/g;
    code = code.replace(sqlBlockRegex, '-- Condensed SQL comment block.');

    // Remove multi-line consecutive comments (3 or more lines of //)
    // and just keep the first line.
    const groupedComments = /^([ \t]*\/\/.*(?:\r?\n)){3,}/gm;
    code = code.replace(groupedComments, (match) => {
        if (match.includes('Condensed')) return match;
        return match.split('\n')[0] + '\n';
    });

    const groupedSql = /^([ \t]*--.*(?:\r?\n)){3,}/gm;
    code = code.replace(groupedSql, (match) => {
        if (match.includes('Condensed')) return match;
        return match.split('\n')[0] + '\n';
    });

    // Remove block comments /* ... */
    const jsBlockComments = /\/\*[\s\S]*?\*\//g;
    code = code.replace(jsBlockComments, '// Comment block removed.');

    fs.writeFileSync(filePath, code);
});
console.log('Comments successfully condensed.');
