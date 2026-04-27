"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROFANITY_PATTERNS = void 0;
exports.hasProfanity = hasProfanity;
exports.PROFANITY_PATTERNS = [
    /\b(fuck|shit|bitch|asshole|dick|pussy|bastard|cunt)\b/i,
    /(?:^|[^а-яё])(хуй|пизд|бля|сука|еба|ёба|гондон|уеб|муда|пидор|пидар|курва)(?=[^а-яё]|$)/ui,
    /(?:^|[^а-яё])(хули|нах|пох)(?=[^а-яё]|$)/ui,
    /(?:^|[^а-яёҷғҳқӣӯ])(кӯс|кус|кур|гои|гоя|гом|мур|лаънат|ланат|ҳаром|харом|занакбаз|саг)(?=[^а-яёҷғҳқӣӯ]|$)/ui,
    /(?:^|[^а-яёҷғҳқӣӯ])(гоида|падар|оча|очат|аҷал|лаънати)(?=[^а-яёҷғҳқӣӯ]|$)/ui,
    /ҳаромхӯр/ui,
    /керам/ui,
    /кери/ui,
];
function hasProfanity(text) {
    const normalized = text.toLowerCase();
    return exports.PROFANITY_PATTERNS.some(pattern => pattern.test(normalized));
}
//# sourceMappingURL=profanity-list.js.map