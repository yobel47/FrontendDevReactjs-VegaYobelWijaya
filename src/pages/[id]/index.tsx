// eslint-disable-next-line react-hooks/exhaustive-deps

import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Filter, Star, Check, X } from "react-feather";
import { useRouter } from 'next/router'
import Modal from "@/components/modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

type ListType = {
    error: boolean;
    message: string;
    restaurant?: RestaurantType;
};

type RestaurantType = {
    id: string
    name: string
    description: string
    city: string
    address: string
    pictureId: number
    categories: Array<NameType>
    menus: MenusType
    rating: number
    customerReviews: Array<ReviewType>
}

type NameType = {
    name: string
}

type MenusType = {
    foods: Array<NameType>
    drinks: Array<NameType>
}

type ReviewType = {
    name: string
    review: string
    date: string
}

interface ReviewsType {
    name: String
    review: String
}

const Detail: NextPage = () => {
    const [data, setData] = useState<ListType | null>(null);
    const [visible, setVisible] = useState(false);
    const imageLoader = require("../../components/loader");
    const [isLoading, setLoading] = useState(true);
    const router = useRouter()
    const id = router.query.id

    useEffect(() => {
        if (!router.isReady) return;
        fetchList()
    }, [!router.isReady]);

    const fetchList = () => {
        fetch(`https://restaurant-api.dicoding.dev/detail/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((e) => {
                setData({ error: true, message: "Server Error", restaurant: undefined })
                setLoading(false);
            })
    }

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

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = (data: any) => {
        setLoading(true)
        fetch(`https://restaurant-api.dicoding.dev/review`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "id": id, "name": data.name, "review": data.review
                })
            })
            .then((res) => res.json())
            .then(() => {
                setLoading(false);
                setVisible(false)
                fetchList()
                notify()
            })
            .catch((e) => {
                setData({ error: true, message: "Server Error", restaurant: undefined })
                setLoading(false);
            })
    };

    const notify = () => {
        toast.success("Success Save Review !", {
            icon: () => <Check className="text-black" />,
            position: toast.POSITION.BOTTOM_RIGHT
        });
    };

    const CloseButton = ({ closeToast }: any) => (
        <X onClick={closeToast} className="text-black" size={18} />
    );

    return (
        <main className="container mx-auto px-4 mt-8 md:mt-8 mb-10">
            {!isLoading && (data?.error) && (
                <div className="font-semibold text-2xl text-center my-16">{data?.message}</div>
            )}
            {isLoading ? (
                <Loading />
            ) : data?.restaurant && (
                <>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2 border-[10px] border-black h-fit">
                            <Image src={"14"} className="relative w-full h-auto" loader={imageLoader} alt={"tes"}
                                width={0}
                                height={0}
                                sizes="100vw"
                                priority />
                        </div>
                        <div className="w-full md:w-1/2 h-fit border-[3px] border-black py-6 px-8">
                            <div className="text-2xl font-bold">{data?.restaurant.name}</div>
                            <div className="flex gap-2 items-center mt-2">
                                <MapPin size={18} />
                                <div className="flex flex-col">
                                    <span className="text-base">{data?.restaurant.address}, {data?.restaurant.city}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center mt-2">
                                <Filter size={18} />
                                <div className="flex flex-col">
                                    <span className="text-base">
                                        {data?.restaurant.categories.map((item, index) => {
                                            return `${item.name}${index === (data.restaurant!!.categories.length - 1) ? "" : ", "}`
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center mt-2">
                                <Star size={16} />
                                <span className="text-base">{data?.restaurant.rating.toFixed(1)}</span>
                            </div>
                            <div className="mt-2">{data?.restaurant.description}</div>
                            <div className="text-lg font-semibold mt-3">Menu</div>
                            <div className="flex gap-4 mt-1">
                                <div className="w-1/2">
                                    <div className="text-base font-semibold">Foods :</div>
                                    <ul>
                                        {data?.restaurant.menus.foods.map((item, index) => {
                                            return (<li key={index}>{item.name}</li>)
                                        })}
                                    </ul>
                                </div>
                                <div className="w-1/2">
                                    <div className="text-base font-semibold">Drinks :</div>
                                    <ul>
                                        {data?.restaurant.menus.drinks.map((item, index) => {
                                            return (<li key={index}> {item.name}</li>)
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className={`w-[100vw] max-w-full absolute left-0 border-2 mt-8 border-black`}></hr>
                    <div className="flex mt-16 items-center justify-between">
                        <div className="text-2xl font-bold ">Reviews</div>
                        <button onClick={() => { setVisible(true) }} className="transition ease-in-out border-[3px] border-black hover:bg-black w-32 hover:text-white text-lg font-bold py-2">Add review</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        {data?.restaurant.customerReviews.map((item, index) => {
                            return (
                                <div className="border-2 border-black p-4" key={index}>
                                    <div className="flex justify-between items-center">
                                        <div className="text-lg font-bold">{item.name}
                                        </div>
                                        <div className="text-sm text-right">{item.date}</div>
                                    </div>
                                    <div className="text-base mt-1">{item.review}</div>
                                </div>
                            )
                        })}

                    </div>
                </>
            )
            }
            <ToastContainer
                toastClassName={"!rounded-none !border-2 !border-black"}
                closeButton={CloseButton}
                bodyClassName={"!text-black !text-lg"}
                progressClassName={"!bg-black"} autoClose={300000} />
            <Modal visible={visible} errors={errors} register={register} handleSubmit={() => handleSubmit(onSubmit)}
                onClose={() => {
                    setVisible(false)
                    reset()
                }} />

        </main >
    );
};

export default Detail;
