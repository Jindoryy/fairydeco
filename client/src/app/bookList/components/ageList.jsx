'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { getRandomInt, randomChoice } from '../utils/helpers';

const availableColors = [
  "customYellow",
  "customDarkYellow",
  "customPink",
  "customLigntGreen",
  "customBlue",
  "customBlueBorder"
];

export default function Bookshelf () {
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const [spines, setSpines] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [sampleList, setSampleList] = useState([])
  const [recentList, setRecentList] = useState([])

  const getBook = async () => {
    try {
      const response = await axios.get(`${apiUrl}/book/main-list/${localStorage.getItem('childId')}`)
      console.log(response.data.data)
      setSampleList(response.data.data.sampleBookList)
      setRecentList(response.data.data.recentBookList)
    } catch (error) {
      console.error("Failed to get BookList: ", error )
    }
  }
  useEffect(() => {
    getBook()

    const s = [];
    for (let i = 0; i < 15; i++) {
      const randomHeight = getRandomInt(200, 300);
      const randomColor = randomChoice(availableColors);
      s.push({
        title: `Book Title ${i + 1}`,
        author: `Author ${i + 1}`,
        height: `${randomHeight}px`,
        top: `${280 - randomHeight}px`, 
        backgroundColor: randomColor
      });
    }
    setSpines(s)


  }, []);


  return (
    <div className="w-full h-full flex flex-col">
      <div className="ml-12">
        <div className="flex mt-32 relative h-auto ml-8">
          {spines && sampleList && sampleList.filter(book => book.bookCoverUrl).map((book, index) => (
            <div className={`relative w-[50px] h-[300px] top-0 ml-0.5 hover:z-1 border-2 rounded-md bg-${spines[index].backgroundColor} hover:transform hover:-translate-x-10 hover:-translate-y-20 hover:-rotate-12`} key={index}>
              <div className="absolute rounded-md font-bold text-center h-[100%] ">
                <div className="m-1 absolute top-0 left-3 text-xs text-gray-700 ">{book.bookName}</div>
                <div className="m-1 absolute left-3 bottom-0 text-xs text-gray-700 ">{book.bookMaker}</div>
              </div>
              <div className={`absolute border-2 rounded-md font-bold text-center w-[50px] h-[300px] `}></div>
              <div className={`absolute border-4 hover:z-100 rounded-md font-bold text-center w-[150px] h-[300px] top-0 left-[50px] bg-${spines[index].backgroundColor}`}>
                <Image src={book.bookCoverUrl} alt={'책 표지'} fill className="hover:z-10"/>
              </div>
            </div>
          ))}
        </div>
        <div className="border-2 border-customPink bg-customPink w-[700px] h-[20px] top-0"></div>
      </div>
      <div className="absolute right-16 bottom-12">
        <div className="flex mt-32 relative h-auto m-auto ml-8">
          {spines && recentList && recentList.filter(book => book.bookCoverUrl).map((book, index) => (
            <div className={`relative w-[50px] h-[300px] top-0 ml-0.5 hover:z-1 border-2 rounded-md bg-${spines[index].backgroundColor} hover:transform hover:-translate-x-20 hover:-translate-y-20 hover:-rotate-12 `} key={index}>
              <div className="absolute rounded-md font-bold text-center h-[100%]">
                <div className="m-1 absolute top-0 left-0 text-xs text-gray-700 ">{book.bookName}</div>
                <div className="m-1 absolute bottom-0 text-xs text-gray-700  left-1/4">{book.bookMaker}</div>
              </div>
              <div className={`absolute border-2 rounded-md font-bold text-center w-[50px] h-[300px] `}></div>
              <div className={`absolute border-4 hover:z-100 rounded-md font-bold text-center w-[150px] h-[300px] top-0 left-[50px] bg-${spines[index].backgroundColor}`}>
                <Image src={book.bookCoverUrl} alt={'책 표지'} fill className="hover:z-10"/>
              </div>
            </div>
          ))}
        </div>
        <div className="border-2 border-customPink bg-customPink w-[1000px] h-[20px] top-0"></div>
      </div>
    </div>
  );
};


