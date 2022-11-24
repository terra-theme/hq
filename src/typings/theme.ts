export type ThemeTime = "day" | "night";

export type ThemeSeason = "spring" | "summer" | "fall" | "winter";

export type ThemeName = `terra ${ThemeSeason} ${ThemeTime}`;

export type ThemeType = "dark" | "light";

export interface Theme {
    name: ThemeName;
    time: ThemeTime;
    season: ThemeSeason;
    // TBD
}
