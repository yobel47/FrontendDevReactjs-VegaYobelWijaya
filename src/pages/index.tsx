import type { NextPage } from "next";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { MapPin, Star, Search } from "react-feather";
import { debounce } from "lodash"
import { useRouter } from 'next/router'
import Head from "next/head";

type ListType = {
    error: boolean;
    message: string;
    count: number;
    restaurants: Array<RestaurantType>;
};

type RestaurantType = {
    id: string;
    name: string
    description: string
    pictureId: number
    city: string
    rating: number
};

const Home: NextPage = () => {
    const [data, setData] = useState<ListType | null>(null);
    const [dataRestaurants, setDataRestaurants] = useState<Array<RestaurantType> | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [search, setSearch] = useState<string>("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const router = useRouter()
    const imageLoader = require("../components/loader");

    useEffect(() => {
        fetch("https://restaurant-api.dicoding.dev/list")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setDataRestaurants(data.restaurants.slice(0, 8))
                setLoading(false);
            })
            .catch((e) => {
                setData({ error: true, message: "Server Error", count: 0, restaurants: [] })
                setLoading(false);
            })
    }, []);

    const Loading = () => {
        return (
            <div className="flex justify-center my-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                    <path fill="none" stroke="#1d0e0b" strokeWidth="8" strokeDasharray="42.76482137044271 42.76482137044271" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" strokeLinecap="round" >
                        <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="2s" keyTimes="0;1" values="0;256.58892822265625"></animate>
                    </path>
                </svg>
            </div>
        )
    }

    const addMoreData = () => {
        setLoading(true)
        const fakeFetchData = async () => {
            setDataRestaurants(data ? data?.restaurants.slice(0, dataRestaurants ? dataRestaurants.length + 4 : 0) : null)
            setLoading(false)
        }
        setTimeout(fakeFetchData, 2000)
    }

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event?.target?.value);
        debouncedSearch(event)
    }

    const debouncedSearch = useMemo(
        () =>
            debounce((event: React.ChangeEvent<HTMLInputElement>) => {
                searchData(event?.target?.value)
            }, 2000),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);


    const searchData = (query: string) => {
        setData(null);
        setDataRestaurants(null)
        setLoading(true);
        fetch("https://restaurant-api.dicoding.dev/search?q=" + query)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setDataRestaurants(data.restaurants.slice(0, 8))
                setLoading(false);
            })
            .catch((e) => {
                setData({ error: true, message: "Server Error", count: 0, restaurants: [] })
                setLoading(false);
            })
    }

    const onFilter = (index: number) => {
        setLoading(true);
        setRating(index)
        const fakeFetchData = async () => {
            const filteredArray = data?.restaurants?.filter((item) => {
                return item.rating <= index;
            })
            setDataRestaurants(filteredArray || null)
            setLoading(false)
        }
        setTimeout(fakeFetchData, 2000)

    }

    return (
        <main className="container mx-auto px-4">
            <Head>
                <title>Restourant</title>
            </Head>
            <div className="mt-8 md:mt-8 mb-10">
                <div className="text-4xl font-bold">Restourant</div>
                <div className="mt-4 max-w-2xl">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque
                    purus semper eget duis at.
                </div>
            </div>
            <hr className={`w-[100vw] max-w-full absolute left-0 border-[1.5px] border-black`}></hr>
            <div className="mt-14 mb-4 flex flex-col-reverse md:flex-row gap-4 justify-between md:items-center items-start">
                <div className="flex gap-3">
                    <div className="text-lg font-bold">Filter by Rating : </div>
                    <div className="flex">
                        {[...Array(5)].map((star, index) => {
                            index += 1;
                            return (
                                <button
                                    type="button"
                                    key={index}
                                    onClick={() => onFilter(index)}
                                    onMouseEnter={() => setHover(index)}
                                    onMouseLeave={() => setHover(rating)}
                                >
                                    <Star size={20} className={index <= (hover || rating) ? "fill-black" : "fill-none"} />
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="relative border-2 border-black w-full md:w-auto mt-2 md:mt-0">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2.5">
                        <Search size={19} />
                    </div>
                    <input
                        type="text"
                        className="text-base block w-full pl-10 p-1 focus:border-none focus:ring-0"
                        placeholder="Search Restaurant"
                        onChange={(event) => {
                            onInputChange(event)
                        }}
                        id='city'
                        name="search"
                        value={search}
                    />
                </div>
            </div>
            <hr className="w-[100vw] max-w-full absolute left-0 border-[1.5px] border-black"></hr>

            <div className="my-12">
                <div className="text-3xl font-semibold">All Restourant</div>
                {data?.error ? (
                    <div className="font-semibold text-lg text-center my-16">{data.message}</div>
                ) : (
                    <>
                        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {dataRestaurants?.map((item: any) => (
                                <div key={item.id} className="p-5 border-2 border-black">
                                    <Image src={item.pictureId} className="relative w-full h-[170px]" loader={imageLoader} alt={item.name}
                                        width={0}
                                        height={0}
                                        sizes="100vw" />
                                    <div>
                                        <div className="text-xl font-semibold break-words mt-2">{item.name}</div>
                                        <div className="flex mt-1 justify-between">
                                            <div className="flex gap-1 items-center">
                                                <MapPin size={16} />
                                                <span className="text-base">{item.city}</span>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <Star size={16} />
                                                <span className="text-base">{item.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: 'hidden' }}>{item.description}</div>
                                    </div>
                                    <button onClick={() => {
                                        router.push(`/${item.id}`)
                                    }} className="transition ease-in-out border-[3px] border-black hover:bg-black w-full mt-4 hover:text-white text-lg font-bold py-2">See More</button>
                                </div>
                            ))}
                        </div>
                        {!isLoading && ((dataRestaurants?.length || 0) !== data?.restaurants.length) &&
                            <div className="flex justify-center">
                                <button onClick={addMoreData} className="transition ease-in-out border-[3px] border-black bg-black hover:bg-white w-1/2 mt-4 text-white hover:text-black text-lg font-bold py-2">See More</button>
                            </div>
                        }
                    </>
                )
                }
                {isLoading && (
                    <Loading />
                )}
                {!isLoading && !data?.error && ((dataRestaurants?.length || 0) === 0) && (
                    <div className="font-semibold text-lg text-center my-16">There is no data found.</div>
                )}
            </div >

        </main >
    );
};

export default Home;
