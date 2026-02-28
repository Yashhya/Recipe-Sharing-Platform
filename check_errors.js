const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('ERROR:', msg.text());
        }
    });

    page.on('pageerror', error => {
        console.log('PAGE ERROR:', error.message);
    });

    try {
        await page.goto('http://localhost:4200', { waitUntil: 'networkidle0', timeout: 10000 });
    } catch (e) {
        console.log('Timeout or error:', e.message);
    }

    await browser.close();
})();
