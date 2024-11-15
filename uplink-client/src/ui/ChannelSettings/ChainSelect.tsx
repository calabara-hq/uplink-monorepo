import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/ui/DesignKit/Select";
import { getChainName, supportedChains } from "@/lib/chains/supportedChains";
import { ChainLabel } from "../ChainLabel/ChainLabel";

export const ChainSelect = ({ chainId, setChainId }: { chainId: 8453 | 84532, setChainId: (val: 8453 | 84532) => void }) => {

    const handleValueChange = (val: string) => {
        const chain = supportedChains.find(c => c.name === val);
        if (!chain) return;
        setChainId(chain.id as 8453 | 84532);
    }

    return (

        <Select value={getChainName(chainId)} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a network" />
            </SelectTrigger>
            <SelectContent className="border border-accent">
                <SelectGroup>
                    <SelectLabel>Network</SelectLabel>
                    <SelectItem value="Base">
                        <div className="flex flex-row gap-1 items-center">
                            <span>Base</span>
                            <ChainLabel chainId={8453} px={16} />
                        </div>
                    </SelectItem>
                    <SelectItem value="Base Sepolia">
                        <div className="flex flex-row gap-1 items-center">
                            <span>Base Sepolia</span>
                            <ChainLabel chainId={84532} px={16} />
                        </div>
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>

    )
}