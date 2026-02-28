import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'app-theme';
    public isDark = false;

    constructor() {
        this.loadTheme();
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        this.applyTheme();
        localStorage.setItem(this.THEME_KEY, this.isDark ? 'dark' : 'light');
    }

    private loadTheme() {
        // Default to light theme manually, but allow dark
        const saved = localStorage.getItem(this.THEME_KEY);
        if (saved === 'dark') {
            this.isDark = true;
        } else {
            this.isDark = false;
        }
        this.applyTheme();
    }

    private applyTheme() {
        if (this.isDark) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }
}
