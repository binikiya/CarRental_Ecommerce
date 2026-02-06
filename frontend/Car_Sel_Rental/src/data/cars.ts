import porscheImg from "../assets/Porsche/1.jpg";
import teslaImg from "../assets/Tesla/1.jpg";
import bentleyImg from "../assets/Bentley/1.jpg";
import bmwImg from "../assets/BMW/1.jpg";
import id4Img from "../assets/VW/1.jpg";
import rollsImg from "../assets/Rolls/1.jpg";

export interface Car {
    id: number;
    title: string;
    tag?: string;
    category: number | string;
    brand: number;
    speed: string;
    car_type: 'rent' | 'sell' | 'both';
    price_sell?: string;
    price_per_day?: string;
    fuel_type: string;
    transmission: string;
    displayImage: string;
    description: string;
}

export const carData: Car[] = [
    { id: 1, title: "Porsche 911 Turbo S", price_per_day: "$250", price_sell: "$230,000", category: 2, brand: 1, car_type: "both", displayImage: porscheImg, speed: "330 km/h", fuel_type: "Petrol", transmission: "PDK", tag: "Iconic", description: "The Porsche 911 Turbo S is a high-performance sports car with a powerful engine and advanced aerodynamics." },
    { id: 2, title: "Tesla Model S Plaid", price_per_day: "$200", price_sell: "$109,000", category: 1, brand: 2, car_type: "both", displayImage: teslaImg, speed: "322 km/h", fuel_type: "Electric", transmission: "Direct", tag: "Fastest", description: "The Tesla Model S Plaid is an electric luxury sedan with exceptional performance and range." },
    { id: 3, title: "Bentley Continental GT", price_sell: "$240,000", category: 3, brand: 3, car_type: "sell", displayImage: bentleyImg, speed: "318 km/h", fuel_type: "Petrol", transmission: "Auto", tag: "Handcrafted", description: "The Bentley Continental GT is a luxury grand tourer with handcrafted interior and powerful engine." },
    { id: 4, title: "BMW M4 Competition", price_sell: "$82,000", category: 4, brand: 4, car_type: "sell", displayImage: bmwImg, speed: "290 km/h", fuel_type: "Petrol", transmission: "M-Steptronic", tag: "Track Ready", description: "The BMW M4 Competition is a high-performance sports car designed for track use." },
    { id: 5, title: "ID.4", price_sell: "$45,095", category: 5, brand: 5, car_type: "sell", displayImage: id4Img, speed: "330 km/h", fuel_type: "Electric", transmission: "Direct", tag: "Ultra Range", description: "The ID.4 is an electric SUV with impressive range and modern features." },
    { id: 6, title: "Rolls-Royce Phantom", price_sell: "$340,000", category: 6, brand: 6, car_type: "sell", displayImage: rollsImg, speed: "250 km/h", fuel_type: "Petrol", transmission: "Auto", tag: "Quiet", description: "The Rolls-Royce Phantom is a luxury limousine with unparalleled comfort and craftsmanship." }
];