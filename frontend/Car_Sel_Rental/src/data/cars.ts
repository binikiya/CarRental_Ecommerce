import porscheImg from "../assets/Porsche/1.jpg";
import teslaImg from "../assets/Tesla/1.jpg";
import bentleyImg from "../assets/Bentley/1.jpg";
import bmwImg from "../assets/BMW/1.jpg";
import id4Img from "../assets/VW/1.jpg";
import rollsImg from "../assets/Rolls/1.jpg";

export interface Car {
    id: number;
    name: string;
    price: string;
    category: 'Sport' | 'Electric' | 'Luxury' | 'Hybrid';
    image: string;
    speed: string;
    fuel: string;
    transmission: string;
    tag: string;
    description: string;
}

export const carData: Car[] = [
    { id: 1, name: "Porsche 911 Turbo S", price: "$230,000", category: "Sport", image: porscheImg, speed: "330 km/h", fuel: "Petrol", transmission: "PDK", tag: "Iconic", description: "The Porsche 911 Turbo S is a high-performance sports car with a powerful engine and advanced aerodynamics." },
    { id: 2, name: "Tesla Model S Plaid", price: "$109,000", category: "Electric", image: teslaImg, speed: "322 km/h", fuel: "Electric", transmission: "Direct", tag: "Fastest", description: "The Tesla Model S Plaid is an electric luxury sedan with exceptional performance and range." },
    { id: 3, name: "Bentley Continental GT", price: "$240,000", category: "Luxury", image: bentleyImg, speed: "318 km/h", fuel: "Petrol", transmission: "Auto", tag: "Handcrafted", description: "The Bentley Continental GT is a luxury grand tourer with handcrafted interior and powerful engine." },
    { id: 4, name: "BMW M4 Competition", price: "$82,000", category: "Sport", image: bmwImg, speed: "290 km/h", fuel: "Petrol", transmission: "M-Steptronic", tag: "Track Ready", description: "The BMW M4 Competition is a high-performance sports car designed for track use." },
    { id: 5, name: "ID.4", price: "$45,095", category: "Electric", image: id4Img, speed: "330 km/h", fuel:"Electric" , transmission:"Direct" , tag:"Ultra Range" , description:"The ID.4 is an electric SUV with impressive range and modern features." },
    { id: 6, name: "Rolls-Royce Phantom", price: "$340,000", category: "Luxury", image: rollsImg, speed: "250 km/h", fuel: "Petrol", transmission: "Auto", tag: "Quiet", description: "The Rolls-Royce Phantom is a luxury limousine with unparalleled comfort and craftsmanship." }
];