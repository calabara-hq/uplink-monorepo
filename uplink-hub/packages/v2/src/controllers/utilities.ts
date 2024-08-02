import { Request, Response, NextFunction } from 'express'
import { ENTRYPOINT_ADDRESS_V06 } from "permissionless/utils";
import { EntryPoint, UserOperation } from "permissionless/types";
import { Eip7677RpcSchema, paymasterActionsEip7677 } from 'permissionless/experimental';

import {
    Address,
    BlockTag,
    Chain,
    Client,
    Hex,
    Transport,
    createClient,
    createPublicClient,
    decodeAbiParameters,
    http,
} from "viem";
import { base, baseSepolia } from "viem/chains";
import { createWeb3Client } from '../utils/viem.js';
import dotenv from 'dotenv'
import { PaymasterError } from '../errors.js';
dotenv.config()

export const coinbaseSmartWalletProxyBytecode =
    "0x363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3";
export const coinbaseSmartWalletV1Implementation =
    "0x000100abaad02f1cfC8Bbe32bD5a564817339E72";
export const coinbaseSmartWalletFactoryAddress =
    "0x0BA5ED0c6AA8c49038F819E587E2633c4A9F428a";
export const magicSpendAddress = "0x011A61C07DbF256A68256B1cB51A5e246730aB92";
export const erc1967ProxyImplementationSlot =
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";


const willSponsor = async ({ chainId, entrypoint, userOp }: { chainId: number, entrypoint: string, userOp: UserOperation<"v0.6"> }) => {
    // check chain id

    console.log(chainId)
    console.log(typeof chainId)

    console.log(chainId === base.id);
    console.log(chainId === baseSepolia.id);

    if (chainId !== baseSepolia.id && chainId !== base.id) return false;

    // check entrypoint
    // not strictly needed given below check on implementation address, but leaving as example
    if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase())
        return false;

    try {

        const client = createWeb3Client(chainId);

        // check the userOp.sender is a proxy with the expected bytecode
        const code = await client.getCode({ address: userOp.sender });

        if (!code) {
            // no code at address, check that the initCode is deploying a Coinbase Smart Wallet
            // factory address is first 20 bytes of initCode after '0x'
            const factoryAddress = userOp.initCode.slice(0, 42);
            console.log(factoryAddress.toLowerCase())
            console.log(coinbaseSmartWalletFactoryAddress.toLowerCase())
            if (factoryAddress.toLowerCase() !== coinbaseSmartWalletFactoryAddress.toLowerCase())
                return false;
        } else {
            // code at address, check that it is a proxy to the expected implementation
            if (code != coinbaseSmartWalletProxyBytecode) return false;

            // check that userOp.sender proxies to expected implementation
            const implementation = await client.request<{
                Parameters: [Address, Hex, BlockTag];
                ReturnType: Hex;
            }>({
                method: "eth_getStorageAt",
                params: [userOp.sender, erc1967ProxyImplementationSlot, "latest"],
            });
            const implementationAddress = decodeAbiParameters(
                [{ type: "address" }],
                implementation
            )[0];
            if (implementationAddress != coinbaseSmartWalletV1Implementation)
                return false;
        }

        // // check that userOp.callData is making a call we want to sponsor
        // const calldata = decodeFunctionData({
        //     abi: coinbaseSmartWalletABI,
        //     data: userOp.callData,
        // });

        // // keys.coinbase.com always uses executeBatch
        // if (calldata.functionName !== "executeBatch") return false;
        // if (!calldata.args || calldata.args.length == 0) return false;

        // const calls = calldata.args[0] as {
        //     target: Address;
        //     value: bigint;
        //     data: Hex;
        // }[];
        // // modify if want to allow batch calls to your contract
        // if (calls.length > 2) return false;

        // let callToCheckIndex = 0;
        // if (calls.length > 1) {
        //     // if there is more than one call, check if the first is a magic spend call
        //     if (calls[0].target.toLowerCase() !== magicSpendAddress.toLowerCase())
        //         return false;
        //     callToCheckIndex = 1;
        // }

        // if (
        //     calls[callToCheckIndex].target.toLowerCase() !==
        //     myNFTAddress.toLowerCase()
        // )
        //     return false;

        // const innerCalldata = decodeFunctionData({
        //     abi: myNFTABI,
        //     data: calls[callToCheckIndex].data,
        // });
        // if (innerCalldata.functionName !== "safeMint") return false;

        return true;
    } catch (e) {
        throw new PaymasterError('Sponsorship check failed')
    }
}

export const paymasterProxy = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { method, params } = req.body

        const userOp = params[0] as UserOperation<"v0.6">;
        const entrypoint = params[1] as string;
        const chainId = Number(params[2]);

        // todo validate the userOp

        // const sponsorable = await willSponsor({ userOp, entrypoint, chainId })

        // if (!sponsorable) throw new PaymasterError('This operation is not sponsorable')

        const chain = (chainId === baseSepolia.id ? baseSepolia : base) as Chain;

        const paymasterClient = createClient({
            chain: chain,
            transport: http(
                `https://api.developer.coinbase.com/rpc/v1/${chainId === baseSepolia.id ? 'base-sepolia' : 'base'}/${process.env.PAYMASTER_KEY}`
            )
            // @ts-ignore
        }).extend(paymasterActionsEip7677(ENTRYPOINT_ADDRESS_V06));


        if (method === "pm_getPaymasterStubData") {
            const result = await paymasterClient.getPaymasterStubData({
                chain: chain,
                userOperation: userOp,
            });
            return res.send(result).status(200);
        } else if (method === "pm_getPaymasterData") {
            const result = await paymasterClient.getPaymasterData({
                chain: chain,
                userOperation: userOp,
            });
            return res.send(result).status(200);
        }
        else {
            throw new PaymasterError('Invalid method')
        }

    } catch (err) {
        console.log(err)
        next(err)
    }

}