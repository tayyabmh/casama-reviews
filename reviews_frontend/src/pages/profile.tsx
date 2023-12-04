import { useAccount } from "wagmi";
import { Database } from '@tableland/sdk';
import { useEffect, useState } from 'react';
import StatusPill from "@/components/statusPills";
import { StarIcon } from "@heroicons/react/20/solid";

const TABLENAME = "casamareviews_80001_5788";
const db = new Database();

const STATUS_ORDER = ["Pending", "Completed"]

type Review = {
    id: number;
    reviewerAddress: `0x${string}`;
    reviewedAddress: `0x${string}`;
    associatedTransactionHash: `0x${string}`;
    review: string;
    rating: number;
    status: string;
}

export default function Profile() {
    const { address } = useAccount();

    const [ userAddress, setUserAddress ] = useState<string>("");
    const [ reviews, setReviews ] = useState<Review[]>([]);
    const [ numberOfReviews, setNumberOfReviews ] = useState<number>(0);
    const [ averageRating, setAverageRating ] = useState<number>(0);

    useEffect(() => {

        setUserAddress(address?.toLowerCase() || "");
        const getReviews = async () => {
            const { results } : { results:  Review[] | null } = await db.prepare(`SELECT * FROM ${TABLENAME} WHERE reviewedAddress = '${address?.toLowerCase()}'`).all();
            const sortedResults = results.sort((a, b) => {
                return STATUS_ORDER.indexOf(b.status) - STATUS_ORDER.indexOf(a.status);
            })
            setReviews(sortedResults);
            setNumberOfReviews(results.length);
            let totalRating = 0;
            let totalCompletedReviews = 0;
            for (let i = 0; i < results.length; i++) {
                if (results[i].status === "Completed"){
                    totalRating += results[i].rating;
                    totalCompletedReviews++;
                }
            }
            setAverageRating((totalRating / totalCompletedReviews));
        }

        getReviews();
    }, [address])


    return (
        <div>
            <h1 className="text-2xl font-semibold">Profile</h1>
            <div className="grid gap-8 grid-cols-3">
                <div className="col-span-1 border mt-20 shadow-md rounded-md p-4 max-h-48">
                    <div className="flex flex-row justify-around">
                        <span className="inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100">
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-2">{userAddress}</p>
                    <p className="text-md text-gray-500 mt-2"><span className="font-bold">Reviews:</span> {numberOfReviews}</p>
                    <p className="text-md text-gray-500 mt-2"><span className="font-bold">Average Rating:</span> {averageRating}</p>
                </div>
                <div className="col-span-2 mt-5 p-4">
                    <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                    <div className="grid gap-4 grid-cols-1">
                        {reviews.map((review) => {
                            if(review.reviewedAddress === userAddress) {
                                return (
                                    <div className="col-span-1 border shadow-md rounded-md p-4" key={review.id}>
                                        <div className="flex flex-row justify-between">
                                            <div className="flex flex-row justify-start">
                                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                                                    <span className="font-medium leading-none text-white">{review.reviewerAddress.substring(2,4)}</span>
                                                </span>
                                                <p className="mt-2 ml-4 text-md text-gray-800">{review.reviewerAddress}</p>
                                            </div>
                                            <div className="mr-2 flex flex-row flex-end">
                                                {review.status === "Completed" ? (
                                                <div className="flex items-center m-4 ">
                                                    <div className="flex items-center">
                                                        <StarIcon
                                                            className='text-yellow-400 h-5 w-5 flex-shrink-0'
                                                            aria-hidden="true"
                                                        />
                                                    </div>
                                                    <p className="ml-1 text-sm text-gray-700">
                                                        {review.rating}
                                                        <span className="sr-only"> out of 5 stars</span>
                                                    </p>
                                                </div>)
                                                : null}
                                                <StatusPill status={review.status} />

                                            </div>
                                        </div>
                                        <div className="ml-16">
                                            <p className="text-sm italic text-gray-800">{review.review}</p>
                                            <div className="mt-4">
                                                <a className="text-indigo-600 text-sm hover:underline" href={`https://mumbai.polygonscan.com/tx/${review.associatedTransactionHash}`}>
                                                    See the Associated Transaction on PolygonScan
                                                </a>
                                            </div>
                                        </div>
                                        
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}