import { useEffect, useState } from "react";
import { Database } from "@tableland/sdk";
import { useAccount } from "wagmi";
import ReviewModal from "@/components/reviewModal";


const TABLENAME = "casamareviews_80001_5788";

const db = new Database();

type Review = {
  id: number;
  reviewerAddress: `0x${string}`;
  revieweeAddress: `0x${string}`;
  associatedTransactionHash: `0x${string}`;
  review: string;
  rating: number;
  status: string;
}

export default function View() {
    const { address } = useAccount();
    // THis is probably a good place to use TS types
    const [ reviews, setReviews ] = useState<any[]>([]);
    const [ reviewModalOpen, setReviewModalOpen ] = useState<boolean>(false);
    const [ selectedReview, setSelectedReview ] = useState<Review | null>(null);

    
    useEffect(() => {
      
      const getReviews = async () => {
        const { results } = await db.prepare(`SELECT * FROM ${TABLENAME} WHERE reviewerAddress = '${address?.toLowerCase()}'`).all();
        setReviews(results);
        console.log(results)
      }

      getReviews();

    }, [address])

    const handleCompleteReview = (review: Review) => {
      setReviewModalOpen(true);
      setSelectedReview(review);
      return;
    }

    return (
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold leading-6 text-gray-900">Your Open Reviews</h1>
                  <p className="mt-2 text-sm text-gray-700">
                    These are reviews to which you have the ability to review the other party.
                  </p>
                </div>
              </div>
                <div className="mt-8 flow-root">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="divide-y divide-gray-300 min-w-full">
                        <thead className="bg-gray-200">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                              Review ID
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Reviewer Address
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Reviewee Address
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Associated Transaction Hash
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-16">
                              Review
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Rating
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Review Status
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Action(s)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {reviews.map((review, reviewIndex) => (
                            <tr key={reviewIndex} className={reviewIndex % 2 === 0 ? undefined : 'bg-gray-50'}>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.id}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.reviewerAddress.substring(0,6) + '...' + review.reviewerAddress.substring(review.reviewerAddress.length - 3, review.reviewerAddress.length)}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.reviewedAddress.substring(0,6) + '...' + review.reviewedAddress.substring(review.reviewedAddress.length - 3, review.reviewedAddress.length)}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <a className="text-indigo-600 hover:underline " href={`https://mumbai.polygonscan.com/tx/${review.associatedTransactionHash}`}>
                                  {review.associatedTransactionHash.substring(0,5) + '...' + review.associatedTransactionHash.substring(review.associatedTransactionHash.length - 4, review.associatedTransactionHash)}
                                </a>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 break-words">
                                {
                                review.review.length > 2 ?
                                // Add a concatenated string of the review, with an ellipsis if it's too long, and a See More button
                                (
                                  <>
                                    {review.review.substring(0, 40) + '...'}
                                    <button 
                                      className="text-indigo-600 hover:underline"

                                    >
                                        See More
                                      </button>
                                  </>
                                )
                                  : null
                                }
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.rating}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.status}</td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button 
                                  className="text-indigo-600 hover:text-indigo-900"
                                  onClick={() => {handleCompleteReview(review)}}  
                                >
                                    {review.status === "Pending" ? "Complete Review" : null}
                                  </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </div>
                </div>
                <ReviewModal
                  show={reviewModalOpen}
                  selectedReview={selectedReview}
                  setReviewModalOpen={setReviewModalOpen}
                />
              </div>
            )
          }