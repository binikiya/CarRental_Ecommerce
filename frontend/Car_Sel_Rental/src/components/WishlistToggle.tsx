const WishlistToggle = ({ carId, initialStatus }: { carId: number, initialStatus: boolean }) => {
    const [isWishlisted, setIsWishlisted] = useState(initialStatus);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to car details
        try {
            await toggleWishlist(carId);
            setIsWishlisted(!isWishlisted);
            toast.success(!isWishlisted ? "Added to Wishlist" : "Removed");
        } catch (err) {
            toast.error("Please login to save items");
        }
    };

    return (
        <button onClick={handleToggle} className="transition-all active:scale-90">
            <FaHeart className={isWishlisted ? "text-red-500" : "text-slate-300 hover:text-red-400"} size={20} />
        </button>
    );
};