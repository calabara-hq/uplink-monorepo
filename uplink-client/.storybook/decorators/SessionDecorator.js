import WalletProvider from '../../src/providers/WalletProvider';

export default function SessionDecorator(Story, context) {
    const session = context.args.loggedIn ? {
        user: { address: '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C' },
        expires: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString()
    } :
        null;

    console.log('SessionDecorator', context)
    return (
        <WalletProvider session={session}>
            <Story />
        </WalletProvider>
    )
};