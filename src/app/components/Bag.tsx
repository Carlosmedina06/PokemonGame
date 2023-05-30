'use client'
import { useState } from 'react'
import Image from 'next/image'
import { RiCloseFill } from 'react-icons/ri'

import useResizeWindows from '../hooks/useResizeWindows'

const Bag = () => {
  const [isOpened, setIsOpened] = useState(false)
  const windowSize = useResizeWindows()

  const handleClick = () => {
    setIsOpened(!isOpened)
  }

  return (
    <div>
      <button className="absolute bottom-10 right-40" onClick={handleClick}>
        <Image
          alt="pokemon bag"
          height={windowSize.height < 768 ? 70 : windowSize.height < 1024 ? 100 : 150}
          src="/images/bag.png"
          width={windowSize.width < 768 ? 70 : windowSize.width < 1024 ? 100 : 150}
        />
      </button>

      {isOpened && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-end">
          <div className="bg-white border-4 border-gray-900 h-auto flex flex-col p-4 w-[40%] md:w-[30%] lg:w-[20%] min-h-[70%] m-6 rounded-lg">
            <div className="flex justify-end">
              <button
                className="text-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                onClick={handleClick}
              >
                <RiCloseFill size={24} />
              </button>
            </div>
            <div className="bg-gray-200 rounded-lg flex flex-col h-full px-4 py-4">
              <button className="bg-blue-500 text-white rounded-md px-4 hover:bg-blue-700 py-2 mb-4">
                <p className="text-lg font-bold">Pokemon</p>
              </button>
              <button className="bg-blue-500 text-white rounded-md px-4 py-2 mb-4 hover:bg-blue-700">
                <p className="text-lg font-bold">Inventory</p>
              </button>
              <button className="bg-blue-500 text-white rounded-md px-4 py-2 mb-4 hover:bg-blue-700">
                <p className="text-lg font-bold">Stats</p>
              </button>
              <button className="bg-blue-500 text-white rounded-md px-4 py-2 mb-4 hover:bg-blue-700">
                <p className="text-lg font-bold">LINK 4</p>
              </button>
              <button className="bg-blue-500 text-white rounded-md px-4 py-2 mb-4 hover:bg-blue-700">
                <p className="text-lg font-bold">LINK 5</p>
              </button>
              <button className="bg-blue-500 text-white rounded-md px-4 py-2 mb-4 hover:bg-blue-700">
                <p className="text-lg font-bold">LINK 6</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bag
