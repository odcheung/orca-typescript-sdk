import { Connection } from '@solana/web3.js'
import { OrcaImpl } from '../model/orca-impl'
import { Orca } from './types'

export function getOrca(connection: Connection): Orca { 
    return new OrcaImpl(connection)
}