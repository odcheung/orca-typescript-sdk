import { Numberu64, TokenSwap } from "@solana/spl-token-swap";
import { Connection, PublicKey, Account } from "@solana/web3.js";

/**
 * An Orca token-swap pool
 * @param address The pool account address
 * @param nonce The nonce used to generate the pool authority
 * @param authority The pool authority PDA address to sign instructions
 * @param poolTokenAddress Public address for the pool token
 * @param feeAccount Public address of the pool token fee account
 * @param tokenNameA Name of Token A
 * @param tokenAccountA Public address of Token A within this pool
 * @param tokenNameB Name of Token B
 * @param tokenAccountB Public address of Token B within this pool
 * @param curveType Trading curve type. 0 - ConstantProduct, 1 - ConstantPrice, 3 - Offset
 */
export type OrcaPool = {
    address: PublicKey
    nonce: number
    authority: PublicKey
    poolTokenAddress: PublicKey
    feeAccount: PublicKey
    tokenNameA: String
    tokenAccountA: PublicKey
    tokenNameB: String
    tokenAccountB: PublicKey
    curveType: number
}

/**
 * Instructions for performing a swap
 *
 * @param userSource User's source token A account
 * @param userDestination User's destination token B account
 * @param amountIn Amount of token A to transfer from source account
 * @param minimumAmountOut Minimum amount of token B the user will receive
 */
export type OrcaSwapInstruction = {
    pool: OrcaPool,
    sourceTokenAddress: PublicKey,
    destinationTokenAddress: PublicKey,
    amountIn: number | Numberu64,
    minimumAmountOut: number | Numberu64,
}

export class Orca {

    /**
     * Swap token A for token B
     * @param connection Web3 Solana Connection Object
     * @param userTransferAuthority Account delegated to transfer user's tokens
     * @param feePayer Account designated to pay the fee of the swap
     * @param instruction Instructions for the swap
     * @throws Error types:
     *      - Unable to load the orca token swap pool
     *      - Authority error in the swap instruction
     *      - Token A & B does not match the input orca pool
     *      - Insufficent balance in user source account or fee account
     *      - Invalid public address input
     */
    static async swap(
        connection: Connection,
        swapInstruction: OrcaSwapInstruction,
        userTransferAuthority: Account,
        feePayer: Account) {

        /** Untested Sample Code!! */
        let poolInfo = swapInstruction.pool
        let poolTokenSwapAccount: PublicKey = poolInfo.address
        let tokenSwapProgramId: PublicKey = new PublicKey(0)
        let tokenSwap = await TokenSwap.loadTokenSwap(connection, poolTokenSwapAccount, tokenSwapProgramId, feePayer).catch(e => {
            throw e
        })

        // Error-Handling

        await tokenSwap.swap(
            swapInstruction.sourceTokenAddress,
            poolInfo.tokenAccountA,
            poolInfo.tokenAccountB,
            swapInstruction.destinationTokenAddress,
            poolInfo.feeAccount,
            userTransferAuthority,
            swapInstruction.amountIn,
            swapInstruction.minimumAmountOut).catch(e => {
                throw e
            });
    }
}

/**
 * Swap Sample Code
 */

let pool1: OrcaPool = {
    address: new PublicKey(0),
    nonce: 1,
    authority: new PublicKey(0),
    poolTokenAddress: new PublicKey(0),
    feeAccount: new PublicKey(0),
    tokenNameA: "TokenA",
    tokenAccountA: new PublicKey(0),
    tokenNameB: "TokenB",
    tokenAccountB: new PublicKey(0),
    curveType: 0
}

let connection = new Connection("endpoint");
let userAuthority = new Account();
let userFeeAddress = new Account();

let swapInstruction: OrcaSwapInstruction = {
    pool: pool1,
    sourceTokenAddress: new PublicKey(0),
    destinationTokenAddress: new PublicKey(0),
    amountIn: 10,
    minimumAmountOut: 15
}

Orca.swap(connection, swapInstruction, userAuthority, userFeeAddress)