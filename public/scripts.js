let isBold = false;
let isItalic = false;
let selectedLanguage = 'auto';
let previewCount = 0;

function escapeHTML(str) {
    return str.replace(/&/g, "&")
              .replace(/</g, "<")
              .replace(/>/g, ">")
              .replace(/"/g, "\"")
              .replace(/'/g, "'");
}

function fixIndentation(code, lang) {
    const lines = code.split('\n');
    const indentSize = 4;
    let indentLevel = 0;
    let fixedLines = [];

    const increaseIndentAfter = {
        python: [/^\s*(def |class |if |elif |else:|for |while |try:|except |with )/],
        cStyle: [/\{\s*$/]
    };

    const decreaseIndentBefore = {
        python: [/^\s*(return|break|continue|pass|raise|yield)\b/, /^\s*else:/, /^\s*elif /],
        cStyle: [/^\s*\}/]
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let trimmed = line.trim();

        if (trimmed === '') {
            fixedLines.push('');
            continue;
        }

        if (lang === 'python' || (lang === 'auto' && trimmed.match(/^\s*(def|class|if|elif|else|for|while|try|except|with|return|break|continue|pass|raise|yield|else:|elif )/))) {
            if (decreaseIndentBefore.python.some(re => re.test(trimmed))) {
                indentLevel = Math.max(indentLevel - 1, 0);
            }
            fixedLines.push(' '.repeat(indentLevel * indentSize) + trimmed);
            if (increaseIndentAfter.python.some(re => re.test(trimmed))) {
                indentLevel++;
            }
        } else if (['javascript', 'java', 'cpp', 'csharp', 'php', 'ruby', 'swift', 'kotlin'].includes(lang) || lang === 'auto') {
            if (decreaseIndentBefore.cStyle.some(re => re.test(trimmed))) {
                indentLevel = Math.max(indentLevel - 1, 0);
            }
            fixedLines.push(' '.repeat(indentLevel * indentSize) + trimmed);
            if (increaseIndentAfter.cStyle.some(re => re.test(trimmed))) {
                indentLevel++;
            }
        } else {
            fixedLines.push(line);
        }
    }
    return fixedLines.join('\n');
}

function generatePreview() {
    const rawCode = document.getElementById('codeInput').value;
    selectedLanguage = document.getElementById('langSelect').value;
    const comment = document.getElementById('commentInput').value;
    const preview = document.getElementById('preview');

    const code = fixIndentation(rawCode, selectedLanguage);

    const keywords = [
        'function', 'def', 'if', 'else', 'for', 'while', 'return', 'class', 'with', 'try', 'except', 'lambda',
        'var', 'let', 'const', 'new', 'break', 'continue', 'switch', 'case', 'default', 'do', 'in', 'of',
        'yield', 'async', 'await', 'static', 'public', 'private', 'protected'
    ];
    const keywordRegex = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');

    let html = '';
    code.split('\n').forEach(line => {
        let escapedLine = escapeHTML(line);

        // Strings highlighting (single, double, backticks)
        escapedLine = escapedLine.replace(/(['"`])((?:\\.|(?!\1).)*)(\1)/g, '<span class="string">$&</span>');

        // Keywords highlighting
        escapedLine = escapedLine.replace(keywordRegex, '<span class="keyword">$1</span>');

        // Function calls highlighting
        escapedLine = escapedLine.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="function">$1</span>');

        // Numbers highlighting
        escapedLine = escapedLine.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="number">$1</span>');

        // Variable declarations highlighting (JS style)
        escapedLine = escapedLine.replace(/\b(var|let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/g, '$1 <span class="variable">$2</span>');

        let classes = 'code-line';
        if (isBold) classes += ' bold';
        if (isItalic) classes += ' italic';

        html += escapedLine ? `<div class="${classes}">${escapedLine}</div>` : '<br />';
    });

    preview.innerHTML = html;

    if (comment.trim()) {
        preview.innerHTML += `<div class="comment">${escapeHTML(comment)}</div>`;
    }

    // Update analytics
    previewCount++;
    document.getElementById('previewCount').textContent = previewCount;

    applyBgColor();
    applyFont();
    applyFontSize();
}

function setBackground(type) {
    const body = document.body;
    const container = document.querySelector('.container');
    const bgWhite = document.getElementById('bgWhite');
    const bgDark = document.getElementById('bgDark');

    if (type === 'white') {
        body.classList.remove('dark-mode');
        container.classList.remove('dark-mode');
        bgWhite.classList.add('active');
        bgWhite.setAttribute('aria-pressed', 'true');
        bgDark.classList.remove('active');
        bgDark.setAttribute('aria-pressed', 'false');
    } else {
        body.classList.add('dark-mode');
        container.classList.add('dark-mode');
        bgDark.classList.add('active');
        bgDark.setAttribute('aria-pressed', 'true');
        bgWhite.classList.remove('active');
        bgWhite.setAttribute('aria-pressed', 'false');
    }
    generatePreview();
}

function applyBgColor() {
    const color = document.getElementById('bgColor').value;
    document.getElementById('preview').style.backgroundColor = color;
}

function applyFont() {
    const font = document.getElementById('fontSelect').value;
    document.getElementById('preview').style.fontFamily = font + ', monospace';
    document.getElementById('codeInput').style.fontFamily = font + ', monospace';
}

function applyLanguage() {
    selectedLanguage = document.getElementById('langSelect').value;
    generatePreview();
}

function applyFontSize() {
    const size = document.getElementById('fontSize').value;
    document.getElementById('preview').style.fontSize = size + 'px';
    document.getElementById('codeInput').style.fontSize = size + 'px';
}

function toggleBold() {
    isBold = !isBold;
    const btn = document.getElementById('applyBold');
    btn.classList.toggle('active', isBold);
    btn.setAttribute('aria-pressed', isBold.toString());
    generatePreview();
}

function toggleItalic() {
    isItalic = !isItalic;
    const btn = document.getElementById('applyItalic');
    btn.classList.toggle('active', isItalic);
    btn.setAttribute('aria-pressed', isItalic.toString());
    generatePreview();
}

function captureScreenshot(format) {
    const preview = document.getElementById('preview');
    html2canvas(preview, { backgroundColor: null, scale: 2 })
        .then(canvas => {
            canvas.toBlob(blob => {
                const link = document.createElement('a');
                link.download = `code-screenshot.${format}`;
                link.href = URL.createObjectURL(blob);
                link.click();
            }, `image/${format}`, 1);
        })
        .catch(() => alert('Export failed. Please try again.'));
}

window.addEventListener('load', () => {
    setBackground('white');
    applyFont();
    applyFontSize();
    generatePreview();
});