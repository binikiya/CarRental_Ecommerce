import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";

interface BookingProps {
    carId: number;
    pricePerDay: number;
    taxRate: number; // e.g., 0.1 for 10%
}

const BookingCard = ({ carId, pricePerDay, taxRate }: BookingProps) => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(addDays(new Date(), 1));
    const [totalPrice, setTotalPrice] = useState(0);

    // Calculate price whenever dates change
    useEffect(() => {
        if (startDate && endDate) {
            const days = differenceInDays(endDate, startDate);
            const rentalTotal = (days > 0 ? days : 1) * pricePerDay;
            const totalWithTax = rentalTotal + (rentalTotal * taxRate);
            setTotalPrice(totalWithTax);
        }
    }, [startDate, endDate, pricePerDay, taxRate]);

    const handleBooking = () => {
        // Navigate to checkout with state
        navigate("/checkout", {
            state: {
                carId,
                startDate,
                endDate,
                totalAmount: totalPrice,
                orderType: 'rent'
            }
        });
    };

    return (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Rental Booking</h3>
            
            <div className="space-y-4">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Pick-up</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            minDate={new Date()}
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-sm dark:text-white outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Drop-off</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate || new Date()}
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-sm dark:text-white outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="py-4 border-t border-b border-slate-100 dark:border-white/5 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Price per day</span>
                        <span className="font-bold dark:text-white">${pricePerDay}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total Days</span>
                        <span className="font-bold dark:text-white">{startDate && endDate ? differenceInDays(endDate, startDate) : 1}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black pt-2">
                        <span className="dark:text-white">Total</span>
                        <span className="text-cyan-500">${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <button 
                    onClick={handleBooking}
                    className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                >
                    Reserve Now
                </button>
                
                <p className="text-[10px] text-center text-slate-400">You won't be charged yet</p>
            </div>
        </div>
    );
};