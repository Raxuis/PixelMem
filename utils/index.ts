import {GameMode} from "@/types";

export const chunkArray = <T, >(arr: T[], size: number): T[][] => {
    return arr.reduce<T[][]>((acc, _, i) =>
        i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc, []
    );
};

export const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const getRandomEmoji = (): string => {
    return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

export const getColumns = (gameMode: GameMode): number => {
    switch (gameMode) {
        case "2x2":
            return 2;
        case "4x4":
            return 4;
        case "6x6":
            return 6;
        default:
            return 2;
    }
};

const EMOJIS = [
    '🐶',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🦊',
    '🐻',
    '🐼',
    '🐨',
    '🐯',
    '🦁',
    '🐮',
    '🐷',
    '🐸',
    '🐵',
    '🐔',
    '🐧',
    '🐦',
    '🐤',
    '🐣',
    '🐥',
    '🦆',
    '🦅',
    '🦉',
    '🦇',
    '🐺',
    '🐗',
    '🐴',
    '🦄',
    '🐝',
    '🐛',
    '🦋',
    '🐌',
    '🐞',
    '🐜',
    '🦗',
    '🕷',
    '🦂',
    '🦟',
    '🦠',
    '🐢',
    '🐍',
    '🦎',
    '🦖',
    '🦕',
    '🐙',
    '🦑',
    '🦐',
    '🦀',
    '🐡',
    '🐠',
    '🐟',
    '🐬',
    '🐳',
    '🐋',
    '🦈',
    '🐊',
    '🐅',
    '🐆',
    '🦓',
    '🦍',
    '🦧',
    '🦣',
    '🐘',
    '🦛',
    '🦏',
    '🐪',
    '🐫',
    '🦒',
    '🦘',
    '🦬',
    '🐃',
    '🐂',
    '🐄',
    '🐎',
    '🐖',
    '🐏',
    '🐑',
    '🦙',
    '🐐',
    '🦌',
    '🐕',
    '🐩',
    '🦮',
    '🐕‍🦺',
    '🦓',
    '🦙',
    '🦛',
    '🦏',
    '🦘',
    '🦍',
    '🦧',
    '🦣',
    '🐘',
    '🦛',
    '🦏',
    '🐪',
    '🐫'
]