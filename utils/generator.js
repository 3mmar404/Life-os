// src/utils/generator.js

const charsets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

export function generatePassword(options) {
    const {
        length = 16,
        includeUppercase = true,
        includeNumbers = true,
        includeSymbols = true
    } = options;

    let availableChars = charsets.lowercase;
    const requiredChars = [];

    if (includeUppercase) {
        availableChars += charsets.uppercase;
        requiredChars.push(charsets.uppercase[Math.floor(Math.random() * charsets.uppercase.length)]);
    }
    if (includeNumbers) {
        availableChars += charsets.numbers;
        requiredChars.push(charsets.numbers[Math.floor(Math.random() * charsets.numbers.length)]);
    }
    if (includeSymbols) {
        availableChars += charsets.symbols;
        requiredChars.push(charsets.symbols[Math.floor(Math.random() * charsets.symbols.length)]);
    }

    let password = requiredChars.join('');

    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }
    // خلط كلمة المرور لضمان عشوائية مواقع الأحرف المطلوبة
    return password.split('').sort(() => Math.random() - 0.5).join('');
}
