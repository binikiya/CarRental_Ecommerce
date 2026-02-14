import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAddresses, getPayments } from "../../api/carService";
import api from "../../api/api";
import { FaMapMarkerAlt, FaCreditCard, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

const Checkout = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<any>(null);
    const [addresses, setAddresses] = useState([]);
    const [payments, setPayments] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderRes, addrRes, payRes] = await Promise.all([
                    api.get(`/orders/${orderId}/`),
                    getAddresses(),
                    getPayments()
                ]);
                setOrder(orderRes.data);
                setAddresses(addrRes.data);
                setPayments(payRes.data);

                const defaultAddr = addrRes.data.find((a: any) => a.is_default);
                if (defaultAddr) setSelectedAddress(defaultAddr);

                const defaultPay = payRes.data.find((p: any) => p.is_default);
                if (defaultPay) setSelectedPayment(defaultPay);

            } catch (err) {
                toast.error("Failed to load checkout data");
            }
        };
        fetchData();
    }, [orderId]);

    const handleFinalizePayment = async () => {
        if (!selectedAddress || !selectedPayment) {
            return toast.error("Please select an address and payment method");
        }

        setIsProcessing(true);
        try {
            await api.patch(`/orders/${orderId}/`, {
                billing_address_json: selectedAddress,
                payment_provider: selectedPayment.provider,
                payment_status: 'paid',
                paid_at: new Date().toISOString()
            });
            
            toast.success("Payment Successful! Your car is booked.");
            navigate('/customer/orders');
        }
        catch (err) {
            toast.error("Transaction failed. Please try again.");
        }
        finally {
            setIsProcessing(false);
        }
    };

    if (!order) return <div className="p-20 text-center font-black">PREPARING YOUR INVOICE...</div>;

    return (
        <div className="max-w-6xl mx-auto px-6 py-20 animate-in fade-in duration-700">
            <h1 className="text-4xl font-black dark:text-white mb-10">Finalize <span className="text-indigo-600">Payment</span></h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    <section>
                        <h3 className="flex items-center gap-2 font-black dark:text-white mb-4 uppercase text-sm tracking-widest">
                            <FaMapMarkerAlt className="text-indigo-600" /> Select Billing Address
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((addr: any) => (
                                <div 
                                    key={addr.id}
                                    onClick={() => setSelectedAddress(addr)}
                                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                                        selectedAddress?.id === addr.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900'
                                    }`}
                                >
                                    <p className="font-bold dark:text-white">{addr.street}</p>
                                    <p className="text-xs text-slate-500">{addr.city}, {addr.country}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="flex items-center gap-2 font-black dark:text-white mb-4 uppercase text-sm tracking-widest">
                            <FaCreditCard className="text-indigo-600" /> Select Payment Method
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {payments.map((pay: any) => (
                                <div 
                                    key={pay.id}
                                    onClick={() => setSelectedPayment(pay)}
                                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                                        selectedPayment?.id === pay.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900'
                                    }`}
                                >
                                    <p className="font-bold dark:text-white">{pay.card_brand} •••• {pay.last4}</p>
                                    <p className="text-xs text-slate-500">Expires {pay.expiry_month}/{pay.expiry_year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 sticky top-28 shadow-2xl">
                        <h3 className="font-black dark:text-white mb-6 uppercase tracking-widest text-xs">Order Summary</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Car Price</span>
                                <span className="font-bold dark:text-white">
                                    ${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Quantity</span>
                                <span className="font-bold dark:text-white">x{order.quantity}</span>
                            </div>
                            <div className="pt-4 border-t dark:border-white/5 flex justify-between">
                                <span className="font-black dark:text-white">Total</span>
                                <span className="font-black text-2xl text-indigo-600">
                                    ${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleFinalizePayment}
                            className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {isProcessing ? "PROCESSING..." : <><FaLock size={14} /> PAY NOW</>}
                        </button>
                        <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
                            Encrypted 256-bit SSL Transaction
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;