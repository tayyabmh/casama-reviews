import Enrich from "@/components/enrich";


export default function Home() {
  return (
    <>
      <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Add Reviews to Transactions</h1>
          <div className="mt-4">
            <p className="text-sm">This is a demo of the Tableland SDK. It allows you to add reviews to transactions on the Ethereum blockchain.</p>
          </div>
          <div className="mx-40 mt-8 overflow-hidden rounded-lg bg-white shadow border">
            <div className="px-4 py-5 sm:p-6">
              <Enrich />
            </div>
          </div>
      </div>            
    </>
  )
}

