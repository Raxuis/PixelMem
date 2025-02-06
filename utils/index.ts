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