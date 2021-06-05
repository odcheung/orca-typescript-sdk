import { PublicKey } from '@solana/web3.js'
import { OrcaPoolConfig } from './pools'

export type Orca = {

    /**
     * Get an instance of an Orca pool.
     * @param pool a pool config targeting an Orca pool
     */
    getPool: (pool: OrcaPoolConfig) => OrcaPool
}

export type OrcaPool = {

    /**
     * Query the balance for an user address
     * @param wallet The public key for the user.
     * @return Returns the amount of LP token the user owns for this pool.
     */
    getLPBalance: (wallet: PublicKey) => Promise<number>
}
