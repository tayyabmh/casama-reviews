import {
    useAccount, 
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi';
import { 
    TABLELAND_REVIEWS_ABI,
    TABLELAND_REVIEWS_CONTRACT_MUMBAI,
} from '@/lib/evm/tableland_reviews_abi';
import { useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { useTransaction } from 'wagmi';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';


export default function Enrich() {
    const { address, isConnected } = useAccount();
    const [ transactionHash, setTransactionHash ] = useState<`0x${string}`>('0x3319e4fed0de971e1506a648e161256912b0f9e54fc350dafc109770b8778b29');
    const debouncedTransactionHash = useDebounce(transactionHash, 500);
    const [ toAddress, setToAddress ] = useState<string>('');
    const [ fromAddress, setFromAddress ] = useState<string>('');
    const [ isValidTransaction, setIsValidTransaction ] = useState<boolean>(false);

    const { data: transactionData, refetch: refetchTransaction } = useTransaction({
        hash: transactionHash,
        enabled: Boolean(transactionHash),
        chainId: 80001,
        onSuccess: (data) => {
            setToAddress(data.to as `0x${string}`);
            setFromAddress(data.from as `0x${string}`)
            setIsValidTransaction(true);
        },
        onError: (error) => {
            console.log(error);
            setIsValidTransaction(false);
        }
    });

    useEffect(() => {
        refetchTransaction();
    }, [debouncedTransactionHash])

    



    const { config } = usePrepareContractWrite({
        abi: TABLELAND_REVIEWS_ABI,
        address: TABLELAND_REVIEWS_CONTRACT_MUMBAI,
        functionName: 'initiateReviewForTransaction',
        args: [toAddress, transactionHash],
        // Change this so it doesn't just spam the network with transaction attempts
        enabled: Boolean(isConnected && isValidTransaction && (address === fromAddress)),
    });
    
    const { data, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash
    });

    useEffect(() => {
        if (isSuccess) {
            console.log('Transaction successful');
        }
    }, [isSuccess])

    const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof e.target.value === 'string') {
            setTransactionHash(e.target.value as `0x${string}`);
        }
    }

    const handleSubmit = () => {
        // At this point validations should be done (valid Txn, valid Connection, valid Address)
        write?.();
    }


    return (
        <div className=''>
            <form className='space-y-8 divide-y divide-gray-200'>
                <div>
                    <div>
                        <div>
                            <h1 className="text-lg font-semibold leading-6 text-gray-900">Enrich</h1>
                            <p className="mt-1 text-sm text-gray-500">Enrich a transaction with a review. You may only enrich a transaction for which you were sender.</p>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="col-span-3 sm:col-span-6">
                            <label htmlFor="transactionHash" className="block text-md font-medium text-gray-900">
                                Transaction Hash
                            </label>
                            <p className='text-sm text-gray-600'>Casama will find the associated transaction data for you.</p>
                            <div className="mt-2 flex rounded-md shadow-sm">
                                <input
                                    type="text"
                                    name="transactionHash"
                                    id="transactionHash"
                                    className="focus:ring-rose-500 focus:border-rose-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                    value={transactionHash}
                                    onChange={(e) => handleTransactionChange(e)}
                                />
                            </div>
                            {!isValidTransaction ? (
                                <div className='flex flex-row'>
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 mt-2 mr-2" aria-hidden="true" />
                                    <p className="mt-2 text-sm text-red-600" id="email-error">
                                        Not a valid transaction hash.
                                    </p>
                                </div>
                            ) : null}
                        </div>
                        <div className='col-span-3 sm:col-span-6'>
                            <label htmlFor="fromAddress" className="block text-md font-medium text-gray-700">
                                From Wallet Address
                            </label>
                            <div className='mt-2 flex rounded-md shadow-sm'>
                                <input
                                    type="text"
                                    name="fromAddress"
                                    id="fromAddress"
                                    className="disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200 focus:ring-rose-500 focus:border-rose-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                    value={fromAddress}
                                    disabled
                                />
                            </div>
                            {address !== fromAddress ? (
                                <div className='flex flex-row'>
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 mt-2 mr-2" aria-hidden="true" />
                                    <p className="mt-2 text-sm text-red-600" id="email-error">
                                        You are not the sender of this transaction.
                                    </p>
                                </div>
                                ) : null
                            }
                        </div>
                        <div className='col-span-3 sm:col-span-6'>
                            <label htmlFor="toAddress" className="block text-md font-medium text-gray-700">
                                To Wallet Address
                            </label>
                            <div className='mt-2 flex rounded-md shadow-sm'>
                                <input
                                    type="text"
                                    name="toAddress"
                                    id="toAddress"
                                    className="disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200 focus:ring-rose-500 focus:border-rose-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                                    value={toAddress}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className='col-span-1 sm:col-span-6'>
                            <button
                                type="button"
                                className="disabled:bg-slate-500  disabled:cursor-not-allowed rounded-md bg-rose-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                                onClick={handleSubmit}
                                // This button should be disabled if the transaction is not valid, the user is not connected, or if the user is neither the sender nor the recipient of the transaction
                                disabled={!isValidTransaction || !isConnected || (address !== fromAddress)}
                            >
                                Enrich Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}