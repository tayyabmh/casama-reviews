import { useAccount, useBalance } from "wagmi";
import { useEffect, useState } from "react";

type ERC20BalanceProps = {
    token: `0x${string}`;
}

export default function ERC20Balance(props: ERC20BalanceProps) {
    const [balance, setBalance] = useState<string>('0');
    const [symbol, setSymbol] = useState<string>('');
    const { token } = props;
    const { address } = useAccount();
    const { data } = useBalance({
        address: address,
        token: token
    });

    useEffect(() => {
        if(data) {
            setBalance(data.formatted);
            setSymbol(data.symbol);
        }
    }, [data])

    return (
        <div>
            {balance} {symbol}
        </div>
    );
}

