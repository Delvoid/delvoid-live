import http from 'http';
import { Readable } from 'stream';
import fs from 'fs';

const ROOT = 'files';
const files = fs.readdirSync(ROOT).sort((a, b) => {
  const numA = parseInt(a.match(/\d+/)?.[0] || '0');
  const numB = parseInt(b.match(/\d+/)?.[0] || '0');
  return numA - numB;
});

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
} as const;

function randomColor() {
  const keys = Object.keys(colors) as (keyof typeof colors)[];
  return colors[keys[Math.floor(Math.random() * keys.length)]];
}

function shouldRedirect(req: http.IncomingMessage): boolean {
  return !req.headers['user-agent']?.includes('curl');
}

function serveFiles(req: http.IncomingMessage, res: http.ServerResponse): void {
  const stream = new Readable({
    read() {},
  });
  stream.pipe(res);
  let fileIndex = 0;

  const interval = setInterval(async () => {
    fileIndex = (fileIndex + 1) % files.length;
    const currentFile = files[fileIndex];
    const data = await fs.promises.readFile(`${ROOT}/${currentFile}`);

    stream.push('\x1B[2J\x1B[3J\x1B[H'); // clear screen
    if (fileIndex % 5 === 0) {
      stream.push(randomColor());
    }

    stream.push(data.toString());
  }, 60);

  req.on('close', () => {
    clearInterval(interval);
  });
}

http
  .createServer((req, res) => {
    if (shouldRedirect(req)) {
      res.writeHead(302, {
        Location: 'https://github.com/delvoid',
      });
      return res.end();
    }

    serveFiles(req, res);
  })
  .listen(3000, () => {
    console.log('Server is running on port 3000');
  });
