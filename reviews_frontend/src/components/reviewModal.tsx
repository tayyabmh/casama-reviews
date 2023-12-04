import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useDebounce } from 'usehooks-ts';
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
    useAccount
} from 'wagmi';
import { TABLELAND_REVIEWS_ABI, TABLELAND_REVIEWS_CONTRACT_MUMBAI } from '@/lib/evm/tableland_reviews_abi';

type Review = {
    id: number;
    reviewerAddress: `0x${string}`;
    revieweeAddress: `0x${string}`;
    associatedTransactionHash: `0x${string}`;
    review: string;
    rating: number;
    status: string;
}

export default function ReviewModal(props: { show: boolean, selectedReview: Review | null, setReviewModalOpen: Function}) {
    const [open, setOpen] = useState(true);
    const [ review, setReview ] = useState<string>("");
    const debouncedReview = useDebounce(review, 500);
    const [ rating, setRating ] = useState<number>(1);
    const debouncedRating = useDebounce(rating, 500);

    const { isConnected } = useAccount();

    const { config } = usePrepareContractWrite({
        abi: TABLELAND_REVIEWS_ABI,
        address: TABLELAND_REVIEWS_CONTRACT_MUMBAI,
        functionName: 'updateReview',
        args: [props.selectedReview?.id, debouncedReview, debouncedRating],
        enabled: Boolean(isConnected),
    });

    const { data, writeAsync  } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash
    });

    const handleReviewSubmit = async () => {
        writeAsync?.().then(() => {
            setTimeout(() => {
            props.setReviewModalOpen(false);
            }, 2000);
        });
    }

    return (
        <Transition.Root show={props.show} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>
                        <div>
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                Complete Review
                            </Dialog.Title>
                            {isSuccess ? <p className='mt-2 bg-green-100 rounded-lg text-sm text-green-600 p-2'>Transaction was succesfully submitted!</p> : null}
                        </div>
                    <div className="mt-3 sm:mt-5">
                        <form className="space-y-6 divide-y divide-gray-200">
                            <div className="space-y-7 divide-y divide-gray-200">
                                <div>
                                    <div className='mt-6 flex flex-col'>
                                        <div className=''>
                                            <label htmlFor="reviewId" className="block text-md font-medium text-gray-700">
                                                Review ID
                                            </label>
                                            <div className="mt-1">
                                                <p className='text-md'>{props.selectedReview?.id}</p>
                                            </div>
                                        </div>
                                        <div className='mt-4'>
                                            <label htmlFor="reviewId" className="block text-md font-medium text-gray-700">
                                                Review
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    rows={4}
                                                    name="comment"
                                                    id="comment"
                                                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                                    value={review}
                                                    onChange={(e) => setReview(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="rating" className="form-label">Rating</label>
                                        <div className="mt-2">
                                            <select
                                                id="rating"
                                                name="rating"
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                value={rating}
                                                onChange={(e) => setRating(parseInt(e.target.value))}
                                            >
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </select>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                            onClick={handleReviewSubmit}
                        >
                            {isLoading ? "Submitting Txn.." : "Complete Review" }
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={() => {
                                props.setReviewModalOpen(false)
                            }}
                        >
                            Cancel
                        </button>
                </div>
                </Dialog.Panel>
                </Transition.Child>
            </div>
            </div>
        </Dialog>
        </Transition.Root>
    );
}