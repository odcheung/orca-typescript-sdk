import { PublicKey } from "@solana/web3.js";
import { OrcaPool, OrcaToken } from "./types";

/**
 * Constants
 * TODO: Generate these from collectibles.json
 */
export const ETH: OrcaToken = Object.freeze({
    name: "ETH",
    mint: new PublicKey("2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk"),
    decimal: 6
});

export const USDC: OrcaToken = Object.freeze({
    name: "USDC",
    mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    decimal: 6
});

export const ethUsdcPool: OrcaPool = Object.freeze({
    address: new PublicKey("DY8qBwVGLeLJSrWib7L16mL7oB4HNAQ2f9yiYWKof54v"),
    nonce: 255,
    authority: new PublicKey("82oSibpDKnPZ2Yk1vn6McjCsQQbKfBkGeEh5FsqeVrtU"),
    poolTokenAddress: new PublicKey("7TYb32qkwYosUQfUspU45cou7Bb3nefJocVMFX2mEGTT"),
    feeAccount: new PublicKey("AcMaBVt6S43JQXKnEDqdicxYofb5Cj1UgFWF9AsurTp6"),
    tokens: {
        "ETH": new PublicKey("8eUUP3t9nkXPub8X6aW2a2gzi82pUFqefwkSY8rCcVxg"),
        "USDC": new PublicKey("2tNEBoEuqJ1pPmA1fpitDnowgUQZXvCT6W3fui67AFfV"),
    },
    curveType: 0,
});
