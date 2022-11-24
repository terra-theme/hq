import { HSL } from "colors-convert/dist/cjs/lib/types/types";
import * as fs from "fs";
import { BasePrimary, HexColor, TerraPrimaryColors } from "../typings/colors";

import { Theme } from "../typings/theme";
import { hslaToHex } from "./color";
import { isFloat } from "./number";

export const buildPrimary = (basePrimary: BasePrimary, l: HSL["l"]): HexColor => {
    if (isFloat(l)) {
        throw Error(`l: '${l}' must be an integer.`);
    } else if (l < 0 || l > 100) {
        throw Error(`l: '${l}' must an integer between 0 an 100, or 0 and 100.`);
    }

    return hslaToHex({
        ...basePrimary,
        l
    });
};

type LuminanceSteps = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];

// const sortObj = <T extends {}>(obj: T): T => {
//     return Object.keys(obj)
//         .sort()
//         .reduce((result: T, key) => {
//             result[key] = obj[key];
//             return result;
//         }, {});
// };

// TODO Sort
export const buildPrimaries = (
    basePrimary: BasePrimary,
    luminanceSteps: LuminanceSteps = [7, 10, 13, 16, 40, 48, 56, 64, 70, 78, 86, 94]
): TerraPrimaryColors => {
    return luminanceSteps.reduce(
        (acc: TerraPrimaryColors, luminance: number, index: number) => {
            return {
                ...acc,
                [index]: buildPrimary(basePrimary, luminance)
            };
        },
        {} as TerraPrimaryColors
    );
};

export const buildThemes = (themes: Theme[]): void => {
    const PROJECT_DIR_PATH = process.env.PWD;
    const DISTRIBUTION_DIR_NAME = "dist";
    const DISTRIBUTION_DIR_PATH = `${PROJECT_DIR_PATH}/${DISTRIBUTION_DIR_NAME}`;

    const ensureDirectory = (dirPath: string): void => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);

            console.log(
                "✅".padEnd(2, " "),
                "Created distribution folder..".padEnd(40, " "),
                `📂 "/${dirPath}"`
            );
        }
    };

    const writeThemeFile = (theme: Theme): void => {
        const themeAsJson = JSON.stringify(theme, undefined, 4);
        const THEME_FILE_PATH = `${DISTRIBUTION_DIR_PATH}/terra-${theme.season}-${theme.time}.json`;

        ensureDirectory(DISTRIBUTION_DIR_PATH);

        fs.writeFile(THEME_FILE_PATH, themeAsJson, err => {
            if (err) throw err;
        });

        console.log(
            "✅".padEnd(2, " "),
            `Updated [${theme.name}]..`.padEnd(40, " "),
            `📁 "${THEME_FILE_PATH}"`
        );
    };

    themes.forEach(writeThemeFile);
};
