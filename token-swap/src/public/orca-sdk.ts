import { TokenSwap } from "@solana/spl-token-swap";
import { Connection, PublicKey, Account } from "@solana/web3.js";
import { ORCA_TOKEN_SWAP_ID, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from "../constants";
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { OrcaSwapInstruction, OrcaToken } from "./types";

export class Orca {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection
    }

    /**
     * Swap token A for token B
     * @param swapInstruction Instructions for the swap
     * @param userTransferAuthority Account delegated to transfer user's tokens
     * @param feePayer Account designated to pay the fee of the swap
     * @throws Error types:
     *      - Unable to load specified tokenswap
     *      - Token A & B does not match the input orca pool
     *      - Insufficent balance in user associated token account or fee account
     *      - User wallet address is not valid
     */
    async swap(
        swapInstruction: OrcaSwapInstruction,
        userTransferAuthority: Account,
        feePayer: Account): Promise<void> {

        const poolInfo = swapInstruction.pool
        const poolTokenSwapAccount: PublicKey = poolInfo.address
        const tokenSwap = await TokenSwap.loadTokenSwap(this.connection, poolTokenSwapAccount, ORCA_TOKEN_SWAP_ID, feePayer).catch(e => {
            throw e
        })

        const sourceTokenUserAddress = await this.findAssociatedTokenAddress(swapInstruction.userWallet, swapInstruction.sourceToken);
        const destinationTokenUserAddress = await this.findAssociatedTokenAddress(swapInstruction.userWallet, swapInstruction.destinationToken);

        const sourceTokenPoolAddress = poolInfo.tokens[swapInstruction.sourceToken.name]
        const destinationTokenPoolAddress = poolInfo.tokens[swapInstruction.destinationToken.name]

        if (sourceTokenUserAddress == null) {
            throw new Error("Token mismatch - sourceToken " + swapInstruction.sourceToken.name + " is not a part of the provided Orca Pool");
        }

        if (destinationTokenPoolAddress == null) {
            throw new Error("Token mismatch - destinationToken " + swapInstruction.destinationToken.name + " is not a part of the provided Orca Pool");
        }

        const amountIn = swapInstruction.amountIn * Math.pow(10, swapInstruction.sourceToken.decimal);
        const minAmountOut = swapInstruction.minimumAmountOut * Math.pow(10, swapInstruction.destinationToken.decimal);

        console.log("Trading " + swapInstruction.amountIn + " of " + swapInstruction.sourceToken.name + " to a min of " + swapInstruction.minimumAmountOut + " of " + swapInstruction.destinationToken.name)

        await tokenSwap.swap(
            sourceTokenUserAddress,
            sourceTokenPoolAddress,
            destinationTokenPoolAddress,
            destinationTokenUserAddress,
            poolInfo.feeAccount,
            userTransferAuthority,
            amountIn,
            minAmountOut).catch(e => {
                throw e
            });
    }

    /**
     * TODO: Verify behavior for the following cases:
     * - If wallet address not valid
     * - If user does not have that token in their wallet
     * - If token mint address is not a mint
     * - token swap program out of date
     * - spl token account program address out of date
     *  */
    private async findAssociatedTokenAddress(walletAddress: PublicKey, token: OrcaToken): Promise<PublicKey> {
        return (await PublicKey.findProgramAddress(
            [
                walletAddress.toBuffer(),
                TOKEN_PROGRAM_ID.toBuffer(),
                token.mint.toBuffer(),
            ],
            SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
        ))[0];
    }
}
