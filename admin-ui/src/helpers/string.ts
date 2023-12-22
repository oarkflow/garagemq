export const toTitleCase = (str: string) => {
    return str.replace(/\p{L}+('\p{L}+)?/gu, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.slice(1)
    })
}

export const slugToTitle = (str: string) => {
    let replaceParam;
    if (str.includes('_')) {
        replaceParam = /_/g
    } else {
        if (str.includes('-')) {
            replaceParam = /-/g

        }
    }
    return str.replace(replaceParam, " ").replace(/\b[a-z]/g, function () {
        return arguments[0].toUpperCase();
    });
}

export const slugify = (text: string) => {
    return text
        .toString()                           // Cast to string (optional)
        .normalize('NFKD')            // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
        .toLowerCase()                  // Convert the string to lowercase letters
        .trim()                                  // Remove whitespace from both sides of a string (optional)
        .replace(/\s+/g, '-')            // Replace spaces with -
        .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
        .replace(/\-\-+/g, '-')
        .replace(/\-$/g, '');        // Replace multiple - with single -
}

export const randomString = (length = 16) => {
    let result = "", seeds
    for (let i = 0; i < length; i++) {
        seeds = [
            Math.floor(Math.random() * 10) + 48,
            Math.floor(Math.random() * 25) + 65,
            Math.floor(Math.random() * 25) + 97
        ]
        result += String.fromCharCode(seeds[Math.floor(Math.random() * 3)])
    }

    return result
}

export const truncate = (text: string, len: number, suffix: string) => {
    if (text.length > len && text.length > 0) {
        return `${text.split(" ").slice(0, len).join(" ")} ${suffix}`;
    } else {
        return text;
    }
};

export const humanFileSize = (bytes: number): `${number} ${'B' | 'KB' | 'MB' | 'GB' | 'TB'}` => {
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Number((bytes / Math.pow(1024, index)).toFixed(2)) * 1} ${(['B', 'KB', 'MB', 'GB', 'TB'] as const)[index]}`;
};