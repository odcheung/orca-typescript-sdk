import { PublicKey } from "@solana/web3.js";

/**
 * An Orca token-swap pool
 * @param address The pool account address
 * @param nonce The nonce used to generate the pool authority
 * @param authority The pool authority PDA address to sign instructions
 * @param poolTokenAddress Public address for the pool token
 * @param feeAccount Public address of the pool token fee account
 * @param tokens The name, public key pair of the tokens in this pool
 * @param curveType Trading curve type. 0 - ConstantProduct, 1 - ConstantPrice, 3 - Offset
 */
export type OrcaPool = {
    address: PublicKey;
    nonce: number;
    authority: PublicKey;
    poolTokenAddress: PublicKey;
    feeAccount: PublicKey;
    tokens: Record<string, PublicKey>;
    curveType: number;
};

/**
 * An Orca Supported Token
 *
 * @param name The name of this token
 * @param mint The mint public key for this token.
 * @param decimal The number of decimal places this token supports
 */
export type OrcaToken = {
    name: string;
    mint: PublicKey;
    decimal: number;
}

/**
 * Instructions for performing a swap
 *
 * @param pool The Orca pool the user would like to perform the swap in
 * @param userWallet The public key for the user's wallet
 * @param sourceToken An Orca supported token in the user's wallet to swap from
 * @param destinationToken An Orca supported token to swap into the user's wallet
 * @param amountIn The amount of sourceTokens to swap from
 * @param minimumAmountOut The minimum amount of destinationToken to receive from this swap
 */
export type OrcaSwapInstruction = {
    pool: OrcaPool,
    userWallet: PublicKey,
    sourceToken: OrcaToken,
    destinationToken: OrcaToken,
    amountIn: number,
    minimumAmountOut: number,
}
