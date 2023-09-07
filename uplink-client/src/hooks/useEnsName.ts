import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const provider = new ethers.providers.AlchemyProvider('homestead', process.env.NEXT_PUBLIC_ALCHEMY_KEY)


const useEnsName = (address: string) => {
    const [ensName, setEnsName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchENSName() {
            try {
                const name = await provider.lookupAddress(address);
                setEnsName(name);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        }

        fetchENSName();
    }, [address]);

    return { ensName, loading, error };
}

export default useEnsName;
