import { useState } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDebounce } from 'usehooks-ts';
import { TABLELAND_REVIEWS_ABI } from '@/lib/evm/tableland_reviews_abi';

const POLYGONMUMBAI_REVIEWS_CONTRACT_ADDRESS = '0x7Afc9F0e9F694928c04f5b3982871c50942D65EE';


export default function Update(){
    const [ reviewId, setReviewId ] = useState<number>(0);
    const debouncedReviewId = useDebounce(reviewId, 500);
    const [ review, setReview ] = useState<string>('');
    const debouncedReview = useDebounce(review, 500);
    const [ rating, setRating ] = useState<number>(1);
    const debouncedRating = useDebounce(rating, 500);

    const { address, isConnected } = useAccount();
    
    // TODO: Error handling would be hella nice here
    const { config } = usePrepareContractWrite({
        abi: TABLELAND_REVIEWS_ABI,
        address: POLYGONMUMBAI_REVIEWS_CONTRACT_ADDRESS,
        functionName: 'updateReview',
        args: [debouncedReviewId, debouncedReview, debouncedRating],
        enabled: Boolean(isConnected),
        onError: (error) => {
            const { message } = error;
            console.log(message);
        }
    });

    const { data, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash
    });

    return (
        <div>
            <h1 className="text-2xl font-semibold">Update Review</h1>
            <div>
                <form 
                    className="grid-cols-4 grid mt-4 p-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        write?.();
                    }}
                >
                    <div className="mb-3 col-span-2">
                        <label htmlFor="review_id" className="form-label">Review ID</label>
                        <div className="mt-2">
                            <input
                            type="number"
                            name="review_id"
                            id="review_id"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                            placeholder="0"
                            value={reviewId}
                            onChange={(e) => setReviewId(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="Review" className="form-label">Review</label>
                            <div className="mt-2">
                                <textarea
                                rows={4}
                                name="comment"
                                id="comment"
                                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="rating" className="form-label">Rating</label>
                            <div className="mt-2">
                                <select
                                    id="rating"
                                    name="rating"
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-rose-600 sm:text-sm sm:leading-6"
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
                        <div className='flex justify-end mt-2'>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}


// function FilledStar(onClick: () => void) {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="#E4A11B"
//             className="mr-1 h-7 w-7 text-warning">
//             <path
//                 fill-rule="evenodd"
//                 d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
//                 clip-rule="evenodd" 
//             />
//         </svg>
//     )
// }

// function EmptyStar(setRating: (newRating: number) => React.ReactNode) {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke-width="1.5"
//             stroke="currentColor"
//             className="mr-1 h-7 w-7 text-warning">
//             onClick={setRating(newRating)}
//             <path
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
//             />
//         </svg>
//     )
// }

// function Rating(rating: number, setRating: (newRating: number) => void) {
//     let content = [];
//     for (let i = 0; i < 5; i++) {
//         if (i <= rating) {
//             content.push(<FilledStar onClick={setRating(i + 1)}/>);
//         } else {
//             content.push(<EmptyStar onClick={setRating(i + 1)}/>);
//         }
//     }
//     return content;
// }