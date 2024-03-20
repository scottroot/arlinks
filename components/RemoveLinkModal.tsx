import {ArweaveWallet, Tag} from "@/types";
import {State} from "@hookstate/core";
import {useState} from "react";
import {createTransaction, dispatchTransaction} from "@/utils/createTransaction";
import Modal from "@/components/Modal";
import type Arweave from "arweave";


export interface RemoveLinkModalProps {
  wallet: ArweaveWallet,
  isOpen: boolean,
  setIsOpen: any,
  item: {title: string, idx: number},
  linksState: State<any, {}>,
  arweave: Arweave,
}

export function RemoveLinkModal({wallet, isOpen, setIsOpen, item, linksState, arweave}: RemoveLinkModalProps) {
  const [dispatchId, setDispatchId] = useState("");

  const handleCreateNewTransaction = async() => {
    const tags: Tag[] = [{ name: "App-Name", value: "ArLinks"},
                         { name: "Title", value: item.title },
                         { name: "Removed", "value": "true" },]
    const transaction = await createTransaction({ arweave, tags })
    const response = await dispatchTransaction({ transaction, wallet })
    if(response && response.id){
      setDispatchId(response.id)
      linksState.nested(String(item.idx)).set(null);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Remove link"
      onSubmit={()=>handleCreateNewTransaction() }
    >
      <div className="relative flex flex-row items-center">
        <div className="w-full">
          <div className="flex flex-col gap-2">
            <p>Removing link &quot;{item.title}&quot;</p>
            <div id="save-status" className="">
              {dispatchId &&
                <div className="flex flex-col">
                  <p>
                    Successfully removed link
                    <br/>
                    <small><a href={`https://viewblock.io/arweave/tx/${dispatchId}}`}>{dispatchId}</a></small>
                  </p>
                  <br/>
                </div>
              }
            </div>
            <div id="button-group"
                 className="border-t w-full mt-6p-4 md:p-5 flex flex-row gap-4 justify-center [&>button]:transition-colors">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {dispatchId ? "Close" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={dispatchId !== ""}
                onClick={() => handleCreateNewTransaction()}
                className="text-white disabled:bg-blue-800/75 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                {dispatchId ? "Submitted" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}


export default RemoveLinkModal;