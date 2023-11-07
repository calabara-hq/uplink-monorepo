import { useState, useEffect } from 'react';
import { createWeb3Client } from '@/lib/viem';

const publicClient = createWeb3Client(1);

const useEnsName = (address: string) => {
    const [ensName, setEnsName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchENSName() {
            try {
                const name = await publicClient.getEnsName({ address: address as `0x${string}` })
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
