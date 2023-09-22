import { useState, useEffect } from "react";
import { X } from "react-feather";
import { useForm } from "react-hook-form";

export default function Modal(props: any) {
    const [visible, setVisible] = useState(props.visible);

    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors },
    // } = useForm();
    // const onSubmit = (data: unknown) => console.log(data);

    useEffect(() => {
        setVisible(props.visible);
    }, [props.visible]);

    const onClose = () => {
        setVisible(!visible);
        props.onClose()
    };

    const Error = ({ message }: { message: string }) => {
        return (
            <div className="p-1 text-red-600 font-bold text-sm">
                {message}
            </div>
        );
    }

    return (
        <div
            className={`${visible ? "visible" : "hidden "} transition ease-in-out duration-1000 delay-500 flex items-center justify-center overflow-y-hidden overflow-x-hidden fixed top-0 bg-opacity-50 bg-gray-600 right-0 left-0 bottom-0 md:inset-0 h-modal md:h-full`}
        >
            <div className="relative p-4 w-full max-w-lg h-full md:h-auto">
                <div className="relative bg-white  shadow border-[5px] border-black">
                    <button
                        type="button"
                        className="absolute top-3 right-2.5 text-black bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        onClick={onClose}
                    >
                        <X />
                        <span className="sr-only">Tutup</span>
                    </button>
                    <div className="p-6 flex flex-col">
                        <h3 className="mb-5 font-poppinsSemibold text-black text-xl font-bold">Tambah Review</h3>
                        <form onSubmit={props.handleSubmit()}>
                            <div>
                                <div className="text-base font-normal">Name</div>
                                <input
                                    className="border-2 border-black focus:border-none focus:ring-0 text-base w-full p-2 mt-2"
                                    type="text"
                                    {...props.register('name', {
                                        required: { value: true, message: 'Name Required' },
                                    })}
                                />
                                {props.errors.name && <Error message={`${props.errors.name.message!}`} />}
                            </div>
                            <div>
                                <div className="text-base font-normal mt-2">Review</div>
                                <input
                                    className="border-2 border-black focus:border-none focus:ring-0 text-base w-full p-2 mt-2"
                                    type="text"
                                    {...props.register('review', {
                                        required: { value: true, message: 'Review Required' },
                                    })}
                                />
                                {props.errors.name && <Error message={`${props.errors?.review?.message!}`} />}
                            </div>
                            <button className="mt-9 transition ease-in-out border-[3px] border-black hover:bg-black w-full hover:text-white text-lg font-bold py-2">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
